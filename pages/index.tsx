'use client'

import { useState, useEffect, DragEvent } from 'react';
import { FileText, Upload, Key, AlertCircle, LogOut } from 'lucide-react';
import { Button } from '../components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import { supabase } from '../lib/supabase';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();
  const [apiKey, setApiKey] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check authentication status
    const checkUser = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        console.log('Home: session check:', { session, error });
        
        if (error) throw error;
        
        if (!session) {
          console.log('Home: no session, redirecting to login');
          router.push('/auth/login');
          return;
        }
        
        setUser(session.user);
      } catch (error) {
        console.error('Home: auth error:', error);
        router.push('/auth/login');
      }
    };

    checkUser();

    // Subscribe to auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Home: auth state changed:', { event, session });
      if (event === 'SIGNED_OUT') {
        router.push('/auth/login');
      } else if (session) {
        setUser(session.user);
      }
    });

    return () => {
      console.log('Home: cleanup auth listener');
      authListener?.subscription.unsubscribe();
    };
  }, [router]);

  // Clear sensitive data when component unmounts or window closes
  useEffect(() => {
    const handleBeforeUnload = () => {
      setApiKey('');
      setFile(null);
      setResult(null);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      setApiKey('');
      setFile(null);
      setResult(null);
    };
  }, []);

  const handleSignOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      router.push('/auth/login');
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile?.type === 'application/pdf') {
      setFile(droppedFile);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile?.type === 'application/pdf') {
      setFile(selectedFile);
    }
  };

  const handleSubmit = async () => {
    if (!file) return;

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('apiKey', apiKey);

      const response = await fetch('/api/process', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Processing failed');
      }

      const data = await response.json();
      setResult(data);
      setShowDialog(true);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
      {/* User info and sign out */}
      <div className="max-w-4xl mx-auto mb-8 flex items-center justify-between bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        <div className="flex items-center gap-4">
          {user?.user_metadata?.avatar_url && (
            <img
              src={user.user_metadata.avatar_url}
              alt="Profile"
              className="w-10 h-10 rounded-full"
            />
          )}
          <div>
            <p className="font-medium text-gray-900 dark:text-gray-100">
              {user?.user_metadata?.full_name || user?.email}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
          </div>
        </div>
        <Button
          onClick={handleSignOut}
          variant="outline"
          className="flex items-center gap-2"
          disabled={loading}
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </Button>
      </div>

      <div className="max-w-4xl mx-auto">
        <div
          className={`p-8 bg-white dark:bg-gray-800 rounded-lg shadow-xl ${
            isDragging ? 'border-2 border-dashed border-blue-500' : ''
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Document Processing Pipeline
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                Upload a PDF document to process and analyze its content
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Hugging Face API Key
                </label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                    placeholder="Enter your API key"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  PDF Document
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="flex items-center justify-center w-full p-6 border-2 border-dashed rounded-md cursor-pointer hover:border-gray-400 dark:border-gray-600 dark:hover:border-gray-500"
                  >
                    <div className="space-y-1 text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        <span className="font-medium">Click to upload</span> or drag and drop
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">PDF up to 10MB</p>
                    </div>
                  </label>
                  {file && (
                    <div className="mt-2 flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <FileText className="mr-2 h-4 w-4" />
                      {file.name}
                    </div>
                  )}
                </div>
              </div>

              <Button
                onClick={handleSubmit}
                className="w-full"
                disabled={!apiKey || !file || loading}
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </div>
                ) : (
                  'Process Document'
                )}
              </Button>
            </div>
          </div>
        </div>

        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Document Content</DialogTitle>
              <DialogDescription>
                Your document has been processed and split into the following sections:
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4 space-y-4">
              {result?.chunks?.map((chunk: any, index: number) => (
                <div 
                  key={index}
                  className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Section {index + 1}
                    </span>
                    {chunk.metadata && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Page {chunk.metadata.loc?.pageNumber || 'N/A'}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-900 dark:text-gray-100 whitespace-pre-wrap">
                    {chunk.content}
                  </p>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

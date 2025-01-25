import { useState, useEffect, DragEvent } from 'react';
import { FileText, Upload, Key, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';

export default function Home() {
  const [apiKey, setApiKey] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

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

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile?.type === 'application/pdf') {
      setFile(droppedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!apiKey || !file) {
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('apiKey', apiKey);

    try {
      const response = await fetch('/api/process', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to process document');
      }

      const data = await response.json();
      setResult(data);
      setShowDialog(true);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
      setApiKey('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Document Processing Pipeline
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Transform your PDFs into vector embeddings using state-of-the-art AI
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-200">
                  <Key className="w-4 h-4 mr-2" />
                  HuggingFace API Key
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                    placeholder="Enter your API key"
                    autoComplete="off"
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  Your API key is never stored and is only used for the current session
                </p>
              </div>

              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-200">
                  <FileText className="w-4 h-4 mr-2" />
                  PDF Document
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="hidden"
                    id="file-upload"
                  />
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`relative cursor-pointer ${
                      isDragging ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : ''
                    }`}
                  >
                    <label
                      htmlFor="file-upload"
                      className={`flex items-center justify-center w-full px-4 py-6 border-2 border-dashed rounded-md transition-colors duration-200 ${
                        isDragging
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-300 hover:border-blue-500 dark:border-gray-600 dark:hover:border-blue-400'
                      }`}
                    >
                      <div className="space-y-1 text-center">
                        <Upload className={`mx-auto h-12 w-12 ${
                          isDragging ? 'text-blue-500' : 'text-gray-400'
                        }`} />
                        <div className="flex flex-col items-center text-sm text-gray-600 dark:text-gray-300">
                          <span className="font-medium">
                            {file ? file.name : 'Drop your PDF here'}
                          </span>
                          <span className="text-xs text-gray-500">
                            or click to browse
                          </span>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                disabled={!apiKey || !file || loading}
                className="w-full"
              >
                {loading ? 'Processing...' : 'Process Document'}
              </Button>
            </form>
          </div>
        </div>

        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent className="sm:max-w-[800px]">
            <DialogHeader>
              <DialogTitle>Processing Results</DialogTitle>
              <DialogDescription>
                Document has been successfully processed and vectorized
              </DialogDescription>
            </DialogHeader>
            
            <div className="mt-4 space-y-4">
              {result?.chunks?.map((chunk: any, index: number) => (
                <div
                  key={index}
                  className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-2"
                >
                  <h3 className="font-semibold text-lg">Chunk {index + 1}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {chunk.content.substring(0, 200)}...
                  </p>
                  <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                    <span>Vector dimension: {chunk.vector.length}</span>
                    <span>Page: {chunk.metadata.loc.pageNumber}</span>
                  </div>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

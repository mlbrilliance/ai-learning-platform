'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../../lib/supabase'
import { Button } from '../../components/ui/button'
import Image from 'next/image';

export default function ProcessPDF() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [file, setFile] = useState<File | null>(null)
  const [apiKey, setApiKey] = useState('')
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) throw error
        
        if (!session) {
          router.push('/auth/login')
          return
        }
        
        setUser(session.user)
      } catch (error) {
        console.error('Error checking user session:', error)
        router.push('/auth/login')
      } finally {
        setLoading(false)
      }
    }

    checkUser()
  }, [router])

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      router.push('/auth/login')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile?.type === 'application/pdf') {
      setFile(selectedFile)
    }
  }

  const handleProcess = async () => {
    if (!file || !apiKey) return

    try {
      setProcessing(true)
      const formData = new FormData()
      formData.append('file', file)
      formData.append('apiKey', apiKey)

      const response = await fetch('/api/process', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Processing failed')
      }

      const result = await response.json()
      console.log('Processing result:', result)
    } catch (error) {
      console.error('Error processing document:', error)
    } finally {
      setProcessing(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header with user info */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {user?.user_metadata?.avatar_url && (
              <Image
                src={user.user_metadata.avatar_url}
                alt="Profile"
                width={40}
                height={40}
                className="rounded-full"
              />
            )}
            <div>
              <p className="font-medium text-gray-900 dark:text-gray-100">
                {user?.user_metadata?.full_name || user?.email}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
            </div>
          </div>
          <Button onClick={handleSignOut} variant="outline">
            Sign Out
          </Button>
        </div>

        {/* Main content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Process PDF Document
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Upload a PDF document to process and analyze its content using our advanced AI pipeline.
          </p>

          {/* API Key Input */}
          <div className="mb-6">
            <label htmlFor="api-key" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Hugging Face API Key
            </label>
            <div className="relative">
              <input
                type="password"
                id="api-key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                placeholder="Enter your Hugging Face API key"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                  />
                </svg>
              </div>
            </div>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Your API key is never stored and is only used for the current session
            </p>
          </div>

          {/* PDF Upload Section */}
          <div className="space-y-4">
            <div 
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                file ? 'border-green-500 bg-green-50 dark:border-green-600 dark:bg-green-900/20' : 'border-gray-300 dark:border-gray-600'
              }`}
            >
              <input
                type="file"
                accept=".pdf"
                className="hidden"
                id="pdf-upload"
                onChange={handleFileChange}
              />
              <label
                htmlFor="pdf-upload"
                className="cursor-pointer flex flex-col items-center"
              >
                {file ? (
                  <>
                    <svg
                      className="w-12 h-12 text-green-500 dark:text-green-400 mb-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="text-green-600 dark:text-green-400 font-medium">
                      {file.name}
                    </span>
                    <span className="text-green-500 dark:text-green-400 text-sm mt-1">
                      Click to change file
                    </span>
                  </>
                ) : (
                  <>
                    <svg
                      className="w-12 h-12 text-gray-400 mb-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                    <span className="text-gray-600 dark:text-gray-300 font-medium">
                      Click to upload or drag and drop
                    </span>
                    <span className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                      PDF files only (max 10MB)
                    </span>
                  </>
                )}
              </label>
            </div>

            <div className="flex justify-end">
              <Button
                className="w-full sm:w-auto"
                onClick={handleProcess}
                disabled={!apiKey || !file || processing}
              >
                {processing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : (
                  'Process Document'
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { logger } from '../../lib/logger'
import Footer from '../../components/Footer'
import { Sparkles, BookOpen, Brain, Bot } from 'lucide-react'

export default function Login() {
  const router = useRouter()
  const { error: errorMessage } = router.query
  const supabase = createClientComponentClient()

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        router.push('/')
      }
    }

    if (!errorMessage) {
      checkSession()
    }
  }, [errorMessage, router, supabase])

  useEffect(() => {
    if (errorMessage) {
      logger.error('Login error from redirect', { error: errorMessage })
    }
  }, [errorMessage])

  const handleGoogleLogin = async () => {
    try {
      logger.info('Starting Google sign-in')

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        throw error
      }

      logger.info('Google sign-in initiated successfully')
    } catch (error) {
      logger.error('Error during Google sign-in:', error)
      const message = error instanceof Error ? error.message : 'Failed to sign in'
      router.push(`/auth/login?error=${encodeURIComponent(message)}`)
    }
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-gray-900 via-blue-900 to-gray-900">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-1/4 top-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute -right-1/4 top-3/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        {/* Main content */}
        <div className="flex min-h-screen flex-col items-center justify-center px-4">
          {/* Logo and Title */}
          <div className="mb-12 text-center">
            <div className="flex items-center justify-center mb-4">
              <Brain className="w-12 h-12 text-blue-400" />
              <Bot className="w-12 h-12 text-purple-400 -ml-4" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 mb-8 leading-[1.4] pb-2">
              Nick&apos;s AI Agents
            </h1>
            <h2 className="text-2xl md:text-3xl font-semibold text-white mb-8 leading-relaxed">
              Powered Learning Platform
            </h2>
            <p className="text-gray-300 max-w-md mx-auto">
              Transform your learning experience with AI-powered document processing and intelligent analysis
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mb-12">
            <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 text-center">
              <div className="flex justify-center mb-4">
                <Sparkles className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">AI-Powered Analysis</h3>
              <p className="text-gray-300 text-sm">Advanced document processing with state-of-the-art AI models</p>
            </div>
            <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 text-center">
              <div className="flex justify-center mb-4">
                <BookOpen className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Smart Learning</h3>
              <p className="text-gray-300 text-sm">Intelligent content organization and personalized insights</p>
            </div>
            <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 text-center">
              <div className="flex justify-center mb-4">
                <Bot className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">AI Agents</h3>
              <p className="text-gray-300 text-sm">Powered by advanced AI agents for enhanced learning experience</p>
            </div>
          </div>

          {/* Login Box */}
          <div className="w-full max-w-md">
            {errorMessage && (
              <div className="mb-4 rounded-md bg-red-500/10 backdrop-blur-lg p-4 text-sm text-red-200 border border-red-500/20">
                {decodeURIComponent(errorMessage as string)}
              </div>
            )}

            <div className="bg-white/5 backdrop-blur-lg rounded-xl p-8 shadow-2xl border border-white/10">
              <h3 className="text-xl font-semibold text-white text-center mb-6">Welcome Back</h3>
              <button
                onClick={handleGoogleLogin}
                className="flex w-full items-center justify-center gap-4 rounded-lg bg-white/10 hover:bg-white/15 backdrop-blur-lg px-8 py-4 text-white transition-all duration-300 border border-white/20 hover:border-white/30"
              >
                <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span className="flex-shrink-0">Continue with Google</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

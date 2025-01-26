'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../../lib/supabase'
import { logger } from '../../lib/logger'

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const handleCallback = async () => {
      try {
        logger.info('Starting auth callback handling')

        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          throw error
        }

        if (!session) {
          // If no session, try to exchange the code
          const code = router.query.code as string
          if (!code) {
            throw new Error('No code parameter found')
          }

          logger.info('Exchanging code for session')
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
          
          if (exchangeError) {
            throw exchangeError
          }
        }

        logger.info('Successfully authenticated, redirecting to home')
        router.push('/')

      } catch (error) {
        logger.error('Auth callback error', error)
        router.push('/auth/login?error=' + encodeURIComponent((error as Error).message))
      }
    }

    if (router.isReady) {
      handleCallback()
    }
  }, [router, router.isReady])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white mx-auto"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-300">
          Completing sign in...
        </p>
      </div>
    </div>
  )
}

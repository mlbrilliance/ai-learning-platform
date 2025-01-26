'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { logger } from '../../lib/logger'

export default function AuthCallback() {
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const handleCallback = async () => {
      try {
        logger.info('Starting auth callback handling')
        
        // Get code from URL parameters
        const { code, error: urlError } = router.query
        logger.info('Auth callback params:', { code, urlError })

        // If there's an error in the URL, throw it
        if (urlError) {
          throw new Error(urlError as string)
        }

        if (!code) {
          throw new Error('No code found in URL')
        }

        // Exchange the code for a session
        logger.info('Exchanging code for session')
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code as string)
        if (exchangeError) {
          throw exchangeError
        }

        // Get the session after exchanging the code
        logger.info('Getting session')
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError) {
          throw sessionError
        }

        if (!session) {
          throw new Error('No session found after code exchange')
        }

        logger.info('Session obtained successfully')

        // Get the site URL from environment variable or window location
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin
        logger.info('Using site URL:', siteUrl)

        // Always redirect to home after successful authentication
        const redirectUrl = `${siteUrl}/`
        logger.info('Auth callback successful, redirecting to:', redirectUrl)
        
        // Use router.push for client-side navigation
        router.push(redirectUrl)
      } catch (error) {
        logger.error('Error in auth callback:', error)
        const message = error instanceof Error ? error.message : 'Authentication failed'
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin
        
        // Use router.push for client-side navigation
        router.push(`/auth/login?error=${encodeURIComponent(message)}`)
      }
    }

    // Only run the callback handler if we have a code in the URL
    if (router.isReady && router.query.code) {
      handleCallback()
    }
  }, [router.isReady, router.query, supabase, router])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h2 className="mb-2 text-2xl font-semibold">Completing sign in...</h2>
        <p className="text-gray-600">Please wait while we authenticate you.</p>
      </div>
    </div>
  )
}

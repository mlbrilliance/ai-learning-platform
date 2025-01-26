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
        const { code, redirectedFrom } = router.query
        logger.info('Auth callback params:', { code, redirectedFrom })

        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code as string)
          if (error) {
            throw error
          }
        }

        // Get the session after exchanging the code
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError) {
          throw sessionError
        }

        if (!session) {
          throw new Error('No session found')
        }

        // Get the site URL from environment variable or window location
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin
        logger.info('Using site URL:', siteUrl)
        
        // Redirect to the original path or home
        const redirectUrl = redirectedFrom ? 
          `${siteUrl}${redirectedFrom}` : 
          `${siteUrl}/`

        logger.info('Auth callback successful, redirecting to:', redirectUrl)
        window.location.href = redirectUrl
      } catch (error) {
        logger.error('Error in auth callback:', error)
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin
        window.location.href = `${siteUrl}/auth/login?error=Authentication failed`
      }
    }

    // Only run the callback handler if we have a code in the URL
    if (router.isReady && router.query.code) {
      handleCallback()
    }
  }, [router.isReady, router.query, supabase])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h2 className="mb-2 text-2xl font-semibold">Completing sign in...</h2>
        <p className="text-gray-600">Please wait while we authenticate you.</p>
      </div>
    </div>
  )
}

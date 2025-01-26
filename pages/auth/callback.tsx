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
        const { searchParams } = new URL(window.location.href)
        const code = searchParams.get('code')

        if (code) {
          await supabase.auth.exchangeCodeForSession(code)
        }

        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          throw error
        }

        if (!session) {
          throw new Error('No session found')
        }

        // Get the return URL from query params or default to home
        const returnTo = searchParams.get('redirectedFrom') || '/'
        
        // Get the site URL from environment variable or window location
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin
        const redirectUrl = returnTo.startsWith('http') ? returnTo : `${siteUrl}${returnTo}`
        
        logger.info('Auth callback successful, redirecting to:', redirectUrl)
        window.location.href = redirectUrl
      } catch (error) {
        logger.error('Error in auth callback:', error)
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin
        window.location.href = `${siteUrl}/auth/login?error=Authentication failed`
      }
    }

    handleCallback()
  }, [router, supabase])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h2 className="mb-2 text-2xl font-semibold">Completing sign in...</h2>
        <p className="text-gray-600">Please wait while we authenticate you.</p>
      </div>
    </div>
  )
}

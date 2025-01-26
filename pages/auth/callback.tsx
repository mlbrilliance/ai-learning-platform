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

        // Get the session
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          throw error
        }

        if (!session) {
          throw new Error('No session found')
        }

        logger.info('Session obtained successfully')

        // Redirect to home after successful authentication
        router.push('/')
      } catch (error) {
        logger.error('Error in auth callback:', error)
        const message = error instanceof Error ? error.message : 'Authentication failed'
        router.push(`/auth/login?error=${encodeURIComponent(message)}`)
      }
    }

    // Only run the callback handler if we're ready
    if (router.isReady) {
      handleCallback()
    }
  }, [router.isReady, supabase, router])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h2 className="mb-2 text-2xl font-semibold">Completing sign in...</h2>
        <p className="text-gray-600">Please wait while we authenticate you.</p>
      </div>
    </div>
  )
}

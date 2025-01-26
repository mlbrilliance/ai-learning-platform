import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { logger } from './lib/logger'

const PUBLIC_ROUTES = ['/auth/login', '/auth/callback']

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  const path = req.nextUrl.pathname

  try {
    // For static assets and next.js internals, proceed
    if (path.startsWith('/_next/') || path.startsWith('/static/')) {
      return res
    }

    // For auth callback, just proceed
    if (path === '/auth/callback') {
      return res
    }

    // For API routes, proceed
    if (path.startsWith('/api/')) {
      return res
    }

    // Refresh session if available
    const { data: { session }, error } = await supabase.auth.getSession()

    // For public routes
    const isPublicRoute = PUBLIC_ROUTES.includes(path)
    if (isPublicRoute) {
      // If has session and on login page, redirect to home
      if (session && path === '/auth/login') {
        return NextResponse.redirect(new URL('/', req.url))
      }
      return res
    }

    // Protected routes
    if (!session) {
      const redirectUrl = req.nextUrl.clone()
      redirectUrl.pathname = '/auth/login'
      redirectUrl.searchParams.set('redirectedFrom', path)
      return NextResponse.redirect(redirectUrl)
    }

    return res
  } catch (error) {
    logger.error('Middleware error', error)
    // On error, allow access to public routes, redirect to login for private routes
    const isPublicRoute = PUBLIC_ROUTES.includes(path)
    if (!isPublicRoute) {
      const redirectUrl = req.nextUrl.clone()
      redirectUrl.pathname = '/auth/login'
      redirectUrl.searchParams.set('error', 'Session error')
      return NextResponse.redirect(redirectUrl)
    }
    return res
  }
}

// Update matcher to exclude static files and API routes
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}

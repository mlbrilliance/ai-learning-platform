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

    // Check auth status
    const { data: { session } } = await supabase.auth.getSession()

    // If no session and not on a public route, redirect to login
    if (!session && !PUBLIC_ROUTES.includes(path)) {
      const redirectUrl = req.nextUrl.clone()
      redirectUrl.pathname = '/auth/login'
      redirectUrl.searchParams.set('redirectedFrom', path)
      return NextResponse.redirect(redirectUrl)
    }

    // User is authenticated or accessing a public route, proceed
    return res
  } catch (error) {
    logger.error('Middleware error:', error)
    return res
  }
}

// Update matcher to exclude static files and API routes
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}

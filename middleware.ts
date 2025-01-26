import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { logger } from './lib/logger'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Auth pages handling
  if (req.nextUrl.pathname.startsWith('/auth')) {
    if (session) {
      // If user is signed in and the current path starts with /auth
      // redirect them to /
      return NextResponse.redirect(new URL('/', req.url))
    }
    // Allow all other auth routes
    return res
  }

  // Protected routes handling
  if (!session) {
    // If user is not signed in and the current path is not /auth
    // redirect them to /auth/login
    return NextResponse.redirect(new URL('/auth/login', req.url))
  }

  return res
}

// Update matcher to exclude static files and API routes
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     * - api (API routes)
     */
    '/((?!_next/static|_next/image|favicon.ico|public|api).*)',
  ],
}

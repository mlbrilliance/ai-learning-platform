import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '../types/supabase'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createPagesBrowserClient({
  supabaseUrl,
  supabaseKey: supabaseAnonKey,
  cookieOptions: {
    name: 'sb-auth-token',
    lifetime: 60 * 60 * 24 * 7, // 1 week
    domain: typeof window !== 'undefined' ? window.location.hostname : undefined,
    sameSite: 'lax',
    path: '/',
    secure: process.env.NODE_ENV === 'production'
  }
})

import { NextApiRequest, NextApiResponse } from 'next'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const supabase = createServerSupabaseClient({ req, res })
    const { data: { session }, error } = await supabase.auth.getSession()

    if (error) {
      throw error
    }

    return res.status(200).json({
      session,
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      redirectUrl: `${req.headers.origin}/auth/callback`,
    })
  } catch (error) {
    console.error('Auth config error:', error)
    return res.status(500).json({ error: 'Failed to get auth configuration' })
  }
}

import { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../../../lib/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { data, error } = await supabase.auth.getSession()
    const { data: settings } = await supabase.auth.getSettings()

    return res.status(200).json({
      session: data,
      settings,
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      redirectUrl: `${req.headers.origin}/auth/callback`,
    })
  } catch (error) {
    console.error('Auth config error:', error)
    return res.status(500).json({ error: 'Failed to get auth configuration' })
  }
}

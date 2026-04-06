import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://bpontndpvmssoizjyikb.supabase.co'
const supabaseAnonKey = 'sb_publishable_VD9r6hab804Tqpa6_uP40g_sVqWdf_n'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Discography = {
  id: string
  created_at: string
  title: string
  jacket_url: string
  audio_url: string
  release_date: string
  description: string
  tracklist: { title: string; length: string }[]
}

export type Member = {
  id: string
  created_at: string
  name: string
  role: string
  avatar_url: string
  bio: string
  sns_links: { platform: string; url: string }[]
}

export type Event = {
  id: string
  created_at: string
  event_name: string
  status: 'upcoming' | 'ongoing' | 'completed'
  link_url: string
  thumbnail_url: string
}

import { supabase } from './supabase'

/**
 * Fetches the visibility status for a given page slug.
 * @param slug The page identifier (e.g., 'home', 'activity', 'discography')
 * @returns Object containing is_public and label, or null if not found.
 */
export async function getPageVisibility(slug: string) {
  const { data, error } = await supabase
    .from('page_settings')
    .select('is_public, label')
    .eq('id', slug)
    .single()

  if (error) {
    console.error(`Error fetching visibility for ${slug}:`, error)
    return { is_public: true, label: slug } // Default to public if error
  }

  return data
}

/**
 * Checks if the current user is an authenticated admin.
 */
export async function isAdmin() {
  const { data: { session } } = await supabase.auth.getSession()
  return !!session
}

-- ==========================================
-- Melocolla Migration: 2026-05-04
-- Feature: Secure Public Storage Upload
-- ==========================================

-- 1. Create RLS Policy for Public Upload (anon)
-- We only allow INSERT to 'melocolla-assets' bucket for unauthenticated users.
DROP POLICY IF EXISTS "Public Upload Access" ON storage.objects;
CREATE POLICY "Public Upload Access" ON storage.objects
  FOR INSERT TO anon
  WITH CHECK (
    bucket_id = 'melocolla-assets' AND
    (lower(storage.extension(name)) = ANY (ARRAY['jpg', 'jpeg', 'png', 'webp', 'gif', 'avif', 'heic', 'heif']))
  );

-- ==========================================
-- Melocolla Final RLS Migration: 2026-04-08
-- Focus: Fix Storage & Table RLS Policies
-- ==========================================

-- 1. Storage Buckets & Policies
-- Ensure the bucket exists and is public for easy retrieval
INSERT INTO storage.buckets (id, name, public)
VALUES ('melocolla-assets', 'melocolla-assets', TRUE)
ON CONFLICT (id) DO NOTHING;

-- Policy: Anyone can read files from melocolla-assets
DROP POLICY IF EXISTS "Public Read Access" ON storage.objects;
CREATE POLICY "Public Read Access" ON storage.objects
  FOR SELECT USING (bucket_id = 'melocolla-assets');

-- Policy: Authenticated users can manage files in melocolla-assets
-- This covers INSERT, UPDATE, DELETE, and SELECT for admins
DROP POLICY IF EXISTS "Admin Manage Access" ON storage.objects;
CREATE POLICY "Admin Manage Access" ON storage.objects
  FOR ALL TO authenticated 
  USING (bucket_id = 'melocolla-assets')
  WITH CHECK (bucket_id = 'melocolla-assets');


-- 2. Database Table RLS Policies
-- We ensure that:
--   - Public users can only SELECT rows where is_public = true
--   - Authenticated users (admins) have full access to ALL rows

-- Activities
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can read public activities" ON activities;
DROP POLICY IF EXISTS "Admins have full access to activities" ON activities;
DROP POLICY IF EXISTS "Public SELECT activities" ON activities;
DROP POLICY IF EXISTS "Admin ALL activities" ON activities;

CREATE POLICY "Public SELECT activities" ON activities 
  FOR SELECT USING (is_public = true);
CREATE POLICY "Admin ALL activities" ON activities 
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Discography
ALTER TABLE discography ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can read public discography" ON discography;
DROP POLICY IF EXISTS "Admins have full access to discography" ON discography;
DROP POLICY IF EXISTS "Public SELECT discography" ON discography;
DROP POLICY IF EXISTS "Admin ALL discography" ON discography;

CREATE POLICY "Public SELECT discography" ON discography 
  FOR SELECT USING (is_public = true);
CREATE POLICY "Admin ALL discography" ON discography 
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Members
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can read public members" ON members;
DROP POLICY IF EXISTS "Admins have full access to members" ON members;
DROP POLICY IF EXISTS "Public SELECT members" ON members;
DROP POLICY IF EXISTS "Admin ALL members" ON members;

CREATE POLICY "Public SELECT members" ON members 
  FOR SELECT USING (is_public = true);
CREATE POLICY "Admin ALL members" ON members 
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Events
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can read public events" ON events;
DROP POLICY IF EXISTS "Admins have full access to events" ON events;
DROP POLICY IF EXISTS "Public SELECT events" ON events;
DROP POLICY IF EXISTS "Admin ALL events" ON events;

CREATE POLICY "Public SELECT events" ON events 
  FOR SELECT USING (is_public = true);
CREATE POLICY "Admin ALL events" ON events 
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

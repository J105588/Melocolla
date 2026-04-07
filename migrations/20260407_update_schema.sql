-- ==========================================
-- Melocolla Migration: 2026-04-07
-- Feature: Activity Reports & Events Fix
-- ==========================================

-- 1. Create Activities Table
CREATE TABLE IF NOT EXISTS activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  is_public BOOLEAN DEFAULT true
);

-- 2. Row Level Security for Activities
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read public activities" ON activities;
CREATE POLICY "Public can read public activities" ON activities
  FOR SELECT USING (is_public = true);

DROP POLICY IF EXISTS "Admins have full access to activities" ON activities;
CREATE POLICY "Admins have full access to activities" ON activities
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 3. Fix events table (Add jacket_url column for consistency)
-- The error "Could not find the 'jacket_url' column of 'events'" is resolved by adding the column.
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='events' AND column_name='jacket_url') THEN
    ALTER TABLE events ADD COLUMN jacket_url TEXT;
  END IF;
  
  -- Synchronize thumbnail_url to jacket_url if jacket_url is empty
  UPDATE events SET jacket_url = thumbnail_url WHERE jacket_url IS NULL;
END $$;

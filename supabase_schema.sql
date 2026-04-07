-- ==========================================
-- Melocolla Supabase Schema (Idempotent & RLS)
-- ==========================================

-- 0. Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Discography Table
CREATE TABLE IF NOT EXISTS discography (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  title TEXT NOT NULL,
  jacket_url TEXT,
  audio_url TEXT,
  release_date DATE NOT NULL DEFAULT CURRENT_DATE,
  description TEXT,
  tracklist JSONB DEFAULT '[]'::jsonb,
  is_public BOOLEAN DEFAULT true
);

-- 2. Members Table
CREATE TABLE IF NOT EXISTS members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  name TEXT NOT NULL,
  role TEXT,
  avatar_url TEXT,
  bio TEXT,
  sns_links JSONB DEFAULT '[]'::jsonb,
  is_public BOOLEAN DEFAULT true
);

-- 3. Events Table
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  event_name TEXT NOT NULL,
  status TEXT CHECK (status IN ('upcoming', 'ongoing', 'completed')),
  link_url TEXT,
  thumbnail_url TEXT,
  jacket_url TEXT,
  is_public BOOLEAN DEFAULT true
);

-- 4. Idempotent Column Additions (For existing tables)
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='discography' AND column_name='is_public') THEN
    ALTER TABLE discography ADD COLUMN is_public BOOLEAN DEFAULT true;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='members' AND column_name='is_public') THEN
    ALTER TABLE members ADD COLUMN is_public BOOLEAN DEFAULT true;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='events' AND column_name='is_public') THEN
    ALTER TABLE events ADD COLUMN is_public BOOLEAN DEFAULT true;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='events' AND column_name='jacket_url') THEN
    ALTER TABLE events ADD COLUMN jacket_url TEXT;
  END IF;
END $$;

-- 5. Activities Table
CREATE TABLE IF NOT EXISTS activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  is_public BOOLEAN DEFAULT true
);

-- 5. Row Level Security (RLS)
ALTER TABLE discography ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

-- 6. Policies (Public Access)
-- DROP POLICY IF EXISTS を使って重複作成を防止
DROP POLICY IF EXISTS "Public can read public discography" ON discography;
CREATE POLICY "Public can read public discography" ON discography
  FOR SELECT USING (is_public = true);

DROP POLICY IF EXISTS "Public can read public members" ON members;
CREATE POLICY "Public can read public members" ON members
  FOR SELECT USING (is_public = true);

DROP POLICY IF EXISTS "Public can read public events" ON events;
CREATE POLICY "Public can read public events" ON events
  FOR SELECT USING (is_public = true);

-- 7. Policies (Admin Access - Authenticated Users)
DROP POLICY IF EXISTS "Admins have full access to discography" ON discography;
CREATE POLICY "Admins have full access to discography" ON discography
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admins have full access to members" ON members;
CREATE POLICY "Admins have full access to members" ON members
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admins have full access to events" ON events;
CREATE POLICY "Admins have full access to events" ON events
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public can read public activities" ON activities;
CREATE POLICY "Public can read public activities" ON activities
  FOR SELECT USING (is_public = true);

DROP POLICY IF EXISTS "Admins have full access to activities" ON activities;
CREATE POLICY "Admins have full access to activities" ON activities
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

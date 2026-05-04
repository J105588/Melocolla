-- ==========================================
-- Melocolla Migration: 2026-05-04
-- Feature: Member Applications System
-- ==========================================

-- 1. Create Member Applications Table
CREATE TABLE IF NOT EXISTS member_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    name TEXT NOT NULL,
    furigana TEXT NOT NULL,
    role TEXT,
    avatar_url TEXT,
    bio TEXT,
    sns_links JSONB DEFAULT '[]'::jsonb,
    slug TEXT,
    email TEXT NOT NULL,
    status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
    notes TEXT -- Admin notes
);

-- 2. Row Level Security
ALTER TABLE member_applications ENABLE ROW LEVEL SECURITY;

-- Public can submit but not read
DROP POLICY IF EXISTS "Public can submit applications" ON member_applications;
CREATE POLICY "Public can submit applications" ON member_applications
    FOR INSERT WITH CHECK (true);

-- Admins can read and update everything
DROP POLICY IF EXISTS "Admins can manage applications" ON member_applications;
CREATE POLICY "Admins can manage applications" ON member_applications
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 3. Update members table sorting defaults (if not exists)
-- Ensure sort_order column exists
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME='members' AND COLUMN_NAME='sort_order') THEN
        ALTER TABLE members ADD COLUMN sort_order INTEGER DEFAULT 2;
    END IF;
END $$;

-- Ensure furigana column exists in members table
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME='members' AND COLUMN_NAME='furigana') THEN
        ALTER TABLE members ADD COLUMN furigana TEXT;
    END IF;
END $$;

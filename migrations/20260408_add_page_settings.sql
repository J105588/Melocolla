-- ==========================================
-- Melocolla Migration: 2026-04-08
-- Feature: Page Visibility Settings
-- ==========================================

-- 1. Create Page Settings Table
CREATE TABLE IF NOT EXISTS page_settings (
    id TEXT PRIMARY KEY, -- slug: 'home', 'discography', etc.
    label TEXT NOT NULL,
    is_public BOOLEAN DEFAULT true,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Row Level Security
ALTER TABLE page_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read page settings" ON page_settings;
CREATE POLICY "Public can read page settings" ON page_settings
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can update page settings" ON page_settings;
CREATE POLICY "Admins can update page settings" ON page_settings
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 3. Seed Initial Data
INSERT INTO page_settings (id, label, is_public) VALUES
    ('home', 'Home', true),
    ('discography', 'Discography', true),
    ('members', 'Members', true),
    ('events', 'Events', true),
    ('activity', 'Activity', true),
    ('terms', 'Terms', true)
ON CONFLICT (id) DO NOTHING;

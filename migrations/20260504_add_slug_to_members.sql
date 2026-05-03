-- Add slug column to members table
ALTER TABLE members ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;
CREATE INDEX IF NOT EXISTS idx_members_slug ON members(slug);

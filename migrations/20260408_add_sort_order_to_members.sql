-- ==========================================
-- Melocolla Migration: 2026-04-08 (B)
-- Feature: Add Sort Order to Members
-- ==========================================

-- 1. Add sort_order column to members table
-- We use a default of 0, so existing members stay at the same priority.
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='members' AND column_name='sort_order') THEN
    ALTER TABLE members ADD COLUMN sort_order INTEGER DEFAULT 0;
  END IF;
END $$;

-- Optional: Initial cleanup for legacy data if needed
-- UPDATE members SET sort_order = 0 WHERE sort_order IS NULL;

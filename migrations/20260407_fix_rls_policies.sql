-- ==========================================
-- Melocolla Migration: 2026-04-07 (B)
-- Feature: Fix RLS Policies for All Tables
-- ==========================================

-- 1. Ensure RLS is enabled for all tables
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE discography ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- 2. Define Public (SELECT) Policies
DROP POLICY IF EXISTS "Public can read public activities" ON activities;
CREATE POLICY "Public can read public activities" ON activities FOR SELECT USING (is_public = true);

DROP POLICY IF EXISTS "Public can read public discography" ON discography;
CREATE POLICY "Public can read public discography" ON discography FOR SELECT USING (is_public = true);

DROP POLICY IF EXISTS "Public can read public members" ON members;
CREATE POLICY "Public can read public members" ON members FOR SELECT USING (is_public = true);

DROP POLICY IF EXISTS "Public can read public events" ON events;
CREATE POLICY "Public can read public events" ON events FOR SELECT USING (is_public = true);

-- 3. Define Admin (ALL) Policies for Authenticated Users
-- We use FOR ALL to cover INSERT, UPDATE, DELETE, and SELECT for admins.

DROP POLICY IF EXISTS "Admins have full access to activities" ON activities;
CREATE POLICY "Admins have full access to activities" ON activities FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admins have full access to discography" ON discography;
CREATE POLICY "Admins have full access to discography" ON discography FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admins have full access to members" ON members;
CREATE POLICY "Admins have full access to members" ON members FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admins have full access to events" ON events;
CREATE POLICY "Admins have full access to events" ON events FOR ALL TO authenticated USING (true) WITH CHECK (true);

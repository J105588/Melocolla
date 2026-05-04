-- ==========================================
-- Melocolla Migration: 2026-05-04
-- Feature: Make Application Email Optional
-- ==========================================

-- Allow NULL for email in member_applications
ALTER TABLE member_applications ALTER COLUMN email DROP NOT NULL;

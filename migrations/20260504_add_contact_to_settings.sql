-- Add Contact page to visibility settings
INSERT INTO page_settings (id, label, is_public)
VALUES ('contact', 'Contact', true)
ON CONFLICT (id) DO NOTHING;

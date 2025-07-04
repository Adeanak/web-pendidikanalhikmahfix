/*
  # Create website_settings table

  1. New Tables
    - `website_settings`
      - `id` (integer, primary key, default 1)
      - `settings` (jsonb, stores website configuration)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `website_settings` table
    - Add policy for public read access to website settings
    - Add policy for super admin to manage website settings

  3. Constraints
    - Ensure only one row can exist (singleton pattern)
    - Add unique index to enforce single row constraint
*/

-- Create website_settings table
CREATE TABLE IF NOT EXISTS public.website_settings (
    id integer NOT NULL DEFAULT 1,
    settings jsonb NOT NULL DEFAULT '{}'::jsonb,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Add primary key constraint
ALTER TABLE public.website_settings 
ADD CONSTRAINT website_settings_pkey PRIMARY KEY (id);

-- Create unique index to ensure only one settings row exists
CREATE UNIQUE INDEX IF NOT EXISTS website_settings_single_row_idx 
ON public.website_settings (id);

-- Enable Row Level Security
ALTER TABLE public.website_settings ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read website settings (needed for public website)
CREATE POLICY "Anyone can read website settings"
ON public.website_settings
FOR SELECT
TO public
USING (true);

-- Policy: Super admin can manage website settings
CREATE POLICY "Super admin can manage website settings"
ON public.website_settings
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE users.id::text = auth.uid()::text
    AND users.role = 'super_admin'
  )
);

-- Insert default settings row if it doesn't exist
INSERT INTO public.website_settings (id, settings)
VALUES (1, '{
  "siteName": "Yayasan Al-Hikmah",
  "siteDescription": "Lembaga Pendidikan Islam Terpadu",
  "logo": "/lovable-uploads/412c52db-f543-4a7b-b59a-0455479a6c37.png",
  "favicon": "/lovable-uploads/412c52db-f543-4a7b-b59a-0455479a6c37.png",
  "primaryColor": "#4F46E5",
  "secondaryColor": "#06B6D4",
  "accentColor": "#F59E0B",
  "fontFamily": "Poppins",
  "heroTitle": "Yayasan Al-Hikmah",
  "heroSubtitle": "Membentuk Generasi Qurani yang Berakhlak Mulia",
  "heroImage": "",
  "aboutTitle": "Tentang Kami",
  "aboutContent": "Yayasan Al-Hikmah adalah lembaga pendidikan Islam yang berkomitmen untuk membentuk generasi Qurani yang berakhlak mulia.",
  "footerText": "© 2025 Yayasan Al-Hikmah. Semua hak dilindungi.",
  "contactEmail": "info@alhikmah.ac.id",
  "contactPhone": "(022) 1234-5678",
  "contactPhone2": "0812-3456-7890",
  "address": {
    "kampung": "Kp. Tanjung",
    "rt": "03",
    "rw": "07",
    "desa": "Desa Tanjungsari",
    "kecamatan": "Kecamatan Cangkuang",
    "kabupaten": "Kabupaten Bandung"
  },
  "socialMedia": {
    "facebook": "",
    "instagram": "",
    "youtube": ""
  },
  "showGraduates": true,
  "showPPDB": true,
  "enableDarkMode": false,
  "showFloatingStats": true
}'::jsonb)
ON CONFLICT (id) DO NOTHING;
/*
  # Website Settings Table Creation

  1. New Tables
    - `website_settings` - Stores website configuration in a single row with JSON data
      - `id` (integer, primary key, default 1)
      - `settings` (jsonb, stores all website configuration)
      - `created_at` (timestamp with timezone)
      - `updated_at` (timestamp with timezone)
  
  2. Security
    - Enable RLS on `website_settings` table
    - Add policy for public users to read settings
    - Add policy for super_admin to manage settings
    
  3. Default Data
    - Insert default website configuration
*/

-- Create website_settings table with primary key
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'website_settings') THEN
    CREATE TABLE public.website_settings (
      id integer PRIMARY KEY DEFAULT 1,
      settings jsonb NOT NULL DEFAULT '{}'::jsonb,
      created_at timestamptz DEFAULT now(),
      updated_at timestamptz DEFAULT now()
    );
  END IF;
END $$;

-- Create unique index to ensure only one settings row exists
CREATE UNIQUE INDEX IF NOT EXISTS website_settings_single_row_idx 
ON public.website_settings (id);

-- Enable Row Level Security
ALTER TABLE public.website_settings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'website_settings' 
    AND policyname = 'Anyone can read website settings'
  ) THEN
    DROP POLICY "Anyone can read website settings" ON public.website_settings;
  END IF;
  
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'website_settings' 
    AND policyname = 'Super admin can manage website settings'
  ) THEN
    DROP POLICY "Super admin can manage website settings" ON public.website_settings;
  END IF;
END $$;

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
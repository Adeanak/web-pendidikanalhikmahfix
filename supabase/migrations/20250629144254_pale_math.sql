/*
  # Create website settings table

  1. New Tables
    - `website_settings`
      - `id` (integer, primary key)
      - `settings` (jsonb)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
  
  2. Security
    - Enable RLS on `website_settings` table
    - Add policies for public read access
    - Add policies for admin write access
*/

-- Create website_settings table if it doesn't exist
CREATE TABLE IF NOT EXISTS website_settings (
  id integer PRIMARY KEY DEFAULT 1,
  settings jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create unique index to ensure only one row
CREATE UNIQUE INDEX IF NOT EXISTS website_settings_single_row_idx ON website_settings ((id));

-- Enable RLS
ALTER TABLE website_settings ENABLE ROW LEVEL SECURITY;

-- Create policies
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'website_settings' AND policyname = 'Anyone can read website settings'
  ) THEN
    CREATE POLICY "Anyone can read website settings"
      ON website_settings
      FOR SELECT
      TO public
      USING (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'website_settings' AND policyname = 'Super admin can manage website settings'
  ) THEN
    CREATE POLICY "Super admin can manage website settings"
      ON website_settings
      FOR ALL
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM users
          WHERE (users.id)::text = (auth.uid())::text
          AND users.role = 'super_admin'::text
        )
      );
  END IF;
END $$;

-- Create RPC function to create the table if it doesn't exist
CREATE OR REPLACE FUNCTION create_website_settings_table()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Create the table if it doesn't exist
  CREATE TABLE IF NOT EXISTS website_settings (
    id integer PRIMARY KEY DEFAULT 1,
    settings jsonb NOT NULL DEFAULT '{}'::jsonb,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
  );
  
  -- Create unique index
  CREATE UNIQUE INDEX IF NOT EXISTS website_settings_single_row_idx ON website_settings ((id));
  
  -- Enable RLS
  ALTER TABLE website_settings ENABLE ROW LEVEL SECURITY;
  
  -- Create policies
  CREATE POLICY "Anyone can read website settings"
    ON website_settings
    FOR SELECT
    TO public
    USING (true);
    
  CREATE POLICY "Super admin can manage website settings"
    ON website_settings
    FOR ALL
    TO authenticated
    USING (
      EXISTS (
        SELECT 1 FROM users
        WHERE (users.id)::text = (auth.uid())::text
        AND users.role = 'super_admin'::text
      )
    );
END;
$$;

-- Insert default settings if not exists
INSERT INTO website_settings (id, settings)
VALUES (
  1,
  '{
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
  }'::jsonb
) ON CONFLICT (id) DO NOTHING;
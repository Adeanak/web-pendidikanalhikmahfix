/*
  # PPDB Configuration Tables

  1. New Tables
    - `ppdb_form_config` - Stores form field configuration
    - `ppdb_settings` - Stores PPDB registration period settings
    - `ppdb_test_schedules` - Stores test schedules for PPDB

  2. Security
    - Enable RLS on all tables
    - Add policies for public read access
    - Add policies for admin management
*/

-- Create ppdb_form_config table
CREATE TABLE IF NOT EXISTS ppdb_form_config (
  id integer PRIMARY KEY DEFAULT 1,
  fields jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create unique index to ensure only one row
CREATE UNIQUE INDEX IF NOT EXISTS ppdb_form_config_single_row_idx ON ppdb_form_config ((id));

-- Create ppdb_settings table
CREATE TABLE IF NOT EXISTS ppdb_settings (
  id integer PRIMARY KEY DEFAULT 1,
  is_open boolean NOT NULL DEFAULT true,
  start_date date,
  end_date date,
  academic_year text DEFAULT '2025/2026',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create unique index to ensure only one row
CREATE UNIQUE INDEX IF NOT EXISTS ppdb_settings_single_row_idx ON ppdb_settings ((id));

-- Create ppdb_test_schedules table
CREATE TABLE IF NOT EXISTS ppdb_test_schedules (
  id bigserial PRIMARY KEY,
  title text NOT NULL,
  date date NOT NULL,
  time text NOT NULL,
  location text NOT NULL,
  description text,
  program text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add program constraint using DO block to handle existing constraint
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'ppdb_test_schedules_program_check' 
    AND table_name = 'ppdb_test_schedules'
  ) THEN
    ALTER TABLE ppdb_test_schedules 
    ADD CONSTRAINT ppdb_test_schedules_program_check 
    CHECK (program = ANY (ARRAY['TKA/TPA'::text, 'PAUD/KOBER'::text, 'Diniyah'::text, 'Semua Program'::text]));
  END IF;
END $$;

-- Enable RLS on all tables
ALTER TABLE ppdb_form_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE ppdb_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE ppdb_test_schedules ENABLE ROW LEVEL SECURITY;

-- Policies for ppdb_form_config
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'ppdb_form_config' AND policyname = 'Anyone can read form config'
  ) THEN
    CREATE POLICY "Anyone can read form config"
      ON ppdb_form_config
      FOR SELECT
      TO public
      USING (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'ppdb_form_config' AND policyname = 'Super admin can manage form config'
  ) THEN
    CREATE POLICY "Super admin can manage form config"
      ON ppdb_form_config
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

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'ppdb_form_config' AND policyname = 'Authorized users can manage form config'
  ) THEN
    CREATE POLICY "Authorized users can manage form config"
      ON ppdb_form_config
      FOR ALL
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM users u
          JOIN permissions p ON (u.id = p.user_id)
          WHERE (u.id)::text = (auth.uid())::text
          AND (p.can_manage_ppdb = true OR u.role = ANY (ARRAY['super_admin'::text, 'ketua_yayasan'::text, 'kepala_sekolah'::text]))
        )
      );
  END IF;
END $$;

-- Policies for ppdb_settings
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'ppdb_settings' AND policyname = 'Anyone can read PPDB settings'
  ) THEN
    CREATE POLICY "Anyone can read PPDB settings"
      ON ppdb_settings
      FOR SELECT
      TO public
      USING (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'ppdb_settings' AND policyname = 'Super admin can manage PPDB settings'
  ) THEN
    CREATE POLICY "Super admin can manage PPDB settings"
      ON ppdb_settings
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

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'ppdb_settings' AND policyname = 'Authorized users can manage PPDB settings'
  ) THEN
    CREATE POLICY "Authorized users can manage PPDB settings"
      ON ppdb_settings
      FOR ALL
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM users u
          JOIN permissions p ON (u.id = p.user_id)
          WHERE (u.id)::text = (auth.uid())::text
          AND (p.can_manage_ppdb = true OR u.role = ANY (ARRAY['super_admin'::text, 'ketua_yayasan'::text, 'kepala_sekolah'::text]))
        )
      );
  END IF;
END $$;

-- Policies for ppdb_test_schedules
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'ppdb_test_schedules' AND policyname = 'Anyone can read test schedules'
  ) THEN
    CREATE POLICY "Anyone can read test schedules"
      ON ppdb_test_schedules
      FOR SELECT
      TO public
      USING (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'ppdb_test_schedules' AND policyname = 'Super admin can manage test schedules'
  ) THEN
    CREATE POLICY "Super admin can manage test schedules"
      ON ppdb_test_schedules
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

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'ppdb_test_schedules' AND policyname = 'Authorized users can manage test schedules'
  ) THEN
    CREATE POLICY "Authorized users can manage test schedules"
      ON ppdb_test_schedules
      FOR ALL
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM users u
          JOIN permissions p ON (u.id = p.user_id)
          WHERE (u.id)::text = (auth.uid())::text
          AND (p.can_manage_ppdb = true OR u.role = ANY (ARRAY['super_admin'::text, 'ketua_yayasan'::text, 'kepala_sekolah'::text]))
        )
      );
  END IF;
END $$;

-- Insert default form configuration
INSERT INTO ppdb_form_config (id, fields) VALUES (
  1,
  '[
    {"id": "nama_lengkap", "label": "Nama Lengkap", "type": "text", "required": true, "placeholder": "Masukkan nama lengkap"},
    {"id": "program_pilihan", "label": "Program Pilihan", "type": "select", "required": true, "options": ["TKA/TPA", "PAUD/KOBER", "Diniyah"]},
    {"id": "parent_name", "label": "Nama Orang Tua/Wali", "type": "text", "required": true, "placeholder": "Masukkan nama orang tua/wali"},
    {"id": "phone", "label": "Nomor Telepon", "type": "tel", "required": true, "placeholder": "Masukkan nomor telepon"},
    {"id": "email", "label": "Email", "type": "email", "required": false, "placeholder": "Masukkan email (opsional)"},
    {"id": "address", "label": "Alamat Lengkap", "type": "textarea", "required": true, "placeholder": "Masukkan alamat lengkap"},
    {"id": "birth_date", "label": "Tanggal Lahir", "type": "date", "required": false}
  ]'::jsonb
) ON CONFLICT (id) DO NOTHING;

-- Insert default PPDB settings
INSERT INTO ppdb_settings (id, is_open, start_date, end_date, academic_year) VALUES (
  1,
  true,
  '2025-01-01',
  '2025-07-31',
  '2025/2026'
) ON CONFLICT (id) DO NOTHING;

-- Insert default test schedules
INSERT INTO ppdb_test_schedules (title, date, time, location, description, program) VALUES
  ('Tes Masuk TKA/TPA', '2025-07-15', '08:00 - 11:00', 'Gedung Utama Al-Hikmah', 'Tes baca Al-Quran dan wawancara orang tua', 'TKA/TPA'),
  ('Tes Masuk PAUD/KOBER', '2025-07-16', '08:00 - 11:00', 'Gedung Utama Al-Hikmah', 'Tes kesiapan sekolah dan wawancara orang tua', 'PAUD/KOBER'),
  ('Tes Masuk Diniyah', '2025-07-17', '13:00 - 16:00', 'Gedung Utama Al-Hikmah', 'Tes pengetahuan agama dasar dan wawancara', 'Diniyah')
ON CONFLICT DO NOTHING;
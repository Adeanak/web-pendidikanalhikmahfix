/*
  # Fix program_details table and policies

  1. New Tables
    - No new tables created, just fixing existing table policies
  
  2. Security
    - Ensure RLS policies are properly created without conflicts
    - Maintain existing security model for program_details
  
  3. Changes
    - Fix policy creation to avoid conflicts with existing policies
    - Ensure default program data is properly inserted
*/

-- Check if program_details table exists, if not create it
CREATE TABLE IF NOT EXISTS program_details (
  id SERIAL PRIMARY KEY,
  program_id TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  description TEXT NOT NULL,
  features TEXT[] DEFAULT '{}',
  curriculum TEXT[] DEFAULT '{}',
  facilities TEXT[] DEFAULT '{}',
  schedule TEXT,
  age_range TEXT,
  class_size TEXT,
  monthly_fee INTEGER DEFAULT 0,
  registration_fee INTEGER DEFAULT 0,
  uniform_fee INTEGER DEFAULT 0,
  book_fee INTEGER DEFAULT 0,
  images TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable row level security
ALTER TABLE program_details ENABLE ROW LEVEL SECURITY;

-- Safely drop existing policies if they exist
DO $$ 
BEGIN
  -- Check if policies exist before attempting to drop them
  IF EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Anyone can read program details' AND tablename = 'program_details') THEN
    DROP POLICY "Anyone can read program details" ON program_details;
  END IF;
  
  IF EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Authenticated users can read program details' AND tablename = 'program_details') THEN
    DROP POLICY "Authenticated users can read program details" ON program_details;
  END IF;
  
  IF EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Super admin can manage program details' AND tablename = 'program_details') THEN
    DROP POLICY "Super admin can manage program details" ON program_details;
  END IF;
  
  IF EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Authorized users can manage program details' AND tablename = 'program_details') THEN
    DROP POLICY "Authorized users can manage program details" ON program_details;
  END IF;
END $$;

-- Create new policies
CREATE POLICY "Anyone can read program details"
  ON program_details
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can read program details"
  ON program_details
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Super admin can manage program details"
  ON program_details
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id::text = auth.uid()::text
      AND users.role = 'super_admin'
    )
  );

CREATE POLICY "Authorized users can manage program details"
  ON program_details
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users u
      JOIN permissions p ON u.id = p.user_id
      WHERE u.id::text = auth.uid()::text
      AND (u.role = ANY(ARRAY['super_admin', 'ketua_yayasan', 'kepala_sekolah']))
    )
  );

-- Insert or update default program details
INSERT INTO program_details (
  program_id, title, subtitle, description, features, curriculum, facilities,
  schedule, age_range, class_size, monthly_fee, registration_fee, uniform_fee, book_fee, images
) VALUES 
(
  'paud',
  'Kober/PAUD',
  'Kelompok Bermain / Pendidikan Anak Usia Dini',
  'Program pendidikan untuk anak usia dini yang menggabungkan pembelajaran akademik dengan nilai-nilai Islam dalam suasana yang menyenangkan.',
  ARRAY[
    'Pembelajaran Dasar (Calistung)',
    'Pengenalan Huruf Hijaiyah',
    'Seni, Musik, dan Gerak',
    'Permainan Edukatif',
    'Pembentukan Karakter Islami'
  ],
  ARRAY[
    'Pengenalan Huruf dan Angka',
    'Membaca dan Menulis Dasar',
    'Berhitung Dasar',
    'Mengenal Huruf Hijaiyah',
    'Hafalan Doa Sehari-hari',
    'Seni dan Kreativitas',
    'Permainan Edukatif',
    'Pengembangan Motorik',
    'Pendidikan Karakter Islami'
  ],
  ARRAY[
    'Ruang Kelas Nyaman',
    'Area Bermain Indoor',
    'Area Bermain Outdoor',
    'Perpustakaan Mini',
    'Alat Peraga Edukatif',
    'Toilet Anak',
    'Ruang Istirahat'
  ],
  'Senin - Jumat, 08:00 - 11:00',
  '3-6 tahun',
  '15-20 anak per kelas',
  150000,
  500000,
  250000,
  200000,
  ARRAY[
    'https://images.pexels.com/photos/8535214/pexels-photo-8535214.jpeg',
    'https://images.pexels.com/photos/8535227/pexels-photo-8535227.jpeg',
    'https://images.pexels.com/photos/8473456/pexels-photo-8473456.jpeg'
  ]
)
ON CONFLICT (program_id) DO UPDATE SET
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  description = EXCLUDED.description,
  features = EXCLUDED.features,
  curriculum = EXCLUDED.curriculum,
  facilities = EXCLUDED.facilities,
  schedule = EXCLUDED.schedule,
  age_range = EXCLUDED.age_range,
  class_size = EXCLUDED.class_size,
  monthly_fee = EXCLUDED.monthly_fee,
  registration_fee = EXCLUDED.registration_fee,
  uniform_fee = EXCLUDED.uniform_fee,
  book_fee = EXCLUDED.book_fee,
  images = EXCLUDED.images,
  updated_at = NOW();

INSERT INTO program_details (
  program_id, title, subtitle, description, features, curriculum, facilities,
  schedule, age_range, class_size, monthly_fee, registration_fee, uniform_fee, book_fee, images
) VALUES 
(
  'tka-tpa',
  'TKA/TPA',
  'Taman Kanak-kanak Al-Quran / Taman Pendidikan Al-Quran',
  'Program pendidikan Al-Quran untuk anak-anak usia 4-12 tahun dengan metode pembelajaran yang menyenangkan dan mudah dipahami.',
  ARRAY[
    'Pembelajaran Al-Quran dengan Tajwid',
    'Hafalan Surat-surat Pendek',
    'Pendidikan Akhlak dan Adab',
    'Pembelajaran Bahasa Arab Dasar',
    'Kegiatan Seni dan Kreativitas'
  ],
  ARRAY[
    'Baca Tulis Al-Quran',
    'Tahsin dan Tajwid',
    'Tahfidz Juz 30',
    'Doa-doa Harian',
    'Hadits Pilihan',
    'Adab dan Akhlak Islami',
    'Bahasa Arab Dasar',
    'Praktek Ibadah',
    'Sirah Nabawiyah'
  ],
  ARRAY[
    'Ruang Belajar Al-Quran',
    'Mushola Mini',
    'Perpustakaan Islam',
    'Alat Peraga Edukatif',
    'Audio Visual',
    'Area Bermain',
    'Toilet Bersih'
  ],
  'Senin - Jumat, 15:30 - 17:00',
  '4-12 tahun',
  '10-15 anak per kelas',
  100000,
  300000,
  200000,
  150000,
  ARRAY[
    'https://images.pexels.com/photos/8471835/pexels-photo-8471835.jpeg',
    'https://images.pexels.com/photos/8471788/pexels-photo-8471788.jpeg',
    'https://images.pexels.com/photos/8471799/pexels-photo-8471799.jpeg'
  ]
)
ON CONFLICT (program_id) DO UPDATE SET
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  description = EXCLUDED.description,
  features = EXCLUDED.features,
  curriculum = EXCLUDED.curriculum,
  facilities = EXCLUDED.facilities,
  schedule = EXCLUDED.schedule,
  age_range = EXCLUDED.age_range,
  class_size = EXCLUDED.class_size,
  monthly_fee = EXCLUDED.monthly_fee,
  registration_fee = EXCLUDED.registration_fee,
  uniform_fee = EXCLUDED.uniform_fee,
  book_fee = EXCLUDED.book_fee,
  images = EXCLUDED.images,
  updated_at = NOW();

INSERT INTO program_details (
  program_id, title, subtitle, description, features, curriculum, facilities,
  schedule, age_range, class_size, monthly_fee, registration_fee, uniform_fee, book_fee, images
) VALUES 
(
  'diniyah',
  'Madrasah Diniyah',
  'Pendidikan Agama Islam Formal',
  'Program pendidikan agama Islam yang komprehensif untuk memberikan pemahaman mendalam tentang ajaran Islam kepada generasi muda.',
  ARRAY[
    'Studi Al-Quran dan Tafsir',
    'Hadits dan Sirah Nabawiyah',
    'Fiqh dan Aqidah',
    'Bahasa Arab Lanjutan',
    'Sejarah Islam'
  ],
  ARRAY[
    'Al-Quran dan Tafsir',
    'Hadits dan Ilmu Hadits',
    'Fiqh Ibadah',
    'Aqidah Islamiyah',
    'Akhlak dan Adab',
    'Bahasa Arab',
    'Sirah Nabawiyah',
    'Sejarah Peradaban Islam',
    'Praktek Ibadah'
  ],
  ARRAY[
    'Ruang Kelas Kondusif',
    'Perpustakaan Islam',
    'Laboratorium Bahasa Arab',
    'Mushola',
    'Ruang Diskusi',
    'Komputer dan Internet',
    'Kantin Halal'
  ],
  'Senin - Kamis, 19:30 - 21:00',
  '7-17 tahun',
  '15-20 santri per kelas',
  125000,
  350000,
  225000,
  175000,
  ARRAY[
    'https://images.pexels.com/photos/5905905/pexels-photo-5905905.jpeg',
    'https://images.pexels.com/photos/5905904/pexels-photo-5905904.jpeg',
    'https://images.pexels.com/photos/5905902/pexels-photo-5905902.jpeg'
  ]
)
ON CONFLICT (program_id) DO UPDATE SET
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  description = EXCLUDED.description,
  features = EXCLUDED.features,
  curriculum = EXCLUDED.curriculum,
  facilities = EXCLUDED.facilities,
  schedule = EXCLUDED.schedule,
  age_range = EXCLUDED.age_range,
  class_size = EXCLUDED.class_size,
  monthly_fee = EXCLUDED.monthly_fee,
  registration_fee = EXCLUDED.registration_fee,
  uniform_fee = EXCLUDED.uniform_fee,
  book_fee = EXCLUDED.book_fee,
  images = EXCLUDED.images,
  updated_at = NOW();
/*
  # Create program_details table

  1. New Tables
    - `program_details`
      - `id` (serial, primary key)
      - `program_id` (text, unique)
      - `title` (text)
      - `subtitle` (text)
      - `description` (text)
      - `features` (text[])
      - `curriculum` (text[])
      - `facilities` (text[])
      - `schedule` (text)
      - `age_range` (text)
      - `class_size` (text)
      - `monthly_fee` (integer)
      - `registration_fee` (integer)
      - `uniform_fee` (integer)
      - `book_fee` (integer)
      - `images` (text[])
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
  2. Security
    - Enable RLS on `program_details` table
    - Add policy for public to read program details
    - Add policy for authenticated users to read program details
    - Add policy for super admin to manage program details
    - Add policy for authorized users to manage program details
*/

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

ALTER TABLE program_details ENABLE ROW LEVEL SECURITY;

-- Public can read program details
CREATE POLICY "Anyone can read program details"
  ON program_details
  FOR SELECT
  TO public
  USING (true);

-- Authenticated users can read program details
CREATE POLICY "Authenticated users can read program details"
  ON program_details
  FOR SELECT
  TO authenticated
  USING (true);

-- Super admin can manage program details
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

-- Authorized users can manage program details
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

-- Insert default program details
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
),
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
),
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
ON CONFLICT (program_id) DO NOTHING;
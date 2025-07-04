/*
  # Create program_details table

  1. New Tables
    - `program_details`
      - `id` (bigint, primary key)
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
      - `monthly_fee` (numeric)
      - `registration_fee` (numeric)
      - `uniform_fee` (numeric)
      - `book_fee` (numeric)
      - `images` (text[])
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
  2. Security
    - Enable RLS on `program_details` table
    - Add policy for public to read program details
    - Add policy for authenticated users with proper permissions to manage program details
*/

-- Create program_details table
CREATE TABLE IF NOT EXISTS program_details (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  program_id text UNIQUE NOT NULL,
  title text NOT NULL,
  subtitle text NOT NULL,
  description text NOT NULL,
  features text[] DEFAULT '{}',
  curriculum text[] DEFAULT '{}',
  facilities text[] DEFAULT '{}',
  schedule text,
  age_range text,
  class_size text,
  monthly_fee numeric DEFAULT 0,
  registration_fee numeric DEFAULT 0,
  uniform_fee numeric DEFAULT 0,
  book_fee numeric DEFAULT 0,
  images text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE program_details ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Anyone can read program details
CREATE POLICY "Anyone can read program details"
  ON program_details
  FOR SELECT
  TO public
  USING (true);

-- Super admin can manage all program details
CREATE POLICY "Super admin can manage program details"
  ON program_details
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE (users.id)::text = (uid())::text
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
      WHERE (u.id)::text = (uid())::text
      AND (
        u.role = ANY (ARRAY['ketua_yayasan', 'kepala_sekolah'])
      )
    )
  );

-- Insert initial data for the three programs
INSERT INTO program_details (program_id, title, subtitle, description, features, curriculum, facilities, schedule, age_range, class_size, monthly_fee, registration_fee, uniform_fee, book_fee)
VALUES
  (
    'paud',
    'Kober/PAUD',
    'Kelompok Bermain / Pendidikan Anak Usia Dini',
    'Program pendidikan untuk anak usia dini yang menggabungkan pembelajaran akademik dengan nilai-nilai Islam dalam suasana yang menyenangkan.',
    ARRAY['Pembelajaran Dasar (Calistung)', 'Pengenalan Huruf Hijaiyah', 'Seni, Musik, dan Gerak', 'Permainan Edukatif', 'Pembentukan Karakter Islami'],
    ARRAY['Pengenalan Huruf dan Angka', 'Membaca dan Menulis Dasar', 'Berhitung Dasar', 'Mengenal Huruf Hijaiyah', 'Hafalan Doa Sehari-hari', 'Seni dan Kreativitas', 'Permainan Edukatif', 'Pengembangan Motorik', 'Pendidikan Karakter Islami'],
    ARRAY['Ruang Kelas Nyaman', 'Area Bermain Indoor', 'Area Bermain Outdoor', 'Perpustakaan Mini', 'Alat Peraga Edukatif', 'Toilet Anak', 'Ruang Istirahat'],
    'Senin - Jumat, 08:00 - 11:00',
    '3-6 tahun',
    '15-20 anak per kelas',
    150000,
    500000,
    250000,
    200000
  ),
  (
    'tka-tpa',
    'TKA/TPA',
    'Taman Kanak-kanak Al-Quran / Taman Pendidikan Al-Quran',
    'Program pendidikan Al-Quran untuk anak-anak usia 4-12 tahun dengan metode pembelajaran yang menyenangkan dan mudah dipahami.',
    ARRAY['Pembelajaran Al-Quran dengan Tajwid', 'Hafalan Surat-surat Pendek', 'Pendidikan Akhlak dan Adab', 'Pembelajaran Bahasa Arab Dasar', 'Kegiatan Seni dan Kreativitas'],
    ARRAY['Baca Tulis Al-Quran', 'Tahsin dan Tajwid', 'Tahfidz Juz 30', 'Doa-doa Harian', 'Hadits Pilihan', 'Adab dan Akhlak Islami', 'Bahasa Arab Dasar', 'Praktek Ibadah', 'Sirah Nabawiyah'],
    ARRAY['Ruang Belajar Al-Quran', 'Mushola Mini', 'Perpustakaan Islam', 'Alat Peraga Edukatif', 'Audio Visual', 'Area Bermain', 'Toilet Bersih'],
    'Senin - Jumat, 15:30 - 17:00',
    '4-12 tahun',
    '10-15 anak per kelas',
    100000,
    300000,
    200000,
    150000
  ),
  (
    'diniyah',
    'Madrasah Diniyah',
    'Pendidikan Agama Islam Formal',
    'Program pendidikan agama Islam yang komprehensif untuk memberikan pemahaman mendalam tentang ajaran Islam kepada generasi muda.',
    ARRAY['Studi Al-Quran dan Tafsir', 'Hadits dan Sirah Nabawiyah', 'Fiqh dan Aqidah', 'Bahasa Arab Lanjutan', 'Sejarah Islam'],
    ARRAY['Al-Quran dan Tafsir', 'Hadits dan Ilmu Hadits', 'Fiqh Ibadah', 'Aqidah Islamiyah', 'Akhlak dan Adab', 'Bahasa Arab', 'Sirah Nabawiyah', 'Sejarah Peradaban Islam', 'Praktek Ibadah'],
    ARRAY['Ruang Kelas Kondusif', 'Perpustakaan Islam', 'Laboratorium Bahasa Arab', 'Mushola', 'Ruang Diskusi', 'Komputer dan Internet', 'Kantin Halal'],
    'Senin - Kamis, 19:30 - 21:00',
    '7-17 tahun',
    '15-20 santri per kelas',
    125000,
    350000,
    225000,
    175000
  );
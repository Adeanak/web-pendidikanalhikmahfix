/*
  # Seed Initial Data for Al-Hikmah Application

  1. Initial Users
    - Super admin, ketua yayasan, kepala sekolah, teacher, and parent users
    - Each with appropriate roles and permissions
  
  2. Permissions
    - Set up permissions for each user based on their role
  
  3. Sample Data
    - Students, teachers, graduates for demonstration
    - Initial visitor stats
  
  4. Security
    - Uses server-side execution to bypass RLS during seeding
    - Maintains data integrity with proper relationships
*/

-- Insert initial users (bypasses RLS in migration context)
INSERT INTO users (username, password, role, name, email, status) VALUES
  ('admin', 'admin123', 'super_admin', 'Super Administrator', 'admin@al-hikmah.com', 'active'),
  ('ketua', 'ketua123', 'ketua_yayasan', 'Ketua Yayasan', 'ketua@al-hikmah.com', 'active'),
  ('kepsek', 'kepsek123', 'kepala_sekolah', 'Kepala Sekolah', 'kepsek@al-hikmah.com', 'active'),
  ('guru1', 'guru123', 'teacher', 'Ustadz Ahmad', 'ahmad@al-hikmah.com', 'active'),
  ('wali1', 'wali123', 'parent', 'Bapak Budi', 'budi@gmail.com', 'active')
ON CONFLICT (username) DO NOTHING;

-- Insert permissions for users
INSERT INTO permissions (user_id, can_edit_students, can_edit_teachers, can_edit_graduates, can_view_reports, can_manage_ppdb)
SELECT 
  u.id,
  CASE 
    WHEN u.role IN ('super_admin', 'ketua_yayasan', 'kepala_sekolah') THEN true
    WHEN u.role = 'teacher' THEN true
    ELSE false
  END as can_edit_students,
  CASE 
    WHEN u.role IN ('super_admin', 'ketua_yayasan', 'kepala_sekolah') THEN true
    ELSE false
  END as can_edit_teachers,
  CASE 
    WHEN u.role IN ('super_admin', 'ketua_yayasan', 'kepala_sekolah') THEN true
    ELSE false
  END as can_edit_graduates,
  CASE 
    WHEN u.role IN ('super_admin', 'ketua_yayasan', 'kepala_sekolah', 'teacher') THEN true
    ELSE false
  END as can_view_reports,
  CASE 
    WHEN u.role IN ('super_admin', 'ketua_yayasan', 'kepala_sekolah') THEN true
    ELSE false
  END as can_manage_ppdb
FROM users u
WHERE NOT EXISTS (
  SELECT 1 FROM permissions p WHERE p.user_id = u.id
);

-- Insert sample students
INSERT INTO students (name, program, class, parent_name, phone, address, birth_date, status) VALUES
  ('Ahmad Fauzi', 'TKA/TPA', 'TKA A', 'Bapak Usman', '081234567890', 'Jl. Masjid No. 12', '2015-05-10', 'active'),
  ('Siti Aminah', 'PAUD/KOBER', 'PAUD B', 'Ibu Fatimah', '081234567891', 'Jl. Pondok No. 5', '2018-08-15', 'active'),
  ('Muhammad Ali', 'Diniyah', 'Diniyah 1', 'Bapak Ibrahim', '081234567892', 'Jl. Pesantren No. 8', '2012-12-20', 'active'),
  ('Zahra Nabila', 'TKA/TPA', 'TPA B', 'Ibu Khadijah', '081234567893', 'Jl. Dakwah No. 3', '2016-03-25', 'graduated')
ON CONFLICT DO NOTHING;

-- Insert sample teachers
INSERT INTO teachers (name, position, program, education, experience) VALUES
  ('Ustadz Muhammad Ridwan', 'Kepala Asatidz', 'All', 'S1 Pendidikan Agama Islam', '10 tahun'),
  ('Ustadzah Siti Maryam', 'Pengajar PAUD', 'PAUD/KOBER', 'S1 PAUD', '5 tahun'),
  ('Ustadz Ahmad Fathoni', 'Pengajar TKA/TPA', 'TKA/TPA', 'S1 Tahfidz Quran', '7 tahun'),
  ('Ustadzah Nurul Hidayah', 'Pengajar Diniyah', 'Diniyah', 'S1 Bahasa Arab', '8 tahun')
ON CONFLICT DO NOTHING;

-- Insert sample graduates
INSERT INTO graduates (name, program, graduation_year, achievement, current_school) VALUES
  ('Muhammad Hafidz', 'TKA/TPA', 2023, 'Hafidz 5 Juz', 'SMP Al-Azhar'),
  ('Fatimah Az-Zahra', 'PAUD/KOBER', 2022, 'Juara 1 Lomba Mewarnai', 'SD Islam Terpadu'),
  ('Yusuf Ibrahim', 'Diniyah', 2021, 'Hafidz 10 Juz', 'MTs Negeri 1'),
  ('Aisyah Nur', 'TKA/TPA', 2023, 'Juara Tilawah', 'SMP Muhammadiyah')
ON CONFLICT DO NOTHING;

-- Initialize visitor stats (only if no record exists)
INSERT INTO visitor_stats (views, comments, registrations)
SELECT 1250, 89, 156
WHERE NOT EXISTS (SELECT 1 FROM visitor_stats);
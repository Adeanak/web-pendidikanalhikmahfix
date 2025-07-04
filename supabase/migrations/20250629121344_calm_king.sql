/*
  # Initial Schema for Al-Hikmah Yayasan

  1. New Tables
    - `users` - User accounts with roles and authentication
    - `permissions` - User permissions for different modules
    - `students` - Student records with program and status
    - `teachers` - Teacher records with qualifications
    - `graduates` - Graduate records with achievements
    - `notifications` - System notifications
    - `ppdb_registrations` - New student registrations
    - `password_reset_requests` - Password reset requests
    - `visitor_stats` - Website visitor statistics

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Proper role-based access control
*/

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('super_admin', 'ketua_yayasan', 'kepala_sekolah', 'teacher', 'parent')),
  name TEXT NOT NULL,
  email TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'pending', 'inactive')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Permissions table
CREATE TABLE IF NOT EXISTS permissions (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  can_edit_students BOOLEAN DEFAULT FALSE,
  can_edit_teachers BOOLEAN DEFAULT FALSE,
  can_edit_graduates BOOLEAN DEFAULT FALSE,
  can_view_reports BOOLEAN DEFAULT FALSE,
  can_manage_ppdb BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Students table
CREATE TABLE IF NOT EXISTS students (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  program TEXT NOT NULL CHECK (program IN ('TKA/TPA', 'PAUD/KOBER', 'Diniyah')),
  class TEXT NOT NULL,
  parent_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  birth_date DATE,
  photo TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'graduated', 'inactive')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Teachers table
CREATE TABLE IF NOT EXISTS teachers (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  program TEXT NOT NULL CHECK (program IN ('PAUD/KOBER', 'TKA/TPA', 'Diniyah', 'All')),
  education TEXT NOT NULL,
  experience TEXT NOT NULL,
  photo TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Graduates table
CREATE TABLE IF NOT EXISTS graduates (
  id BIGSERIAL PRIMARY KEY,
  student_id BIGINT REFERENCES students(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  program TEXT NOT NULL CHECK (program IN ('PAUD/KOBER', 'TKA/TPA', 'Diniyah')),
  graduation_year INTEGER NOT NULL,
  achievement TEXT,
  current_school TEXT,
  photo TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error')),
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- PPDB registrations table
CREATE TABLE IF NOT EXISTS ppdb_registrations (
  id BIGSERIAL PRIMARY KEY,
  nama_lengkap TEXT NOT NULL,
  program_pilihan TEXT NOT NULL,
  parent_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  address TEXT NOT NULL,
  birth_date DATE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Password reset requests table
CREATE TABLE IF NOT EXISTS password_reset_requests (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  username TEXT NOT NULL,
  email TEXT NOT NULL,
  new_password TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  processed_at TIMESTAMPTZ,
  processed_by BIGINT REFERENCES users(id) ON DELETE SET NULL
);

-- Visitor stats table
CREATE TABLE IF NOT EXISTS visitor_stats (
  id BIGSERIAL PRIMARY KEY,
  views INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  registrations INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE graduates ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE ppdb_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE password_reset_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE visitor_stats ENABLE ROW LEVEL SECURITY;

-- Policies for users table
CREATE POLICY "Users can read all users" ON users FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE TO authenticated USING (auth.uid()::text = id::text);
CREATE POLICY "Super admin can manage all users" ON users FOR ALL TO authenticated USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE id::text = auth.uid()::text AND role = 'super_admin'
  )
);

-- Policies for permissions table
CREATE POLICY "Users can read all permissions" ON permissions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Super admin can manage permissions" ON permissions FOR ALL TO authenticated USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE id::text = auth.uid()::text AND role = 'super_admin'
  )
);

-- Policies for students table
CREATE POLICY "Users can read students" ON students FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authorized users can manage students" ON students FOR ALL TO authenticated USING (
  EXISTS (
    SELECT 1 FROM users u
    JOIN permissions p ON u.id = p.user_id
    WHERE u.id::text = auth.uid()::text AND (p.can_edit_students = true OR u.role IN ('super_admin', 'ketua_yayasan', 'kepala_sekolah'))
  )
);

-- Policies for teachers table
CREATE POLICY "Users can read teachers" ON teachers FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authorized users can manage teachers" ON teachers FOR ALL TO authenticated USING (
  EXISTS (
    SELECT 1 FROM users u
    JOIN permissions p ON u.id = p.user_id
    WHERE u.id::text = auth.uid()::text AND (p.can_edit_teachers = true OR u.role IN ('super_admin', 'ketua_yayasan', 'kepala_sekolah'))
  )
);

-- Policies for graduates table
CREATE POLICY "Users can read graduates" ON graduates FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authorized users can manage graduates" ON graduates FOR ALL TO authenticated USING (
  EXISTS (
    SELECT 1 FROM users u
    JOIN permissions p ON u.id = p.user_id
    WHERE u.id::text = auth.uid()::text AND (p.can_edit_graduates = true OR u.role IN ('super_admin', 'ketua_yayasan', 'kepala_sekolah'))
  )
);

-- Policies for notifications table
CREATE POLICY "Users can read own notifications" ON notifications FOR SELECT TO authenticated USING (
  user_id::text = auth.uid()::text OR user_id IS NULL
);
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE TO authenticated USING (
  user_id::text = auth.uid()::text
);
CREATE POLICY "Super admin can manage all notifications" ON notifications FOR ALL TO authenticated USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE id::text = auth.uid()::text AND role = 'super_admin'
  )
);

-- Policies for PPDB registrations
CREATE POLICY "Users can read PPDB registrations" ON ppdb_registrations FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authorized users can manage PPDB" ON ppdb_registrations FOR ALL TO authenticated USING (
  EXISTS (
    SELECT 1 FROM users u
    JOIN permissions p ON u.id = p.user_id
    WHERE u.id::text = auth.uid()::text AND (p.can_manage_ppdb = true OR u.role IN ('super_admin', 'ketua_yayasan', 'kepala_sekolah'))
  )
);

-- Policies for password reset requests
CREATE POLICY "Users can read own reset requests" ON password_reset_requests FOR SELECT TO authenticated USING (
  user_id::text = auth.uid()::text
);
CREATE POLICY "Super admin can manage reset requests" ON password_reset_requests FOR ALL TO authenticated USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE id::text = auth.uid()::text AND role = 'super_admin'
  )
);

-- Policies for visitor stats
CREATE POLICY "Users can read visitor stats" ON visitor_stats FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authorized users can update visitor stats" ON visitor_stats FOR UPDATE TO authenticated USING (
  EXISTS (
    SELECT 1 FROM users u
    JOIN permissions p ON u.id = p.user_id
    WHERE u.id::text = auth.uid()::text AND (p.can_view_reports = true OR u.role IN ('super_admin', 'ketua_yayasan', 'kepala_sekolah'))
  )
);
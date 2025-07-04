-- Fix RLS policies to allow anonymous operations
-- This migration adds policies that allow public access to certain operations

-- Allow anonymous users to read visitor stats
CREATE POLICY "Anyone can read visitor stats" ON visitor_stats
  FOR SELECT
  USING (true);

-- Allow anonymous users to update visitor stats
CREATE POLICY "Anyone can update visitor stats" ON visitor_stats
  FOR UPDATE
  USING (true);

-- Allow anonymous users to read students
CREATE POLICY "Anyone can read students" ON students
  FOR SELECT
  USING (true);

-- Allow anonymous users to read teachers
CREATE POLICY "Anyone can read teachers" ON teachers
  FOR SELECT
  USING (true);

-- Allow anonymous users to read graduates
CREATE POLICY "Anyone can read graduates" ON graduates
  FOR SELECT
  USING (true);

-- Allow anonymous users to insert into ppdb_registrations
CREATE POLICY "Anyone can register for PPDB" ON ppdb_registrations
  FOR INSERT
  WITH CHECK (true);

-- Allow anonymous users to read users (for login)
CREATE POLICY "Anyone can read users for login" ON users
  FOR SELECT
  USING (true);

-- Allow service role to bypass RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE graduates ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE ppdb_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE password_reset_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE visitor_stats ENABLE ROW LEVEL SECURITY;

-- Make sure we have at least one visitor_stats record
INSERT INTO visitor_stats (id, views, comments, registrations)
VALUES (1, 1250, 89, 156)
ON CONFLICT (id) DO NOTHING;
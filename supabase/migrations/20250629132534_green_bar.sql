-- Drop all existing policies for notifications to avoid conflicts
DROP POLICY IF EXISTS "Authenticated users can create notifications" ON notifications;
DROP POLICY IF EXISTS "Anyone can read system notifications" ON notifications;
DROP POLICY IF EXISTS "Users can read own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can update own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can delete own notifications" ON notifications;
DROP POLICY IF EXISTS "Super admin can manage all notifications" ON notifications;

-- Drop existing visitor_stats policies if they exist
DROP POLICY IF EXISTS "Anyone can update visitor stats" ON visitor_stats;
DROP POLICY IF EXISTS "Anyone can read visitor stats" ON visitor_stats;

-- Create new notification policies
CREATE POLICY "Authenticated users can create notifications"
  ON notifications
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can read system notifications"
  ON notifications
  FOR SELECT
  TO authenticated
  USING (user_id IS NULL);

CREATE POLICY "Users can read own notifications"
  ON notifications
  FOR SELECT
  TO authenticated
  USING (user_id::text = auth.uid()::text);

CREATE POLICY "Users can update own notifications"
  ON notifications
  FOR UPDATE
  TO authenticated
  USING (user_id::text = auth.uid()::text);

CREATE POLICY "Users can delete own notifications"
  ON notifications
  FOR DELETE
  TO authenticated
  USING (user_id::text = auth.uid()::text);

CREATE POLICY "Super admin can manage all notifications"
  ON notifications
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id::text = auth.uid()::text AND role = 'super_admin'
    )
  );

-- Make sure visitor_stats has a record with id=1
INSERT INTO visitor_stats (id, views, comments, registrations)
VALUES (1, 0, 0, 0)
ON CONFLICT (id) DO NOTHING;

-- Create visitor_stats policies
CREATE POLICY "Anyone can update visitor stats"
  ON visitor_stats
  FOR UPDATE
  TO anon
  USING (true);

CREATE POLICY "Anyone can read visitor stats"
  ON visitor_stats
  FOR SELECT
  TO anon
  USING (true);

-- Also allow authenticated users to access visitor_stats
CREATE POLICY "Authenticated users can read visitor stats"
  ON visitor_stats
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update visitor stats"
  ON visitor_stats
  FOR UPDATE
  TO authenticated
  USING (true);
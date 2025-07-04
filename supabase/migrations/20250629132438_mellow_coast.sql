-- Create a more permissive policy for notifications
DROP POLICY IF EXISTS "Authenticated users can create notifications" ON notifications;

-- Allow all authenticated users to create notifications
CREATE POLICY "Authenticated users can create notifications"
  ON notifications
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Allow all users to read system-wide notifications
CREATE POLICY "Anyone can read system notifications"
  ON notifications
  FOR SELECT
  TO authenticated
  USING (user_id IS NULL);

-- Allow users to read their own notifications
CREATE POLICY "Users can read own notifications"
  ON notifications
  FOR SELECT
  TO authenticated
  USING (user_id::text = auth.uid()::text);

-- Allow users to update their own notifications
CREATE POLICY "Users can update own notifications"
  ON notifications
  FOR UPDATE
  TO authenticated
  USING (user_id::text = auth.uid()::text);

-- Allow users to delete their own notifications
CREATE POLICY "Users can delete own notifications"
  ON notifications
  FOR DELETE
  TO authenticated
  USING (user_id::text = auth.uid()::text);

-- Allow super admins to manage all notifications
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

-- Create a policy to allow anonymous users to update visitor_stats
CREATE POLICY "Anyone can update visitor stats"
  ON visitor_stats
  FOR UPDATE
  TO anon
  USING (true);

-- Create a policy to allow anonymous users to read visitor_stats
CREATE POLICY "Anyone can read visitor stats"
  ON visitor_stats
  FOR SELECT
  TO anon
  USING (true);
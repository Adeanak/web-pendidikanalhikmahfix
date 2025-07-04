/*
  # Fix notification INSERT policy

  1. Security Changes
    - Add INSERT policy for notifications table to allow authenticated users to create notifications
    - This enables the system to generate notifications for users (PPDB registrations, password resets, etc.)
    
  2. Policy Details
    - Allows authenticated users to insert notifications for any user (needed for system notifications)
    - Super admins can still manage all notifications as before
    - Users can still only read/update their own notifications
*/

-- Add INSERT policy for notifications to allow system-generated notifications
CREATE POLICY "Authenticated users can create notifications"
  ON notifications
  FOR INSERT
  TO authenticated
  WITH CHECK (true);
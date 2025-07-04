/*
  # Create message tables

  1. New Tables
    - `messages`
      - `id` (uuid, primary key)
      - `name` (text, required)
      - `email` (text, required)
      - `subject` (text, required)
      - `message` (text, required)
      - `rating` (integer, optional, 1-5 scale)
      - `status` (text, default 'unread')
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `messages` table
    - Add policy for authenticated users to read all messages
    - Add policy for anyone to insert messages (contact form)
    - Add policy for authenticated users to update message status
*/

CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  rating integer CHECK (rating >= 1 AND rating <= 5),
  status text DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'replied', 'archived')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert messages (for contact form)
CREATE POLICY "Anyone can insert messages"
  ON messages
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Allow authenticated users to read all messages
CREATE POLICY "Authenticated users can read all messages"
  ON messages
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow authenticated users to update message status
CREATE POLICY "Authenticated users can update messages"
  ON messages
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_messages_updated_at
  BEFORE UPDATE ON messages
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
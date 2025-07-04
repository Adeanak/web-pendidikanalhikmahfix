/*
  # Create Message and Rating System Tables

  1. New Tables
    - `messages` - Stores user messages and ratings
      - `id` (bigserial, primary key)
      - `name` (text, sender name)
      - `email` (text, sender email, optional)
      - `rating` (integer, 1-5 star rating)
      - `message` (text, message content)
      - `status` (text, message status: pending/approved/rejected)
      - `admin_reply` (text, admin's reply, optional)
      - `created_at` (timestamp with timezone)
      - `updated_at` (timestamp with timezone)
    - `message_settings` - Stores message system configuration
      - `id` (integer, primary key, default 1)
      - `auto_approve` (boolean, auto-approve messages)
      - `filter_words` (text array, words to filter)
      - `notify_admin` (boolean, notify admin of new messages)
      - `max_messages_display` (integer, max messages to display)
      - `created_at` (timestamp with timezone)
      - `updated_at` (timestamp with timezone)

  2. Security
    - Enable RLS on all tables
    - Add policies for public insert access to messages
    - Add policies for admin management of messages and settings
*/

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id bigserial PRIMARY KEY,
  name text NOT NULL,
  email text,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  message text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_reply text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create message_settings table
CREATE TABLE IF NOT EXISTS message_settings (
  id integer PRIMARY KEY DEFAULT 1,
  auto_approve boolean DEFAULT false,
  filter_words text[] DEFAULT '{}',
  notify_admin boolean DEFAULT true,
  max_messages_display integer DEFAULT 10,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create unique index to ensure only one settings row
CREATE UNIQUE INDEX IF NOT EXISTS message_settings_single_row_idx 
ON message_settings (id);

-- Enable RLS on all tables
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_settings ENABLE ROW LEVEL SECURITY;

-- Policies for messages table
CREATE POLICY "Anyone can insert messages"
  ON messages
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can read approved messages"
  ON messages
  FOR SELECT
  TO public
  USING (status = 'approved');

CREATE POLICY "Super admin can manage all messages"
  ON messages
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id::text = auth.uid()::text
      AND users.role = 'super_admin'
    )
  );

CREATE POLICY "Authorized users can manage messages"
  ON messages
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users u
      JOIN permissions p ON u.id = p.user_id
      WHERE u.id::text = auth.uid()::text
      AND (u.role IN ('super_admin', 'ketua_yayasan', 'kepala_sekolah'))
    )
  );

-- Policies for message_settings table
CREATE POLICY "Anyone can read message settings"
  ON message_settings
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Super admin can manage message settings"
  ON message_settings
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id::text = auth.uid()::text
      AND users.role = 'super_admin'
    )
  );

-- Create helper function for table creation (used by admin interface)
CREATE OR REPLACE FUNCTION create_message_settings_table()
RETURNS void AS $$
BEGIN
  -- Create the table if it doesn't exist
  CREATE TABLE IF NOT EXISTS message_settings (
    id integer PRIMARY KEY DEFAULT 1,
    auto_approve boolean DEFAULT false,
    filter_words text[] DEFAULT '{}',
    notify_admin boolean DEFAULT true,
    max_messages_display integer DEFAULT 10,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
  );
  
  -- Create unique index
  CREATE UNIQUE INDEX IF NOT EXISTS message_settings_single_row_idx 
  ON message_settings (id);
  
  -- Enable RLS
  ALTER TABLE message_settings ENABLE ROW LEVEL SECURITY;
  
  -- Create policies
  CREATE POLICY "Anyone can read message settings"
    ON message_settings
    FOR SELECT
    TO public
    USING (true);
    
  CREATE POLICY "Super admin can manage message settings"
    ON message_settings
    FOR ALL
    TO authenticated
    USING (
      EXISTS (
        SELECT 1 FROM users
        WHERE users.id::text = auth.uid()::text
        AND users.role = 'super_admin'
      )
    );
    
  -- Insert default settings if not exists
  INSERT INTO message_settings (id, auto_approve, filter_words, notify_admin, max_messages_display)
  VALUES (1, false, '{}', true, 10)
  ON CONFLICT (id) DO NOTHING;
END;
$$ LANGUAGE plpgsql;

-- Insert default settings
INSERT INTO message_settings (id, auto_approve, filter_words, notify_admin, max_messages_display)
VALUES (1, false, '{}', true, 10)
ON CONFLICT (id) DO NOTHING;
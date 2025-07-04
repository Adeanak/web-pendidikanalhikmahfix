/*
  # Initialize visitor stats table

  1. New Tables
    - Ensure `visitor_stats` table has initial data
  
  2. Security
    - Ensure RLS policies are properly set
*/

-- Insert initial data if not exists
INSERT INTO visitor_stats (id, views, comments, registrations)
VALUES (1, 0, 0, 0)
ON CONFLICT (id) DO NOTHING;

-- Ensure RLS policies exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'visitor_stats' AND policyname = 'Anyone can update visitor stats'
  ) THEN
    CREATE POLICY "Anyone can update visitor stats"
      ON visitor_stats
      FOR UPDATE
      TO anon
      USING (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'visitor_stats' AND policyname = 'Anyone can read visitor stats'
  ) THEN
    CREATE POLICY "Anyone can read visitor stats"
      ON visitor_stats
      FOR SELECT
      TO anon
      USING (true);
  END IF;
END $$;
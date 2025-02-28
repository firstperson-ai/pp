-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  subscription_status TEXT DEFAULT 'Not Subscribed',
  resume_downloads_remaining INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  user_id UUID REFERENCES users(id) PRIMARY KEY,
  plan TEXT NOT NULL CHECK (plan IN ('Basic', 'Pro', 'Premium', 'Ultimate')),
  max_resumes INTEGER NOT NULL,
  support_level TEXT NOT NULL CHECK (support_level IN ('Standard', 'Priority', '24/7 Priority')),
  start_date TIMESTAMP DEFAULT NOW(),
  end_date TIMESTAMP
);

-- Create resume_downloads table
CREATE TABLE IF NOT EXISTS resume_downloads (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  download_count INTEGER DEFAULT 0,
  downloaded_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS on custom tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume_downloads ENABLE ROW LEVEL SECURITY;

-- Create indexes for performance
CREATE INDEX idx_users_id ON users(id);
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_resume_downloads_user_id ON resume_downloads(user_id);

-- RLS Policies for Localhost
-- Relaxed policy: Allow inserts into users table for testing
CREATE POLICY "Allow inserts for localhost testing" ON users FOR INSERT
  TO public, authenticated WITH CHECK (true);

-- Allow authenticated users to read their own data in users table
CREATE POLICY "Users can read their own data" ON users FOR SELECT
  TO authenticated USING (auth.uid() = id);

CREATE POLICY "Users can update their own data" ON users FOR UPDATE
  TO authenticated USING (auth.uid() = id);

-- Allow authenticated users to read their own subscription data
CREATE POLICY "Subscriptions can read their own data" ON subscriptions FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

-- Allow authenticated users to read their own resume downloads
CREATE POLICY "Resume downloads can read their own data" ON resume_downloads FOR SELECT
  TO authenticated USING (auth.uid() = user_id);
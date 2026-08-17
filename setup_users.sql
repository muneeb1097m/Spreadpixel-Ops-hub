
-- Create the users table for the dashboard
CREATE TABLE IF NOT EXISTS flc_ops_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'member' -- 'member' or 'admin'
);

-- Note: In a production environment, you should use Supabase Auth.
-- This table is for a custom authentication experience as requested.

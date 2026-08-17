-- Migration to add slack_id column to flc_ops_users table
ALTER TABLE flc_ops_users ADD COLUMN IF NOT EXISTS slack_id TEXT;

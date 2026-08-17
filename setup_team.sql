
ALTER TABLE flc_ops_users ADD COLUMN IF NOT EXISTS assigned_clients JSONB DEFAULT '[]'::jsonb;

CREATE TABLE IF NOT EXISTS flc_ops_invites (
    email TEXT PRIMARY KEY,
    assigned_clients JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    invited_by TEXT
);

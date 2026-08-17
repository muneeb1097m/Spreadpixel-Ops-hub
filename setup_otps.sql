
-- Create the OTPs table
CREATE TABLE IF NOT EXISTS flc_ops_otps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    email TEXT NOT NULL,
    code TEXT NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    verified BOOLEAN DEFAULT FALSE
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_flc_ops_otps_email ON flc_ops_otps(email);

-- Optional: Cleanup old OTPs function or policy
-- DELETE FROM flc_ops_otps WHERE expires_at < NOW();

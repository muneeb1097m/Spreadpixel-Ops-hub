-- Create the attendance table
CREATE TABLE IF NOT EXISTS flc_ops_attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    slack_user_id TEXT NOT NULL,
    email TEXT,
    name TEXT NOT NULL,
    date DATE NOT NULL,
    check_in TIMESTAMPTZ,
    check_out TIMESTAMPTZ,
    working_hours NUMERIC DEFAULT 0,
    UNIQUE (slack_user_id, date)
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_flc_ops_attendance_date ON flc_ops_attendance (date);
CREATE INDEX IF NOT EXISTS idx_flc_ops_attendance_email ON flc_ops_attendance (email);

-- Supabase Schema for FLC Ops Hub

-- 1. Clients Table
CREATE TABLE IF NOT EXISTS public.flc_ops_clients (
    id TEXT PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    name TEXT NOT NULL,
    start_date TEXT,
    package TEXT,
    tasks_data JSONB DEFAULT '{}'::jsonb,
    followups_data JSONB DEFAULT '[]'::jsonb
);

-- 2. Users Table
CREATE TABLE IF NOT EXISTS public.flc_ops_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'member',
    assigned_clients JSONB DEFAULT '[]'::jsonb
);

-- 3. OTPs Table
CREATE TABLE IF NOT EXISTS public.flc_ops_otps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    email TEXT NOT NULL,
    code TEXT NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL
);

-- 4. Attendance Table
CREATE TABLE IF NOT EXISTS public.flc_ops_attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    user_id TEXT,
    user_name TEXT,
    date TEXT,
    check_in TEXT,
    check_out TEXT,
    status TEXT
);

-- 5. Invites Table
CREATE TABLE IF NOT EXISTS public.flc_ops_invites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    email TEXT NOT NULL,
    role TEXT NOT NULL,
    clients JSONB DEFAULT '[]'::jsonb
);

-- 6. Meeting Notes Table
CREATE TABLE IF NOT EXISTS public.flc_ops_meeting_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    client_id TEXT,
    title TEXT,
    notes TEXT
);

-- 7. Notifications Table
CREATE TABLE IF NOT EXISTS public.flc_ops_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    user_email TEXT,
    title TEXT,
    body TEXT,
    read BOOLEAN DEFAULT false,
    type TEXT DEFAULT 'info'
);

-- Enable RLS & Add Public Policies
ALTER TABLE public.flc_ops_clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flc_ops_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flc_ops_otps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flc_ops_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flc_ops_invites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flc_ops_meeting_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flc_ops_notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow All Clients" ON public.flc_ops_clients;
CREATE POLICY "Allow All Clients" ON public.flc_ops_clients FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow All Users" ON public.flc_ops_users;
CREATE POLICY "Allow All Users" ON public.flc_ops_users FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow All OTPs" ON public.flc_ops_otps;
CREATE POLICY "Allow All OTPs" ON public.flc_ops_otps FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow All Attendance" ON public.flc_ops_attendance;
CREATE POLICY "Allow All Attendance" ON public.flc_ops_attendance FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow All Invites" ON public.flc_ops_invites;
CREATE POLICY "Allow All Invites" ON public.flc_ops_invites FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow All Meeting Notes" ON public.flc_ops_meeting_notes;
CREATE POLICY "Allow All Meeting Notes" ON public.flc_ops_meeting_notes FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow All Notifications" ON public.flc_ops_notifications;
CREATE POLICY "Allow All Notifications" ON public.flc_ops_notifications FOR ALL USING (true);

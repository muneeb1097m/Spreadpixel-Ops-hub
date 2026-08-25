-- ========================================================
-- FLC OPS HUB: AUDIT & TASK LOGS TABLE
-- Run this in your Supabase SQL Editor
-- ========================================================

CREATE TABLE IF NOT EXISTS public.flc_ops_task_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    member_name TEXT,
    member_email TEXT,
    task_id TEXT,
    task_name TEXT,
    client_id TEXT,
    client_name TEXT,
    action_type TEXT DEFAULT 'COMPLETED'
);

-- Enable Row Level Security
ALTER TABLE public.flc_ops_task_logs ENABLE ROW LEVEL SECURITY;

-- Allow Full Access Policy
DROP POLICY IF EXISTS "Allow All Task Logs" ON public.flc_ops_task_logs;
CREATE POLICY "Allow All Task Logs" ON public.flc_ops_task_logs FOR ALL USING (true);

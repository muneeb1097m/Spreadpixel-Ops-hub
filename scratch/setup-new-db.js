import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, serviceKey);

async function setup() {
  console.log("Setting up database tables on:", supabaseUrl);

  const sqlStatements = [
    `CREATE TABLE IF NOT EXISTS flc_ops_clients (
      id TEXT PRIMARY KEY,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW(),
      name TEXT NOT NULL,
      start_date TEXT,
      package TEXT,
      tasks_data JSONB DEFAULT '{}'::jsonb,
      followups_data JSONB DEFAULT '[]'::jsonb
    );`,
    `CREATE TABLE IF NOT EXISTS flc_ops_users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      created_at TIMESTAMPTZ DEFAULT NOW(),
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'member',
      assigned_clients JSONB DEFAULT '[]'::jsonb
    );`,
    `CREATE TABLE IF NOT EXISTS flc_ops_otps (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      created_at TIMESTAMPTZ DEFAULT NOW(),
      email TEXT NOT NULL,
      code TEXT NOT NULL,
      expires_at TIMESTAMPTZ NOT NULL
    );`,
    `CREATE TABLE IF NOT EXISTS flc_ops_attendance (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      created_at TIMESTAMPTZ DEFAULT NOW(),
      user_id TEXT,
      user_name TEXT,
      date TEXT,
      check_in TEXT,
      check_out TEXT,
      status TEXT
    );`,
    `CREATE TABLE IF NOT EXISTS flc_ops_invites (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      created_at TIMESTAMPTZ DEFAULT NOW(),
      email TEXT NOT NULL,
      role TEXT NOT NULL,
      clients JSONB DEFAULT '[]'::jsonb
    );`,
    `CREATE TABLE IF NOT EXISTS flc_ops_meeting_notes (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      created_at TIMESTAMPTZ DEFAULT NOW(),
      client_id TEXT,
      title TEXT,
      notes TEXT
    );`,
    `CREATE TABLE IF NOT EXISTS flc_ops_notifications (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      created_at TIMESTAMPTZ DEFAULT NOW(),
      user_email TEXT,
      title TEXT,
      body TEXT,
      read BOOLEAN DEFAULT false,
      type TEXT DEFAULT 'info'
    );`
  ];

  // Test executing SQL via REST
  for (const sql of sqlStatements) {
    try {
      const res = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': serviceKey,
          'Authorization': `Bearer ${serviceKey}`
        },
        body: JSON.stringify({ query: sql })
      });
      const resText = await res.text();
      console.log("SQL exec result:", res.status, resText);
    } catch (e) {
      console.error("SQL exec error:", e.message);
    }
  }
}

setup();

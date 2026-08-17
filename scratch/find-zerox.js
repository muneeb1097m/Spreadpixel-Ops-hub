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

async function findZeroX() {
    console.log('=== Checking all tables for ZeroX ===\n');

    // 1. Search in clients table (active)
    const { data: clients, error: cErr } = await supabase
        .from('flc_ops_clients')
        .select('id, name, created_at, updated_at, tasks_data')
        .ilike('name', '%zero%');
    if (cErr) console.error('Clients error:', cErr);
    else {
        console.log(`Found ${clients.length} client(s) matching "zero":`);
        clients.forEach(c => {
            console.log(`  ID: ${c.id}`);
            console.log(`  Name: ${c.name}`);
            console.log(`  Created: ${c.created_at}`);
            console.log(`  Updated: ${c.updated_at}`);
            const tasks = c.tasks_data || {};
            const assignedBD = tasks.__assigned_bd || 'N/A';
            const clientName = tasks.__client_name || 'N/A';
            console.log(`  Assigned BD: ${assignedBD}`);
            console.log(`  Client Name: ${clientName}`);
            console.log('');
        });
    }

    // 2. List ALL clients to confirm ZeroX is really gone
    console.log('\n=== ALL Current Clients ===');
    const { data: allClients, error: allErr } = await supabase
        .from('flc_ops_clients')
        .select('id, name, created_at, updated_at')
        .order('created_at', { ascending: false });
    if (allErr) console.error('All clients error:', allErr);
    else {
        allClients.forEach(c => {
            console.log(`  [${c.id}] ${c.name} — created: ${c.created_at}, updated: ${c.updated_at}`);
        });
    }

    // 3. Check if there's an audit_log or history table
    console.log('\n=== Checking for audit/log tables ===');
    const tables = ['audit_log', 'audit_logs', 'history', 'flc_ops_audit', 'deleted_clients', 'flc_ops_logs'];
    for (const t of tables) {
        const { data, error } = await supabase.from(t).select('*').limit(1);
        if (!error) {
            console.log(`✅ Table "${t}" EXISTS:`, data);
        } else {
            console.log(`❌ Table "${t}" not found`);
        }
    }

    // 4. Check users table to list all users (who has access to delete)
    console.log('\n=== All Users With Access ===');
    const { data: users, error: uErr } = await supabase
        .from('flc_ops_users')
        .select('id, name, email, role, created_at')
        .order('role');
    if (uErr) console.error('Users error:', uErr);
    else {
        users.forEach(u => {
            console.log(`  [${u.role.toUpperCase()}] ${u.name} — ${u.email}`);
        });
    }
}

findZeroX();

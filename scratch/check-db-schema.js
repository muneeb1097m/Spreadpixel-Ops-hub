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

async function checkSchema() {
    // We can query pg_catalog to get constraints on flc_ops_users
    const query = `
        SELECT
            tc.table_schema, 
            tc.constraint_name, 
            tc.table_name, 
            kcu.column_name, 
            ccu.table_schema AS foreign_table_schema,
            ccu.table_name AS foreign_table_name,
            ccu.column_name AS foreign_column_name 
        FROM 
            information_schema.table_constraints AS tc 
            JOIN information_schema.key_column_usage AS kcu
              ON tc.constraint_name = kcu.constraint_name
              AND tc.table_schema = kcu.table_schema
            JOIN information_schema.constraint_column_usage AS ccu
              ON ccu.constraint_name = tc.constraint_name
              AND ccu.table_schema = tc.table_schema
        WHERE tc.constraint_type = 'FOREIGN KEY' 
          AND (tc.table_name = 'flc_ops_users' OR ccu.table_name = 'flc_ops_users');
    `;
    
    // In Supabase, we can use RPC or run this via postgrest if there is a function.
    // If not, let's just inspect the columns of flc_ops_task_logs and other tables.
    const { data: cols, error: err1 } = await supabase.from('flc_ops_users').select('*').limit(1);
    console.log("Users columns:", cols ? Object.keys(cols[0] || {}) : "No data");
    
    try {
        const { data: logs, error: err2 } = await supabase.from('flc_ops_task_logs').select('*').limit(1);
        console.log("Task logs columns:", logs ? Object.keys(logs[0] || {}) : "No data");
    } catch(e) {
        console.log("Task logs check failed:", e.message);
    }
}

checkSchema();

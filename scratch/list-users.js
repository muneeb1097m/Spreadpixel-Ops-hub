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

async function listUsers() {
    const { data: users, error } = await supabase.from('flc_ops_users').select('*');
    if (error) {
        console.error("Error:", error);
        return;
    }
    console.log("All Users:");
    users.forEach(u => {
        console.log(`Name: "${u.name}", Email: "${u.email}", Role: "${u.role}"`);
    });
}
listUsers();

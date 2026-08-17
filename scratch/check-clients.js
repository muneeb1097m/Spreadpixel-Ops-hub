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

async function check() {
    const { data: clients, error } = await supabase.from('flc_ops_clients').select('*');
    if (error) {
        console.error("Error:", error);
        return;
    }
    for (const c of clients) {
        console.log("Client:", c.name);
        const tasks = c.tasks_data || {};
        const assignedTasks = Object.keys(tasks).filter(k => tasks[k].assigned);
        console.log("  Assigned tasks keys:", assignedTasks);
        assignedTasks.forEach(k => {
            console.log(`    Task [${k}]:`, tasks[k]);
        });
    }
}
check();

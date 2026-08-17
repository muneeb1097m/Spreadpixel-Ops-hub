import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const anonKey = process.env.VITE_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

const anonClient = createClient(supabaseUrl, anonKey);
const serviceClient = createClient(supabaseUrl, serviceKey);

async function testDelete() {
    // 1. Fetch users
    const { data: users, error: fetchError } = await serviceClient.from('flc_ops_users').select('*');
    if (fetchError) {
        console.error("Fetch Error:", fetchError);
        return;
    }

    console.log(`Found ${users.length} users.`);
    const target = users.find(u => u.email !== 'admin@faseehlall.com');
    if (!target) {
        console.log("No test user found other than main admin.");
        return;
    }

    console.log(`Targeting user: ${target.name} (${target.email}) - ID: ${target.id}`);

    // 2. Try delete with Anon Client
    console.log("\nAttempting delete with ANON client...");
    const { data: anonData, error: anonError } = await anonClient.from('flc_ops_users').delete().eq('id', target.id);
    if (anonError) {
        console.error("ANON client delete failed:", anonError);
    } else {
        console.log("ANON client delete succeeded (or returned no error). Data:", anonData);
    }

    // 3. Verify if user was actually deleted
    const { data: verify1 } = await serviceClient.from('flc_ops_users').select('*').eq('id', target.id).maybeSingle();
    if (verify1) {
        console.log("Verification 1: User still exists in database. Anon delete did NOT work!");
    } else {
        console.log("Verification 1: User was deleted by Anon client.");
        return;
    }

    // 4. Try delete with Service Role Client
    console.log("\nAttempting delete with SERVICE ROLE client...");
    const { data: serviceData, error: serviceError } = await serviceClient.from('flc_ops_users').delete().eq('id', target.id);
    if (serviceError) {
        console.error("SERVICE ROLE client delete failed:", serviceError);
    } else {
        console.log("SERVICE ROLE client delete succeeded! Data:", serviceData);
    }

    // 5. Verify again
    const { data: verify2 } = await serviceClient.from('flc_ops_users').select('*').eq('id', target.id).maybeSingle();
    if (verify2) {
        console.log("Verification 2: User still exists in database. Service Role delete also failed!");
    } else {
        console.log("Verification 2: User successfully deleted by Service Role client.");
    }
}

testDelete();

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

const SPECIFIC_ROLES = ['AM', 'CW', 'GD', 'VE', 'ADS', 'CRM', 'OPS', 'SMM', 'BD', 'TECH'];

async function migrate() {
    console.log("Fetching all users...");
    const { data: users, error: fetchError } = await supabase.from('flc_ops_users').select('*');
    if (fetchError) {
        console.error("Fetch Error:", fetchError);
        return;
    }

    console.log(`Found ${users.length} users. Checking roles to migrate...`);

    let migratedCount = 0;

    for (const u of users) {
        const currentRole = (u.role || '').toUpperCase();
        
        // If the role matches one of our specific team positions
        if (SPECIFIC_ROLES.includes(currentRole)) {
            const suffix = `(${currentRole})`;
            let newName = u.name.trim();
            
            // Append suffix if it doesn't already contain it
            if (!newName.endsWith(suffix)) {
                newName = `${newName} ${suffix}`;
            }

            console.log(`Migrating: "${u.name}" (Role: ${u.role}) -> Name: "${newName}", Role: "member"`);

            const { error: updateError } = await supabase
                .from('flc_ops_users')
                .update({
                    name: newName,
                    role: 'member'
                })
                .eq('id', u.id);

            if (updateError) {
                console.error(`Failed to update user ${u.name}:`, updateError);
            } else {
                migratedCount++;
            }
        }
    }

    console.log(`\nMigration complete! Successfully updated ${migratedCount} user profile(s).`);
}

migrate();

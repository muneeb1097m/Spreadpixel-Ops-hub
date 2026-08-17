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

// Map of names to restore
const RESTORE_MAP = {
    "Abdullah (BD)": { name: "Abdullah", role: "BD" },
    "jawad ashraf (TECH)": { name: "jawad ashraf", role: "TECH" },
    "Hamzaali (VE)": { name: "Hamzaali", role: "VE" },
    "muhammad basit (OPS)": { name: "muhammad basit", role: "OPS" },
    "Azeem Faiz (AM)": { name: "Azeem Faiz", role: "AM" },
    "Muneeb (OPS)": { name: "Muneeb", role: "OPS" },
    "Muhammad Usman (BD)": { name: "Muhammad Usman", role: "BD" },
    "Nadeem Abbas (BD)": { name: "Nadeem Abbas", role: "BD" },
    "Usman Ali (ADS)": { name: "Usman Ali", role: "ADS" },
    "OMAR KHAN (AM)": { name: "OMAR KHAN", role: "AM" },
    "Talha Asad (ADS)": { name: "Talha Asad", role: "ADS" },
    "Neelam Rana (CW)": { name: "Neelam Rana", role: "CW" },
    "Abdullah (BD)": { name: "Abdullah", role: "BD" },
    "Taha Siddiqui (BD)": { name: "Taha Siddiqui", role: "BD" },
    "Maaz (GD)": { name: "Maaz", role: "GD" },
    "Zohaib Atif (VE)": { name: "Zohaib Atif", role: "VE" },
    "Abdul Muhaimin (VE)": { name: "Abdul Muhaimin", role: "VE" },
    "Muhammad Kabir (SMM)": { name: "Muhammad Kabir", role: "SMM" },
    "Maliha (BD)": { name: "Maliha", role: "BD" }
};

async function restore() {
    console.log("Fetching users to restore...");
    const { data: users, error: fetchError } = await supabase.from('flc_ops_users').select('*');
    if (fetchError) {
        console.error("Fetch Error:", fetchError);
        return;
    }

    let restoredCount = 0;

    for (const u of users) {
        // Match either exact name or trimmed name
        const matchKey = u.name.trim();
        const restoreData = RESTORE_MAP[matchKey];

        if (restoreData) {
            console.log(`Restoring: "${u.name}" -> Name: "${restoreData.name}", Role: "${restoreData.role}"`);
            const { error: updateError } = await supabase
                .from('flc_ops_users')
                .update({
                    name: restoreData.name,
                    role: restoreData.role
                })
                .eq('id', u.id);

            if (updateError) {
                console.error(`Failed to restore user ${u.name}:`, updateError);
            } else {
                restoredCount++;
            }
        }
    }

    console.log(`\nRestoration complete! Successfully restored ${restoredCount} user profile(s).`);
}

restore();

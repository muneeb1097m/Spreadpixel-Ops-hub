import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials!");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const SLACK_MAPPING = {
  "Muneeb": "D0APL6R7FGF",
  "Syed Haseeb Gilani": "D0B1GMJJG12",
  "Maaz": "D0B1FAH69D4",
  "Muhammad Azeem": "D0B190B8Q67",
  "Neelam Rana": "D0B1FAH2S1G",
  "Pariwish Siddiqui": "D0B1A7NUEJX",
  "Muhammad Usman": "D0B1ET2GCRL",
  "Maliha Atif": "D0B1EFPTFFY",
  "Muhammad Basit": "D0B1LGS00R2",
  "Sumra Saleh": "D0B2BBDKQBD",
  "Nadeem Abbas": "D0B1NGTUADS",
  "M.ShaheerLall": "D0B2BBY9WAU",
  "Muhammad Atif Naseer": "U0B983A3266",
  "Usman Ali": "U0B91PCUDL3",
  "Hamza Ali": "U0B9C5Y2CG4"
};

// Hardcoded manual mapping override to ensure 100% accuracy
const MANUAL_OVERRIDE = {
  "atif naseer": "U0B983A3266",
  "maliha": "D0B1EFPTFFY",
  "hamzaali": "U0B9C5Y2CG4",
  "neelam": "D0B1FAH2S1G",
  "neelam rana": "D0B1FAH2S1G",
  "shaheerlall": "D0B2BBY9WAU",
  "muhammad basit": "D0B1LGS00R2",
  "zohaib atif": null, // Reset since they are not in the mapping list
  "azeem faiz": null   // Reset since they are not in the mapping list
};

async function seed() {
  try {
    const { data: users, error } = await supabase.from('flc_ops_users').select('*');
    if (error) throw error;

    console.log(`Fetched ${users.length} users from database.`);
    
    for (const u of users) {
      let matchedId = null;
      let matchedKey = null;
      const uNameKey = u.name.toLowerCase().trim().replace(/\s+/g, '');

      // 1. Check Manual Overrides first
      if (MANUAL_OVERRIDE[u.name.toLowerCase().trim()] !== undefined) {
        matchedId = MANUAL_OVERRIDE[u.name.toLowerCase().trim()];
        matchedKey = `Manual Override for ${u.name}`;
      } else if (MANUAL_OVERRIDE[uNameKey] !== undefined) {
        matchedId = MANUAL_OVERRIDE[uNameKey];
        matchedKey = `Manual Override for ${u.name}`;
      } else {
        // 2. Exact match
        for (const [name, id] of Object.entries(SLACK_MAPPING)) {
          if (u.name.toLowerCase().trim() === name.toLowerCase().trim()) {
            matchedId = id;
            matchedKey = name;
            break;
          }
        }

        // 3. Containment match (e.g. "muhammad atif naseer" contains "atif naseer")
        if (!matchedId) {
          for (const [name, id] of Object.entries(SLACK_MAPPING)) {
            const uNameNorm = u.name.toLowerCase().trim().replace(/\s+/g, '');
            const mNameNorm = name.toLowerCase().trim().replace(/\s+/g, '');
            if (uNameNorm.includes(mNameNorm) || mNameNorm.includes(uNameNorm)) {
              matchedId = id;
              matchedKey = name;
              break;
            }
          }
        }
      }

      // Perform update (even if matchedId is null, to clear incorrect values)
      console.log(`Updating "${u.name}" -> Slack ID: "${matchedId}" (Reason: ${matchedKey || 'No match / Reset'})`);
      const { error: updateError } = await supabase
        .from('flc_ops_users')
        .update({ slack_id: matchedId })
        .eq('id', u.id);
      
      if (updateError) {
        console.error(`Failed to update user "${u.name}":`, updateError.message);
      } else {
        console.log(`Successfully set Slack ID for "${u.name}".`);
      }
    }
  } catch (err) {
    console.error("Migration/Seeding Exception:", err);
  }
}

seed();

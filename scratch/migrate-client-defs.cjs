const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from the project .env
dotenv.config({ path: path.join(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runMigration() {
  console.log("Fetching all clients...");
  const { data: clients, error: fetchError } = await supabase
    .from('flc_ops_clients')
    .select('*');

  if (fetchError) {
    console.error("Error fetching clients:", fetchError);
    return;
  }

  console.log(`Found ${clients.length} clients.`);
  let updatedCount = 0;

  for (const c of clients) {
    const tasksData = c.tasks_data || {};
    const defs = tasksData.__defs;

    if (!defs || !Array.isArray(defs)) {
      console.log(`Skipping client "${c.name}" (no custom defs stored).`);
      continue;
    }

    let modified = false;
    const newDefs = defs.map(t => {
      if (t.n === "CRM & Automation Test" && t.role === "CRM") {
        modified = true;
        return { ...t, role: "ADS" };
      }
      return t;
    });

    if (modified) {
      console.log(`Updating client "${c.name}" CRM & Automation Test tasks assignment to ADS...`);
      const updatedTasksData = { ...tasksData, __defs: newDefs, __meta_updated_at: new Date().toISOString() };
      
      const { error: updateError } = await supabase
        .from('flc_ops_clients')
        .update({ tasks_data: updatedTasksData, updated_at: new Date().toISOString() })
        .eq('id', c.id);

      if (updateError) {
        console.error(`Failed to update client "${c.name}":`, updateError);
      } else {
        console.log(`Successfully updated client "${c.name}".`);
        updatedCount++;
      }
    } else {
      console.log(`Client "${c.name}" has custom defs, but none required updating.`);
    }
  }

  console.log(`\nMigration complete. Updated ${updatedCount} clients.`);
}

runMigration();

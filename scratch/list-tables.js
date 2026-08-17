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

async function listTables() {
  const { data, error } = await supabase.rpc('get_tables');
  if (error) {
    // If RPC doesn't exist, try querying a query or running an arbitrary select.
    console.log("RPC get_tables failed. Trying query on public tables...");
    const { data: tablesData, error: queryError } = await supabase
      .from('pg_tables')
      .select('tablename')
      .eq('schemaname', 'public');
    if (queryError) {
      console.log("Direct table query failed. Let's try select from schema info...");
      console.error(queryError);
    } else {
      console.log("Tables:", tablesData);
    }
  } else {
    console.log("Tables (RPC):", data);
  }
}
listTables();

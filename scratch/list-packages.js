import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://axscckeukbiiqfrchxji.supabase.co';
const supabaseKey = 'sb_publishable_0JCerWHdwQkMh33FU34ikA_M902wVUU';

const supabase = createClient(supabaseUrl, supabaseKey);

async function listAllClients() {
  const { data: clients } = await supabase.from('flc_ops_clients').select('id, name, package, created_at').order('created_at', { ascending: false });
  console.log(`Total DB rows: ${clients.length}`);
  clients.forEach((c, idx) => {
    console.log(`${idx + 1}. [${c.id}] "${c.name}" | Package: "${c.package}" | Created: ${c.created_at}`);
  });
}

listAllClients();

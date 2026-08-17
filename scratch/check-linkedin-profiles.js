import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://axscckeukbiiqfrchxji.supabase.co';
const supabaseKey = 'sb_publishable_0JCerWHdwQkMh33FU34ikA_M902wVUU';

const supabase = createClient(supabaseUrl, supabaseKey);

async function inspectProfiles() {
  const { data: clients, error } = await supabase.from('flc_ops_clients').select('*');
  if (error) {
    console.error('Fetch error:', error);
    return;
  }
  const opsClients = (clients || []).filter(c => c.package !== 'lead');
  
  console.log(`Checking ${opsClients.length} ops clients:`);
  opsClients.forEach(c => {
    console.log(`Client: ${c.name} | Profiles:`, c.tasks_data?.__linkedin_profiles || 'None');
  });
}

inspectProfiles();

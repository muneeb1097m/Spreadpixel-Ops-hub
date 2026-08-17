import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://axscckeukbiiqfrchxji.supabase.co';
const supabaseKey = 'sb_publishable_0JCerWHdwQkMh33FU34ikA_M902wVUU';

const supabase = createClient(supabaseUrl, supabaseKey);

async function inspectData() {
  const { data, error } = await supabase.from('flc_ops_clients').select('id, name, package, tasks_data');
  if (error) {
    console.error('Error fetching:', error);
    return;
  }
  console.log(`Total rows: ${data.length}`);
  const clients = data.filter(c => c.package !== 'lead');
  const leads = data.filter(c => c.package === 'lead');

  console.log(`Ops Clients (${clients.length}):`);
  clients.forEach(c => console.log(`  - [${c.id}] ${c.name}`));

  console.log(`\nLeads (${leads.length}):`);
  leads.forEach(l => {
    const parentId = l.tasks_data?.__bd_outreach_parent_client_id;
    const parent = clients.find(c => c.id === parentId);
    console.log(`  - [${l.id}] ${l.name} | Stage: ${l.tasks_data?.__bd_outreach_stage} | Parent ID: ${parentId} (${parent ? parent.name : 'NONE/UNASSIGNED'})`);
  });
}

inspectData();

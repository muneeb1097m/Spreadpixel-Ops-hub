import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://axscckeukbiiqfrchxji.supabase.co';
const supabaseKey = 'sb_publishable_0JCerWHdwQkMh33FU34ikA_M902wVUU';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testIsolation() {
  const { data: clients } = await supabase.from('flc_ops_clients').select('*');
  const mirai = clients.find(c => c.name === 'Mirai Studios');
  const flc90 = clients.find(c => c.name === 'FLC 90 Days System');

  const miraiLeads = clients.filter(c => c.package === 'lead' && c.tasks_data?.__bd_outreach_parent_client_id === mirai.id);
  const flc90Leads = clients.filter(c => c.package === 'lead' && c.tasks_data?.__bd_outreach_parent_client_id === flc90.id);

  console.log(`Mirai Studios ID: ${mirai.id}`);
  console.log(`Mirai Studios BD Leads Count: ${miraiLeads.length}`);
  console.log(`FLC 90 Days System BD Leads Count: ${flc90Leads.length}`);
}

testIsolation();

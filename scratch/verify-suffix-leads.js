import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://axscckeukbiiqfrchxji.supabase.co';
const supabaseKey = 'sb_publishable_0JCerWHdwQkMh33FU34ikA_M902wVUU';

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifySuffixLeads() {
  const { data: clients } = await supabase.from('flc_ops_clients').select('*');
  const suffix = clients.find(c => c.name.toLowerCase().includes('suffix'));
  const suffixLeads = clients.filter(c => c.package === 'lead' && c.tasks_data?.__bd_outreach_parent_client_id === suffix.id);

  console.log(`Suffix tech ID: ${suffix.id}`);
  console.log(`Suffix tech BD Leads Count: ${suffixLeads.length}`);
  suffixLeads.forEach((l, i) => console.log(`  ${i+1}. ${l.name} (${l.tasks_data?.__bd_outreach_company || 'No company'})`));
}

verifySuffixLeads();

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://axscckeukbiiqfrchxji.supabase.co';
const supabaseKey = 'sb_publishable_0JCerWHdwQkMh33FU34ikA_M902wVUU';

const supabase = createClient(supabaseUrl, supabaseKey);

async function findSuffixTechLeads() {
  const { data, error } = await supabase.from('flc_ops_clients').select('*');
  if (error) {
    console.error('Error fetching clients:', error);
    return;
  }

  console.log(`Total rows in flc_ops_clients: ${data.length}`);
  
  const suffixClient = data.find(c => c.name.toLowerCase().includes('suffix'));
  console.log('Suffix tech client record:', suffixClient ? { id: suffixClient.id, name: suffixClient.name, package: suffixClient.package } : 'NOT FOUND');

  console.log('\n--- ALL LEADS IN DATABASE ---');
  const leads = data.filter(c => c.package === 'lead' || c.tasks_data?.__bd_outreach_stage || c.tasks_data?.__bd_outreach_company || c.tasks_data?.__bd_outreach_parent_client_id);
  
  leads.forEach(l => {
    const parentId = l.tasks_data?.__bd_outreach_parent_client_id;
    const parent = data.find(c => c.id === parentId);
    console.log(`Lead ID: ${l.id} | Name: "${l.name}" | Package: ${l.package} | Stage: ${l.tasks_data?.__bd_outreach_stage} | Parent ID: ${parentId} (${parent ? parent.name : 'UNASSIGNED/ORPHANED'})`);
  });

  console.log('\n--- NON-LEAD CLIENTS THAT MIGHT BE LEADS ---');
  const otherClients = data.filter(c => c.package !== 'lead');
  otherClients.forEach(c => {
    if (c.tasks_data?.__bd_outreach_stage || c.tasks_data?.__bd_outreach_parent_client_id) {
      console.log(`Client ID: ${c.id} | Name: "${c.name}" | Package: ${c.package} | Stage: ${c.tasks_data?.__bd_outreach_stage} | Parent ID: ${c.tasks_data?.__bd_outreach_parent_client_id}`);
    }
  });
}

findSuffixTechLeads();

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://axscckeukbiiqfrchxji.supabase.co';
const supabaseKey = 'sb_publishable_0JCerWHdwQkMh33FU34ikA_M902wVUU';

const supabase = createClient(supabaseUrl, supabaseKey);

async function inspectLeadDetails() {
  const { data } = await supabase.from('flc_ops_clients').select('*');
  const leads = data.filter(c => c.package === 'lead');
  
  console.log(`Found ${leads.length} leads in database:`);
  leads.forEach((l, i) => {
    console.log(`${i+1}. [${l.id}] ${l.name} | Assigned BD: ${l.tasks_data?.__assigned_bd || 'None'} | Date: ${l.tasks_data?.__bd_outreach_date} | Parent: ${l.tasks_data?.__bd_outreach_parent_client_id}`);
  });
}

inspectLeadDetails();

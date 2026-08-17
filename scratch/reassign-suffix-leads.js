import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://axscckeukbiiqfrchxji.supabase.co';
const supabaseKey = 'sb_publishable_0JCerWHdwQkMh33FU34ikA_M902wVUU';

const supabase = createClient(supabaseUrl, supabaseKey);

const SUFFIX_TECH_ID = '1401e0bf-c9bc-4e8c-8e3c-9196e898f1e3';

async function migrateLeadsToSuffixTech() {
  const { data: leads, error } = await supabase.from('flc_ops_clients').select('*').eq('package', 'lead');
  if (error) {
    console.error('Error fetching leads:', error);
    return;
  }

  console.log(`Found ${leads.length} leads to reassign to Suffix tech...`);

  for (const lead of leads) {
    const updatedTasks = {
      ...(lead.tasks_data || {}),
      __bd_outreach_parent_client_id: SUFFIX_TECH_ID,
      __meta_updated_at: new Date().toISOString()
    };

    const { error: updateError } = await supabase
      .from('flc_ops_clients')
      .update({ tasks_data: updatedTasks, updated_at: new Date().toISOString() })
      .eq('id', lead.id);

    if (updateError) {
      console.error(`Failed to update ${lead.name} (${lead.id}):`, updateError);
    } else {
      console.log(`Successfully reassigned lead "${lead.name}" -> Suffix tech`);
    }
  }
}

migrateLeadsToSuffixTech();

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://axscckeukbiiqfrchxji.supabase.co';
const supabaseKey = 'sb_publishable_0JCerWHdwQkMh33FU34ikA_M902wVUU';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSuffixTech() {
  const { data } = await supabase.from('flc_ops_clients').select('*').eq('id', '1401e0bf-c9bc-4e8c-8e3c-9196e898f1e3');
  console.log(JSON.stringify(data, null, 2));
}

checkSuffixTech();

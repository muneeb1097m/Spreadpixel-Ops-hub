import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://axscckeukbiiqfrchxji.supabase.co';
const supabaseKey = 'sb_publishable_0JCerWHdwQkMh33FU34ikA_M902wVUU';

const supabase = createClient(supabaseUrl, supabaseKey);

async function findLewis() {
  const { data, error } = await supabase.from('flc_ops_clients').select('*');
  if (error) {
    console.error('Fetch error:', error);
    return;
  }
  console.log(`Total rows in DB: ${data.length}`);
  const lewis = data.find(c => c.name.toLowerCase().includes('lewis') || c.name.toLowerCase().includes('barbanel'));
  console.log('Lewis record in Supabase:', lewis);
}

findLewis();

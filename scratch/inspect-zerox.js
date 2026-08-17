import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY
);

async function inspectZeroX() {
  const { data, error } = await supabase
    .from('flc_ops_clients')
    .select('*')
    .eq('id', '493abdf3-f8cd-4a14-88de-447c25a27181')
    .single();

  if (error) {
    console.error('Error fetching ZeroX:', error);
    return;
  }

  console.log('=== ZeroX Client Data ===');
  console.log('Name:', data.name);
  console.log('Tasks keys:', Object.keys(data.tasks || {}));
  console.log('Website:', data.tasks?.__website);
  console.log('Drive Link:', data.tasks?.__drive_link);
  console.log('Standard Notes:', data.tasks?.__standard_notes);
  console.log('Client Notes:', data.tasks?.__client_notes);
  console.log('Brand Brief:', data.tasks?.__creative_brand_brief);
}

inspectZeroX();

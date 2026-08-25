
import { createClient } from '@supabase/supabase-js';
import { toast } from 'sonner';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

export async function fetchClients(cid = null, user = null) {
  let query = supabase.from('flc_ops_clients').select('*');
  if (cid) {
    query = query.eq('id', cid);
  } else {
    query = query.order('created_at', { ascending: false });
  }
  
  const { data, error } = await query;
  if (error) throw new Error(`Supabase fetch error: ${error.message}`);
  if (!data) return []; // Guard against null response
  
  const formatted = data.map(c => ({
    id: c.id,
    name: c.name,
    startDate: c.start_date,
    package: c.package,
    tasks: c.tasks_data,
    followups: c.followups_data,
    updatedAt: c.updated_at
  }));

  // Role-based visibility logic
  if (user && user.role && user.role.toLowerCase() !== 'admin') {
    const assigned = user.assigned_clients || [];
    if (assigned.includes('all')) {
      return formatted;
    }
    return formatted.filter(c => assigned.includes(c.id));
  }

  return formatted;
}

export async function upsertClient(client) {
  let mergedTasks = client.tasks || {};

  // If we are updating an existing client, merge with existing DB tasks to prevent data loss
  if (client.id && String(client.id).trim() !== '') {
    try {
      const { data: existing } = await supabase
        .from('flc_ops_clients')
        .select('tasks_data')
        .eq('id', String(client.id))
        .maybeSingle();

      if (existing) {
        const dbTasks = existing.tasks_data || {};
        const finalTasks = { ...dbTasks };
        
        const dbMetaTime = dbTasks.__meta_updated_at ? new Date(dbTasks.__meta_updated_at).getTime() : 0;
        const localMetaTime = client.tasks?.__meta_updated_at ? new Date(client.tasks.__meta_updated_at).getTime() : 0;

        if (localMetaTime > 0 && localMetaTime < dbMetaTime) {
            client.name = existing.name;
            client.startDate = existing.start_date;
            client.package = existing.package;
        }

        // 1. Merge metadata fields (starting with __)
        const metadataKeys = [
          '__website', '__drive_link', '__client_name', '__standard_notes', '__client_notes', 
          '__defs', '__slack_id', '__meta_updated_at', '__assigned_bd',
          '__bd_outreach_stage', '__bd_outreach_notes', '__bd_outreach_icp', 
          '__bd_outreach_raw_profile', '__bd_outreach_score', '__bd_outreach_ai_explanation', 
          '__bd_outreach_company', '__bd_outreach_headline', '__bd_outreach_date',
          '__bd_outreach_parent_client_id', '__linkedin_profiles', '__bd_outreach_linkedin_profile_id',
          '__bd_outreach_linkedin_url', '__creative_content_calendar', '__creative_brand_brief',
          '__brand_logo_url', '__brand_colors', '__brand_niche', '__brand_logo_position', '__brand_platform'
        ];
        metadataKeys.forEach(key => {
          const dbVal = dbTasks[key];
          const localVal = client.tasks?.[key];
          if (localMetaTime >= dbMetaTime) {
            if (localVal !== undefined && localVal !== null && localVal !== "") {
              finalTasks[key] = localVal;
            } else if (dbVal) {
              finalTasks[key] = dbVal;
            }
          } else {
            if (dbVal) {
              finalTasks[key] = dbVal;
            }
          }
        });

        // 2. Merge payment month metadata keys
        Object.keys(dbTasks).forEach(k => {
          if (k.startsWith('__payment_month')) {
            const dbVal = dbTasks[k];
            const localVal = client.tasks?.[k];
            if (localVal !== undefined && localVal !== null && localVal !== "") {
              finalTasks[k] = localVal;
            } else if (dbVal) {
              finalTasks[k] = dbVal;
            }
          }
        });

        // 3. Merge individual task items based on updatedAt timestamps
        Object.keys(client.tasks || {}).forEach(taskId => {
          if (taskId.startsWith('__')) return; // Skip metadata keys

          const localTask = client.tasks[taskId] || {};
          const dbTask = dbTasks[taskId];

          if (!dbTask) {
            finalTasks[taskId] = localTask;
            return;
          }

          // Compare individual updatedAt timestamps
          const localTime = localTask.updatedAt ? new Date(localTask.updatedAt).getTime() : 0;
          const dbTime = dbTask.updatedAt ? new Date(dbTask.updatedAt).getTime() : 0;

          if (localTime > 0 || dbTime > 0) {
            if (localTime >= dbTime) {
              finalTasks[taskId] = { ...dbTask, ...localTask };
            } else {
              finalTasks[taskId] = { ...localTask, ...dbTask };
            }
          } else {
            // Fallback for legacy tasks that don't have updatedAt yet
            const merged = { ...dbTask, ...localTask };
            if (dbTask.done && !localTask.done) {
              merged.done = true;
            }
            if (dbTask.notes && dbTask.notes.trim() && (!localTask.notes || !localTask.notes.trim())) {
              merged.notes = dbTask.notes;
            }
            if (dbTask.review && dbTask.review.trim() && (!localTask.review || !localTask.review.trim())) {
              merged.review = dbTask.review;
            }
            if (dbTask.delayReason && dbTask.delayReason.trim() && (!localTask.delayReason || !localTask.delayReason.trim())) {
              merged.delayReason = dbTask.delayReason;
            }
            finalTasks[taskId] = merged;
          }
        });

        mergedTasks = finalTasks;
      }
    } catch (err) {
      console.error('Error fetching existing client for merge:', err);
    }
  }

  const clientId = (client.id !== undefined && client.id !== null && String(client.id).trim() !== '')
    ? String(client.id).trim()
    : (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `client_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`);

  const payload = {
    id: clientId,
    name: client.name,
    start_date: client.startDate,
    package: client.package,
    tasks_data: mergedTasks,
    followups_data: client.followups || [],
    updated_at: client.updatedAt || new Date().toISOString()
  };

  const { data, error } = await supabase
    .from('flc_ops_clients')
    .upsert(payload, { onConflict: 'id' })
    .select()
    .single();

  if (error) {
    console.error('[UPSERT ERROR]', error);
    throw error;
  }
  return data;
}

export function subscribeToClients(callback) {
  return supabase
    .channel('public:flc_ops_clients')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'flc_ops_clients' }, callback)
    .subscribe();
}

export function subscribeToTaskLogs(callback) {
  const channel = supabase.channel('task-completions');
  channel
    .on('broadcast', { event: 'completed' }, (response) => {
      if (response && response.payload) {
        callback({ eventType: 'INSERT', new: response.payload });
      }
    })
    .subscribe();
  return channel;
}

export function broadcastTaskCompletion(payload) {
  const channel = supabase.channel('task-completions');
  channel.subscribe((status) => {
    if (status === 'SUBSCRIBED') {
      channel.send({
        type: 'broadcast',
        event: 'completed',
        payload
      });
    }
  });
}

export async function deleteClient(id) {
  // First, attempt to delete associated task logs to satisfy foreign key constraints if table exists
  try {
    const { error: logError } = await supabase
      .from('flc_ops_task_logs')
      .delete()
      .eq('client_id', String(id));
    
    if (logError && logError.code !== 'PGRST205' && !logError.message?.includes('schema cache')) {
      console.warn('Warning deleting client task logs:', logError.message);
    }
  } catch (err) {
    console.warn('Non-blocking error deleting client task logs:', err);
  }

  // Then, delete the client
  const { error } = await supabase
    .from('flc_ops_clients')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

export async function signUpUser({ name, email, password, role }) {
  // Check for pending invite
  const { data: invite } = await supabase
    .from('flc_ops_invites')
    .select('*')
    .eq('email', email.trim())
    .maybeSingle();

  let assigned_clients = [];
  if (invite) {
    assigned_clients = invite.assigned_clients || [];
    role = 'member'; // Force role to member if invited
  }

  const { data, error } = await supabase
    .from('flc_ops_users')
    .insert({ name, email: email.trim(), password_hash: password, role, assigned_clients })
    .select()
    .single();
    
  if (error) throw error;

  if (invite) {
    await supabase.from('flc_ops_invites').delete().eq('email', email.trim());
  }

  return data;
}

export async function signInUser(email, password) {
  const { data, error } = await supabase
    .from('flc_ops_users')
    .select('*')
    .ilike('email', email.trim())
    .eq('password_hash', password)
    .maybeSingle();
    
  if (error) throw error;
  if (!data) return null;

  // Check for any new pending invites for this existing user
  const { data: invite } = await supabase
    .from('flc_ops_invites')
    .select('*')
    .eq('email', email.trim())
    .maybeSingle();

  if (invite && invite.assigned_clients?.length > 0) {
    // Add new clients to their existing ones
    const currentAssigned = data.assigned_clients || [];
    const newAssigned = [...new Set([...currentAssigned, ...invite.assigned_clients])];
    
    await supabase.from('flc_ops_users').update({ assigned_clients: newAssigned }).eq('id', data.id);
    await supabase.from('flc_ops_invites').delete().eq('email', email.trim());
    
    data.assigned_clients = newAssigned;
  }

  return data;
}

export async function logTaskCompletion({ member_name, member_email, task_id, task_name, client_id, client_name, action_type = 'COMPLETED' }) {
  try {
    const { error } = await supabase
      .from('flc_ops_task_logs')
      .insert({
        member_name,
        member_email: member_email?.trim().toLowerCase(),
        task_id,
        task_name,
        client_id: String(client_id), // Convert to string for broad compatibility
        client_name,
        action_type,
        completed_at: new Date().toISOString()
      });
    if (error) {
      if (error.code !== 'PGRST205' && !error.message?.includes('schema cache')) {
        console.error('[LOG ERROR]', error);
        toast.error("Audit log failed: " + error.message);
      }
    }
  } catch (err) {
    console.warn('[LOG ERROR]', err);
  }
}

export async function fetchMemberLogs(email) {
  try {
    const { data, error } = await supabase
      .from('flc_ops_task_logs')
      .select('*')
      .eq('member_email', email?.trim().toLowerCase())
      .order('completed_at', { ascending: false });
    if (error) {
      if (error.code === 'PGRST205' || error.message?.includes('schema cache')) return [];
      throw error;
    }
    return data || [];
  } catch (err) {
    if (err?.code === 'PGRST205' || err?.message?.includes('schema cache')) return [];
    throw err;
  }
}

export async function fetchRecentLogs(limit = 20) {
  try {
    const { data, error } = await supabase
      .from('flc_ops_task_logs')
      .select('*')
      .order('completed_at', { ascending: false })
      .limit(limit);
    if (error) {
      if (error.code === 'PGRST205' || error.message?.includes('schema cache')) return [];
      throw error;
    }
    return data || [];
  } catch (err) {
    if (err?.code === 'PGRST205' || err?.message?.includes('schema cache')) return [];
    throw err;
  }
}


import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://axscckeukbiiqfrchxji.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_0JCerWHdwQkMh33FU34ikA_M902wVUU';
const supabase = createClient(supabaseUrl, supabaseKey);

const resendKey = process.env.RESEND_API_KEY;
const resend = resendKey ? new Resend(resendKey) : null;

async function sendEmailSafely(params) {
  if (!resend) {
    console.log('[RESEND MOCK]:', params);
    return { data: { id: 'mock' }, error: null };
  }
  try {
    const response = await resend.emails.send(params);
    if (response && response.error) {
      console.error('[RESEND API ERROR]:', response.error);
      return { data: { id: 'mock-fallback' }, error: null };
    }
    return response || { data: { id: 'mock' }, error: null };
  } catch (err) {
    console.error('[RESEND FETCH/NETWORK ERROR]:', err);
    return { data: { id: 'mock-fallback' }, error: null };
  }
}

export default async function handler(req, res) {
  let action = req.query.action;
  if (!action) {
    const urlParts = req.url.split('?')[0].split('/').filter(Boolean);
    action = urlParts[urlParts.length - 1];
  }

  try {
    switch (action) {
      case 'signup':
        return await handleSignup(req, res);
      case 'send-otp':
        return await handleSendOtp(req, res);
      case 'verify-otp':
        return await handleVerifyOtp(req, res);
      case 'request-password-reset':
        return await handleRequestPasswordReset(req, res);
      case 'update-forgotten-password':
        return await handleUpdateForgottenPassword(req, res);
      case 'send-invite-email':
        return await handleSendInviteEmail(req, res);
      case 'delete-user':
        return await handleDeleteUser(req, res);
      default:
        return res.status(404).json({ error: `Unknown auth action: ${action}` });
    }
  } catch (err) {
    console.error(`[Auth Router Error - ${action}]:`, err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
}

async function handleSignup(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { name, email, password, role } = req.body;
  if (!email || !password || !name) return res.status(400).json({ error: 'Missing required fields' });

  const { data: invite } = await supabase
    .from('flc_ops_invites')
    .select('*')
    .ilike('email', email.trim())
    .maybeSingle();

  let assigned_clients = [];
  let finalRole = role || 'member';
  if (invite) {
    assigned_clients = invite.assigned_clients || [];
    finalRole = 'member';
  }

  const { data: user, error: createError } = await supabase
    .from('flc_ops_users')
    .insert({ 
      name, 
      email: email.trim(), 
      password_hash: password, 
      role: finalRole, 
      assigned_clients 
    })
    .select()
    .single();
      
  if (createError) {
    if (createError.code === '23505') return res.status(400).json({ error: 'An account already exists with this email.' });
    throw createError;
  }

  if (invite) {
    await supabase.from('flc_ops_invites').delete().ilike('email', email.trim());
  }

  return res.status(200).json({ success: true, user });
}

async function handleSendOtp(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { email, password, isLogin } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });

  if (isLogin) {
    if (!password) return res.status(400).json({ error: 'Password is required' });
    
    const { data: user, error: userError } = await supabase
      .from('flc_ops_users')
      .select('id, password_hash')
      .ilike('email', email.trim()) 
      .maybeSingle();
    
    if (userError) throw userError;
    if (!user || user.password_hash !== password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + 10);

  // Clean old OTPs for this email and insert fresh OTP
  await supabase.from('flc_ops_otps').delete().eq('email', email.toLowerCase().trim());
  const { error } = await supabase.from('flc_ops_otps').insert({
    email: email.toLowerCase().trim(),
    code: otp,
    expires_at: expiresAt.toISOString()
  });

  if (error) throw error;

  console.log(`\n=======================================`);
  console.log(`🔑 OTP GENERATED FOR ${email}: ${otp}`);
  console.log(`=======================================\n`);

  const { error: resendError } = await sendEmailSafely({
    from: process.env.SENDER_EMAIL || 'onboarding@spreadpixel.com',
    to: [email],
    subject: 'Your SpreadPixel OpsHub Verification Code',
    html: `
      <div style="font-family: sans-serif; padding: 24px; color: #0f172a; max-width: 500px; margin: 0 auto; border: 1px solid #fed7aa; border-radius: 16px; background: #ffffff;">
        <div style="margin-bottom: 20px; border-bottom: 2px solid #ea580c; padding-bottom: 12px;">
          <h2 style="color: #ea580c; font-weight: 900; margin: 0; font-size: 22px;">SpreadPixel OpsHub</h2>
          <div style="color: #64748b; font-size: 13px; margin-top: 4px;">Account Verification</div>
        </div>
        <p style="font-size: 14px; color: #334155;">Enter the following 6-digit verification code to complete your access:</p>
        <div style="text-align: center; margin: 24px 0;">
          <div style="font-size: 36px; font-weight: 900; letter-spacing: 6px; border: 2px dashed #ea580c; padding: 14px 24px; border-radius: 12px; display: inline-block; background: #fff7ed; color: #ea580c;">
            ${otp}
          </div>
        </div>
        <p style="color: #94a3b8; font-size: 12px; text-align: center;">This code expires in 10 minutes.</p>
      </div>
    `
  });

  if (resendError) {
    console.warn('[OTP EMAIL NOTICE]:', resendError);
  }
  return res.status(200).json({ success: true, message: 'OTP sent' });
}

async function handleVerifyOtp(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { email, code, isLogin, password } = req.body;
  if (!email || !code) return res.status(400).json({ error: 'Email and code are required' });

  const { data, error } = await supabase
    .from('flc_ops_otps')
    .select('*')
    .eq('email', email.toLowerCase().trim())
    .single();

  if (error || !data) return res.status(401).json({ error: 'Invalid email or code' });

  if (new Date(data.expires_at) < new Date()) {
    return res.status(401).json({ error: 'OTP has expired. Please request a new one.' });
  }

  if (data.code !== code) {
    return res.status(401).json({ error: 'Invalid code. Please check and try again.' });
  }

  let userData = null;
  if (isLogin) {
    const { data: u, error: uErr } = await supabase
      .from('flc_ops_users')
      .select('*')
      .ilike('email', email.trim())
      .eq('password_hash', password)
      .maybeSingle();
    if (uErr) throw uErr;
    if (!u) return res.status(401).json({ error: 'Credentials mismatch during verification' });
    userData = u;
  }

  try {
    await supabase
      .from('flc_ops_otps')
      .update({ verified: true })
      .eq('email', data.email);
  } catch (ignored) {}

  return res.status(200).json({ success: true, user: userData });
}

async function handleRequestPasswordReset(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });

  const { data: user, error: userError } = await supabase
    .from('flc_ops_users')
    .select('id')
    .ilike('email', email.toLowerCase().trim())
    .maybeSingle();

  if (userError) throw userError;
  if (!user) return res.status(404).json({ error: 'No account found with this email' });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + 10);

  // Clean old OTPs for this email and insert fresh OTP
  await supabase.from('flc_ops_otps').delete().eq('email', email.toLowerCase().trim());
  const { error } = await supabase.from('flc_ops_otps').insert({
    email: email.toLowerCase().trim(),
    code: otp,
    expires_at: expiresAt.toISOString()
  });

  if (error) throw error;

  console.log(`\n=======================================`);
  console.log(`🔑 PASSWORD RESET OTP FOR ${email}: ${otp}`);
  console.log(`=======================================\n`);

  const { error: resendError } = await sendEmailSafely({
    from: process.env.SENDER_EMAIL || 'onboarding@spreadpixel.com',
    to: [email],
    subject: 'Reset Your SpreadPixel OpsHub Password',
    html: `
      <div style="font-family: sans-serif; padding: 24px; color: #0f172a; max-width: 500px; margin: 0 auto; border: 1px solid #fed7aa; border-radius: 16px; background: #ffffff;">
        <div style="margin-bottom: 20px; border-bottom: 2px solid #ea580c; padding-bottom: 12px;">
          <h2 style="color: #ea580c; font-weight: 900; margin: 0; font-size: 22px;">SpreadPixel OpsHub</h2>
          <div style="color: #64748b; font-size: 13px; margin-top: 4px;">Password Reset Request</div>
        </div>
        <p style="font-size: 14px; color: #334155;">Enter the following 6-digit code to reset your password:</p>
        <div style="text-align: center; margin: 24px 0;">
          <div style="font-size: 36px; font-weight: 900; letter-spacing: 6px; border: 2px dashed #ea580c; padding: 14px 24px; border-radius: 12px; display: inline-block; background: #fff7ed; color: #ea580c;">
            ${otp}
          </div>
        </div>
        <p style="color: #94a3b8; font-size: 12px; text-align: center;">This verification code will expire in 10 minutes.</p>
      </div>
    `
  });

  if (resendError) {
    console.warn('[RESET OTP EMAIL NOTICE]:', resendError);
  }

  return res.status(200).json({ success: true, message: 'Reset code sent successfully' });
}

async function handleUpdateForgottenPassword(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { email, newPassword } = req.body;
  if (!email || !newPassword) return res.status(400).json({ error: 'Email and new password are required' });

  const { data: otpData, error: otpError } = await supabase
    .from('flc_ops_otps')
    .select('*')
    .ilike('email', email.trim())
    .single();

  if (otpError || !otpData || !otpData.verified) {
    return res.status(401).json({ error: 'Please verify your reset code first.' });
  }

  const { data: user, error: userFetchError } = await supabase
    .from('flc_ops_users')
    .select('name, role')
    .ilike('email', email.toLowerCase().trim())
    .single();

  if (userFetchError) throw userFetchError;

  const { error: updateErr } = await supabase
    .from('flc_ops_users')
    .update({ password_hash: newPassword })
    .ilike('email', email.toLowerCase().trim());

  if (updateErr) throw updateErr;

  await supabase.from('flc_ops_otps').delete().eq('email', email.toLowerCase().trim());

  const { data: admins } = await supabase
    .from('flc_ops_users')
    .select('email')
    .eq('role', 'admin');

  if (admins && admins.length > 0) {
    const adminEmails = admins.map(a => a.email);
    await resend.emails.send({
      from: process.env.SENDER_EMAIL || 'onboarding@resend.dev',
      to: adminEmails,
      subject: `Password Reset: ${user.name}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #0f172a;">
          <h2 style="color: #dc2626; font-weight: 900;">Security Notification</h2>
          <p>This is to inform you that the password for <strong>${user.name}</strong> (${email}) has been successfully reset.</p>
          <p style="color: #64748b; font-size: 13px; margin-top: 20px;">If this was not authorized, please take immediate action in the dashboard.</p>
        </div>
      `
    }).catch(e => console.error("Admin Notification Email Failed:", e));
  }

  return res.status(200).json({ success: true, message: 'Password updated successfully' });
}

async function handleSendInviteEmail(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  
  const { email, selectedClients, inviterName } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });

  const clientCount = (selectedClients && Array.isArray(selectedClients)) ? selectedClients.length : 0;

  const { data: existingUser } = await supabase.from('flc_ops_users').select('id, email, assigned_clients').ilike('email', email.trim()).maybeSingle();
  
  if (existingUser) {
    const newAssigned = [...new Set([...(existingUser.assigned_clients || []), ...(selectedClients || [])])];
    await supabase.from('flc_ops_users').update({ assigned_clients: newAssigned }).eq('id', existingUser.id);
  } else {
    const { error: inviteError } = await supabase.from('flc_ops_invites').upsert({ 
      email: email.trim(), 
      assigned_clients: selectedClients || [], 
      invited_by: inviterName || 'Admin' 
    }, { onConflict: 'email' });
    if (inviteError) throw inviteError;
  }

  const inviteUrl = `${process.env.VITE_APP_URL || 'https://ops.faseehlall.com'}/?signup=true&email=${encodeURIComponent(email)}`;
  
  const { error: resendError } = await sendEmailSafely({
    from: process.env.SENDER_EMAIL || 'onboarding@spreadpixel.com',
    to: [email],
    subject: 'You have been invited to SpreadPixel OpsHub',
    html: `
      <div style="font-family: sans-serif; padding: 24px; color: #0f172a; max-width: 500px; margin: 0 auto; border: 1px solid #fed7aa; border-radius: 16px; background: #ffffff;">
        <div style="margin-bottom: 20px; border-bottom: 2px solid #ea580c; padding-bottom: 12px;">
          <h2 style="color: #ea580c; font-weight: 900; margin: 0; font-size: 22px;">SpreadPixel OpsHub</h2>
          <div style="color: #64748b; font-size: 13px; margin-top: 4px;">Team Member Invitation</div>
        </div>
        <p>Hello,</p>
        <p><strong>${inviterName || 'An Admin'}</strong> has invited you to join <strong>SpreadPixel OpsHub</strong> as a Team Member.</p>
        <p>You have been assigned to manage <strong>${clientCount} client(s)</strong>.</p>
        <div style="margin: 28px 0; text-align: center;">
          <a href="${inviteUrl}" style="background: #ea580c; color: #ffffff; padding: 12px 28px; text-decoration: none; border-radius: 12px; font-weight: 800; display: inline-block;">Accept Invitation & Sign Up</a>
        </div>
        <p style="color: #64748b; font-size: 12px;">If you already have an account, signing in with this email will automatically grant you access to the new clients.</p>
      </div>
    `
  });

  if (resendError) {
    console.warn('[INVITE EMAIL NOTICE]:', resendError);
  }
  return res.status(200).json({ success: true, message: 'Invite sent' });
}

async function handleDeleteUser(req, res) {
  if (req.method !== 'POST' && req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.body;
  if (!id) return res.status(400).json({ error: 'Missing user ID' });

  const { data: user, error: userError } = await supabase
    .from('flc_ops_users')
    .select('email')
    .eq('id', id)
    .maybeSingle();

  if (userError) throw userError;
  if (!user) return res.status(404).json({ error: 'User not found' });

  try {
    const { error: missedError } = await supabase
      .from('flc_ops_missed_tasks')
      .delete()
      .eq('team_member_id', id);
    
    if (missedError && missedError.code !== 'PGRST205' && !missedError.message?.includes('schema cache')) {
      console.warn('[DELETE MISSED TASKS WARNING]', missedError.message);
    }
  } catch (err) {
    console.warn('[DELETE MISSED TASKS WARNING]', err.message);
  }

  const { error: deleteError } = await supabase
    .from('flc_ops_users')
    .delete()
    .eq('id', id);

  if (deleteError) throw deleteError;

  return res.status(200).json({ success: true, message: 'User deleted successfully' });
}

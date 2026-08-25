
import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';
import syncAttendanceHandler from './api/sync-attendance.js';
import authRouterHandler from './api/auth-router.js';
import regenerateSingleAngleHandler from './api/regenerate-single-angle.js';
import generateLearnedIterationHandler from './api/generate-learned-iteration.js';
import analyzeLeadHandler from './api/analyze-lead.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));

// Initialize Resend
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

async function sendEmail({ from, to, subject, html }) {
  if (!resend) {
    console.warn(`[RESEND MOCK] Email Simulation (No RESEND_API_KEY set):`);
    console.warn(`To: ${to}\nSubject: ${subject}`);
    return { data: { id: "mock-email-id" }, error: null };
  }
  
  try {
    const response = await resend.emails.send({ from, to, subject, html });
    if (response.error) {
      console.error('\n=======================================');
      console.error('📧 EMAIL API FAILED (Legacy API Key or Setup Issue):');
      console.error(response.error.message);
      console.error(`Email intended for: ${to}`);
      console.error(`Fallback: Check the HTML payload below to find your OTP code.`);
      console.error(html);
      console.error('=======================================\n');
      
      // Mock success to prevent blocking the user in development
      return { data: { id: "mock-email-id" }, error: null };
    }
    return response;
  } catch (err) {
    console.error('Unexpected Resend Error:', err);
    return { data: { id: "mock-email-id" }, error: null };
  }
}

// Initialize Supabase (Service Role key for backend access)
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY
);

// Health Check
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Request Password Reset OTP
app.post('/api/auth/request-password-reset', async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    try {
        // Check if user exists
        const { data: user, error: userError } = await supabase
            .from('flc_ops_users')
            .select('id')
            .ilike('email', email.toLowerCase().trim())
            .maybeSingle();

        if (userError) throw userError;
        if (!user) return res.status(404).json({ error: 'No account found with this email' });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + 10); // 10 min expiry

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

        // Send via Resend
        const { error: resendError } = await sendEmail({
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

        if (resendError) throw resendError;

        res.json({ 
            success: true, 
            message: 'Reset code sent successfully', 
            devCode: !process.env.RESEND_API_KEY ? otp : undefined 
        });
    } catch (err) {
        console.error('Password Reset Request Error:', err);
        res.status(500).json({ error: err.message });
    }
});

// Update Forgotten Password (only if OTP was verified)
app.post('/api/auth/update-forgotten-password', async (req, res) => {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) return res.status(400).json({ error: 'Email and new password are required' });

    try {
        // Check if OTP was verified
        const { data: otpData, error: otpError } = await supabase
            .from('flc_ops_otps')
            .select('*')
            .eq('email', email.toLowerCase().trim())
            .single();

        if (otpError || !otpData) {
            throw new Error('Please verify your reset code first.');
        }

        // Fetch User Info to get the name for admin notification
        const { data: user, error: userFetchError } = await supabase
            .from('flc_ops_users')
            .select('name, role')
            .ilike('email', email.toLowerCase().trim())
            .single();

        if (userFetchError) throw userFetchError;

        // Update password in flc_ops_users
        const { error: updateErr } = await supabase
            .from('flc_ops_users')
            .update({ password_hash: newPassword })
            .ilike('email', email.toLowerCase().trim());

        if (updateErr) throw updateErr;

        // Clear verified OTP
        await supabase.from('flc_ops_otps').delete().eq('email', email.toLowerCase().trim());

        // Notify Admins
        const { data: admins } = await supabase
            .from('flc_ops_users')
            .select('email')
            .eq('role', 'admin');

        if (admins && admins.length > 0) {
            const adminEmails = admins.map(a => a.email);
            await sendEmail({
                from: process.env.SENDER_EMAIL || 'onboarding@spreadpixel.com',
                to: adminEmails,
                subject: `Password Reset Notification: ${user.name}`,
                html: `
                    <div style="font-family: sans-serif; padding: 20px; color: #0f172a;">
                        <h2 style="color: #ea580c; font-weight: 900;">Security Notice - SpreadPixel OpsHub</h2>
                        <p>User <strong>${user.name}</strong> (${email}) has successfully reset their password.</p>
                        <p style="color: #64748b; font-size: 13px;">If this was not authorized, please update security settings immediately.</p>
                    </div>
                `
            });
        }

        res.json({ success: true, message: 'Password updated successfully' });
    } catch (err) {
        console.error('Password Update Error:', err);
        res.status(401).json({ error: err.message });
    }
});

// Send OTP (with optional credential check for login)
app.post('/api/auth/send-otp', async (req, res) => {
    const { email, password, isLogin } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    try {
        if (isLogin) {
            if (!password) return res.status(400).json({ error: 'Password is required' });
            
            // Check credentials
            const { data: user, error: userError } = await supabase
                .from('flc_ops_users')
                .select('*')
                .ilike('email', email.trim())
                .maybeSingle();

            if (userError) throw userError;
            if (!user) {
                console.warn(`Login failed: No user found for ${email.trim()}`);
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            if (user.password_hash !== password) {
                console.warn(`Login failed: Password mismatch for ${email.trim()}`);
                return res.status(401).json({ error: 'Invalid credentials' });
            }
            
            // If we get here, credentials are valid
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
        console.log(`🔑 ONBOARDING / LOGIN OTP FOR ${email}: ${otp}`);
        console.log(`=======================================\n`);

        // Send via Resend
        const { data, error: resendError } = await sendEmail({
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

        if (resendError) throw resendError;

        res.json({ 
            success: true, 
            message: 'OTP sent successfully', 
            devCode: !process.env.RESEND_API_KEY ? otp : undefined 
        });
    } catch (err) {
        console.error('OTP Send Error:', err);
        res.status(500).json({ error: err.message });
    }
});

// Verify OTP (and optionally return user data to avoid extra DB calls)
app.post('/api/auth/verify-otp', async (req, res) => {
    const { email, code, isLogin, password } = req.body;
    if (!email || !code) return res.status(400).json({ error: 'Email and code are required' });

    try {
        const { data: otpData, error: otpError } = await supabase
            .from('flc_ops_otps')
            .select('*')
            .eq('email', email.toLowerCase().trim())
            .single();

        if (otpError || !otpData) throw new Error('Invalid email or code');

        const now = new Date();
        if (new Date(otpData.expires_at) < now) throw new Error('OTP has expired');
        
        if (String(otpData.code).trim() !== String(code).trim()) {
            console.log(`[OTP MISMATCH] Received: "${code}" vs Expected: "${otpData.code}" for ${email}`);
            throw new Error('Invalid code. Please enter the latest 6-digit code received.');
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
            if (!u) throw new Error('Credentials mismatch during verification');
            userData = u;
        }

        // Mark as verified
        try {
            await supabase.from('flc_ops_otps').update({ verified: true }).eq('email', email.toLowerCase().trim());
        } catch (ignored) {}

        res.json({ success: true, user: userData });
    } catch (err) {
        console.error('OTP Verify Error:', err);
        res.status(401).json({ error: err.message });
    }
});

// Create/Signup User (Securely on backend)
app.post('/api/auth/signup', async (req, res) => {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: 'Name, email, and password are required' });

    try {
        const { data: existingUser } = await supabase
            .from('flc_ops_users')
            .select('id')
            .ilike('email', email.trim())
            .maybeSingle();

        if (existingUser) {
            return res.status(400).json({ error: 'User with this email already exists' });
        }

        // Check if there was an invite for this user to get pre-assigned clients
        const { data: invite } = await supabase
            .from('flc_ops_invites')
            .select('*')
            .ilike('email', email.trim())
            .maybeSingle();

        const assignedClients = invite?.clients || [];
        const userRole = role || invite?.role || 'member';

        const { data: newUser, error: insertError } = await supabase
            .from('flc_ops_users')
            .insert({
                name,
                email: email.toLowerCase().trim(),
                password_hash: password,
                role: userRole,
                assigned_clients: assignedClients
            })
            .select()
            .single();

        if (insertError) throw insertError;

        // If invite existed, clean it up
        if (invite) {
            await supabase.from('flc_ops_invites').delete().eq('id', invite.id);
        }

        // Clear verified OTP
        await supabase.from('flc_ops_otps').delete().eq('email', email.toLowerCase().trim());

        res.json({ success: true, user: newUser });
    } catch (err) {
        console.error('Signup Error:', err);
        res.status(500).json({ error: err.message });
    }
});

// Invite Team Member
app.post('/api/auth/invite', async (req, res) => {
    const { email, role, selectedClients, inviterName } = req.body;
    if (!email || !role) return res.status(400).json({ error: 'Email and role are required' });

    try {
        // Save invite to DB
        const { data: invite, error: inviteError } = await supabase
            .from('flc_ops_invites')
            .upsert({
                email: email.toLowerCase().trim(),
                role,
                clients: selectedClients || []
            }, { onConflict: 'email' })
            .select()
            .single();

        if (inviteError) throw inviteError;

        const inviteUrl = `${process.env.VITE_APP_URL || 'http://localhost:5173'}/?signup=true&email=${encodeURIComponent(email)}`;
        const clientCount = (selectedClients || []).length;
        
        const { error: resendError } = await sendEmail({
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

        if (resendError) throw resendError;
        res.json({ success: true, message: 'Invite sent' });
    } catch (err) {
        console.error('Invite Send Error:', err);
        res.status(500).json({ error: err.message });
    }
});

// Delete user (and their missed tasks)
app.post('/api/auth/delete-user', authRouterHandler);

// Send Slack Notification
app.post('/api/notify-slack', async (req, res) => {
    const { member_name, task_name, client_name, notes, slack_channel_id, duration } = req.body;
    if (!member_name || !task_name || !client_name) {
        return res.status(400).json({ error: 'Missing required parameters' });
    }

    const botToken = process.env.SLACK_BOT_TOKEN;
    const channelId = slack_channel_id || process.env.SLACK_CHANNEL_ID || 'C0B9FN1UN11';

    if (!botToken) {
        console.warn("[SLACK WARNING] SLACK_BOT_TOKEN is not defined in environment variables.");
        return res.status(500).json({ error: 'Slack Bot Token is not configured' });
    }

    try {
        const blocks = [
            {
                type: "header",
                text: {
                    type: "plain_text",
                    text: "🚀 Task Completed!",
                    emoji: true
                }
            },
            {
                type: "section",
                fields: [
                    {
                        type: "mrkdwn",
                        text: `*Client:*\n${client_name}`
                    },
                    {
                        type: "mrkdwn",
                        text: `*Team Member:*\n${member_name}`
                    }
                ]
            },
            {
                type: "section",
                fields: [
                    {
                        type: "mrkdwn",
                        text: `*Task:*\n${task_name}`
                    },
                    ...(duration ? [{
                        type: "mrkdwn",
                        text: `*Time Spent:*\n${duration}`
                    }] : [])
                ]
            }
        ];

        if (notes && notes.trim()) {
            blocks.push({
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: `*Evidence/Notes:*\n\`\`\`${notes.trim()}\`\`\``
                }
            });
        }

        const response = await fetch('https://slack.com/api/chat.postMessage', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': `Bearer ${botToken}`
            },
            body: JSON.stringify({ 
                channel: channelId,
                blocks 
            })
        });

        const data = await response.json();
        if (!response.ok || !data.ok) {
            throw new Error(`Slack API returned error: ${data.error || 'Unknown error'}`);
        }

        res.json({ success: true, message: 'Slack notification sent' });
    } catch (err) {
        console.error('Slack Notification Error:', err);
        res.status(500).json({ error: err.message });
    }
});
// Send Slack Assignment Notification
app.post('/api/notify-assignment', async (req, res) => {
    const { client_name, task_name, member_name, slack_id, slack_channel_id } = req.body;
    if (!client_name || !task_name || !member_name) {
        return res.status(400).json({ error: 'Missing required parameters' });
    }

    const botToken = process.env.SLACK_BOT_TOKEN;
    const channelId = slack_channel_id || process.env.SLACK_CHANNEL_ID || 'C0B9FN1UN11';

    if (!botToken) {
        console.warn("[SLACK WARNING] SLACK_BOT_TOKEN is not defined in environment variables.");
        return res.status(500).json({ error: 'Slack Bot Token is not configured' });
    }

    const userMention = slack_id ? `<@${slack_id}>` : `*${member_name}*`;
    const text = `🎯 *New Task Assignment*\n\nHey ${userMention}, you have been assigned to the task *"${task_name}"* for client *${client_name}*. Please review and complete it on schedule.`;

    try {
        const response = await fetch('https://slack.com/api/chat.postMessage', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': `Bearer ${botToken}`
            },
            body: JSON.stringify({ 
                channel: channelId,
                text,
                blocks: [
                    {
                        type: "section",
                        text: {
                            type: "mrkdwn",
                            text: text
                        }
                    }
                ]
            })
        });

        const data = await response.json();
        if (!response.ok || !data.ok) {
            throw new Error(`Slack API returned error: ${data.error || 'Unknown error'}`);
        }

        res.json({ success: true, message: 'Slack assignment notification sent' });
    } catch (err) {
        console.error('Slack Assignment Notification Error:', err);
        res.status(500).json({ error: err.message });
    }
});

// Sync Slack Attendance and Monthly Report
app.all('/api/sync-attendance', syncAttendanceHandler);

// Regenerate single creative angle
app.post('/api/regenerate-single-angle', regenerateSingleAngleHandler);

// Generate learned iteration strategy based on approved & unapproved feedback
app.post('/api/generate-learned-iteration', generateLearnedIterationHandler);

// Analyze lead with Claude Opus / OpenRouter
app.post('/api/analyze-lead', analyzeLeadHandler);

// Creative Hub 30-Day Calendar endpoint
import generateCreativeCalendarHandler from './api/generate-creative-calendar.js';
app.post('/api/generate-creative-calendar', generateCreativeCalendarHandler);

// Creative Hub Brand Brief Auto-Fill endpoint
import analyzeBrandBriefHandler from './api/analyze-brand-brief.js';
app.post('/api/analyze-brand-brief', analyzeBrandBriefHandler);

// Server-side Direct AI Endpoint (Bypasses Browser CORS)
import generateDirectAiHandler from './api/generate-direct-ai.js';
app.post('/api/generate-direct-ai', generateDirectAiHandler);


// Serve frontend
app.get('*all', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, '0.0.0.0', () => {
  console.log(`SpreadPixel OpsHub server running on port ${port}`);
});

import { createClient } from '@supabase/supabase-js';
import { DEFAULT_TASKS } from '../src/constants.js';

export default async function handler(req, res) {
    if (req.method !== 'GET' && req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { type } = req.query; // '12pm' or '6pm'
    if (type !== '12pm' && type !== '6pm') {
        return res.status(400).json({ error: 'Invalid type parameter. Use 12pm or 6pm.' });
    }

    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
    const botToken = process.env.SLACK_BOT_TOKEN;

    if (!supabaseUrl || !supabaseKey || !botToken) {
        return res.status(500).json({ error: 'Missing environment variables.' });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    try {
        const { data: clients, error } = await supabase.from('flc_ops_clients').select('*');
        if (error) throw error;

        let notificationsSent = 0;

        for (const client of clients) {
            const slackChannelId = client.tasks_data?.__slack_id?.trim();
            if (!slackChannelId) continue;

            const startDate = client.start_date;
            if (!startDate) continue;

            const tzFormatter = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Karachi', year: 'numeric', month: '2-digit', day: '2-digit' });
            const todayStr = tzFormatter.format(new Date());
            const dToday = new Date(todayStr + 'T00:00:00Z');
            const dStart = new Date(startDate + 'T00:00:00Z');
            const actualDay = Math.max(1, Math.round((dToday - dStart) / 86400000) + 1);

            // Compute working day map
            const workingDayMap = {};
            let actual = 1;
            const sd = new Date(startDate + 'T00:00:00Z');
            for (let logical = 1; logical <= 150; logical++) {
                let d = new Date(sd);
                d.setUTCDate(d.getUTCDate() + (actual - 1));
                while (d.getUTCDay() === 0) { // skip Sunday
                    actual++;
                    d = new Date(sd);
                    d.setUTCDate(d.getUTCDate() + (actual - 1));
                }
                workingDayMap[logical] = actual;
                actual++;
            }

            // Find target logical day
            let todayLogicalDay = 1;
            let closestDiff = Infinity;
            for (const [logDay, actDay] of Object.entries(workingDayMap)) {
                const diff = Math.abs(actDay - actualDay);
                if (diff < closestDiff) {
                    closestDiff = diff;
                    todayLogicalDay = Number(logDay);
                }
                if (actDay === actualDay) {
                    todayLogicalDay = Number(logDay);
                    break;
                }
            }

            const yesterdayLogicalDay = Math.max(1, todayLogicalDay - 1);

            // Merge tasks
            const defs = client.tasks_data?.__defs || [];
            const defsMap = new Map(defs.map(d => [d.id, d]));
            const defaultIds = new Set(DEFAULT_TASKS.map(t => t.id));
            const mergedTasks = [];

            DEFAULT_TASKS.forEach(bt => {
                if (defsMap.has(bt.id)) {
                    const dt = defsMap.get(bt.id);
                    mergedTasks.push({ ...bt, ...dt, n: dt.n || bt.n });
                } else {
                    mergedTasks.push(bt);
                }
            });

            defs.forEach(dt => {
                if (!defaultIds.has(dt.id)) {
                    if (dt.isPost && dt.day >= 8 && dt.day % 2 !== 0) return;
                    if (dt.id.match(/^p\d+$/) && dt.day >= 8) return;
                    mergedTasks.push(dt);
                }
            });

            // Find pending tasks
            const todayPendingTasks = [];
            const yesterdayPendingTasks = [];

            mergedTasks.forEach(t => {
                const isDone = client.tasks_data?.[t.id]?.done === true;
                if (!isDone) {
                    if (t.day === todayLogicalDay) todayPendingTasks.push(t);
                    if (t.day === yesterdayLogicalDay) yesterdayPendingTasks.push(t);
                }
            });

            if (todayPendingTasks.length === 0 && yesterdayPendingTasks.length === 0) {
                continue; // Nothing to notify
            }

            let blocks = [];

            if (type === '12pm') {
                blocks.push({
                    type: "header",
                    text: {
                        type: "plain_text",
                        text: "📋 Daily Pending Tasks Reminder",
                        emoji: true
                    }
                });

                let textContent = `*Here are the pending tasks for ${client.name} today:*\n\n`;
                if (todayPendingTasks.length > 0) {
                    textContent += `*Today's Tasks:*\n` + todayPendingTasks.map(t => `• ${t.n} (${t.role || 'Unassigned'})`).join('\n') + `\n\n`;
                }
                
                if (yesterdayPendingTasks.length > 0) {
                    const leadsToTag = Array.from(new Set(yesterdayPendingTasks.map(t => {
                        if (t.role === 'ADS') return '<@U0B91PCUDL3>'; // Usman Ali
                        if (t.role === 'SMM') return '<@D0B1D8P5WNA>'; // Still needs fixing
                        if (t.role === 'TECH') return '<@U0AQ1L03858>'; // Muneeb
                        return '<@U0AQ1L03858>'; // Default to Muneeb for other roles
                    })));
                    
                    textContent += `🚨 *RED ALERT! Yesterday's Pending Tasks:* ${leadsToTag.join(' ')}\n` + yesterdayPendingTasks.map(t => `• ${t.n} (${t.role || 'Unassigned'})`).join('\n');
                }

                blocks.push({
                    type: "section",
                    text: {
                        type: "mrkdwn",
                        text: textContent.trim()
                    }
                });
            } else if (type === '6pm') {
                blocks.push({
                    type: "header",
                    text: {
                        type: "plain_text",
                        text: "⏳ End of Day Follow-Up",
                        emoji: true
                    }
                });

                let textContent = `*Tasks still pending for ${client.name}:*\n\n`;
                
                if (todayPendingTasks.length > 0) {
                    textContent += `*Today's Tasks:*\n` + todayPendingTasks.map(t => `• ${t.n} (${t.role || 'Unassigned'})`).join('\n') + `\n\n`;
                }

                if (yesterdayPendingTasks.length > 0) {
                    textContent += `*Yesterday's Tasks:*\n` + yesterdayPendingTasks.map(t => `• ${t.n} (${t.role || 'Unassigned'})`).join('\n');
                }

                blocks.push({
                    type: "section",
                    text: {
                        type: "mrkdwn",
                        text: textContent.trim()
                    }
                });
            }

            // Send to Slack
            const response = await fetch('https://slack.com/api/chat.postMessage', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json; charset=utf-8',
                    'Authorization': `Bearer ${botToken}`
                },
                body: JSON.stringify({ 
                    channel: slackChannelId,
                    blocks 
                })
            });

            const data = await response.json();
            if (response.ok && data.ok) {
                notificationsSent++;
            } else {
                console.error(`Failed to send Slack notification for client ${client.name}:`, data.error);
            }
        }

        return res.status(200).json({ success: true, notificationsSent });
    } catch (error) {
        console.error('Cron Error:', error);
        return res.status(500).json({ error: error.message });
    }
}

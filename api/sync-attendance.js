import { createClient } from '@supabase/supabase-js';
import fetch from 'node-fetch';

export default async function handler(req, res) {
    if (req.method !== 'GET' && req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { type } = req.query; // 'daily_sync' or 'monthly_report'
    const mode = type || 'daily_sync';

    if (mode !== 'daily_sync' && mode !== 'monthly_report') {
        return res.status(400).json({ error: 'Invalid type parameter. Use daily_sync or monthly_report.' });
    }

    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
    const botToken = process.env.SLACK_BOT_TOKEN;
    const channelId = process.env.SLACK_ATTENDANCE_CHANNEL_ID || process.env.SLACK_CHANNEL_ID || 'C0B9FN1UN11';

    if (!supabaseUrl || !supabaseKey || !botToken) {
        return res.status(500).json({ error: 'Missing environment variables.' });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    try {
        if (mode === 'daily_sync') {
            const result = await doDailySync(supabase, botToken, channelId);
            return res.status(200).json({ success: true, ...result });
        } else if (mode === 'monthly_report') {
            const result = await doMonthlyReport(supabase, botToken, channelId);
            return res.status(200).json({ success: true, ...result });
        }
    } catch (err) {
        console.error('Attendance Sync/Report Error:', err);
        return res.status(500).json({ error: err.message });
    }
}

function getKarachiDateStr(date) {
    const tzString = date.toLocaleString('en-US', { timeZone: 'Asia/Karachi' });
    const localDate = new Date(tzString);
    const y = localDate.getFullYear();
    const m = String(localDate.getMonth() + 1).padStart(2, '0');
    const d = String(localDate.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

async function doDailySync(supabase, botToken, channelId) {
    // 1. Fetch Slack users list to get real names and emails
    const usersRes = await fetch('https://slack.com/api/users.list', {
        headers: {
            'Authorization': `Bearer ${botToken}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
    const usersData = await usersRes.json();
    if (!usersData.ok) {
        throw new Error(`Slack users.list error: ${usersData.error}`);
    }

    const slackUsersMap = new Map();
    usersData.members.forEach(m => {
        slackUsersMap.set(m.id, {
            id: m.id,
            name: m.real_name || m.name,
            email: m.profile?.email || null
        });
    });

    // 2. Fetch history of the channel (getting the last 200 messages)
    const historyRes = await fetch(`https://slack.com/api/conversations.history?channel=${channelId}&limit=200`, {
        headers: {
            'Authorization': `Bearer ${botToken}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
    const historyData = await historyRes.json();
    if (!historyData.ok) {
        throw new Error(`Slack conversations.history error: ${historyData.error}`);
    }

    // 3. Process messages from the last 36 hours to cover today and yesterday's late shifts
    const nowSec = Math.floor(Date.now() / 1000);
    const thirtySixHoursAgo = nowSec - (36 * 60 * 60);

    const relevantMessages = historyData.messages
        .filter(m => !m.subtype && m.user && Number(m.ts) >= thirtySixHoursAgo)
        // Sort chronologically (oldest first)
        .sort((a, b) => Number(a.ts) - Number(b.ts));

    let processedCount = 0;
    let createdRecords = 0;
    let updatedRecords = 0;

    for (const msg of relevantMessages) {
        const text = (msg.text || '').toLowerCase().trim();

        // Keywords detection
        const checkInKeywords = ['check in', 'check-in', 'checkin', 'c/in', 'ci', 'sign in', 'signin', 'sign-in', 'checked in', 'checking in'];
        const checkOutKeywords = ['check out', 'check-out', 'checkout', 'c/out', 'co', 'sign out', 'signout', 'sign-out', 'checked out', 'checking out'];

        const isCheckIn = checkInKeywords.some(keyword => text.includes(keyword)) || text === 'in';
        const isCheckOut = checkOutKeywords.some(keyword => text.includes(keyword)) || text === 'out';

        if (!isCheckIn && !isCheckOut) continue; // Ignore other messages

        const slackUser = slackUsersMap.get(msg.user);
        if (!slackUser) continue;

        // Message timestamp in milliseconds
        const msgTimeMs = Math.floor(Number(msg.ts) * 1000);
        const msgDate = new Date(msgTimeMs);
        const karachiDateStr = getKarachiDateStr(msgDate);
        const timeIsoString = msgDate.toISOString();

        processedCount++;

        // Fetch existing attendance record
        const { data: existing, error: selectError } = await supabase
            .from('flc_ops_attendance')
            .select('*')
            .eq('slack_user_id', slackUser.id)
            .eq('date', karachiDateStr)
            .maybeSingle();

        if (selectError) {
            console.error(`Select error for ${slackUser.name} on ${karachiDateStr}:`, selectError);
            continue;
        }

        if (isCheckIn) {
            // Check-in logic: only set check_in if it doesn't exist yet
            if (!existing) {
                const { error: insertError } = await supabase
                    .from('flc_ops_attendance')
                    .insert({
                        slack_user_id: slackUser.id,
                        email: slackUser.email,
                        name: slackUser.name,
                        date: karachiDateStr,
                        check_in: timeIsoString,
                        check_out: null,
                        working_hours: 0
                    });
                if (insertError) {
                    console.error('Insert check-in error:', insertError);
                } else {
                    createdRecords++;
                }
            }
        } else if (isCheckOut) {
            // Check-out logic: update existing record if present, or create one with only check-out if not
            if (existing) {
                // Compute working hours
                const checkInTimeStr = existing.check_in;
                let workingHours = 0;
                if (checkInTimeStr) {
                    const diffMs = msgTimeMs - new Date(checkInTimeStr).getTime();
                    workingHours = Math.round((diffMs / (1000 * 60 * 60)) * 100) / 100;
                }

                const { error: updateError } = await supabase
                    .from('flc_ops_attendance')
                    .update({
                        check_out: timeIsoString,
                        working_hours: workingHours
                    })
                    .eq('id', existing.id);
                if (updateError) {
                    console.error('Update check-out error:', updateError);
                } else {
                    updatedRecords++;
                }
            } else {
                // If they checked out but have no check-in, we still log it
                const { error: insertError } = await supabase
                    .from('flc_ops_attendance')
                    .insert({
                        slack_user_id: slackUser.id,
                        email: slackUser.email,
                        name: slackUser.name,
                        date: karachiDateStr,
                        check_in: null,
                        check_out: timeIsoString,
                        working_hours: 0
                    });
                if (insertError) {
                    console.error('Insert check-out only error:', insertError);
                } else {
                    createdRecords++;
                }
            }
        }
    }

    return {
        processedMessages: processedCount,
        createdAttendanceRecords: createdRecords,
        updatedAttendanceRecords: updatedRecords
    };
}

async function doMonthlyReport(supabase, botToken, channelId) {
    // 1. Calculate the previous month in Asia/Karachi timezone
    const now = new Date();
    const tzString = now.toLocaleString('en-US', { timeZone: 'Asia/Karachi' });
    const localKarachi = new Date(tzString);
    
    let year = localKarachi.getFullYear();
    let month = localKarachi.getMonth(); // This returns previous month (0-11) because it's 0-indexed and localKarachi is current month
    
    // If localKarachi is January (0), then previous month is December of previous year
    if (month === 0) {
        month = 12;
        year = year - 1;
    }

    const startDateStr = `${year}-${String(month).padStart(2, '0')}-01`;
    const lastDay = new Date(year, month, 0).getDate();
    const endDateStr = `${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;

    // 2. Fetch all attendance records for the previous month
    const { data: attendance, error } = await supabase
        .from('flc_ops_attendance')
        .select('*')
        .gte('date', startDateStr)
        .lte('date', endDateStr);

    if (error) {
        throw error;
    }

    // 3. Calculate target working hours (Monday-Saturday, excluding Sundays)
    let workingDaysCount = 0;
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month - 1, lastDay);
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        if (d.getDay() !== 0) { // 0 is Sunday
            workingDaysCount++;
        }
    }
    const targetHours = workingDaysCount * 8; // 8 hours per day

    // 4. Summarize stats by user
    const userStats = {};
    attendance.forEach(rec => {
        const key = rec.email || rec.slack_user_id;
        if (!userStats[key]) {
            userStats[key] = {
                name: rec.name,
                email: rec.email,
                completedHours: 0,
                daysPresent: 0
            };
        }
        userStats[key].completedHours += Number(rec.working_hours || 0);
        if (rec.check_in) {
            userStats[key].daysPresent += 1;
        }
    });

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const monthName = monthNames[month - 1];

    // 5. Format Slack message Blocks
    const reportHeader = `📅 Attendance & Working Hours Report - *${monthName} ${year}*`;
    
    let textSummary = `*Summary:*\n`;
    textSummary += `• *Total Working Days (excl. Sundays):* ${workingDaysCount} days\n`;
    textSummary += `• *Monthly Target Hours:* ${targetHours} hrs (8 hrs/day)\n\n`;

    const userSummaryList = Object.values(userStats).map(stat => {
        const completed = Math.round(stat.completedHours * 100) / 100;
        const missing = Math.max(0, Math.round((targetHours - completed) * 100) / 100);
        const statusSymbol = missing === 0 ? "✅" : "⚠️";
        const statusText = missing === 0 ? "*Target Completed*" : `*Missing ${missing} hrs*`;
        return `${statusSymbol} *${stat.name}* (${stat.email || 'No Slack Email'})\n   Present: ${stat.daysPresent} days | Completed: ${completed} hrs / Target: ${targetHours} hrs\n   Status: ${statusText}`;
    });

    const blocks = [
        {
            type: "header",
            text: {
                type: "plain_text",
                text: reportHeader,
                emoji: true
            }
        },
        {
            type: "section",
            text: {
                type: "mrkdwn",
                text: textSummary
            }
        }
    ];

    if (userSummaryList.length > 0) {
        for (let i = 0; i < userSummaryList.length; i += 5) {
            const chunk = userSummaryList.slice(i, i + 5).join('\n\n');
            blocks.push({
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: chunk
                }
            });
        }
    } else {
        blocks.push({
            type: "section",
            text: {
                type: "mrkdwn",
                text: "No attendance logs found for this month."
            }
        });
    }

    // 6. Post to Slack
    const slackRes = await fetch('https://slack.com/api/chat.postMessage', {
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

    const slackData = await slackRes.json();
    if (!slackRes.ok || !slackData.ok) {
        throw new Error(`Slack API error: ${slackData.error || 'Unknown error'}`);
    }

    return {
        month: monthName,
        year,
        workingDays: workingDaysCount,
        targetHours,
        usersReported: Object.keys(userStats).length
    };
}

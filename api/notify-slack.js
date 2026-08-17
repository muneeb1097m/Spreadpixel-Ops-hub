export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
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

        res.status(200).json({ success: true, message: 'Slack notification sent' });
    } catch (err) {
        console.error('Slack Notification Error:', err);
        res.status(500).json({ error: err.message });
    }
}

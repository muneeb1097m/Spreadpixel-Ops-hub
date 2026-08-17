export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
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

        res.status(200).json({ success: true, message: 'Slack assignment notification sent' });
    } catch (err) {
        console.error('Slack Assignment Notification Error:', err);
        res.status(500).json({ error: err.message });
    }
}

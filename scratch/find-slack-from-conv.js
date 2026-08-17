import fetch from 'node-fetch';
import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const botToken = process.env.SLACK_BOT_TOKEN;

async function findUserFromConv(channelId) {
    const response = await fetch(`https://slack.com/api/conversations.members?channel=${channelId}`, {
        headers: {
            'Authorization': `Bearer ${botToken}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
    const data = await response.json();
    console.log(`Members of ${channelId}:`, data);
}

findUserFromConv('D0B1D8P5WNA');
findUserFromConv('D0B963S53T8');

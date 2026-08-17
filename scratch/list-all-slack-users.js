import fetch from 'node-fetch';
import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const botToken = process.env.SLACK_BOT_TOKEN;

async function findAllUsers() {
    const response = await fetch('https://slack.com/api/users.list', {
        headers: {
            'Authorization': `Bearer ${botToken}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
    const data = await response.json();
    if (!data.ok) {
        console.error("Error fetching users:", data.error);
        return;
    }

    const members = data.members.map(m => ({ id: m.id, name: m.name, real_name: m.real_name }));
    console.log(JSON.stringify(members, null, 2));
}

findAllUsers();

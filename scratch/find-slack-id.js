import fetch from 'node-fetch';
import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const botToken = process.env.SLACK_BOT_TOKEN;

async function findUser() {
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

    const muneebs = data.members.filter(m => m.name.toLowerCase().includes('muneeb') || (m.real_name && m.real_name.toLowerCase().includes('muneeb')));
    console.log(muneebs.map(m => ({ id: m.id, name: m.name, real_name: m.real_name })));
}

findUser();

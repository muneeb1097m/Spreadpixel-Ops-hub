import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import handler from '../api/cron-tasks.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

const req = {
    method: 'GET',
    query: { type: '12pm' }
};

const res = {
    status: (statusCode) => ({
        json: (data) => {
            console.log(`Status: ${statusCode}`);
            console.log(`Data:`, data);
        }
    })
};

console.log("Running manual cron task execution for '12pm'...");
handler(req, res).catch(console.error);

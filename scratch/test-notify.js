import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

const port = process.env.PORT || 8080;
const url = `http://localhost:${port}/api/notify-assignment`;

const payload = {
  client_name: "Growedgex",
  task_name: "Client Drive Setup",
  member_name: "Atif Naseer",
  slack_id: "U0B983A3266",
  slack_channel_id: "C0B9FN1UN11"
};

async function test() {
  console.log(`Sending test assignment request to ${url}...`);
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    const data = await res.json();
    console.log("Response Status:", res.status);
    console.log("Response Data:", data);
  } catch (err) {
    console.error("Test Request Failed:", err);
  }
}

test();

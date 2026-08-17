import fetch from 'node-fetch';

async function checkModels() {
  try {
    const res = await fetch('https://openrouter.ai/api/v1/models');
    const data = await res.json();
    const claudeModels = data.data.filter(m => m.id.includes('claude') || m.id.includes('fable'));
    console.log('Available Claude / Fable Models on OpenRouter:');
    claudeModels.forEach(m => console.log(`- ${m.id} (${m.name})`));
  } catch (err) {
    console.error(err);
  }
}

checkModels();

import dotenv from 'dotenv';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Force re-read .env file from disk so new keys are picked up instantly without server restart
  dotenv.config({ override: true });

  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const anthropicKey = process.env.ANTHROPIC_API_KEY || process.env.VITE_ANTHROPIC_API_KEY;
    const openRouterKey = process.env.OPENROUTER_API_KEY || process.env.FABBLE_API_KEY || process.env.VITE_OPENROUTER_API_KEY;

    let responseText = null;
    let fallbackNotice = null;

    // 1. Try Official Anthropic API
    if (anthropicKey) {
      const modelsToTry = [
        { id: 'claude-opus-5', name: 'Claude Opus 5' },
        { id: 'claude-3-5-sonnet-20241022', name: 'Claude 3.5 Sonnet' },
        { id: 'claude-3-opus-20240229', name: 'Claude 3 Opus' }
      ];
      for (const model of modelsToTry) {
        try {
          const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-api-key': anthropicKey,
              'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
              model: model.id,
              max_tokens: 4000,
              system: 'You output strictly raw valid JSON matching the requested schema. Return ONLY valid JSON, do not wrap in markdown tags.',
              messages: [{ role: 'user', content: prompt }]
            })
          });

          if (anthropicRes.ok) {
            const data = await anthropicRes.json();
            responseText = data.content?.[0]?.text || '';
            if (responseText) {
              if (model.id !== 'claude-opus-5') {
                fallbackNotice = `⚠️ Primary model (Claude Opus 5) failed. Switched to fallback model: ${model.name}.`;
              }
              break;
            }
          } else {
            const errData = await anthropicRes.json().catch(() => ({}));
            console.warn(`[generate-direct-ai] Anthropic model ${model.id} failed:`, errData.error?.message || anthropicRes.status);
          }
        } catch (e) {
          console.warn(`[generate-direct-ai] Anthropic model ${model.id} error:`, e.message);
        }
      }
    }

    // 2. Try OpenRouter as fallback
    if (!responseText && openRouterKey) {
      const openRouterModels = [
        { id: 'anthropic/claude-opus-5', name: 'Claude Opus 5' },
        { id: 'anthropic/claude-3-opus', name: 'Claude 3 Opus' },
        { id: 'anthropic/claude-3.5-sonnet', name: 'Claude 3.5 Sonnet' }
      ];
      for (const model of openRouterModels) {
        try {
          const openRouterRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${openRouterKey}`,
              'HTTP-Referer': 'https://flc-dashboard.com',
              'X-Title': 'FLC Direct AI Generator'
            },
            body: JSON.stringify({
              model: model.id,
              max_tokens: 4000,
              temperature: 0.3,
              messages: [
                { role: 'system', content: 'You output strictly raw valid JSON matching the requested schema.' },
                { role: 'user', content: prompt }
              ]
            })
          });

          if (openRouterRes.ok) {
            const data = await openRouterRes.json();
            responseText = data.choices?.[0]?.message?.content || '';
            if (responseText) {
              if (model.id !== 'anthropic/claude-opus-5') {
                fallbackNotice = `⚠️ Primary model (Claude Opus 5) failed. Switched to fallback model: ${model.name}.`;
              }
              break;
            }
          }
        } catch (e) {
          console.warn(`[generate-direct-ai] OpenRouter fallback failed:`, e.message);
        }
      }
    }

    if (!responseText) {
      return res.status(500).json({ error: 'AI generation failed. Please check your ANTHROPIC_API_KEY in .env file.' });
    }

    let cleanText = responseText.trim();
    if (cleanText.startsWith('```json')) cleanText = cleanText.substring(7);
    if (cleanText.startsWith('```')) cleanText = cleanText.substring(3);
    if (cleanText.endsWith('```')) cleanText = cleanText.substring(0, cleanText.length - 3);

    return res.status(200).json({ text: cleanText.trim(), fallbackNotice });

  } catch (err) {
    console.error('[generate-direct-ai] Error:', err);
    return res.status(500).json({ error: err.message || 'Direct AI generation failed' });
  }
}

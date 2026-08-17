async function fetchWebsiteText(url) {
  if (!url || typeof url !== 'string') return '';
  let formattedUrl = url.trim();
  if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
    formattedUrl = 'https://' + formattedUrl;
  }
  try {
    const res = await fetch(formattedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      signal: AbortSignal.timeout(6000)
    });
    if (!res.ok) return '';
    const html = await res.text();
    const clean = html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    return clean.substring(0, 8000);
  } catch (err) {
    console.warn(`[fetchWebsiteText] Failed to fetch ${url}:`, err.message);
    return '';
  }
}

import dotenv from 'dotenv';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Force re-read .env file from disk so new keys are picked up instantly without server restart
  dotenv.config({ override: true });

  try {
    const { clientName, driveLink, website, notes } = req.body;

    const anthropicKey = process.env.ANTHROPIC_API_KEY || process.env.VITE_ANTHROPIC_API_KEY;
    const openRouterKey = process.env.OPENROUTER_API_KEY || process.env.FABBLE_API_KEY || process.env.VITE_OPENROUTER_API_KEY;

    if (!anthropicKey && !openRouterKey) {
      return res.status(500).json({ error: 'No AI API Key (ANTHROPIC_API_KEY or OPENROUTER_API_KEY) is configured on the server.' });
    }

    // Scrape live website content if URL is provided
    let websiteContent = '';
    if (website) {
      websiteContent = await fetchWebsiteText(website);
    }

    console.log(`[analyze-brand-brief] Analyzing brief for "${clientName}". Website: "${website}". Notes length: ${notes?.length || 0}`);

    const prompt = `You are an expert advertising creative director and Meta Ads brand strategist. Analyze the following client onboarding intelligence, live website content, and brand notes to extract and generate a structured Brand Brief for a 30-day Meta Ads Content Strategy.

Client Information:
- Client Name: ${clientName || 'Unknown'}
- Website URL: ${website || 'Not provided'}
- Scraped Live Website Content:
"""
${websiteContent || 'No live website content fetched.'}
"""
- Client Onboarding / Standard Notes:
"""
${notes || 'No extra notes provided.'}
"""

CRITICAL ACCURACY INSTRUCTIONS:
1. Strictly base the client's industry, core offer, target personas, and proof on the actual provided notes and website content.
2. DO NOT fill fields with meta-disclaimers like "Not specified in intel" or "Placeholder to validate". If a field cannot be inferred, provide a clean, professional, concise 1-sentence value relevant to the client's business name.
3. If the client is an AI Automation Agency, AI Software, SaaS, B2B Service, or specific niche, accurately reflect that exact offer and target audience across all JSON fields.
4. CRITICAL PUNCTUATION RULE: Absolutely DO NOT use em-dashes (—) or en-dashes (–) anywhere in your output. Use standard hyphens (-), commas (,), or periods (.) instead.

Return ONLY a valid JSON object matching this schema (do not wrap in markdown code blocks or add explanations, return pure JSON):
{
  "client_name": "Exact Client Name & Industry",
  "core_offer": "Concise high-value core offer",
  "persona_1": "Primary ideal customer avatar/persona",
  "core_proof": "Key proof point or authority metric",
  "cta": "Direct call to action",
  "brand_colors": "Dominant brand hex colors (e.g. #7C3AED, #0F172A, #059669)",
  "brand_niche": "Exact industry or niche",
  "brand_logo_position": "Top-Left",
  "brand_platform": "Meta Ads Feed & Stories"
}
`;

    let responseText = null;
    let fallbackNotice = null;

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
            console.error(`[analyze-brand-brief] Anthropic API HTTP ${anthropicRes.status} (${model.id}):`, errData);
          }
        } catch (e) {
          console.warn(`[analyze-brand-brief] Anthropic error ${model.id}:`, e.message);
        }
      }
    }

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
              'X-Title': 'FLC Brand Brief Analyzer'
            },
            body: JSON.stringify({
              model: model.id,
              max_tokens: 8192,
              temperature: 0.3,
              messages: [
                { role: 'system', content: 'You output strictly raw valid JSON matching the requested schema.' },
                { role: 'user', content: prompt }
              ]
            })
          });

          if (openRouterRes.ok) {
            const data = await openRouterRes.json();
            const choice = data.choices?.[0];
            let rawContent = choice?.message?.content || choice?.message?.reasoning || choice?.text;

            if (Array.isArray(rawContent)) {
              rawContent = rawContent.map(part => (typeof part === 'string' ? part : part.text || part.content || '')).join('\n');
            } else if (typeof rawContent === 'object' && rawContent !== null) {
              rawContent = rawContent.text || rawContent.content || JSON.stringify(rawContent);
            }

            responseText = String(rawContent || '').trim();
            if (responseText) {
              if (model.id !== 'anthropic/claude-opus-5') {
                fallbackNotice = `⚠️ Primary model (Claude Opus 5) failed. Switched to fallback model: ${model.name}.`;
              }
              break;
            }
          }
        } catch (e) {
          console.warn(`[analyze-brand-brief] OpenRouter error ${model.id}:`, e.message);
        }
      }
    }

    if (!responseText) {
      throw new Error('AI Brand Brief Analysis request failed. Please check your ANTHROPIC_API_KEY or OPENROUTER_API_KEY in .env file.');
    }

    function safeParseJson(rawText) {
      if (!rawText || typeof rawText !== 'string') return null;
      let cleanText = rawText.trim()
        .replace(/<thought>[\s\S]*?<\/thought>/gi, '')
        .replace(/<reasoning>[\s\S]*?<\/reasoning>/gi, '')
        .trim();

      if (cleanText.startsWith('```')) {
        cleanText = cleanText.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/, '').trim();
      }

      try { return JSON.parse(cleanText); } catch (e) {}

      const startObj = cleanText.indexOf('{');
      const endObj = cleanText.lastIndexOf('}');
      if (startObj !== -1 && endObj > startObj) {
        try { return JSON.parse(cleanText.substring(startObj, endObj + 1)); } catch (e2) {}
      }
      return null;
    }

    const briefData = safeParseJson(responseText);
    if (!briefData) {
      throw new Error('AI returned invalid format for brand brief.');
    }
    return res.status(200).json({ brief: briefData, fallbackNotice });

  } catch (err) {
    console.error('[analyze-brand-brief] Error:', err);
    return res.status(500).json({ error: err.message || 'Failed to analyze client brand brief' });
  }
}

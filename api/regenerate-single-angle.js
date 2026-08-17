export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      clientName,
      coreOffer,
      persona,
      awarenessLevel,
      angleName,
      currentHeadline,
      currentVisualDirection,
      improvementFeedback,
      brandColors
    } = req.body;

    if (!clientName || !improvementFeedback) {
      return res.status(400).json({ error: 'Client name and improvement feedback are required.' });
    }

    const anthropicKey = process.env.ANTHROPIC_API_KEY || process.env.VITE_ANTHROPIC_API_KEY;
    const openRouterKey = process.env.OPENROUTER_API_KEY || process.env.FABBLE_API_KEY || process.env.VITE_OPENROUTER_API_KEY;

    if (!anthropicKey && !openRouterKey) {
      return res.status(500).json({
        error: 'Neither ANTHROPIC_API_KEY nor OPENROUTER_API_KEY is configured on the server.'
      });
    }

    const colorsStr = brandColors || '#7C3AED, #0F172A, #059669';

    const systemPrompt = `You are an expert advertising creative director, B2B marketing designer, and conversion visual strategist.
Your task is to REGENERATE and IMPROVE a single Meta Ad creative strategy angle based on specific feedback from the user.

Client & Brand Context:
* Client Name: ${clientName}
* Core Offer: ${coreOffer || 'B2B Services'}
* Target Persona: ${persona || 'Target Audience'}
* Awareness Level: ${awarenessLevel || 'Problem Aware'}
* Strategic Angle Name: ${angleName || 'Strategic Angle'}
* Brand Colors: ${colorsStr}

Current Content to Improve:
* Headline Text: "${currentHeadline || ''}"
* Visual Direction: "${currentVisualDirection || ''}"

USER'S SPECIFIC IMPROVEMENT FEEDBACK:
"""
${improvementFeedback}
"""

Instructions:
1. Re-write the graphic headline text ("headlineText") incorporating the feedback. "headlineText" MUST BE A CREATIVE, CUSTOMER-FACING ADVERTISEMENT GRAPHIC HEADLINE (STRICTLY 6 TO 10 WORDS LONG).
   - ABSOLUTE PROHIBITION RULE: DO NOT copy internal framework category names, strategy names, or placeholders (such as "Alternative to Traditional Path", "Cost of Inaction", "Unaware", "Solution Aware", or "Problem Aware") into "headlineText"!
2. Re-write the visual direction prompt ("visualDirection") for image generators (Midjourney / DALL-E / FLUX) strictly formatted for a 1:1 Square Feed Graphic (1080x1080). Focus 95% on visual elements, setting, subjects, composition, 3D render depth, and brand colors.
   - ABSOLUTE PROHIBITION RULE: DO NOT include long paragraphs, bullet points, offer terms, or flyer copy on the image graphic. Keep image text limited to AT MOST one short 3-5 word primary headline. Absolutely NO raw base64 data strings.
3. Re-write all 5 Meta ad primary copy variations ("copyVariations": directBenefit, problemPas, storyIdentity, proofAuthority, objectionFaq), making them punchy, 70-120+ words each, strictly adhering to the user's feedback.
   - BACKGROUND CONTEXT ONLY RULE: All persona descriptions, demographic traits, and prompt instructions provided here are internal background intelligence ONLY. DO NOT output persona names, demographic tags, age/location data, or internal prompt labels (such as "Persona Name:", "Demographics:", "Emotional Problem:", "Persona Profile Attribute:") inside any copy string! Output MUST be 100% clean, ready-to-publish customer-facing ad copy (Hook, Body with paragraph breaks, Value Prop, CTA).
4. CRITICAL PUNCTUATION RULE: Do NOT use em-dashes (—) or en-dashes (–). Use standard hyphens (-) or commas.

Return ONLY a valid JSON object matching this schema (no markdown code block wrapping, just raw JSON):
{
  "headlineText": "Exact 6 to 10 word punchy external graphic headline text for customer",
  "visualDirection": "Act as an expert advertising creative director... Updated visual direction based on feedback...",
  "copyVariations": {
    "directBenefit": "Full 70-120+ word Meta ad copy...",
    "problemPas": "Full 70-120+ word Meta ad copy...",
    "storyIdentity": "Full 70-120+ word Meta ad copy...",
    "proofAuthority": "Full 70-120+ word Meta ad copy...",
    "objectionFaq": "Full 70-120+ word Meta ad copy..."
  }
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
              messages: [{ role: 'user', content: systemPrompt }]
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
          }
        } catch (e) {
          console.warn(`[regenerate-single-angle] Anthropic error ${model.id}:`, e.message);
        }
      }
    }

    if (!responseText && openRouterKey) {
      const openRouterModels = [
        { id: 'anthropic/claude-opus-5', name: 'Claude Opus 5' },
        { id: 'anthropic/claude-3-opus', name: 'Claude 3 Opus' },
        { id: 'anthropic/claude-3.5-sonnet', name: 'Claude 3.5 Sonnet' }
      ];
      let lastError = null;

      for (const model of openRouterModels) {
        try {
          const openRouterRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${openRouterKey}`,
              'HTTP-Referer': 'https://flc-dashboard.com',
              'X-Title': 'FLC Creative Angle Regeneration'
            },
            body: JSON.stringify({
              model: model.id,
              max_tokens: 8192,
              temperature: 0.3,
              messages: [
                { role: 'system', content: 'You output strictly raw valid JSON matching the requested schema.' },
                { role: 'user', content: systemPrompt }
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
          } else {
            const errData = await openRouterRes.json().catch(() => ({}));
            lastError = errData.error?.message || `HTTP ${openRouterRes.status}`;
            console.warn(`[regenerate-single-angle] OpenRouter error ${model.id}:`, openRouterRes.status, errData);
          }
        } catch (e) {
          lastError = e.message;
          console.warn(`[regenerate-single-angle] OpenRouter error ${model.id}:`, e.message);
        }
      }

      if (!responseText) {
        throw new Error(`AI Regeneration failed: ${lastError || 'Empty response'}`);
      }
    }

    if (!responseText) {
      throw new Error('AI Fable 5 Regeneration failed. Check OpenRouter API key configuration.');
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

    const updatedAngle = safeParseJson(responseText);
    if (!updatedAngle) {
      throw new Error('AI returned invalid format for regenerated angle.');
    }

    const sanitizeEmDashes = (obj) => {
      if (typeof obj === 'string') {
        return obj.replace(/\s*[\u2014\u2013—–]\s*/g, ' - ').replace(/[\u2014\u2013—–]/g, ' - ');
      }
      if (Array.isArray(obj)) return obj.map(sanitizeEmDashes);
      if (obj && typeof obj === 'object') {
        const cleaned = {};
        for (const k of Object.keys(obj)) {
          cleaned[k] = sanitizeEmDashes(obj[k]);
        }
        return cleaned;
      }
      return obj;
    };

    return res.status(200).json({ updatedAngle: sanitizeEmDashes(updatedAngle), fallbackNotice });

  } catch (err) {
    console.error('[regenerate-single-angle] Error:', err);
    return res.status(500).json({ error: err.message || 'Single angle regeneration failed' });
  }
}

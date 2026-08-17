export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { 
      client_name, 
      core_offer, 
      personas: inputPersonas, 
      persona_1, 
      persona_2, 
      core_proof, 
      cta,
      brand_colors,
      brand_logo_url,
      brand_niche,
      brand_logo_position,
      brand_platform,
      client_history = []
    } = req.body;

    const personasList = Array.isArray(inputPersonas) && inputPersonas.length > 0 
      ? inputPersonas 
      : [persona_1, persona_2].filter(Boolean);

    const p1 = personasList[0] || persona_1 || 'Primary Persona';
    const p2 = personasList[1] || persona_2 || 'Secondary Persona';

    if (!client_name || !core_offer || (!p1 && !p2)) {
      return res.status(400).json({ error: 'Client name, core offer, and at least 1 Target Persona are required.' });
    }

    const openRouterKey = process.env.OPENROUTER_API_KEY || process.env.FABBLE_API_KEY || process.env.VITE_OPENROUTER_API_KEY;

    if (!openRouterKey) {
      return res.status(500).json({
        error: 'OPENROUTER_API_KEY / FABBLE_API_KEY is not configured on the server. Please add your OpenRouter key to generate content with Fable 5.'
      });
    }

    const personaSummary = personasList.map((p, i) => `Persona ${i + 1}: ${p}`).join(' | ');
    const colorsStr = brand_colors || '#7C3AED, #0F172A, #059669';

    function safeParseJson(responseText) {
      if (!responseText || typeof responseText !== 'string') return null;

      let cleanText = responseText.trim();
      cleanText = cleanText
        .replace(/<thought>[\s\S]*?<\/thought>/gi, '')
        .replace(/<reasoning>[\s\S]*?<\/reasoning>/gi, '')
        .trim();

      if (cleanText.startsWith('```')) {
        cleanText = cleanText.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/, '').trim();
      }

      // 1. Direct JSON parse
      try {
        return JSON.parse(cleanText);
      } catch (e) {}

      // 2. Fast 1-pass slice between first '[' and last ']'
      const startIdx = cleanText.indexOf('[');
      const endIdx = cleanText.lastIndexOf(']');
      if (startIdx !== -1 && endIdx > startIdx) {
        const slice = cleanText.substring(startIdx, endIdx + 1);
        try {
          return JSON.parse(slice);
        } catch (e2) {
          try {
            const sanitized = slice.replace(/(?<=:\s*"[^"]*)\n(?=[^"]*")/g, '\\n');
            return JSON.parse(sanitized);
          } catch (e3) {}
        }
      }

      // 3. Fast 1-pass slice between first '{' and last '}'
      const startObj = cleanText.indexOf('{');
      const endObj = cleanText.lastIndexOf('}');
      if (startObj !== -1 && endObj > startObj) {
        const sliceObj = cleanText.substring(startObj, endObj + 1);
        try {
          return JSON.parse(sliceObj);
        } catch (e4) {}
      }

      // 4. Item regex match fallback
      try {
        const itemMatches = cleanText.match(/\{[\s\S]*?"day"\s*:\s*\d+[\s\S]*?\}/g) || [];
        const items = [];
        for (const itemStr of itemMatches) {
          try {
            items.push(JSON.parse(itemStr));
          } catch (err) {}
        }
        if (items.length > 0) return items;
      } catch (e5) {}

      return null;
    }

    let fallbackNotice = null;

    async function executePrompt(promptText) {
      let responseText = null;
      let lastError = null;

      const modelsToTry = [
        { id: 'anthropic/claude-opus-5', name: 'Claude Opus 5' },
        { id: 'anthropic/claude-3-opus', name: 'Claude 3 Opus' },
        { id: 'anthropic/claude-3.5-sonnet', name: 'Claude 3.5 Sonnet' }
      ];

      for (const model of modelsToTry) {
        try {
          const reqBody = {
            model: model.id,
            max_tokens: 8192,
            temperature: 0.3,
            messages: [
              { role: 'system', content: 'You are a precise JSON generation API. Output strictly raw valid JSON matching the requested schema. Do not include introductory text, explanations, markdown code blocks, or thoughts.' },
              { role: 'user', content: promptText }
            ]
          };

          const openRouterRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${openRouterKey}`,
              'HTTP-Referer': 'https://flc-dashboard.com',
              'X-Title': 'FLC Ops Dashboard Creative Hub'
            },
            body: JSON.stringify(reqBody)
          });

          if (openRouterRes.ok) {
            const openRouterData = await openRouterRes.json();
            const choice = openRouterData.choices?.[0];
            let rawContent = choice?.message?.content || choice?.message?.reasoning || choice?.text;

            if (Array.isArray(rawContent)) {
              rawContent = rawContent.map(part => (typeof part === 'string' ? part : part.text || part.content || '')).join('\n');
            } else if (typeof rawContent === 'object' && rawContent !== null) {
              rawContent = rawContent.text || rawContent.content || JSON.stringify(rawContent);
            }

            responseText = String(rawContent || '').trim();
            if (responseText) {
              if (model.id !== 'anthropic/claude-opus-5') {
                fallbackNotice = `⚠️ Primary model (Claude Opus 5) failed or rate-limited. Switched to fallback model: ${model.name}.`;
              }
              break;
            }
          } else {
            const errData = await openRouterRes.json().catch(() => ({}));
            lastError = errData.error?.message || `OpenRouter HTTP ${openRouterRes.status}`;
            console.warn(`[CreativeHub API] OpenRouter model ${model.id} error:`, openRouterRes.status, errData);
          }
        } catch (e) {
          lastError = e.message;
          console.warn(`[CreativeHub API] OpenRouter model ${model.id} fetch exception:`, e.message);
        }
      }

      if (!responseText) {
        throw new Error(`OpenRouter Claude Opus generation failed: ${lastError || 'Empty content'}`);
      }

      const parsedData = safeParseJson(responseText);
      if (!parsedData) {
        console.error('[CreativeHub API] JSON parsing failed for raw response:', responseText.substring(0, 300));
        throw new Error('Failed to parse valid JSON from Claude Opus response.');
      }

      const items = Array.isArray(parsedData) ? parsedData : (parsedData.calendar || parsedData.angles || parsedData.data || []);
      return items;
    }

    const approvedHistory = Array.isArray(client_history) ? client_history.filter(i => i.reviewStatus === 'approved') : [];
    const unapprovedHistory = Array.isArray(client_history) ? client_history.filter(i => i.reviewStatus === 'unapproved') : [];
    const teamNotesHistory = Array.isArray(client_history) ? client_history.filter(i => i.teamNotes && i.teamNotes.trim()) : [];

    const approvedSummary = approvedHistory.length > 0
      ? approvedHistory.map(a => `* APPROVED WINNER: Angle "${a.angleName || 'Strategy'}" | Headline: "${a.headlineText || 'Headline'}"`).join('\n')
      : 'No approved winning angles yet.';
    const unapprovedSummary = unapprovedHistory.length > 0
      ? unapprovedHistory.map(a => `* REJECTED ANGLE: "${a.angleName || 'Strategy'}" | Headline: "${a.headlineText || 'Headline'}" (DO NOT REPEAT)`).join('\n')
      : 'No unapproved angles yet.';
    const teamNotesSummary = teamNotesHistory.length > 0
      ? teamNotesHistory.map(a => `* TEAM FEEDBACK on "${a.angleName || 'Angle'}": "${a.teamNotes.trim()}"`).join('\n')
      : 'No specific team notes recorded.';

    const buildPromptForBatch = (batchPersona, startDay, endDay, count) => `You are an expert advertising creative director executing the FLC Meta Ads system. Generate days ${startDay} through ${endDay} (exactly ${count} distinct ad packages) for Persona: "${batchPersona}".

Client & Offer Intel:
* Client Name: ${client_name}
* Core Offer: ${core_offer}
* Target Persona: ${batchPersona}
* Proof: ${core_proof || 'Case studies & metrics'}
* CTA: ${cta || 'Book a Strategy Call'}
* Brand Colors: ${colorsStr}
* Target Platform & Format: STRICTLY 1:1 Square Feed Graphic (1080x1080)

CLIENT SPECIFIC HISTORICAL PREFERENCE DATASET (Learned from previous approvals/rejections for ${client_name}):
✅ APPROVED WINNING PATTERNS (Replicate these tone, hook styles & visual concepts):
${approvedSummary}

❌ UNAPPROVED / FORBIDDEN PATTERNS (ABSOLUTELY DO NOT REPEAT THESE TOPICS OR WEAK HOOKS):
${unapprovedSummary}

📝 SPECIFIC TEAM IMPROVEMENT DIRECTIVES:
${teamNotesSummary}

Rules:
1. Generate exactly ${count} distinct ad packages starting from day ${startDay} to day ${endDay} progressing logically through the 5 FLC awareness levels (Unaware, Problem Aware, Solution Aware, Offer Aware, Most Aware).
2. GRAPHIC HEADLINE TEXT ("headlineText"): MUST BE A CREATIVE, CUSTOMER-FACING ADVERTISEMENT GRAPHIC HEADLINE (STRICTLY 6 TO 10 WORDS LONG).
   - Examples of great headlines: "Your Best Customer Never Saw You Coming", "Your Customers Scroll Past You Every Single Day", "Stop Wasting 20 Hours Every Single Week", "Waiting Has A Massive Hidden Price Tag".
   - ABSOLUTE PROHIBITION RULE: DO NOT copy internal framework category names, strategy names, or placeholders (such as "Alternative to Traditional Path", "Cost of Inaction", "Unaware", "Solution Aware", or "Problem Aware") into "headlineText"! "headlineText" MUST be 100% original, punchy, external customer-facing headline text written directly to hook ${batchPersona}.
3. VISUAL-FIRST IMAGE GENERATION PROMPT ("visualDirection"): MUST be a visual-focused 3D / photorealistic scene prompt for image generators (Midjourney / DALL-E / FLUX). Focus 95% on visual elements, setting, subjects, composition, and brand colors.
   - ABSOLUTE PROHIBITION RULE: DO NOT include long paragraphs, bullet points, offer terms, or flyer text on the image graphic. Keep image text limited to AT MOST one short 3-5 word primary headline. Absolutely NO raw base64 data strings.
4. META AD PRIMARY COPY VARIATIONS ("copyVariations"): Output 5 full-length (70-120+ words each) customer-facing Meta Ad primary text captions (directBenefit, problemPas, storyIdentity, proofAuthority, objectionFaq) with clean paragraph spacing.
   - BACKGROUND CONTEXT ONLY RULE: All persona descriptions, demographic traits, and prompt instructions provided here are internal background intelligence ONLY. DO NOT output persona names, demographic tags, age/location data, or internal prompt labels (such as "Persona Name:", "Demographics:", "Emotional Problem:", "Persona Profile Attribute:") inside any copy string! Output MUST be 100% clean, ready-to-publish customer-facing ad copy (Hook, Body with paragraph breaks, Value Prop, CTA).
5. CRITICAL PUNCTUATION RULE: Absolutely DO NOT use em-dashes (—) or en-dashes (–). Use standard hyphens (-) or commas.

Output strictly in valid raw JSON array matching this schema for ${count} items:
[
  {
    "day": ${startDay},
    "persona": "${batchPersona}",
    "awarenessLevel": "Unaware",
    "angleName": "Name of Strategic Angle (Tailored for ${client_name})",
    "visualDirection": "Visual direction framework...",
    "headlineText": "Exact 6 to 10 word punchy external graphic headline text for customer",
    "copyVariations": {
      "directBenefit": "Ready-to-publish Meta Ad Primary Text caption with Hook, Body paragraphs, Offer & CTA...",
      "problemPas": "Ready-to-publish Meta Ad Primary Text caption with Hook, Body paragraphs, Offer & CTA...",
      "storyIdentity": "Ready-to-publish Meta Ad Primary Text caption with Hook, Body paragraphs, Offer & CTA...",
      "proofAuthority": "Ready-to-publish Meta Ad Primary Text caption with Hook, Body paragraphs, Offer & CTA...",
      "objectionFaq": "Ready-to-publish Meta Ad Primary Text caption with Hook, Body paragraphs, Offer & CTA..."
    }
  }
]`;

    // Generate 60 days using 12 micro-batches of 5 items each to respect Claude's 4096 token output limit
    const batchPromises = [
      executePrompt(buildPromptForBatch(p1, 1, 5, 5)).catch(e => { console.warn('B1 error:', e.message); return []; }),
      executePrompt(buildPromptForBatch(p1, 6, 10, 5)).catch(e => { console.warn('B2 error:', e.message); return []; }),
      executePrompt(buildPromptForBatch(p1, 11, 15, 5)).catch(e => { console.warn('B3 error:', e.message); return []; }),
      executePrompt(buildPromptForBatch(p1, 16, 20, 5)).catch(e => { console.warn('B4 error:', e.message); return []; }),
      executePrompt(buildPromptForBatch(p1, 21, 25, 5)).catch(e => { console.warn('B5 error:', e.message); return []; }),
      executePrompt(buildPromptForBatch(p1, 26, 30, 5)).catch(e => { console.warn('B6 error:', e.message); return []; }),
      
      executePrompt(buildPromptForBatch(p2, 31, 35, 5)).catch(e => { console.warn('B7 error:', e.message); return []; }),
      executePrompt(buildPromptForBatch(p2, 36, 40, 5)).catch(e => { console.warn('B8 error:', e.message); return []; }),
      executePrompt(buildPromptForBatch(p2, 41, 45, 5)).catch(e => { console.warn('B9 error:', e.message); return []; }),
      executePrompt(buildPromptForBatch(p2, 46, 50, 5)).catch(e => { console.warn('B10 error:', e.message); return []; }),
      executePrompt(buildPromptForBatch(p2, 51, 55, 5)).catch(e => { console.warn('B11 error:', e.message); return []; }),
      executePrompt(buildPromptForBatch(p2, 56, 60, 5)).catch(e => { console.warn('B12 error:', e.message); return []; })
    ];

    // Parallel execution across 12 micro-batches
    const batches = await Promise.all(batchPromises);
    const combinedCalendar = batches.flat();

    // Remove all em-dashes (—) and en-dashes (–) from generated content
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

    const sanitizedCalendar = sanitizeEmDashes(combinedCalendar);
    return res.status(200).json({ calendar: sanitizedCalendar, fallbackNotice });

  } catch (err) {
    console.error('[generate-creative-calendar] Error:', err);
    return res.status(500).json({ error: err.message || 'Failed to generate 60-day content calendar' });
  }
}

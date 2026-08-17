export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      client_name,
      core_offer,
      brand_colors,
      current_calendar,
      target_personas,
      new_persona_prompt,
      iteration_notes,
      version_number = 2
    } = req.body;

    if (!client_name || !current_calendar || !Array.isArray(current_calendar)) {
      return res.status(400).json({ error: 'Client name and previous calendar history are required.' });
    }

    const openRouterKey = process.env.OPENROUTER_API_KEY || process.env.FABBLE_API_KEY || process.env.VITE_OPENROUTER_API_KEY;

    if (!openRouterKey) {
      return res.status(500).json({
        error: 'OPENROUTER_API_KEY / FABBLE_API_KEY is not configured. Please add your OpenRouter key for Fable 5.'
      });
    }

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
              { role: 'system', content: 'You are a precise JSON generation API. Output strictly raw valid JSON matching the requested schema. No markdown wrappers.' },
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
                fallbackNotice = `⚠️ Primary model (Claude Opus 5) failed. Switched to fallback model: ${model.name}.`;
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
        throw new Error(`OpenRouter iteration generation failed: ${lastError || 'Empty content'}`);
      }

      const parsedData = safeParseJson(responseText);
      if (!parsedData) {
        throw new Error('Failed to parse valid JSON from generation response.');
      }

      const items = Array.isArray(parsedData) ? parsedData : (parsedData.calendar || parsedData.angles || parsedData.data || []);
      return items;
    }

    // Extract Approved, Unapproved, Needs Improvement, and Team Performance Notes intelligence
    const approvedAngles = current_calendar.filter(c => c.reviewStatus === 'approved');
    const unapprovedAngles = current_calendar.filter(c => c.reviewStatus === 'unapproved');
    const improvementAngles = current_calendar.filter(c => c.reviewStatus === 'needs_improvement' || c.lastFeedback);
    const teamNotesAngles = current_calendar.filter(c => c.teamNotes && String(c.teamNotes).trim().length > 0);

    const approvedSummary = approvedAngles.length > 0
      ? approvedAngles.map(a => `- Angle: "${a.angleName}" | Persona: "${a.persona}" | Headline: "${a.headlineText}"${a.teamNotes ? ` | Team Note: "${a.teamNotes}"` : ''} | Visual: "${a.visualDirection?.substring(0, 120)}..."`).join('\n')
      : 'None approved yet (use general best practices).';

    const unapprovedSummary = unapprovedAngles.length > 0
      ? unapprovedAngles.map(a => `- Angle: "${a.angleName}" | Persona: "${a.persona}" | Headline: "${a.headlineText}"${a.teamNotes ? ` | Team Note: "${a.teamNotes}"` : ''} | Reason: REJECTED by team`).join('\n')
      : 'None rejected.';

    const improvementSummary = improvementAngles.length > 0
      ? improvementAngles.map(a => `- Angle: "${a.angleName}" | Feedback: "${a.lastFeedback || 'Needs revision'}"`).join('\n')
      : 'None flagged.';

    const teamNotesSummary = teamNotesAngles.length > 0
      ? teamNotesAngles.map(a => `* Angle "${a.angleName}" (${a.reviewStatus || 'reviewed'}): "${a.teamNotes.trim()}"`).join('\n')
      : 'No specific team notes recorded.';

    const personasList = Array.isArray(target_personas) && target_personas.length > 0
      ? target_personas
      : ['Primary Persona', 'Secondary Persona'];

    const colorsStr = brand_colors || '#7C3AED, #0F172A, #059669';

    const systemPrompt = `You are an expert advertising creative director, B2B marketing designer, and conversion visual strategist.
Your task is to generate VERSION ${version_number} of a 60-day Meta Ads Content Strategy (60 distinct ad packages) by LEARNING FROM THE APPROVAL, REJECTION, & TEAM PERFORMANCE NOTES of Version 1.

Client & Core Offer:
* Client Name: ${client_name}
* Core Offer: ${core_offer || 'B2B Services'}
* Target Personas (${personasList.length}): ${personasList.join(', ')}
${new_persona_prompt ? `* New Persona / Direction Focus: ${new_persona_prompt}` : ''}
${iteration_notes ? `* Strategic Iteration Notes: ${iteration_notes}` : ''}
* Brand Colors: ${colorsStr}

APPROVAL, REJECTION, & TEAM PERFORMANCE INTELLIGENCE FROM VERSION 1:

📝 DIRECT TEAM PERFORMANCE NOTES & STRATEGIC INSIGHTS (HIGHEST PRIORITY):
${teamNotesSummary}

✅ APPROVED WINNING ANGLES (Do MORE of these angles, visual themes, and hook styles):
${approvedSummary}

❌ UNAPPROVED REJECTED ANGLES (STRICTLY AVOID these topics, visual directions, and weak hooks):
${unapprovedSummary}

⚡ SPECIFIC IMPROVEMENT FEEDBACK (Incorporate these lessons into the new angles):
${improvementSummary}

Execution & Dynamic AI Creative Director Rules:
1. Generate exactly 60 BRAND NEW post concepts for Version ${version_number}, distributed evenly among the specified Target Personas (${personasList.join(', ')}).
2. PRIORITIZE HUMAN TEAM NOTES: Treat the notes in the Team Performance Notes section as core conversion directives. If a team note mentions what worked great (high CTR, strong conversion hook, winning visual style), replicate and scale those elements across multiple new angles.
3. DO NOT repeat the unapproved rejected angles. Synthesize the winning formulas of approved angles and team notes into new, higher-converting concepts.
3. For each Persona, progress logically through the 5 FLC awareness levels (Unaware, Problem Aware, Solution Aware, Offer Aware, Most Aware).
4. For EACH post concept, set the Target Ad Platform format to STRICTLY 1:1 Square Feed Graphic (1080x1080).
5. EVERY "visualDirection" string MUST follow the 6-part Creative Director framework (Role & Goal, Logo Placement, Brand Colors, Headline & Offer Emphasis, 3D Visual Metaphor, Composition & Avoid Checklist).
6. META AD PRIMARY COPY VARIATIONS ("copyVariations"): Output 5 full-length (70-120+ words each) customer-facing Meta Ad primary text captions (directBenefit, problemPas, storyIdentity, proofAuthority, objectionFaq) with clean paragraph spacing.
   - BACKGROUND CONTEXT ONLY RULE: All persona descriptions, demographic traits, and prompt instructions provided here are internal background intelligence ONLY. DO NOT output persona names, demographic tags, age/location data, or internal prompt labels (such as "Persona Name:", "Demographics:", "Emotional Problem:", "Persona Profile Attribute:") inside any copy string! Output MUST be 100% clean, ready-to-publish customer-facing ad copy (Hook, Body with paragraph breaks, Value Prop, CTA).
7. CRITICAL PUNCTUATION RULE: Do NOT use em-dashes (—) or en-dashes (–). Use standard hyphens (-) or commas.

Output strictly in valid JSON format matching this schema for 60 items (no markdown code block wrapping, just raw JSON array):
[
  {
    "day": 1,
    "persona": "${personasList[0]}",
    "awarenessLevel": "Unaware",
    "angleName": "Name of Evolved Strategic Angle",
    "visualDirection": "Act as an expert advertising creative director... Evolved visual direction based on Version 1 learnings...",
    "headlineText": "Short text for graphic",
    "copyVariations": {
      "directBenefit": "Full 70-120+ word Meta ad copy...",
      "problemPas": "Full 70-120+ word Meta ad copy...",
      "storyIdentity": "Full 70-120+ word Meta ad copy...",
      "proofAuthority": "Full 70-120+ word Meta ad copy...",
      "objectionFaq": "Full 70-120+ word Meta ad copy..."
    }
  }
]`;

    const prompt1 = buildLearnedPromptForBatch(p1, 1, 15, 15);
    const prompt2 = buildLearnedPromptForBatch(p1, 16, 30, 15);
    const prompt3 = buildLearnedPromptForBatch(p2, 31, 45, 15);
    const prompt4 = buildLearnedPromptForBatch(p2, 46, 60, 15);

    // Parallel execution across 4 micro-batches (Completes in ~10 seconds, zero Vercel timeouts)
    const [b1, b2, b3, b4] = await Promise.all([
      executePrompt(prompt1).catch(e => { console.warn('Iter B1 error:', e.message); return []; }),
      executePrompt(prompt2).catch(e => { console.warn('Iter B2 error:', e.message); return []; }),
      executePrompt(prompt3).catch(e => { console.warn('Iter B3 error:', e.message); return []; }),
      executePrompt(prompt4).catch(e => { console.warn('Iter B4 error:', e.message); return []; })
    ]);

    const combinedCalendar = [...b1, ...b2, ...b3, ...b4];

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
    console.error('[generate-learned-iteration] Error:', err);
    return res.status(500).json({ error: err.message || 'Failed to generate learned iteration' });
  }
}

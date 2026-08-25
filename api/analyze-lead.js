export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { rawProfile, icp } = req.body;

        if (!rawProfile || !icp) {
            return res.status(400).json({ error: 'rawProfile and icp are required' });
        }

        const anthropicKey = process.env.ANTHROPIC_API_KEY || process.env.VITE_ANTHROPIC_API_KEY;
        const openRouterKey = process.env.OPENROUTER_API_KEY || process.env.FABBLE_API_KEY || process.env.VITE_OPENROUTER_API_KEY;

        if (!anthropicKey && !openRouterKey) {
            return res.status(500).json({
                error: 'Neither ANTHROPIC_API_KEY nor OPENROUTER_API_KEY is configured on the server.'
            });
        }

        const prompt = `You are an expert sales and business development assistant.
Your task is to analyze the following raw text content of a person's profile (which has been copied from LinkedIn or similar) and evaluate how well this person fits the target Ideal Customer Profile (ICP).

Target ICP:
"""
${icp}
"""

Raw Profile Content:
"""
${rawProfile}
"""

Evaluate the match and extract the key details. Assign a Match Score from 0 to 100 based on how closely their current role, industry, company, and background align with the target ICP. Provide a 2-3 sentence explanation summarizing your evaluation.

Return ONLY a JSON object with the following schema (no markdown wrapping, no extra text, just raw JSON):
{
  "name": "Person's extracted name (if not found, guess or use 'Unknown')",
  "company": "Person's current company (if not found, guess or use 'Unknown')",
  "headline": "Person's job title or profile headline (if not found, guess or use 'Unknown')",
  "score": 85,
  "explanation": "Brief explanation of why this score was given, referencing specific aspects of the profile that match or mismatch the ICP.",
  "linkedin_url": "Full LinkedIn URL if present in raw profile text, or null"
}
`;

        let responseText = null;

        if (anthropicKey) {
            const modelsToTry = ['claude-opus-5', 'claude-3-opus-20240229'];
            for (const modelId of modelsToTry) {
                try {
                    const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'x-api-key': anthropicKey,
                            'anthropic-version': '2023-06-01'
                        },
                        body: JSON.stringify({
                            model: modelId,
                            max_tokens: 4000,
                            system: 'You output strictly raw valid JSON matching the requested schema. Return ONLY valid JSON, do not wrap in markdown tags.',
                            messages: [{ role: 'user', content: prompt }]
                        })
                    });

                    if (anthropicRes.ok) {
                        const data = await anthropicRes.json();
                        responseText = data.content?.[0]?.text || '';
                        if (responseText) break;
                    }
                } catch (e) {
                    console.warn(`[analyze-lead] Anthropic error ${modelId}:`, e.message);
                }
            }
        }

        if (!responseText && openRouterKey) {
            const openRouterModels = ['anthropic/claude-opus-5'];
            for (const modelId of openRouterModels) {
                try {
                    const openRouterRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${openRouterKey}`,
                            'HTTP-Referer': 'https://spreadpixel.com',
                            'X-Title': 'SpreadPixel BD Hub Lead Scorer'
                        },
                        body: JSON.stringify({
                            model: modelId,
                            messages: [
                                { role: 'system', content: 'You output strictly raw valid JSON matching the requested schema.' },
                                { role: 'user', content: prompt }
                            ]
                        })
                    });

                    if (openRouterRes.ok) {
                        const data = await openRouterRes.json();
                        responseText = data.choices?.[0]?.message?.content;
                        if (responseText) break;
                    }
                } catch (e) {
                    console.warn(`[analyze-lead] OpenRouter error ${modelId}:`, e.message);
                }
            }
        }

        if (!responseText) {
            throw new Error('AI Lead Profile Analysis failed — please try again');
        }

        // Strip any accidental markdown code fences
        let cleanText = responseText.trim();
        if (cleanText.startsWith('```')) {
            cleanText = cleanText.replace(/^```json\s*/i, '').replace(/```$/, '').trim();
        }

        const result = JSON.parse(cleanText);
        return res.status(200).json(result);

    } catch (err) {
        console.error('[analyze-lead] Error:', err);
        return res.status(500).json({ error: err.message || 'Internal server error' });
    }
}

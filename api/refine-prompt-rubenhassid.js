export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      clientName,
      coreOffer,
      persona,
      angleName,
      headlineText,
      currentVisualDirection,
      brandColors,
      brandLogoPosition = 'Top-Left'
    } = req.body;

    if (!clientName) {
      return res.status(400).json({ error: 'Client name is required.' });
    }

    const openRouterKey = process.env.OPENROUTER_API_KEY || process.env.FABBLE_API_KEY || process.env.VITE_OPENROUTER_API_KEY;

    if (!openRouterKey) {
      return res.status(500).json({
        error: 'OPENROUTER_API_KEY / FABBLE_API_KEY is not configured.'
      });
    }

    const colorsStr = (brandColors && brandColors !== '#7C3AED, #0F172A, #059669')
      ? brandColors
      : `Official brand colors of ${clientName}`;

    const prompt = `You are Ruben Hassid, world-renowned AI Prompt Engineer and Creative Advertising Director.
Your task is to refine and rewrite an AI image generation prompt for ${clientName} promoting ${coreOffer || 'Core Offer'} into an immaculate, studio-grade Ruben Hassid Visual Art Direction prompt (for Midjourney v6 / DALL-E 3 / FLUX).

Context & Intelligence:
* Brand Name: ${clientName}
* Core Offer: ${coreOffer || 'B2B Services'}
* Target Persona: ${persona || 'Target Audience'}
* Angle Theme: ${angleName || 'Strategic Angle'}
* Graphic Headline: "${headlineText || ''}"
* Original Draft Prompt: "${currentVisualDirection || ''}"
* Brand Colors: ${colorsStr}
* Preferred Logo Position: ${brandLogoPosition}
* Aspect Ratio: STRICTLY 1:1 Square Feed Graphic (1080x1080)

RUBEN HASSID 6-PART PROMPT ARCHITECTURE RULES:
Structure the output "refinedVisualDirection" following Ruben Hassid's exact studio format:

1. [SUBJECT & SCENE CORE]: Hyper-detailed 3D visual metaphor or cinematic photorealistic scene illustrating "${angleName}" for ${persona} (e.g. sleek 3D frosted glassmorphism UI card, floating Octane render isometric automation nodes, polished metallic accents).
2. [MEDIUM & ARTISTIC STYLE]: Octane 3D render depth, 8k ultra-detailed commercial studio advertising visual, sleek B2B minimalism, raytraced reflections.
3. [LIGHTING & ATMOSPHERE]: Volumetric neon ambient glow, soft studio rim lighting, dark slate backdrop, crisp depth of field (f/1.8), clean breathing space.
4. [COLOR PALETTE]: Accentuated with official brand colors (${colorsStr}) against high-contrast dark mode canvas.
5. [COMPOSITION & FRAMING]: Centered 3D focal object, golden ratio rule, reserved ${brandLogoPosition} logo clearance zone, 1:1 Square aspect ratio (1080x1080).
6. [STRICT NEGATIVE CONSTRAINTS]: Max 1 short 3-5 word primary headline. ABSOLUTELY NO long text paragraphs, NO flyer bullet points, NO distorted typography, NO overcrowded stock photos, NO Base64 text strings.

Output strictly in raw valid JSON format matching this schema (no markdown code blocks, just raw JSON):
{
  "refinedVisualDirection": "[Ruben Hassid 6-part studio visual direction prompt for Midjourney / DALL-E / FLUX]",
  "headlineText": "Refined 6 to 10 word customer graphic headline text"
}`;

    const modelsToTry = [
      { id: 'anthropic/claude-opus-5', name: 'Claude Opus 5' },
      { id: 'anthropic/claude-3-opus', name: 'Claude 3 Opus' },
      { id: 'anthropic/claude-3.5-sonnet', name: 'Claude 3.5 Sonnet' }
    ];

    let responseText = null;
    let lastError = null;

    for (const model of modelsToTry) {
      try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${openRouterKey}`,
            'HTTP-Referer': 'https://flc-dashboard.vercel.app',
            'X-Title': 'FLC Dashboard'
          },
          body: JSON.stringify({
            model: model.id,
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.7,
            max_tokens: 1500
          })
        });

        if (response.ok) {
          const data = await response.json();
          responseText = data.choices?.[0]?.message?.content || '';
          if (responseText) break;
        } else {
          lastError = await response.text();
        }
      } catch (err) {
        lastError = err.message;
      }
    }

    if (!responseText) {
      throw new Error(`OpenRouter error: ${lastError || 'Empty content'}`);
    }

    const rawContent = responseText;

    let cleanText = rawContent.trim()
      .replace(/<thought>[\s\S]*?<\/thought>/gi, '')
      .replace(/<reasoning>[\s\S]*?<\/reasoning>/gi, '')
      .trim();

    if (cleanText.startsWith('```')) {
      cleanText = cleanText.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/, '').trim();
    }

    let parsed = null;
    try {
      parsed = JSON.parse(cleanText);
    } catch (e) {
      const start = cleanText.indexOf('{');
      const end = cleanText.lastIndexOf('}');
      if (start !== -1 && end > start) {
        parsed = JSON.parse(cleanText.substring(start, end + 1));
      }
    }

    if (!parsed || !parsed.refinedVisualDirection) {
      return res.status(500).json({ error: 'Failed to generate refined Ruben Hassid prompt.' });
    }

    return res.status(200).json(parsed);
  } catch (error) {
    console.error('[Ruben Hassid API Error]:', error);
    return res.status(500).json({ error: error.message });
  }
}

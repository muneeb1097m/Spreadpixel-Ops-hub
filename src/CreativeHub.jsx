import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Plus, 
  Layers, 
  Copy, 
  Check, 
  Bot, 
  RefreshCw, 
  FileText, 
  User, 
  Target, 
  Award, 
  Send, 
  ChevronRight, 
  X, 
  Eye, 
  ShieldCheck, 
  Zap,
  Edit3,
  UploadCloud,
  FileUp,
  AlertTriangle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { upsertClient } from './supabase';
import { getApiUrl } from './config.js';

const AWARENESS_LEVELS = [
  { id: 'Unaware', label: 'Unaware', color: '#7c3aed', bg: '#f5f3ff', border: '#ddd6fe' },
  { id: 'Problem Aware', label: 'Problem Aware', color: '#9333ea', bg: '#faf5ff', border: '#e9d5ff' },
  { id: 'Solution Aware', label: 'Solution Aware', color: '#0284c7', bg: '#f0f9ff', border: '#bae6fd' },
  { id: 'Offer Aware', label: 'Offer Aware', color: '#059669', bg: '#ecfdf5', border: '#a7f3d0' },
  { id: 'Most Aware', label: 'Most Aware', color: '#d97706', bg: '#fffbeb', border: '#fde68a' }
];

const COPY_TYPES = [
  { id: 'directBenefit', label: 'Direct Benefit' },
  { id: 'problemPas', label: 'Problem / PAS' },
  { id: 'storyIdentity', label: 'Story / Identity' },
  { id: 'proofAuthority', label: 'Proof / Authority' },
  { id: 'objectionFaq', label: 'Objection / FAQ' }
];

const extractClientPreferenceDataset = (calData = []) => {
  if (!Array.isArray(calData) || calData.length === 0) {
    return {
      approvedText: 'No approved winning angles recorded yet.',
      unapprovedText: 'No unapproved angles recorded yet.',
      teamNotesText: 'No specific team improvement notes recorded yet.'
    };
  }

  const approvedList = calData.filter(item => item.reviewStatus === 'approved');
  const unapprovedList = calData.filter(item => item.reviewStatus === 'unapproved');
  const teamNotesList = calData.filter(item => item.teamNotes && item.teamNotes.trim());

  const approvedText = approvedList.length > 0
    ? approvedList.map(a => `* APPROVED WINNER: Angle "${a.angleName || 'Strategy'}" | Headline: "${a.headlineText || 'Headline'}"`).join('\n')
    : 'No approved winning angles recorded yet.';

  const unapprovedText = unapprovedList.length > 0
    ? unapprovedList.map(a => `* REJECTED ANGLE: "${a.angleName || 'Strategy'}" | Headline: "${a.headlineText || 'Headline'}" (DO NOT REPEAT)`).join('\n')
    : 'No unapproved angles recorded yet.';

  const teamNotesText = teamNotesList.length > 0
    ? teamNotesList.map(a => `* TEAM FEEDBACK on "${a.angleName || 'Angle'}": "${a.teamNotes.trim()}"`).join('\n')
    : 'No specific team improvement notes recorded yet.';

  return { approvedText, unapprovedText, teamNotesText };
};

const INPUT_STYLE = {
  width: '100%',
  padding: '11px 16px',
  borderRadius: 12,
  background: '#ffffff',
  border: '1.5px solid #cbd5e1',
  color: '#0f172a',
  fontSize: 13,
  fontWeight: 500,
  outline: 'none',
  transition: 'all 0.2s ease'
};

const LABEL_STYLE = {
  display: 'block',
  fontSize: 11,
  fontWeight: 800,
  color: '#475569',
  textTransform: 'uppercase',
  letterSpacing: '0.8px',
  marginBottom: 6
};

const BUTTON_CANCEL_STYLE = {
  padding: '11px 20px',
  borderRadius: 12,
  background: '#f1f5f9',
  border: '1px solid #cbd5e1',
  color: '#475569',
  fontWeight: 700,
  fontSize: 13,
  cursor: 'pointer'
};

const formatPersonaTag = (str, fallback = 'Persona') => {
  if (!str) return fallback;
  const s = String(str).trim();
  if (s.length <= 25) return s;
  const firstPart = s.split(/[\(\,\:\.\-]/)[0].trim();
  if (firstPart && firstPart.length > 3 && firstPart.length <= 25) return firstPart;
  return s.substring(0, 22) + '...';
};

export default function CreativeHub({ sel, setClients, user, isAdmin }) {
  const brief = sel?.tasks?.__creative_brand_brief || {};
  const [clientName, setClientName] = useState(brief.client_name || sel?.name || '');
  const [coreOffer, setCoreOffer] = useState(brief.core_offer || '');
  
  const initialPersonas = brief.personas && Array.isArray(brief.personas) && brief.personas.length > 0
    ? [brief.personas[0]]
    : [brief.persona_1].filter(Boolean);
  const [personas, setPersonas] = useState(initialPersonas.length > 0 ? initialPersonas : ['']);

  const [coreProof, setCoreProof] = useState(brief.core_proof || '');
  const [cta, setCta] = useState(brief.cta || '');

  const [brandColors, setBrandColors] = useState(brief.brand_colors || sel?.tasks?.__brand_colors || sel?.tasks?.__brand_color || '');
  const [brandLogoUrl, setBrandLogoUrl] = useState(brief.brand_logo_url || sel?.tasks?.__brand_logo_url || '');
  const [brandNiche, setBrandNiche] = useState(brief.brand_niche || sel?.tasks?.__brand_niche || '');
  const [brandLogoPosition, setBrandLogoPosition] = useState(brief.brand_logo_position || sel?.tasks?.__brand_logo_position || 'Top-Left');
  const [brandPlatform, setBrandPlatform] = useState(brief.brand_platform || sel?.tasks?.__brand_platform || 'Meta Ads (1:1 Feed Square)');
  const [isExtractingColors, setIsExtractingColors] = useState(false);

  const calendarData = sel?.tasks?.__creative_content_calendar || [];
  const [calendar, setCalendar] = useState(calendarData);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAnalyzingBrief, setIsAnalyzingBrief] = useState(false);
  const [selectedPersonaFilter, setSelectedPersonaFilter] = useState('all');
  const [selectedAwarenessFilter, setSelectedAwarenessFilter] = useState('all');
  const [generationProgress, setGenerationProgress] = useState(0);
  const [selectedCards, setSelectedCards] = useState([]);
  const [activeCopyTabs, setActiveCopyTabs] = useState({});
  const [copiedKey, setCopiedKey] = useState(null);

  const [feedbackInputs, setFeedbackInputs] = useState({});
  const [openImprovementBoxes, setOpenImprovementBoxes] = useState({});
  const [regeneratingAngles, setRegeneratingAngles] = useState({});
  const [selectedAngleModal, setSelectedAngleModal] = useState(null);
  const cancelGenerationRef = useRef(false);
  const selRef = useRef(sel);
  useEffect(() => {
    selRef.current = sel;
  }, [sel]);

  const handleStopGeneration = () => {
    cancelGenerationRef.current = true;
    toast.info('Stopping generation after active card...');
  };

  useEffect(() => {
    const currentBrief = sel?.tasks?.__creative_brand_brief || {};
    setClientName(currentBrief.client_name || sel?.name || '');
    setCoreOffer(currentBrief.core_offer || '');
    const loadedPersonas = currentBrief.personas && Array.isArray(currentBrief.personas) && currentBrief.personas.length > 0
      ? [currentBrief.personas[0]]
      : [currentBrief.persona_1].filter(Boolean);
    setPersonas(loadedPersonas.length > 0 ? loadedPersonas : ['']);
    setCoreProof(currentBrief.core_proof || '');
    setCta(currentBrief.cta || '');

    const storageKey = sel?.id ? `flc_strategy_calendar_${sel.id}` : null;
    const loadedCal = (sel?.tasks?.__creative_content_calendar && Array.isArray(sel.tasks.__creative_content_calendar) && sel.tasks.__creative_content_calendar.length > 0)
      ? sel.tasks.__creative_content_calendar
      : (storageKey ? JSON.parse(localStorage.getItem(storageKey) || '[]') : []);
    setCalendar(loadedCal);

    setBrandColors(currentBrief.brand_colors || sel?.tasks?.__brand_colors || sel?.tasks?.__brand_color || '');
    setBrandLogoUrl(currentBrief.brand_logo_url || sel?.tasks?.__brand_logo_url || '');
    setBrandNiche(currentBrief.brand_niche || sel?.tasks?.__brand_niche || '');
    setBrandLogoPosition(currentBrief.brand_logo_position || sel?.tasks?.__brand_logo_position || 'Top-Left');
    setBrandPlatform(currentBrief.brand_platform || sel?.tasks?.__brand_platform || 'Meta Ads (1:1 Feed Square)');

    // Reset transient client selection state to prevent cross-client UI bleed
    setSelectedCards([]);
    setSelectedAngleModal(null);
    setOpenImprovementBoxes({});
    setFeedbackInputs({});
    setRegeneratingAngles({});
    setSelectedPersonaFilter('all');
    setSelectedAwarenessFilter('all');
  }, [sel?.id, sel?.tasks?.__creative_content_calendar, sel?.tasks?.__creative_brand_brief]);

  const handleUpdateReviewStatus = async (angleDay, status) => {
    if (!sel) return;
    const nowStr = new Date().toISOString();
    const updatedCalendar = calendar.map(item => {
      const dayNum = item.day || item.id;
      if (dayNum === angleDay) {
        return { ...item, reviewStatus: status, reviewUpdatedAt: nowStr };
      }
      return item;
    });

    setCalendar(updatedCalendar);

    const updatedTasks = {
      ...(sel.tasks || {}),
      __creative_content_calendar: updatedCalendar,
      __meta_updated_at: nowStr
    };
    const updatedClient = { ...sel, tasks: updatedTasks, updatedAt: nowStr };

    try {
      await upsertClient(updatedClient);
      setClients(prev => prev.map(c => c.id === sel.id ? updatedClient : c));
      if (status === 'approved') {
        toast.success(`🧠 Learned Client Preference: Angle #${angleDay} added to ${sel?.name || 'Client'}'s Winning Dataset! ✅`);
      } else if (status === 'unapproved') {
        toast.error(`🧠 Learned Client Preference: Angle #${angleDay} added to ${sel?.name || 'Client'}'s Forbidden Dataset! ❌`);
      } else if (status === 'needs_improvement') {
        toast.info(`Angle #${angleDay} flagged for improvement ⚡`);
      }
    } catch (e) {
      toast.error('Failed to update status: ' + e.message);
    }
  };

  const handleRegenerateAngle = async (item, angleDay) => {
    const feedback = (feedbackInputs[angleDay] || '').trim();
    if (!feedback) {
      toast.error('Please enter what improvement you want first.');
      return;
    }

    setRegeneratingAngles(prev => ({ ...prev, [angleDay]: true }));

    try {
      let updatedAngle = null;

      try {
        const res = await fetch(getApiUrl('/api/regenerate-single-angle'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            clientName: brief.client_name || clientName || sel?.name,
            coreOffer: brief.core_offer || coreOffer,
            persona: item.persona,
            awarenessLevel: item.awarenessLevel,
            angleName: item.angleName,
            currentHeadline: item.headlineText,
            currentVisualDirection: item.visualDirection,
            improvementFeedback: feedback,
            brandColors: brandColors
          })
        });

        const contentType = res.headers.get('content-type') || '';
        if (res.ok && contentType.includes('application/json')) {
          const data = await res.json();
          if (data.fallbackNotice) {
            toast.warning(data.fallbackNotice, { duration: 8000 });
          }
          if (data.updatedAngle) {
            updatedAngle = data.updatedAngle;
          }
        }
      } catch (e) {
        console.warn('Backend API endpoint unavailable, executing direct fallback:', e);
      }

      if (!updatedAngle) {
        const fallbackPrompt = `You are an expert advertising creative director. REGENERATE and IMPROVE this single Meta Ad angle based on user feedback.
Client: ${clientName}
Persona: ${item.persona}
Angle: ${item.angleName}
Current Headline: "${item.headlineText || ''}"
Current Visual Direction: "${item.visualDirection || ''}"

USER IMPROVEMENT FEEDBACK:
"""
${feedback}
"""

Return ONLY a JSON object:
{
  "headlineText": "New improved headline",
  "visualDirection": "New improved visual direction based on feedback",
  "copyVariations": {
    "directBenefit": "Full 70-120+ word Meta ad copy...",
    "problemPas": "Full 70-120+ word Meta ad copy...",
    "storyIdentity": "Full 70-120+ word Meta ad copy...",
    "proofAuthority": "Full 70-120+ word Meta ad copy...",
    "objectionFaq": "Full 70-120+ word Meta ad copy..."
  }
}`;
        updatedAngle = await callDirectAiApi(fallbackPrompt);
      }

      if (!updatedAngle) {
        throw new Error('AI Regeneration produced no output. Please try again.');
      }

      const nowStr = new Date().toISOString();
      const updatedCalendar = calendar.map(cItem => {
        const dayNum = cItem.day || cItem.id;
        if (dayNum === angleDay) {
          return {
            ...cItem,
            headlineText: updatedAngle.headlineText || cItem.headlineText,
            visualDirection: updatedAngle.visualDirection || cItem.visualDirection,
            copyVariations: updatedAngle.copyVariations || cItem.copyVariations,
            reviewStatus: 'needs_improvement',
            lastFeedback: feedback,
            lastRegeneratedAt: nowStr
          };
        }
        return cItem;
      });

      setCalendar(updatedCalendar);

      const updatedTasks = {
        ...(sel?.tasks || {}),
        __creative_content_calendar: updatedCalendar,
        __meta_updated_at: nowStr
      };
      const updatedClient = { ...sel, tasks: updatedTasks, updatedAt: nowStr };

      await upsertClient(updatedClient);
      setClients(prev => prev.map(c => c.id === sel.id ? updatedClient : c));

      setOpenImprovementBoxes(prev => ({ ...prev, [angleDay]: false }));
      setFeedbackInputs(prev => ({ ...prev, [angleDay]: '' }));

      toast.success(`Angle #${angleDay} regenerated successfully based on your feedback! 🚀`);
    } catch (err) {
      console.error(err);
      toast.error('Regeneration Error: ' + err.message);
    } finally {
      setRegeneratingAngles(prev => ({ ...prev, [angleDay]: false }));
    }
  };

  const [refiningPrompts, setRefiningPrompts] = useState({});

  const handleRefinePromptRubenHassid = async (item, angleDay) => {
    setRefiningPrompts(prev => ({ ...prev, [angleDay]: true }));
    toast.info(`✨ Refining Image Prompt for Angle #${angleDay} with Ruben Hassid AI Engine...`);

    try {
      let refinedData = null;
      try {
        const res = await fetch(getApiUrl('/api/refine-prompt-rubenhassid'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            clientName: brief.client_name || clientName || sel?.name,
            coreOffer: brief.core_offer || coreOffer,
            persona: item.persona,
            angleName: item.angleName,
            headlineText: item.headlineText,
            currentVisualDirection: item.visualDirection,
            brandColors: brandColors,
            brandLogoPosition: brandLogoPosition
          })
        });

        if (res.ok) {
          refinedData = await res.json();
        }
      } catch (e) {
        console.warn('API Endpoint failed, attempting fallback direct call:', e);
      }

      if (!refinedData) {
        const prompt = `You are Ruben Hassid, elite AI Prompt Engineer. Refine this image prompt into Ruben Hassid's 6-part studio prompt architecture (Subject & Scene, Medium & Style, Lighting & Atmosphere, Color Palette, Composition, Negative Constraints):
Current Prompt: "${item.visualDirection}"
Brand: "${clientName}"
Angle: "${item.angleName}"

Return ONLY JSON:
{
  "refinedVisualDirection": "[Ruben Hassid 6-part studio image prompt]",
  "headlineText": "${item.headlineText || ''}"
}`;
        const directRes = await callDirectAiApi(prompt);
        if (directRes && directRes.refinedVisualDirection) {
          refinedData = directRes;
        }
      }

      if (!refinedData || !refinedData.refinedVisualDirection) {
        throw new Error('Ruben Hassid Prompt Engine returned no output.');
      }

      const nowStr = new Date().toISOString();
      const updatedCalendar = calendar.map(cItem => {
        const dayNum = cItem.day || cItem.id;
        if (dayNum === angleDay) {
          return {
            ...cItem,
            visualDirection: refinedData.refinedVisualDirection,
            headlineText: refinedData.headlineText || cItem.headlineText,
            isRubenHassidRefined: true,
            promptRefinedAt: nowStr
          };
        }
        return cItem;
      });

      setCalendar(updatedCalendar);

      if (sel) {
        const updatedTasks = {
          ...(sel.tasks || {}),
          __creative_content_calendar: updatedCalendar,
          __meta_updated_at: nowStr
        };
        const updatedClient = { ...sel, tasks: updatedTasks, updatedAt: nowStr };
        await upsertClient(updatedClient);
        setClients(prev => prev.map(c => c.id === sel.id ? updatedClient : c));

        const targetClientId = sel.id;
        if (targetClientId) {
          localStorage.setItem(`flc_strategy_calendar_${targetClientId}`, JSON.stringify(updatedCalendar));
        }
      }

      if (selectedAngleModal && (selectedAngleModal.day || selectedAngleModal.id) === angleDay) {
        setSelectedAngleModal(prev => ({
          ...prev,
          visualDirection: refinedData.refinedVisualDirection,
          headlineText: refinedData.headlineText || prev.headlineText,
          isRubenHassidRefined: true
        }));
      }

      toast.success(`✨ Prompt Refined! Ruben Hassid 6-part studio visual generated for Angle #${angleDay}!`);
    } catch (err) {
      console.error(err);
      toast.error('Prompt refinement failed: ' + err.message);
    } finally {
      setRefiningPrompts(prev => ({ ...prev, [angleDay]: false }));
    }
  };

  const handleUpdateTeamNotes = async (angleDay, notesText) => {
    if (!sel) return;
    const nowStr = new Date().toISOString();
    const updatedCalendar = calendar.map(item => {
      const dayNum = item.day || item.id;
      if (dayNum === angleDay) {
        return { ...item, teamNotes: notesText, teamNotesUpdatedAt: nowStr };
      }
      return item;
    });

    setCalendar(updatedCalendar);

    const updatedTasks = {
      ...(sel.tasks || {}),
      __creative_content_calendar: updatedCalendar,
      __meta_updated_at: nowStr
    };
    const updatedClient = { ...sel, tasks: updatedTasks, updatedAt: nowStr };

    try {
      await upsertClient(updatedClient);
      setClients(prev => prev.map(c => c.id === sel.id ? updatedClient : c));
    } catch (e) {
      console.warn('Failed to persist team notes:', e);
    }
  };

  const handleUpdateCardField = async (angleDay, field, value) => {
    if (!sel) return;
    const nowStr = new Date().toISOString();
    const updatedCalendar = calendar.map(item => {
      const dayNum = item.day || item.id;
      if (dayNum === angleDay) {
        if (field.startsWith('copy_')) {
          const copyKey = field.replace('copy_', '');
          return {
            ...item,
            copyVariations: {
              ...(item.copyVariations || {}),
              [copyKey]: value
            },
            updatedAt: nowStr
          };
        }
        return { ...item, [field]: value, updatedAt: nowStr };
      }
      return item;
    });

    setCalendar(updatedCalendar);

    const updatedTasks = {
      ...(sel.tasks || {}),
      __creative_content_calendar: updatedCalendar,
      __meta_updated_at: nowStr
    };
    const updatedClient = { ...sel, tasks: updatedTasks, updatedAt: nowStr };

    try {
      await upsertClient(updatedClient);
      setClients(prev => prev.map(c => c.id === sel.id ? updatedClient : c));
    } catch (e) {
      console.warn('Failed to update card field:', e);
    }
  };

  const [showIterationModal, setShowIterationModal] = useState(false);
  const [isGeneratingIteration, setIsGeneratingIteration] = useState(false);
  const [iterationPromptNotes, setIterationPromptNotes] = useState('');
  const [iterationPersonas, setIterationPersonas] = useState(personas);

  const approvedCount = calendar.filter(c => c.reviewStatus === 'approved').length;
  const unapprovedCount = calendar.filter(c => c.reviewStatus === 'unapproved').length;
  const improvementCount = calendar.filter(c => c.reviewStatus === 'needs_improvement' || c.lastFeedback).length;
  const pendingCount = Math.max(0, calendar.length - approvedCount - unapprovedCount - improvementCount);

  const currentVersionCount = sel?.tasks?.__creative_version_count || 1;

  const handleGenerateLearnedIteration = async (e) => {
    e?.preventDefault();

    const unreviewedCards = calendar.filter(c => !c.reviewStatus);
    if (unreviewedCards.length > 0) {
      toast.error(`Review Incomplete: ${unreviewedCards.length} of ${calendar.length} cards are still pending review. Every single card must be Approved, Unapproved, or Flagged before generating Version ${currentVersionCount + 1}.`);
      return;
    }

    const validPersonas = iterationPersonas.map(p => p.trim()).filter(Boolean);
    if (validPersonas.length === 0) {
      toast.error('Please enter at least 1 Target Persona for the new version.');
      return;
    }

    const targetClientId = sel?.id;
    const storageKey = targetClientId ? `flc_strategy_calendar_${targetClientId}` : 'flc_strategy_calendar_default';

    setIsGeneratingIteration(true);

    try {
      const nextVersionNumber = currentVersionCount + 1;
      
      const approvedSummary = calendar.filter(c => c.reviewStatus === 'approved')
        .map(a => `- Angle: "${a.angleName}" | Headline: "${a.headlineText}"`).join('\n');
      const unapprovedSummary = calendar.filter(c => c.reviewStatus === 'unapproved')
        .map(a => `- Angle: "${a.angleName}" | Headline: "${a.headlineText}" (REJECTED)`).join('\n');

      const rawColors = (brandColors || brief.brand_colors || sel?.tasks?.__brand_colors || '').trim();
      const colorsStr = (rawColors && rawColors !== '#7C3AED, #0F172A, #059669')
        ? rawColors
        : `Official brand colors of ${clientName || sel?.name || 'Client'} (derived from official brand logo)`;

      const buildIterationPrompt = (bPersona, targetAwareness, angleTheme) => `You are an expert advertising creative director, B2B marketing designer, and conversion-focused visual strategist generating Version ${nextVersionNumber} of Meta Ads Strategy.

Client Brand Assets & Intelligence:
* Brand Name: ${clientName || sel?.name || 'Your Brand'}
* Product / Core Offer: ${coreOffer || 'Core Offer'}
* Target Audience Persona: ${bPersona}
* Brand Colors: ${colorsStr}
${iterationPromptNotes ? `* Strategic Iteration Direction: ${iterationPromptNotes}` : ''}

LEARNINGS FROM PREVIOUS VERSION:
APPROVED WINNING ANGLES (Replicate winning formulas):
${approvedSummary || 'None approved yet.'}

UNAPPROVED REJECTED ANGLES (STRICTLY AVOID):
${unapprovedSummary || 'None rejected.'}

RULES & STRICT SCHEMA SPECIFICATIONS:
1. Generate exactly 1 distinct ad package explicitly for the "${targetAwareness}" awareness level around Theme: "${angleTheme}".
2. GRAPHIC HEADLINE TEXT ("headlineText"): MUST BE A CREATIVE, CUSTOMER-FACING ADVERTISEMENT GRAPHIC HEADLINE (STRICTLY 6 TO 10 WORDS LONG).
   - EXAMPLES OF GREAT HEADLINES:
     * "Your Best Customer Never Saw You Coming"
     * "Your Customers Scroll Past You Every Single Day"
     * "Stop Wasting 20 Hours Every Single Week"
     * "Waiting Has A Massive Hidden Price Tag"
     * "Why Top Companies Are Switching To ${clientName || sel?.name || 'Us'}"

   - ABSOLUTE PROHIBITION RULE: DO NOT copy internal framework category names, strategy names, or placeholders (such as "Alternative to Traditional Path", "Cost of Inaction", "Unaware", "Solution Aware", or "Problem Aware") into "headlineText"! "headlineText" MUST be 100% original, punchy, external customer-facing headline text written directly to hook ${bPersona}.

3. VISUAL-FIRST IMAGE GENERATION PROMPT ("visualDirection"): The "visualDirection" string MUST be an ultra-detailed, studio-grade image generation prompt (for Midjourney / DALL-E / FLUX) following this exact framework:
   "Act like an expert advertising creative director, visual artist, and 3D graphic designer.
   Goal: Create a premium, high-converting advertising visual for ${clientName || sel?.name || 'Client'} promoting ${coreOffer || 'Offer'} to ${bPersona}.
   Platform: Meta Ads Feed Graphic (STRICTLY 1:1 Square 1080x1080 format).

   VISUAL SCENE & ARTISTIC COMPOSITION:
   1. Subject & Scene Concept: Hyper-detailed 3D visual metaphor or cinematic photorealistic scene illustrating ${angleTheme} for ${bPersona} (e.g. sleek glassmorphic UI elements, floating 3D holographic nodes, isometric render depth, Octane render quality).
   2. Logo Placement: Clean logo placement space in ${brandLogoPosition || 'Top-Left'} corner with padding.
   3. Color Scheme & Lighting: Modern dark-mode background accented with official brand colors: ${colorsStr}. Cinematic studio lighting with shallow depth of field.
   4. Atmosphere: High-end professional aesthetic, crisp contrast, clean breathing room.

   STRICT IMAGE TEXT RULES & AVOID CHECKLIST:
   - DO NOT include long paragraphs, bullet points, offer terms, or flyer copy on the image graphic.
   - AT MOST include a single short 3-5 word primary headline at the top.
   - ABSOLUTELY NO raw base64 data strings.
   - AVOID: Overcrowded text, misspelled letters, generic stock photos, low contrast, text wrapping errors, messy cluttered layouts."

4. META AD PRIMARY COPY VARIATIONS ("copyVariations"):
   Generate 5 full-length (70-120+ words each) customer-facing Meta Ad primary text captions (directBenefit, problemPas, storyIdentity, proofAuthority, objectionFaq) customized for ${clientName || sel?.name || 'Client'}:
   - directBenefit: Focus directly on immediate gains of ${coreOffer || 'Offer'}.
   - problemPas: Focus on pain, frustration, and cost of inaction regarding ${angleTheme}.
   - storyIdentity: Personal story / identity alignment with ${bPersona} tackling ${angleTheme}.
   - proofAuthority: Data-backed authority, case study metrics, and proof for ${clientName || sel?.name || 'Client'}.
   - objectionFaq: Tackling false beliefs, tech hurdles, and risk reversal for ${coreOffer || 'Offer'}.

   STRICT AD COPY BOUNDARY CONSTRAINTS:
   - BACKGROUND CONTEXT ONLY RULE: All persona descriptions, demographic traits (age, location), psychological profiles, and prompt instructions provided here are internal background intelligence ONLY. DO NOT output persona names, demographic tags, age/location data, or internal prompt labels (such as "Persona Name:", "Demographics:", "Emotional Problem:", "Persona Profile Attribute:") inside any copy string!
   - READY-TO-PUBLISH COPY: Your output MUST be 100% clean, ready-to-publish customer-facing advertisement copy written directly to hook ${bPersona}.
   - COPYWRITING STRUCTURE & SPACING: Each variation must strictly follow standard high-converting ad structure with clean double-line paragraph breaks:
     * Line 1: Attention-grabbing Hook
     * Body: 2-3 short, punchy paragraphs separated by double line breaks
     * Value Proposition & Offer: (${clientName || sel?.name || 'Client'} - ${coreOffer || 'Offer'})
     * Final Line: Clear Call to Action

5. Absolutely DO NOT use em-dashes (—) or en-dashes (–). Use standard hyphens (-) or commas.

Output strictly in valid raw JSON format matching this schema array for ${cnt} items (generate exactly ${cnt} distinct item objects in the array):
[
  {
    "day": 1,
    "persona": "${bPersona}",
    "awarenessLevel": "${targetAwareness}",
    "angleName": "Evolved Strategic Angle for ${clientName || sel?.name || 'Client'}",
    "headlineText": "Exact 6 to 10 word punchy external graphic headline text for customer",
    "visualDirection": "Act like an expert advertising creative director... [Ultra-detailed 6-part image generation prompt]",
    "copyVariations": {
      "directBenefit": "Full 70-120+ word Meta ad copy...",
      "problemPas": "Full 70-120+ word Meta ad copy...",
      "storyIdentity": "Full 70-120+ word Meta ad copy...",
      "proofAuthority": "Full 70-120+ word Meta ad copy...",
      "objectionFaq": "Full 70-120+ word Meta ad copy..."
    }
  }
]`;

      const p1 = validPersonas[0] || 'Primary Persona';
      const awarenessListProgression = ['Unaware', 'Problem Aware', 'Solution Aware', 'Product Aware', 'Most Aware'];
      
      const FLC_STRATEGY_MATRIX = {
        'Unaware': [
          `The Hidden Cost of Manual ${coreOffer || 'Operations'} Drag`,
          `Why ${p1} Fall Behind Competitors Today`,
          `The Silent Opportunity In Modernizing ${coreOffer || 'Services'}`
        ],
        'Problem Aware': [
          `Why Traditional Approaches To ${coreOffer || 'Workflows'} Are Failing`,
          `The Cost Of Inaction And Inefficiency In ${coreOffer || 'Operations'}`,
          `Why ${p1} Waste Time On Legacy Processes`
        ],
        'Solution Aware': [
          `The Modern Mechanism For Scalable ${coreOffer || 'Growth'}`,
          `Why ${clientName || sel?.name || 'Us'} Outperforms Standard Industry Methods`,
          `Eliminating Operational Friction For ${p1}`
        ],
        'Product Aware': [
          `How ${clientName || sel?.name || 'Us'} Accelerates Growth With ${coreOffer || 'Systems'}`,
          `Verified Client Results & Turnaround Milestones`,
          `The Complete ROI Breakdown Of ${clientName || sel?.name || 'Our'} Solution`
        ],
        'Most Aware': [
          `Claim Your Custom ${coreOffer || 'Growth'} Blueprint With ${clientName || sel?.name || 'Us'}`,
          `Risk-Free Performance Guarantee For ${p1}`,
          `Reserve Your Implementation Slot With ${clientName || sel?.name || 'Us'}`
        ]
      };

      const awarenessProgression = ['Unaware', 'Problem Aware', 'Solution Aware', 'Product Aware', 'Most Aware'];
      const batchConfigs = [];
      for (let d = 1; d <= 30; d++) {
        const awarenessIdx = Math.min(4, Math.floor((d - 1) / 6));
        const awareness = awarenessProgression[awarenessIdx];
        batchConfigs.push({
          persona: p1,
          start: d,
          end: d,
          count: 1,
          awareness: awareness,
          angleTheme: `${awareness} Strategic Concept ${((d - 1) % 6) + 1}`,
          label: `Card ${d} (${awareness})`
        });
      }

      const sanitizeEmDashes = (obj) => {
        if (typeof obj === 'string') return obj.replace(/\s*[\u2014\u2013—–]\s*/g, ' - ').replace(/[\u2014\u2013—–]/g, ' - ');
        if (Array.isArray(obj)) return obj.map(sanitizeEmDashes);
        if (obj && typeof obj === 'object') {
          const cleaned = {};
          for (const k of Object.keys(obj)) cleaned[k] = sanitizeEmDashes(obj[k]);
          return cleaned;
        }
        return obj;
      };

      toast.info(`Strategizing Version ${nextVersionNumber} for ${clientName || 'Client'}... Cards will generate in background!`);
      setShowIterationModal(false);
      
      let totalGenerated = 0;
      setGenerationProgress(0);
      setIsGenerating(true);
      
      let liveAppendedCalendar = [...calendar];
      cancelGenerationRef.current = false;

      const nowStr = new Date().toISOString();
      const existingHistory = sel?.tasks?.__creative_version_history || [];
      const updatedHistory = [
        ...existingHistory,
        {
          version: currentVersionCount,
          calendar: calendar,
          archivedAt: nowStr
        }
      ];

      const updatedBrief = {
        ...(brief || {}),
        personas: [validPersonas[0]],
        persona_1: validPersonas[0] || ''
      };

      setPersonas(validPersonas);

      for (const cfg of batchConfigs) {
        if (cancelGenerationRef.current) {
          toast.warning('Iteration generation stopped.');
          break;
        }
        let itemsToAdd = [];
        let success = false;
        let lastErr = null;

        for (let attempt = 1; attempt <= 3; attempt++) {
          try {
            const prompt = buildIterationPrompt(cfg.persona, cfg.awareness, cfg.angleTheme);
            const res = await callDirectAiApi(prompt);
            const rawItems = Array.isArray(res) ? res : (res?.calendar || res?.angles || res?.data || []);
            
            if (rawItems.length > 0) {
              const exactItems = rawItems.slice(0, cfg.count);
              itemsToAdd = sanitizeEmDashes(exactItems);
              success = true;
              break;
            } else {
              throw new Error("AI returned empty response");
            }
          } catch (err) {
            lastErr = err;
            console.warn(`[CreativeHub] Iteration Day ${cfg.start} attempt ${attempt}/3 failed:`, err.message);
            if (attempt < 3) {
              await new Promise(r => setTimeout(r, 1000 * attempt));
            }
          }
        }

        if (!success) {
          toast.error(`❌ AI Iteration for Day ${cfg.start} failed: ${lastErr?.message || 'AI request error'}. Generation stopped.`);
          break;
        }

        const mappedItems = itemsToAdd.map((item, i) => ({
          ...item,
          day: liveAppendedCalendar.length + i + 1,
          awarenessLevel: cfg.awareness,
          id: `angle_${liveAppendedCalendar.length + i + 1}`
        }));
        liveAppendedCalendar = [...liveAppendedCalendar, ...mappedItems];

        localStorage.setItem(storageKey, JSON.stringify(liveAppendedCalendar));

        if (targetClientId) {
          const syncTime = new Date().toISOString();
          setClients(prev => prev.map(c => {
            if (c.id === targetClientId) {
              const updatedTasks = {
                ...(c.tasks || {}),
                __creative_brand_brief: updatedBrief,
                __creative_content_calendar: liveAppendedCalendar,
                __creative_version_count: nextVersionNumber,
                __creative_version_history: updatedHistory,
                __meta_updated_at: syncTime
              };
              const updatedClient = { ...c, tasks: updatedTasks, updatedAt: syncTime };
              upsertClient(updatedClient).catch(clientErr => console.warn('[CreativeHub] Iteration card sync warning:', clientErr));
              return updatedClient;
            }
            return c;
          }));
        }

        if (selRef.current?.id === targetClientId || !targetClientId) {
          setCalendar(liveAppendedCalendar);
        }

        totalGenerated += itemsToAdd.length;
        setGenerationProgress(prev => Math.min(30, prev + itemsToAdd.length));

        await new Promise(r => setTimeout(r, 150));
      }

      setIterationPromptNotes('');
      if (totalGenerated === 30) {
        toast.success(`Version ${nextVersionNumber} generated successfully using AI Learning from approval feedback! 🚀`);
      }

    } catch (err) {
      console.error(err);
      toast.error('Iteration Error: ' + err.message);
    } finally {
      setIsGeneratingIteration(false);
      setIsGenerating(false);
    }
  };

  const safeParseJson = (responseText) => {
    if (!responseText || typeof responseText !== 'string') return null;

    let cleanText = responseText.trim();
    cleanText = cleanText
      .replace(/<thought>[\s\S]*?<\/thought>/gi, '')
      .replace(/<reasoning>[\s\S]*?<\/reasoning>/gi, '')
      .replace(/<thinking>[\s\S]*?<\/thinking>/gi, '')
      .trim();

    if (cleanText.startsWith('```')) {
      cleanText = cleanText.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/, '').trim();
    }

    // Strategy: Try multiple parsing approaches
    const tryParse = (text) => {
      // Attempt 1: Direct parse
      try { return JSON.parse(text); } catch (e) {}
      
      // Attempt 2: Fix unescaped control chars inside JSON string values
      try {
        const fixed = text.replace(/(?<=:\s*")((?:[^"\\]|\\.)*)(?=")/gs, (match) => {
          return match.replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\t/g, '\\t');
        });
        return JSON.parse(fixed);
      } catch (e) {}

      // Attempt 3: Brute force - escape all unescaped newlines
      try {
        const bruteFixed = text
          .replace(/\r\n/g, '\\n')
          .replace(/\n/g, '\\n')
          .replace(/\r/g, '\\r')
          .replace(/\t/g, '\\t');
        return JSON.parse(bruteFixed);
      } catch (e) {}
      
      return null;
    };

    // Try parsing the full clean text
    let result = tryParse(cleanText);
    if (result) return result;

    // Try extracting array [...]
    const startIdx = cleanText.indexOf('[');
    const endIdx = cleanText.lastIndexOf(']');
    if (startIdx !== -1 && endIdx > startIdx) {
      result = tryParse(cleanText.substring(startIdx, endIdx + 1));
      if (result) return result;
    }

    // Try extracting single object {...}
    const startObj = cleanText.indexOf('{');
    const endObj = cleanText.lastIndexOf('}');
    if (startObj !== -1 && endObj > startObj) {
      result = tryParse(cleanText.substring(startObj, endObj + 1));
      if (result) {
        return Array.isArray(result) ? result : [result];
      }
    }

    // Last resort: extract individual card objects by splitting on },{ pattern
    try {
      const arrayContent = cleanText.substring(
        cleanText.indexOf('[') + 1,
        cleanText.lastIndexOf(']')
      ).trim();
      
      if (arrayContent) {
        // Split by top-level comma between objects
        const objects = [];
        let depth = 0;
        let current = '';
        for (let i = 0; i < arrayContent.length; i++) {
          const ch = arrayContent[i];
          if (ch === '{') depth++;
          if (ch === '}') depth--;
          current += ch;
          if (depth === 0 && current.trim()) {
            const trimmed = current.trim();
            if (trimmed.startsWith('{')) {
              const parsed = tryParse(trimmed);
              if (parsed) objects.push(parsed);
            }
            current = '';
          }
        }
        if (objects.length > 0) return objects;
      }
    } catch (e) {}

    console.error('[safeParseJson] ALL parse attempts failed. Raw text (first 500 chars):', cleanText.substring(0, 500));
    return null;
  };

  const extractArrayFromResponse = (res) => {
    if (!res) return [];
    if (Array.isArray(res)) return res;
    if (typeof res === 'object') {
      if (Array.isArray(res.calendar)) return res.calendar;
      if (Array.isArray(res.angles)) return res.angles;
      if (Array.isArray(res.data)) return res.data;
      if (Array.isArray(res.items)) return res.items;
      if (Array.isArray(res.cards)) return res.cards;
      if (Array.isArray(res.strategy)) return res.strategy;
      if (Array.isArray(res.results)) return res.results;
      
      const values = Object.values(res);
      if (values.length > 0 && values.every(v => v && typeof v === 'object' && (v.headlineText || v.day || v.angleName))) {
        return values;
      }
      
      if (res.headlineText || res.day || res.angleName || res.visualDirection || res.copyVariations) {
        return [res];
      }
    }
    return [];
  };

  const callDirectAiApi = async (prompt) => {
    let lastServerError = null;
    try {
      const res = await fetch(getApiUrl('/api/generate-direct-ai'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
        signal: AbortSignal.timeout(240000)
      });

      if (res.ok) {
        const data = await res.json();
        if (data.fallbackNotice) {
          toast.warning(data.fallbackNotice, { duration: 8000 });
        }
        const responseText = data.text || '';
        console.log('[callDirectAiApi] Raw response length:', responseText.length, '| First 200 chars:', responseText.substring(0, 200));
        if (responseText) {
          const parsed = safeParseJson(responseText.trim());
          if (parsed) {
            console.log('[callDirectAiApi] Parsed successfully. Items:', Array.isArray(parsed) ? parsed.length : 1);
            return parsed;
          }
          console.error('[callDirectAiApi] safeParseJson returned null. Full raw text:', responseText);
          throw new Error('AI output received but JSON parsing failed. Check browser console for raw AI output.');
        }
        throw new Error('AI returned an empty response.');
      }

      const errData = await res.json().catch(() => ({}));
      lastServerError = errData.error || `Server returned HTTP ${res.status}`;
      if (res.status !== 404) {
        throw new Error(lastServerError);
      }
    } catch (err) {
      if (err.message && !err.message.includes('404') && !err.message.includes('Failed to fetch')) {
        throw err;
      }
      lastServerError = err.message;
    }

    const anthropicKey = import.meta.env?.VITE_ANTHROPIC_API_KEY;
    if (anthropicKey) {
      const modelsToTry = [
        { id: 'claude-opus-5', name: 'Claude Opus 5' },
        { id: 'claude-3-opus-20240229', name: 'Claude 3 Opus' },
        { id: 'claude-3-5-sonnet-20241022', name: 'Claude 3.5 Sonnet' }
      ];
      for (const model of modelsToTry) {
        try {
          const res = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-api-key': anthropicKey,
              'anthropic-version': '2023-06-01',
              'anthropic-dangerously-allow-browser': 'true'
            },
            body: JSON.stringify({
              model: model.id,
              max_tokens: 8192,
              temperature: 0.3,
              system: 'You output strictly raw valid JSON matching the requested schema. Return ONLY valid JSON, do not wrap in markdown tags.',
              messages: [{ role: 'user', content: prompt }]
            })
          });

          if (res.ok) {
            const data = await res.json();
            const responseText = data.content?.[0]?.text || '';
            if (responseText) {
              const parsed = safeParseJson(responseText.trim());
              if (parsed) return parsed;
            }
          }
        } catch (e) {
          console.warn(`[CreativeHub] Direct Anthropic ${model.id} error:`, e.message);
        }
      }
    }

    throw new Error(lastServerError || 'AI Generation Request Failed. Please check backend server.');
  };

  const fileInputRef = useRef(null);

  const handleFileUploadPersona = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsAnalyzingBrief(true);
    toast.info(`Analyzing file: ${file.name}...`);

    try {
      const text = await file.text();
      if (!text || !text.trim()) {
        throw new Error('Uploaded file is empty or could not be converted to readable text.');
      }

      const prompt = `You are an expert Meta Ads Strategic Director. Analyze the following uploaded document content to extract all target audience personas, customer avatars, and ideal customer profiles (ICPs) for high-converting Meta advertising campaigns.

Document Content (${file.name}):
"""
${text.substring(0, 10000)}
"""

Extract all target personas described or implied in this document.
Return ONLY a valid JSON object matching this schema:
{
  "personas": [
    "Persona 1 title & detailed description",
    "Persona 2 title & detailed description"
  ]
}`;

      let extractedPersonas = [];
      const resObj = await callDirectAiApi(prompt);
      if (Array.isArray(resObj?.personas) && resObj.personas.length > 0) {
        extractedPersonas = resObj.personas;
      }

      if (extractedPersonas.length > 0) {
        setPersonas(extractedPersonas);
        toast.success(`Extracted ${extractedPersonas.length} Target Persona(s) from ${file.name}!`);
      } else {
        toast.error('Could not extract distinct personas from the file.');
      }
    } catch (err) {
      console.error(err);
      toast.error('File Analysis Error: ' + err.message);
    } finally {
      setIsAnalyzingBrief(false);
      if (e.target) e.target.value = '';
    }
  };

  const handleAutoFillBrief = async () => {
    setIsAnalyzingBrief(true);
    try {
      const payload = {
        clientName: sel?.name || clientName,
        driveLink: sel?.tasks?.__drive_link || '',
        website: sel?.tasks?.__website || '',
        notes: [sel?.tasks?.__standard_notes, sel?.tasks?.__client_notes].filter(Boolean).join('\n\n')
      };

      let briefObj = null;

      try {
        const res = await fetch(getApiUrl('/api/analyze-brand-brief'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        const contentType = res.headers.get('content-type') || '';
        if (res.ok && contentType.includes('application/json')) {
          const data = await res.json();
          if (data.fallbackNotice) {
            toast.warning(data.fallbackNotice, { duration: 8000 });
          }
          briefObj = data.brief;
        }
      } catch (e) {
        console.warn('API endpoint unavailable, attempting direct fallback:', e);
      }

      if (!briefObj) {
        const prompt = `You are an expert Meta Ads Strategic Director. Analyze the following client onboarding intelligence, notes, website, and drive information to extract and generate the 6 key brand brief inputs for a 30-day Meta Ads Content Strategy.

Client Information:
- Client Name: ${payload.clientName}
- Website URL: ${payload.website || 'Not provided'}
- Google Drive Link: ${payload.driveLink || 'Not provided'}
- Client Onboarding / Standard Notes:
"""
${payload.notes || 'No extra notes provided.'}
"""

CRITICAL ACCURACY INSTRUCTION: Strictly analyze the client name and notes. Do NOT assume or hallucinate that the client is a "Web Design", "Branding", or "Digital Marketing Agency" unless the provided intel explicitly states so.

Return ONLY a valid JSON object matching this exact schema:
{
  "client_name": "Exact Client Name & Real Industry (e.g. ${payload.clientName})",
  "core_offer": "Exact core offer and main service value proposition from the intel",
  "persona_1": "Primary ideal customer persona",
  "persona_2": "Secondary ideal customer persona",
  "core_proof": "Key proof, metrics, or testimonials",
  "cta": "Compelling call to action"
}`;
        briefObj = await callDirectAiApi(prompt);
      }

      if (briefObj) {
        if (briefObj.client_name) setClientName(briefObj.client_name);
        if (briefObj.core_offer) setCoreOffer(briefObj.core_offer);
        if (briefObj.core_proof) setCoreProof(briefObj.core_proof);
        if (briefObj.cta) setCta(briefObj.cta);

        if (briefObj.persona_1) {
          setPersonas([briefObj.persona_1]);
        }
        toast.success('Brief auto-filled from Client Drive & Intel!');
      }
    } catch (err) {
      console.error(err);
      toast.error('Auto-Fill failed: ' + err.message);
    } finally {
      setIsAnalyzingBrief(false);
    }
  };

  const handleGenerateCalendar = async (e) => {
    e?.preventDefault();
    if (!clientName.trim() || !coreOffer.trim()) {
      toast.error('Please enter a Brand Name and Core Offer in the Brand Assets section before generating.');
      setShowCreateModal(true);
      return;
    }

    const validPersonas = personas.map(p => p.trim()).filter(Boolean);
    if (validPersonas.length === 0) {
      toast.error('Client name, core offer, and at least 1 persona are required.');
      return;
    }

    const actualLogo = (brandLogoUrl || sel?.tasks?.__brand_logo_url || brief.brand_logo_url || '').trim();
    if (!actualLogo) {
      toast.error(`⚠️ Logo Required: Please upload or provide a Brand Logo for "${clientName || sel?.name || 'this client'}" in the Brand Assets section before generating the calendar.`);
      setShowCreateModal(true);
      return;
    }

    const targetClientId = sel?.id;
    const storageKey = targetClientId ? `flc_strategy_calendar_${targetClientId}` : 'flc_strategy_calendar_default';

    setIsGenerating(true);
    setShowCreateModal(false);
    setGenerationProgress(0);
    const newBrief = {
      client_name: clientName.trim(),
      core_offer: coreOffer.trim(),
      personas: validPersonas,
      persona_1: validPersonas[0] || '',
      persona_2: validPersonas[1] || '',
      core_proof: coreProof.trim(),
      cta: cta.trim(),
      brand_colors: brandColors.trim(),
      brand_logo_url: brandLogoUrl.trim(),
      brand_niche: brandNiche.trim(),
      brand_logo_position: brandLogoPosition,
      brand_platform: brandPlatform,
      updated_at: new Date().toISOString()
    };

    try {
      let accumulatedCalendar = [];
      const rawColors = (brandColors || brief.brand_colors || sel?.tasks?.__brand_colors || '').trim();
      const colorsStr = (rawColors && rawColors !== '#7C3AED, #0F172A, #059669')
        ? rawColors
        : `Official brand colors of ${newBrief.client_name} (derived from official brand logo)`;
      const rawLogo = actualLogo;
      const isBase64 = rawLogo && (rawLogo.startsWith('data:') || rawLogo.length > 200);
      const safeLogoRef = isBase64 ? 'Official Brand Logo (Overlay logo post-generation)' : (rawLogo ? rawLogo.trim() : 'Attached');
      const logoPromptText = `Reserve brand logo placement space in ${brandLogoPosition || 'Top-Left'} corner. Logo status: ${safeLogoRef}`;

      const clientDataset = extractClientPreferenceDataset(calendar);

      const buildBrowserPrompt = (bPersona, startD, endD, cnt, targetAwareness, angleTheme) => `You are an expert advertising creative director, B2B marketing designer, and conversion-focused visual strategist.
Generate day ${startD} Meta Ad strategy package explicitly tailored for Brand: "${newBrief.client_name}" promoting Core Offer: "${newBrief.core_offer}" targeting Persona: "${bPersona}".

Input Client Brand Assets & Intelligence:
* Brand Name: ${newBrief.client_name}
* Product / Core Offer: ${newBrief.core_offer}
* Industry Niche: ${brandNiche || newBrief.brand_niche || 'B2B Services'}
* Target Audience: ${bPersona}
* Proof / Testimonials: ${newBrief.core_proof || 'Verified client case studies'}
* Call to Action (CTA): ${newBrief.cta || 'Book a Strategy Call'}
* Brand Colors: ${colorsStr}
* Brand Logo Position: ${brandLogoPosition || 'Top-Left'}
* Target Platform: Meta Ads Feed Graphic (STRICTLY 1:1 Square 1080x1080 format)

CLIENT SPECIFIC HISTORICAL PREFERENCE DATASET (Learned from previous approvals/rejections for ${newBrief.client_name}):
✅ APPROVED WINNING PATTERNS (Replicate these tone, hook styles & visual concepts):
${clientDataset.approvedText}

❌ UNAPPROVED / FORBIDDEN PATTERNS (ABSOLUTELY DO NOT REPEAT THESE TOPICS OR WEAK HOOKS):
${clientDataset.unapprovedText}

📝 SPECIFIC TEAM IMPROVEMENT DIRECTIVES:
${clientDataset.teamNotesText}

RULES & STRICT SCHEMA SPECIFICATIONS:
1. Awareness Level: Explicitly build this ad for "${targetAwareness}" level.
2. Angle Strategic Theme: Build the underlying strategy concept around "${angleTheme}".
3. GRAPHIC HEADLINE TEXT ("headlineText"): MUST BE A CREATIVE, CUSTOMER-FACING ADVERTISEMENT GRAPHIC HEADLINE (STRICTLY 6 TO 10 WORDS LONG).
   - EXAMPLES OF GREAT HEADLINES:
     * "Your Best Customer Never Saw You Coming"
     * "Your Customers Scroll Past You Every Single Day"
     * "Stop Wasting 20 Hours Every Single Week"
     * "Waiting Has A Massive Hidden Price Tag"
     * "The Single Biggest Mistake In ${brandNiche || newBrief.brand_niche || 'Operations'}"
     * "Why Top Companies Are Switching To ${newBrief.client_name}"

   - ABSOLUTE PROHIBITION RULE: DO NOT copy internal framework category names, strategy names, or placeholders (such as "Alternative to Traditional Path", "Cost of Inaction", "Unaware", "Solution Aware", or "Problem Aware") into "headlineText"! "headlineText" MUST be 100% original, punchy, external customer-facing headline text written directly to hook ${bPersona}.

4. VISUAL-FIRST IMAGE GENERATION PROMPT ("visualDirection"): The "visualDirection" string MUST be an ultra-detailed, studio-grade image generation prompt (for Midjourney / DALL-E / FLUX) following this exact framework:
   "Act like an expert advertising creative director, visual artist, and 3D graphic designer.
   Goal: Create a premium, high-converting advertising visual for ${newBrief.client_name} promoting ${newBrief.core_offer} to ${bPersona}.
   Platform: Meta Ads Feed Graphic (STRICTLY 1:1 Square 1080x1080 format).

   VISUAL SCENE & ARTISTIC COMPOSITION:
   1. Subject & Scene Concept: Hyper-detailed 3D visual metaphor or cinematic photorealistic scene illustrating ${angleTheme} for ${bPersona} (e.g. sleek glassmorphic UI elements, floating 3D holographic nodes, isometric render depth, Octane render quality).
   2. Logo Placement: Clean logo placement space in ${brandLogoPosition || 'Top-Left'} corner with padding.
   3. Color Scheme & Lighting: Modern dark-mode background accented with official brand colors: ${colorsStr}. Cinematic studio lighting with shallow depth of field.
   4. Atmosphere: High-end professional aesthetic, crisp contrast, clean breathing room.

   STRICT IMAGE TEXT RULES & AVOID CHECKLIST:
   - DO NOT include long paragraphs, bullet points, offer terms, or flyer copy on the image graphic.
   - AT MOST include a single short 3-5 word primary headline at the top.
   - ABSOLUTELY NO raw base64 data strings.
   - AVOID: Overcrowded text, misspelled letters, generic stock photos, low contrast, text wrapping errors, messy cluttered layouts."

5. META AD PRIMARY TEXT CAPTION VARIATIONS ("copyVariations"):
   Generate 5 full-length (70-120+ words each) customer-facing Meta Ad Primary Text captions (directBenefit, problemPas, storyIdentity, proofAuthority, objectionFaq) customized for ${newBrief.client_name}:
   - directBenefit: Primary Text focusing directly on immediate gains of ${newBrief.core_offer}.
   - problemPas: Primary Text focusing on pain, frustration, and cost of inaction regarding ${angleTheme}.
   - storyIdentity: Primary Text focusing on personal story / identity alignment with ${bPersona} tackling ${angleTheme}.
   - proofAuthority: Primary Text focusing on data-backed authority, case study metrics, and proof for ${newBrief.client_name}.
   - objectionFaq: Primary Text tackling false beliefs, tech hurdles, and risk reversal for ${newBrief.core_offer}.

   STRICT PRIMARY TEXT BOUNDARY CONSTRAINTS:
   - BACKGROUND CONTEXT ONLY RULE: All persona descriptions, demographic traits (age, location), psychological profiles, and prompt instructions provided here are internal background intelligence ONLY. DO NOT output persona names, demographic tags, age/location data, or internal prompt labels (such as "Persona Name:", "Demographics:", "Emotional Problem:", "Persona Profile Attribute:") inside any Primary Text string!
   - READY-TO-PUBLISH PRIMARY TEXT: Your output MUST be 100% clean, ready-to-publish customer-facing advertisement Primary Text written directly to hook ${bPersona}.
   - PRIMARY TEXT COPYWRITING STRUCTURE & SPACING: Each Primary Text variation must strictly follow standard high-converting ad structure with clean double-line paragraph breaks:
     * Line 1: Attention-grabbing Hook
     * Body: 2-3 short, punchy paragraphs separated by double line breaks
     * Value Proposition & Offer: (${newBrief.client_name} - ${newBrief.core_offer})
     * Final Line: Clear Call to Action (${newBrief.cta || 'Book a Strategy Call'})
   - NO UNBROKEN WALLS OF TEXT: Use clean paragraph spacing. Do NOT lump Primary Text into giant unformatted blocks of text.

6. Absolutely DO NOT use em-dashes (—) or en-dashes (–). Use standard hyphens (-) or commas.

Output strictly in valid raw JSON format matching this schema array for ${cnt} items (generate exactly ${cnt} distinct item objects in the array):
[
  {
    "day": ${startD},
    "persona": "${bPersona}",
    "awarenessLevel": "${targetAwareness}",
    "angleName": "Name of Strategic Angle (Tailored for ${newBrief.client_name})",
    "headlineText": "Exact 6 to 10 word punchy external graphic headline text for customer",
    "visualDirection": "Act like an expert advertising creative director... [Ultra-detailed 6-part image generation prompt]",
    "copyVariations": {
      "directBenefit": "Ready-to-publish Meta Ad Primary Text caption with Hook, Body paragraphs, Offer & CTA...",
      "problemPas": "Ready-to-publish Meta Ad Primary Text caption with Hook, Body paragraphs, Offer & CTA...",
      "storyIdentity": "Ready-to-publish Meta Ad Primary Text caption with Hook, Body paragraphs, Offer & CTA...",
      "proofAuthority": "Ready-to-publish Meta Ad Primary Text caption with Hook, Body paragraphs, Offer & CTA...",
      "objectionFaq": "Ready-to-publish Meta Ad Primary Text caption with Hook, Body paragraphs, Offer & CTA..."
    }
  }
]`;

      const p1 = validPersonas[0] || 'Primary Persona';
      const awarenessListProgression = ['Unaware', 'Problem Aware', 'Solution Aware', 'Product Aware', 'Most Aware'];

      const FLC_STRATEGY_MATRIX = {
        'Unaware': [
          `The Hidden Cost of Manual ${newBrief.core_offer || 'Operations'} Drag`,
          `Why ${p1} Fall Behind Competitors Today`,
          `The Silent Opportunity In Modernizing ${newBrief.core_offer || 'Services'}`
        ],
        'Problem Aware': [
          `Why Traditional Approaches To ${newBrief.core_offer || 'Workflows'} Are Failing`,
          `The Cost Of Inaction And Inefficiency In ${newBrief.core_offer || 'Operations'}`,
          `Why ${p1} Waste Time On Legacy Processes`
        ],
        'Solution Aware': [
          `The Modern Mechanism For Scalable ${newBrief.core_offer || 'Growth'}`,
          `Why ${newBrief.client_name} Outperforms Standard Industry Methods`,
          `Eliminating Operational Friction For ${p1}`
        ],
        'Product Aware': [
          `How ${newBrief.client_name} Accelerates Growth With ${newBrief.core_offer || 'Systems'}`,
          `Verified Client Results & Turnaround Milestones`,
          `The Complete ROI Breakdown Of ${newBrief.client_name}'s Solution`
        ],
        'Most Aware': [
          `Claim Your Custom ${newBrief.core_offer || 'Growth'} Blueprint With ${newBrief.client_name}`,
          `Risk-Free Performance Guarantee For ${p1}`,
          `Reserve Your Implementation Slot With ${newBrief.client_name}`
        ]
      };

      const awarenessProgression = ['Unaware', 'Problem Aware', 'Solution Aware', 'Product Aware', 'Most Aware'];
      const batchConfigs = [];
      for (let d = 1; d <= 30; d++) {
        const awarenessIdx = Math.min(4, Math.floor((d - 1) / 6));
        const awareness = awarenessProgression[awarenessIdx];
        batchConfigs.push({
          persona: p1,
          start: d,
          end: d,
          count: 1,
          awareness: awareness,
          angleTheme: `${awareness} Strategic Concept ${((d - 1) % 6) + 1}`,
          label: `Card ${d} (${awareness})`
        });
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

      toast.info(`Strategizing Content Calendar for ${clientName}... Cards will generate in background!`);
      
      if (selRef.current?.id === targetClientId || !targetClientId) {
        setCalendar([]);
      }
      localStorage.setItem(storageKey, JSON.stringify([]));
      cancelGenerationRef.current = false;
      
      let totalGenerated = 0;

      for (const cfg of batchConfigs) {
        if (cancelGenerationRef.current) {
          toast.warning('Calendar generation stopped by user.');
          break;
        }
        let itemsToAdd = [];
        let success = false;
        let lastErr = null;

        for (let attempt = 1; attempt <= 10; attempt++) {
          try {
            const prompt = buildBrowserPrompt(cfg.persona, cfg.start, cfg.end, cfg.count, cfg.awareness, cfg.angleTheme);
            const res = await callDirectAiApi(prompt);
            const rawItems = extractArrayFromResponse(res);
            if (rawItems.length > 0) {
              const exactItems = rawItems.slice(0, cfg.count);
              itemsToAdd = sanitizeEmDashes(exactItems);
              success = true;
              break;
            } else {
              throw new Error("AI returned empty response");
            }
          } catch (err) {
            lastErr = err;
            console.warn(`[CreativeHub] Card ${cfg.start} attempt ${attempt}/10 failed:`, err.message);
            if (attempt < 10) {
              const isOverloaded = err.message?.includes('Overloaded') || err.message?.includes('overloaded') || err.message?.includes('429') || err.message?.includes('529');
              const waitSec = isOverloaded ? 15 : 8;
              toast.warning(`⏳ API busy - retrying Card ${cfg.start} (Attempt ${attempt}/10)... Waiting ${waitSec}s...`, { duration: waitSec * 1000 });
              await new Promise(r => setTimeout(r, waitSec * 1000));
            }
          }
        }

        if (!success) {
          toast.error(`❌ Card ${cfg.start} failed after 10 AI retries (${lastErr?.message || 'API limit'}). Generation stopped.`);
          break;
        }

        const mappedItems = itemsToAdd.map((item, i) => ({
          ...item,
          day: accumulatedCalendar.length + i + 1,
          awarenessLevel: cfg.awareness,
          id: `angle_${accumulatedCalendar.length + i + 1}`
        }));
        accumulatedCalendar = [...accumulatedCalendar, ...mappedItems];

        if (storageKey) {
          localStorage.setItem(storageKey, JSON.stringify(accumulatedCalendar));
        }

        if (targetClientId) {
          const syncTime = new Date().toISOString();
          setClients(prev => prev.map(c => {
            if (c.id === targetClientId) {
              const updatedTasks = {
                ...(c.tasks || {}),
                __creative_brand_brief: newBrief,
                __creative_content_calendar: accumulatedCalendar,
                __meta_updated_at: syncTime
              };
              const updatedClient = { ...c, tasks: updatedTasks, updatedAt: syncTime };
              upsertClient(updatedClient).catch(clientErr => console.warn('[CreativeHub] Card sync warning:', clientErr));
              return updatedClient;
            }
            return c;
          }));
        }

        if (selRef.current?.id === targetClientId || !targetClientId) {
          setCalendar(accumulatedCalendar);
        }

        totalGenerated += itemsToAdd.length;
        setGenerationProgress(accumulatedCalendar.length);

        await new Promise(r => setTimeout(r, 150));
      }

      if (accumulatedCalendar.length === 30) {
        toast.success(`✅ 30 Meta Ads Strategy Angles for ${clientName} generated successfully!`);
      } else {
        toast.info(`ℹ️ ${accumulatedCalendar.length} of 30 cards ready.`);
      }
    } catch (err) {
      console.error(err);
      toast.error('Generation Error: ' + err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyText = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const syncCalendarToDB = async (cal) => {
    if (!sel) return;
    const updatedTasks = {
      ...(sel?.tasks || {}),
      __creative_content_calendar: cal,
      __meta_updated_at: new Date().toISOString()
    };
    const updatedClient = { ...sel, tasks: updatedTasks, updatedAt: new Date().toISOString() };
    await upsertClient(updatedClient).catch(() => {});
    setClients(prev => prev.map(c => c.id === sel.id ? updatedClient : c));
  };

  const handleToggleCardSelection = (e, item) => {
    e.stopPropagation();
    const uniqueId = item.id || item.angleName;
    setSelectedCards(prev => prev.includes(uniqueId) ? prev.filter(c => c !== uniqueId) : [...prev, uniqueId]);
  };

  const handleBulkDelete = () => {
    if (!window.confirm(`Are you sure you want to delete ${selectedCards.length} selected strategies?`)) return;
    const newCal = calendar.filter(c => !selectedCards.includes(c.id || c.angleName));
    setCalendar(newCal);
    setSelectedCards([]);
    const storageKey = sel?.id ? `flc_strategy_calendar_${sel.id}` : 'flc_strategy_calendar_default';
    localStorage.setItem(storageKey, JSON.stringify(newCal));
    toast.success(`${selectedCards.length} strategies deleted.`);
    syncCalendarToDB(newCal);
  };
  
  const handleDeleteSingle = (e, itemToDelete) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this strategy?')) return;
    const uniqueId = itemToDelete.id || itemToDelete.angleName;
    const newCal = calendar.filter(c => c !== itemToDelete);
    setCalendar(newCal);
    setSelectedCards(prev => prev.filter(id => id !== uniqueId));
    const storageKey = sel?.id ? `flc_strategy_calendar_${sel.id}` : 'flc_strategy_calendar_default';
    localStorage.setItem(storageKey, JSON.stringify(newCal));
    toast.success('Strategy deleted.');
    syncCalendarToDB(newCal);
  };

  const activePersonas = Array.from(new Set(calendar.map(c => c.persona))).filter(Boolean);

  const filteredCalendar = calendar.filter(item => {
    if (selectedPersonaFilter.startsWith('persona_')) {
      const idx = parseInt(selectedPersonaFilter.replace('persona_', ''), 10) - 1;
      const targetPersonaStr = activePersonas[idx];
      if (item.persona !== targetPersonaStr) return false;
    }
    if (selectedAwarenessFilter !== 'all' && item.awarenessLevel !== selectedAwarenessFilter) return false;
    return true;
  });

  const handleSelectAll = () => {
    const allVisibleIds = filteredCalendar.map(c => c.id || c.angleName).filter(Boolean);
    if (allVisibleIds.length === 0) return;
    
    const areAllSelected = allVisibleIds.every(id => selectedCards.includes(id));
    
    if (areAllSelected) {
      setSelectedCards(prev => prev.filter(id => !allVisibleIds.includes(id)));
    } else {
      setSelectedCards(prev => {
        const newSet = new Set([...prev, ...allVisibleIds]);
        return Array.from(newSet);
      });
    }
  };

  return (
    <div style={{ padding: '4px 0 40px 0', fontFamily: 'Inter, sans-serif' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 20, padding: '20px 28px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.03)', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 11, fontWeight: 800, color: '#7c3aed', background: '#f5f3ff', border: '1px solid #ddd6fe', padding: '2px 10px', borderRadius: 20, letterSpacing: '0.8px', textTransform: 'uppercase' }}>
              Version {currentVersionCount} Strategy
            </span>
            <span style={{ fontSize: 13, color: '#64748b', fontWeight: 600 }}>
              Client: <strong style={{ color: '#0f172a' }}>{sel?.name || 'Selected Client'}</strong>
            </span>
            {calendar.length > 0 && (
              <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginLeft: 8 }}>
                <span style={{ fontSize: 10, fontWeight: 900, color: '#166534', background: '#dcfce7', border: '1px solid #86efac', padding: '2px 8px', borderRadius: 12 }}>
                  {approvedCount} Approved ✅
                </span>
                <span style={{ fontSize: 10, fontWeight: 900, color: '#9a3412', background: '#ffedd5', border: '1px solid #fdba74', padding: '2px 8px', borderRadius: 12 }}>
                  {unapprovedCount} Unapproved ❌
                </span>
                {improvementCount > 0 && (
                  <span style={{ fontSize: 10, fontWeight: 900, color: '#92400e', background: '#fef3c7', border: '1px solid #fcd34d', padding: '2px 8px', borderRadius: 12 }}>
                    {improvementCount} Needs Work ⚡
                  </span>
                )}
              </div>
            )}
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 900, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
            <Sparkles size={24} color="#7c3aed" /> Creative Hub — Meta Ads Strategy Angles
          </h1>
        </div>

        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          {calendar.length > 0 && (
            <button
              type="button"
              onClick={() => {
                const currentPersonas = Array.isArray(personas) && personas.length > 0 ? personas : [''];
                setIterationPersonas([...currentPersonas]);
                setShowIterationModal(true);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '11px 20px',
                borderRadius: 12,
                background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: 13,
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)',
                transition: 'all 0.2s ease'
              }}
            >
              <Bot size={16} /> Generate Next Iteration 🧠
            </button>
          )}

          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '11px 22px',
              borderRadius: 12,
              background: 'linear-gradient(135deg, #7c3aed 0%, #9333ea 100%)',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: 13,
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(124, 58, 237, 0.35)',
              transition: 'all 0.2s ease'
            }}
          >
            <Plus size={16} /> New Brief
          </button>
        </div>
      </div>

      {calendar.length > 0 && (
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 16, padding: '14px 20px', marginBottom: 24, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 16, boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <button
              onClick={() => setSelectedPersonaFilter('all')}
              style={{ padding: '6px 14px', borderRadius: 8, border: '1px solid', borderColor: selectedPersonaFilter === 'all' ? '#7c3aed' : '#e2e8f0', background: selectedPersonaFilter === 'all' ? '#f5f3ff' : '#ffffff', color: selectedPersonaFilter === 'all' ? '#7c3aed' : '#64748b', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}
            >
              All {calendar.length} Angles
            </button>
            {activePersonas.map((p, i) => (
              <button
                key={i}
                onClick={() => setSelectedPersonaFilter(`persona_${i + 1}`)}
                style={{ padding: '6px 14px', borderRadius: 8, border: '1px solid', borderColor: selectedPersonaFilter === `persona_${i + 1}` ? '#7c3aed' : '#e2e8f0', background: selectedPersonaFilter === `persona_${i + 1}` ? '#f5f3ff' : '#ffffff', color: selectedPersonaFilter === `persona_${i + 1}` ? '#7c3aed' : '#64748b', fontWeight: 700, fontSize: 12, cursor: 'pointer', maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                title={p || `Persona ${i + 1}`}
              >
                P{i + 1}: {formatPersonaTag(p, `Persona ${i + 1}`)}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {calendar.length > 0 && (
              <button
                onClick={handleSelectAll}
                style={{ padding: '6px 12px', borderRadius: 8, border: '1px solid #cbd5e1', background: '#f8fafc', color: '#475569', fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
              >
                {filteredCalendar.length > 0 && filteredCalendar.every(c => selectedCards.includes(c.id || c.angleName)) ? 'Deselect All' : 'Select All'}
              </button>
            )}
            {selectedCards.length > 0 && (
              <button
                onClick={handleBulkDelete}
                style={{ padding: '6px 12px', borderRadius: 8, border: 'none', background: '#ef4444', color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
              >
                Delete Selected ({selectedCards.length})
              </button>
            )}
            <span style={{ fontSize: 11, fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
              Awareness:
            </span>
            <select
              value={selectedAwarenessFilter}
              onChange={e => setSelectedAwarenessFilter(e.target.value)}
              style={{ padding: '6px 12px', borderRadius: 8, border: '1px solid #cbd5e1', background: '#ffffff', color: '#0f172a', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
            >
              <option value="all">All 5 Levels</option>
              {AWARENESS_LEVELS.map(lvl => (
                <option key={lvl.id} value={lvl.id}>{lvl.label}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {isGenerating && (
        <div style={{ marginBottom: 24, padding: 24, background: '#ffffff', borderRadius: 16, border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h4 style={{ fontSize: 15, fontWeight: 800, color: '#0f172a', margin: 0 }}>Generating Meta Ads Strategy...</h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#7c3aed' }}>{generationProgress} / 30 Strategies</span>
              <button
                type="button"
                onClick={handleStopGeneration}
                style={{
                  padding: '5px 14px',
                  borderRadius: 8,
                  background: '#fff7ed',
                  border: '1px solid #fdba74',
                  color: '#ea580c',
                  fontWeight: 800,
                  fontSize: 12,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6
                }}
              >
                Stop Generation 🛑
              </button>
            </div>
          </div>
          <div style={{ width: '100%', height: 10, background: '#f1f5f9', borderRadius: 10, overflow: 'hidden' }}>
            <div style={{ width: `${(generationProgress / 30) * 100}%`, height: '100%', background: 'linear-gradient(90deg, #7c3aed, #9333ea)', transition: 'width 0.3s ease' }}></div>
          </div>
          <p style={{ margin: '8px 0 0', fontSize: 12, color: '#64748b' }}>Crafting highly converting angles and copy. Click "Stop Generation" to halt anytime.</p>
        </div>
      )}

      {calendar.length === 0 && !isGenerating && (
        <div style={{ background: '#ffffff', border: '2px dashed #cbd5e1', borderRadius: 24, padding: '70px 40px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
          <div style={{ width: 60, height: 60, borderRadius: 18, background: '#f5f3ff', border: '1px solid #ddd6fe', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
            <Sparkles size={30} color="#7c3aed" />
          </div>
          <h3 style={{ fontSize: 20, fontWeight: 900, color: '#0f172a', marginBottom: 8 }}>
            No Creative Angles Generated Yet for {sel?.name || 'this client'}
          </h3>
          <p style={{ fontSize: 13, color: '#64748b', maxWidth: 480, margin: '0 auto 24px', lineHeight: 1.6 }}>
            Click <strong>"Generate Strategy Angles"</strong> to input your brand brief (Offer, Personas, Proof, CTA) and generate 30 distinct Meta Ads Creative Strategy Angles.
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            style={{ padding: '11px 26px', borderRadius: 12, background: '#7c3aed', color: '#ffffff', fontWeight: 800, fontSize: 13, border: 'none', cursor: 'pointer', boxShadow: '0 4px 14px rgba(124, 58, 237, 0.35)' }}
          >
            + Generate Strategy Angles
          </button>
        </div>
      )}

      {filteredCalendar.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
          {filteredCalendar.map((item, idx) => {
            const levelObj = AWARENESS_LEVELS.find(l => l.id === item.awarenessLevel) || AWARENESS_LEVELS[0];
            const angleNumber = item.day || idx + 1;
            const reviewStatus = item.reviewStatus;

            const isApproved = reviewStatus === 'approved';
            const isUnapproved = reviewStatus === 'unapproved';
            const isNeedsImprovement = reviewStatus === 'needs_improvement';

            return (
              <div
                key={angleNumber}
                onClick={() => setSelectedAngleModal(item)}
                style={{
                  background: isApproved ? '#f0fdf4' : isUnapproved ? '#fef2f2' : isNeedsImprovement ? '#fffbeb' : '#ffffff',
                  border: isApproved ? '2px solid #10b981' : isUnapproved ? '2px solid #ef4444' : isNeedsImprovement ? '2px solid #f59e0b' : '1.5px solid #e2e8f0',
                  opacity: isUnapproved ? 0.85 : 1,
                  borderRadius: 18,
                  padding: '18px 20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                  position: 'relative',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <input 
                      type="checkbox" 
                      checked={selectedCards.includes(item.id || item.angleName)}
                      onClick={e => e.stopPropagation()}
                      onChange={(e) => handleToggleCardSelection(e, item)}
                      style={{ cursor: 'pointer', width: 16, height: 16, accentColor: '#7c3aed' }}
                    />
                    <div style={{ width: 34, height: 30, borderRadius: 8, background: '#f5f3ff', border: '1px solid #ddd6fe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 11, color: '#7c3aed' }}>
                      A#{angleNumber}
                    </div>
                    <span style={{ fontSize: 10, fontWeight: 900, color: '#7c3aed', background: '#f5f3ff', border: '1px solid #ddd6fe', padding: '2px 7px', borderRadius: 10 }}>
                      {angleNumber <= 30 ? 'P1' : 'P2'}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    {isApproved && (
                      <span style={{ fontSize: 10, fontWeight: 900, color: '#166534', background: '#dcfce7', border: '1px solid #86efac', padding: '2px 8px', borderRadius: 10 }}>
                        Approved ✅
                      </span>
                    )}
                    {isUnapproved && (
                      <span style={{ fontSize: 10, fontWeight: 900, color: '#991b1b', background: '#fee2e2', border: '1px solid #fca5a5', padding: '2px 8px', borderRadius: 10 }}>
                        Unapproved ❌
                      </span>
                    )}
                    {isNeedsImprovement && (
                      <span style={{ fontSize: 10, fontWeight: 900, color: '#92400e', background: '#fef3c7', border: '1px solid #fcd34d', padding: '2px 8px', borderRadius: 10 }}>
                        Needs Work ⚡
                      </span>
                    )}
                    {!reviewStatus && (
                      <span style={{ fontSize: 10, fontWeight: 800, color: '#64748b', background: '#f1f5f9', border: '1px solid #cbd5e1', padding: '2px 8px', borderRadius: 10 }}>
                        Pending ⏳
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: 15, fontWeight: 900, color: '#0f172a', lineHeight: 1.3, marginBottom: 4 }}>
                    {item.angleName || `Strategic Angle ${angleNumber}`}
                  </div>
                  {item.headlineText && (
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#6d28d9', background: '#faf5ff', padding: '6px 10px', borderRadius: 8, border: '1px solid #e9d5ff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      "{item.headlineText}"
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: 10, marginTop: 2 }}>
                  <span style={{ fontSize: 10, fontWeight: 800, color: levelObj.color, background: levelObj.bg, border: `1px solid ${levelObj.border}`, padding: '2px 8px', borderRadius: 12 }}>
                    {levelObj.label}
                  </span>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 11, fontWeight: 800, color: '#7c3aed' }}>
                    {item.teamNotes && String(item.teamNotes).trim().length > 0 && (
                      <span style={{ fontSize: 10, color: '#059669', background: '#ecfdf5', padding: '1px 6px', borderRadius: 6 }}>
                        📝 Note
                      </span>
                    )}
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Edit3 size={12} /> Edit
                    </span>
                    <button 
                      onClick={(e) => handleDeleteSingle(e, item)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444', borderRadius: 6 }}
                      title="Delete Angle"
                    >
                      <X size={14} strokeWidth={3} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selectedAngleModal && (() => {
        const activeModalItem = calendar.find(c => (c.day || c.id) === (selectedAngleModal.day || selectedAngleModal.id)) || selectedAngleModal;
        const modalAngleNumber = activeModalItem.day || calendar.findIndex(c => (c.day || c.id) === (activeModalItem.day || activeModalItem.id)) + 1;
        const modalLevelObj = AWARENESS_LEVELS.find(l => l.id === activeModalItem.awarenessLevel) || AWARENESS_LEVELS[0];
        const activeTab = activeCopyTabs[modalAngleNumber] || 'directBenefit';

        return (
          <div
            style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.65)', backdropFilter: 'blur(6px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
            onClick={() => setSelectedAngleModal(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={e => e.stopPropagation()}
              style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 24, width: 'min(780px, 95vw)', maxHeight: '90vh', overflowY: 'auto', padding: 32, boxShadow: '0 24px 64px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column', gap: 20 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #f1f5f9', paddingBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 48, height: 44, borderRadius: 14, background: '#f5f3ff', border: '1.5px solid #ddd6fe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 15, color: '#7c3aed' }}>
                    A#{modalAngleNumber}
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 11, fontWeight: 900, color: '#7c3aed', background: '#f5f3ff', border: '1px solid #ddd6fe', padding: '2px 8px', borderRadius: 10 }}>
                        {modalAngleNumber <= 30 ? 'Persona 1' : 'Persona 2'}
                      </span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: '#64748b' }}>
                        {formatPersonaTag(activeModalItem.persona, modalAngleNumber <= 30 ? 'Persona 1' : 'Persona 2')}
                      </span>
                      <span style={{ fontSize: 11, fontWeight: 800, color: modalLevelObj.color, background: modalLevelObj.bg, border: `1px solid ${modalLevelObj.border}`, padding: '2px 10px', borderRadius: 20 }}>
                        {modalLevelObj.label}
                      </span>
                    </div>
                    <h2 style={{ fontSize: 20, fontWeight: 900, color: '#0f172a', margin: 0 }}>
                      {activeModalItem.angleName || `Strategic Angle ${modalAngleNumber}`}
                    </h2>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <button
                    type="button"
                    disabled={modalAngleNumber <= 1}
                    onClick={() => {
                      const prevItem = calendar.find(c => (c.day || c.id) === modalAngleNumber - 1);
                      if (prevItem) setSelectedAngleModal(prevItem);
                    }}
                    style={{ padding: '6px 12px', borderRadius: 10, background: '#f8fafc', border: '1px solid #cbd5e1', fontSize: 12, fontWeight: 800, color: '#475569', cursor: modalAngleNumber <= 1 ? 'not-allowed' : 'pointer', opacity: modalAngleNumber <= 1 ? 0.5 : 1 }}
                  >
                    ← Prev
                  </button>

                  <button
                    type="button"
                    disabled={modalAngleNumber >= calendar.length}
                    onClick={() => {
                      const nextItem = calendar.find(c => (c.day || c.id) === modalAngleNumber + 1);
                      if (nextItem) setSelectedAngleModal(nextItem);
                    }}
                    style={{ padding: '6px 12px', borderRadius: 10, background: '#f8fafc', border: '1px solid #cbd5e1', fontSize: 12, fontWeight: 800, color: '#475569', cursor: modalAngleNumber >= calendar.length ? 'not-allowed' : 'pointer', opacity: modalAngleNumber >= calendar.length ? 0.5 : 1 }}
                  >
                    Next →
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedAngleModal(null)}
                    style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', cursor: 'pointer' }}
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <label style={LABEL_STYLE}>Graphic Headline Text (Editable)</label>
                  <button
                    onClick={() => handleCopyText(activeModalItem.headlineText || '', `hl_${modalAngleNumber}`)}
                    style={{ background: 'none', border: 'none', color: '#7c3aed', fontSize: 11, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
                  >
                    {copiedKey === `hl_${modalAngleNumber}` ? <Check size={12} /> : <Copy size={12} />} Copy Headline
                  </button>
                </div>
                <input
                  value={activeModalItem.headlineText || ''}
                  onChange={e => handleUpdateCardField(modalAngleNumber, 'headlineText', e.target.value)}
                  placeholder="Headline text to display on ad graphic..."
                  style={{ ...INPUT_STYLE, fontWeight: 800, color: '#5b21b6', background: '#faf5ff', borderColor: '#e9d5ff' }}
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <label style={LABEL_STYLE}>GPT Image 2 Prompt / Visual Direction (Ruben Hassid Refined ✨)</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <button
                      type="button"
                      onClick={() => handleRefinePromptRubenHassid(activeModalItem, modalAngleNumber)}
                      disabled={refiningPrompts[modalAngleNumber]}
                      style={{
                        background: refiningPrompts[modalAngleNumber] ? '#94a3b8' : 'linear-gradient(135deg, #7c3aed 0%, #9333ea 100%)',
                        border: 'none',
                        color: '#ffffff',
                        fontSize: 11,
                        fontWeight: 800,
                        borderRadius: 8,
                        padding: '4px 10px',
                        cursor: refiningPrompts[modalAngleNumber] ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                        boxShadow: '0 2px 6px rgba(124, 58, 237, 0.3)'
                      }}
                    >
                      {refiningPrompts[modalAngleNumber] ? <RefreshCw size={12} className="animate-spin" /> : <Sparkles size={12} />} Refine Prompt (Ruben Hassid AI)
                    </button>
                    <button
                      onClick={() => handleCopyText(activeModalItem.visualDirection || '', `vis_${modalAngleNumber}`)}
                      style={{ background: 'none', border: 'none', color: '#7c3aed', fontSize: 11, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
                    >
                      {copiedKey === `vis_${modalAngleNumber}` ? <Check size={12} /> : <Copy size={12} />} Copy Prompt
                    </button>
                  </div>
                </div>
                <textarea
                  rows={4}
                  value={activeModalItem.visualDirection || ''}
                  onChange={e => handleUpdateCardField(modalAngleNumber, 'visualDirection', e.target.value)}
                  placeholder="Detailed visual direction prompt..."
                  style={{ ...INPUT_STYLE, fontFamily: 'monospace', fontSize: 12, lineHeight: 1.5, resize: 'vertical' }}
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <label style={LABEL_STYLE}>Primary Text Variations (5 Copy Angles)</label>
                  <button
                    onClick={() => handleCopyText(activeModalItem.copyVariations?.[activeTab] || '', `copy_${modalAngleNumber}_${activeTab}`)}
                    style={{ background: 'none', border: 'none', color: '#7c3aed', fontSize: 11, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
                  >
                    {copiedKey === `copy_${modalAngleNumber}_${activeTab}` ? <Check size={12} /> : <Copy size={12} />} Copy Active Copy
                  </button>
                </div>

                <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 6, marginBottom: 8 }}>
                  {COPY_TYPES.map(type => (
                    <button
                      key={type.id}
                      onClick={() => setActiveCopyTabs(prev => ({ ...prev, [modalAngleNumber]: type.id }))}
                      style={{
                        padding: '6px 12px',
                        borderRadius: 8,
                        border: '1px solid',
                        borderColor: activeTab === type.id ? '#7c3aed' : '#e2e8f0',
                        background: activeTab === type.id ? '#f5f3ff' : '#ffffff',
                        color: activeTab === type.id ? '#7c3aed' : '#64748b',
                        fontWeight: 700,
                        fontSize: 11,
                        cursor: 'pointer',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>

                <textarea
                  rows={6}
                  value={activeModalItem.copyVariations?.[activeTab] || ''}
                  onChange={e => handleUpdateCardField(modalAngleNumber, `copy_${activeTab}`, e.target.value)}
                  placeholder={`Enter ${COPY_TYPES.find(t => t.id === activeTab)?.label} copy variation...`}
                  style={{ ...INPUT_STYLE, fontSize: 13, lineHeight: 1.6, resize: 'vertical' }}
                />
              </div>

              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 14, padding: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <div style={{ fontSize: 11, fontWeight: 900, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.8px', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <FileText size={14} color="#7c3aed" /> Team Performance Notes (Guides Next Version)
                  </div>
                  {activeModalItem.teamNotes && String(activeModalItem.teamNotes).trim().length > 0 && (
                    <span style={{ fontSize: 10, fontWeight: 800, color: '#059669', background: '#ecfdf5', padding: '2px 8px', borderRadius: 6 }}>
                      Saved 📝
                    </span>
                  )}
                </div>
                <textarea
                  rows={2}
                  value={activeModalItem.teamNotes || ''}
                  onChange={e => handleUpdateTeamNotes(modalAngleNumber, e.target.value)}
                  placeholder="Add performance notes (e.g. 'This hook got 4.8% CTR for CFOs — test more calculation angles in Next Version')..."
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 10,
                    border: '1px solid #cbd5e1',
                    background: '#ffffff',
                    fontSize: 12,
                    color: '#0f172a',
                    outline: 'none',
                    resize: 'none',
                    lineHeight: 1.4,
                    fontFamily: 'inherit'
                  }}
                />
              </div>

              <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
                  <div style={{ fontSize: 12, fontWeight: 900, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Review Status Action:
                  </div>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <button
                      type="button"
                      onClick={() => handleUpdateReviewStatus(modalAngleNumber, 'approved')}
                      style={{
                        padding: '8px 16px',
                        borderRadius: 10,
                        fontSize: 12,
                        fontWeight: 800,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        background: activeModalItem.reviewStatus === 'approved' ? '#10b981' : '#f0fdf4',
                        color: activeModalItem.reviewStatus === 'approved' ? '#ffffff' : '#15803d',
                        border: '1.5px solid #86efac',
                        boxShadow: activeModalItem.reviewStatus === 'approved' ? '0 2px 8px rgba(16,185,129,0.3)' : 'none'
                      }}
                    >
                      <Check size={14} /> Approve
                    </button>

                    <button
                      type="button"
                      onClick={() => handleUpdateReviewStatus(modalAngleNumber, 'unapproved')}
                      style={{
                        padding: '8px 16px',
                        borderRadius: 10,
                        fontSize: 12,
                        fontWeight: 800,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        background: activeModalItem.reviewStatus === 'unapproved' ? '#ef4444' : '#fef2f2',
                        color: activeModalItem.reviewStatus === 'unapproved' ? '#ffffff' : '#b91c1c',
                        border: '1.5px solid #fca5a5',
                        boxShadow: activeModalItem.reviewStatus === 'unapproved' ? '0 2px 8px rgba(239,68,68,0.3)' : 'none'
                      }}
                    >
                      <X size={14} /> Unapprove
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setOpenImprovementBoxes(prev => ({ ...prev, [modalAngleNumber]: !prev[modalAngleNumber] }));
                      }}
                      style={{
                        padding: '8px 16px',
                        borderRadius: 10,
                        fontSize: 12,
                        fontWeight: 800,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        background: openImprovementBoxes[modalAngleNumber] ? '#f59e0b' : '#fffbeb',
                        color: openImprovementBoxes[modalAngleNumber] ? '#ffffff' : '#b45309',
                        border: '1.5px solid #fcd34d',
                        boxShadow: openImprovementBoxes[modalAngleNumber] ? '0 2px 8px rgba(245,158,11,0.3)' : 'none'
                      }}
                    >
                      <Sparkles size={14} /> Need Improvement
                    </button>
                  </div>
                </div>

                {openImprovementBoxes[modalAngleNumber] && (
                  <div style={{ background: '#fffbeb', border: '1.5px solid #fcd34d', borderRadius: 14, padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div style={{ fontSize: 11, fontWeight: 900, color: '#92400e', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Sparkles size={14} /> Specify Improvement Feedback for Angle #{modalAngleNumber}:
                    </div>
                    <textarea
                      rows={3}
                      value={feedbackInputs[modalAngleNumber] || ''}
                      onChange={e => setFeedbackInputs(prev => ({ ...prev, [modalAngleNumber]: e.target.value }))}
                      placeholder="e.g. Make the hook more aggressive, focus visual on a 3D glassmorphism dashboard, and emphasize 30-day ROI..."
                      disabled={regeneratingAngles[modalAngleNumber]}
                      style={{ ...INPUT_STYLE, resize: 'none', background: '#ffffff', fontSize: 12, lineHeight: 1.5, borderColor: '#fde68a' }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                      <button
                        type="button"
                        onClick={() => setOpenImprovementBoxes(prev => ({ ...prev, [modalAngleNumber]: false }))}
                        disabled={regeneratingAngles[modalAngleNumber]}
                        style={{ padding: '6px 14px', borderRadius: 8, background: '#fef3c7', color: '#92400e', border: '1px solid #fcd34d', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRegenerateAngle(activeModalItem, modalAngleNumber)}
                        disabled={regeneratingAngles[modalAngleNumber]}
                        style={{
                          padding: '6px 18px',
                          borderRadius: 8,
                          background: regeneratingAngles[modalAngleNumber] ? '#94a3b8' : 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
                          color: '#ffffff',
                          border: 'none',
                          fontSize: 12,
                          fontWeight: 800,
                          cursor: regeneratingAngles[modalAngleNumber] ? 'not-allowed' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                          boxShadow: '0 2px 6px rgba(217,119,6,0.3)'
                        }}
                      >
                        {regeneratingAngles[modalAngleNumber] ? (
                          <>
                            <RefreshCw size={12} className="animate-spin" /> Regenerating Content with AI...
                          </>
                        ) : (
                          <>
                            <Sparkles size={12} /> Regenerate Content
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        );
      })()}

      {showCreateModal && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.55)', backdropFilter: 'blur(4px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
          onClick={() => !isGenerating && setShowCreateModal(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={e => e.stopPropagation()}
            style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 24, width: 'min(620px, 95vw)', maxHeight: '90vh', overflowY: 'auto', padding: 32, boxShadow: '0 24px 64px rgba(0,0,0,0.18)' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, borderBottom: '1px solid #f1f5f9', paddingBottom: 16 }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 900, color: '#7c3aed', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 4 }}>
                  Meta Ads Creative Agent
                </div>
                <h2 style={{ fontSize: 20, fontWeight: 900, color: '#0f172a', margin: 0 }}>
                  Create Strategy Angles
                </h2>
              </div>
              <button 
                onClick={() => setShowCreateModal(false)} 
                style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, width: 34, height: 34, color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                title="Close modal"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleGenerateCalendar} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

              <div style={{ background: '#f5f3ff', border: '1.5px solid #ddd6fe', borderRadius: 16, padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 4 }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 800, color: '#7c3aed', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Sparkles size={14} /> AI Brand Brief Auto-Fill
                  </div>
                  <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>
                    Auto-extract Offer, Personas, Proof & CTA directly from {sel?.name || 'Client'}'s Website & onboarding intel.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleAutoFillBrief}
                  disabled={isAnalyzingBrief || isGenerating}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 10,
                    background: isAnalyzingBrief ? '#94a3b8' : 'linear-gradient(135deg, #7c3aed 0%, #9333ea 100%)',
                    color: '#ffffff',
                    fontWeight: 800,
                    fontSize: 12,
                    border: 'none',
                    cursor: isAnalyzingBrief ? 'not-allowed' : 'pointer',
                    whiteSpace: 'nowrap',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    boxShadow: '0 2px 8px rgba(124,58,237,0.3)'
                  }}
                >
                  {isAnalyzingBrief ? (
                    <>
                      <RefreshCw size={14} className="animate-spin" /> Analyzing Intel...
                    </>
                  ) : (
                    <>
                      <Bot size={14} /> Auto-Fill Brief ✨
                    </>
                  )}
                </button>
              </div>

              <div>
                <label style={LABEL_STYLE}>
                  1. Client Name & Industry *
                </label>
                <input
                  value={clientName}
                  onChange={e => setClientName(e.target.value)}
                  placeholder="e.g. Suffix Tech (AI & Software Agency)"
                  disabled={isGenerating}
                  style={INPUT_STYLE}
                />
              </div>

              <div>
                <label style={LABEL_STYLE}>
                  2. Core Offer *
                </label>
                <textarea
                  value={coreOffer}
                  onChange={e => setCoreOffer(e.target.value)}
                  rows={2}
                  placeholder="e.g. 90-Day Custom Sales Automation & Lead System for B2B Founders"
                  disabled={isGenerating}
                  style={{ ...INPUT_STYLE, resize: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, background: '#faf5ff', border: '1px solid #e9d5ff', borderRadius: 16, padding: '16px 18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label style={{ ...LABEL_STYLE, color: '#7c3aed', marginBottom: 0 }}>
                    3. Target Personas ({personas.length}) *
                  </label>
                  <button
                    type="button"
                    onClick={() => setPersonas([...personas, ''])}
                    disabled={isGenerating}
                    style={{
                      background: '#ffffff',
                      border: '1.5px solid #c084fc',
                      color: '#7c3aed',
                      borderRadius: 8,
                      padding: '5px 12px',
                      fontSize: 11,
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      boxShadow: '0 2px 4px rgba(124, 58, 237, 0.1)'
                    }}
                  >
                    <Plus size={14} /> Add Persona
                  </button>
                </div>

                <div
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    border: '1.5px dashed #c084fc',
                    background: '#ffffff',
                    borderRadius: 12,
                    padding: '10px 14px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 10,
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, textAlign: 'left' }}>
                    <UploadCloud size={20} color="#7c3aed" />
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 800, color: '#7c3aed' }}>
                        Upload Avatar / Brand Document (PDF, TXT, DOCX, CSV)
                      </div>
                      <div style={{ fontSize: 10, color: '#64748b' }}>
                        AI will analyze your document & extract target personas automatically.
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    disabled={isAnalyzingBrief || isGenerating}
                    style={{
                      background: isAnalyzingBrief ? '#94a3b8' : '#f5f3ff',
                      border: '1px solid #ddd6fe',
                      color: '#7c3aed',
                      borderRadius: 8,
                      padding: '5px 12px',
                      fontSize: 11,
                      fontWeight: 800,
                      cursor: isAnalyzingBrief ? 'not-allowed' : 'pointer',
                      whiteSpace: 'nowrap',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4
                    }}
                  >
                    {isAnalyzingBrief ? <RefreshCw size={12} className="animate-spin" /> : <FileUp size={12} />} Upload File
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUploadPersona}
                    accept=".txt,.pdf,.doc,.docx,.csv,.json,.md"
                    style={{ display: 'none' }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {personas.map((p, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <span style={{ fontSize: 11, fontWeight: 900, color: '#7c3aed', width: 75, flexShrink: 0 }}>
                        Persona {idx + 1}:
                      </span>
                      <input
                        value={p}
                        onChange={e => {
                          const updated = [...personas];
                          updated[idx] = e.target.value;
                          setPersonas(updated);
                        }}
                        placeholder={`e.g. Target Persona ${idx + 1}`}
                        disabled={isGenerating}
                        style={{ ...INPUT_STYLE, borderColor: '#c084fc', flex: 1 }}
                      />
                      {personas.length > 1 && (
                        <button
                          type="button"
                          onClick={() => setPersonas(personas.filter((_, i) => i !== idx))}
                          disabled={isGenerating}
                          style={{
                            background: '#ffffff',
                            border: '1px solid #fecaca',
                            color: '#ef4444',
                            borderRadius: 10,
                            width: 36,
                            height: 36,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                          }}
                          title="Remove Persona"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label style={LABEL_STYLE}>
                  5. Core Proof / Testimonials
                </label>
                <textarea
                  value={coreProof}
                  onChange={e => setCoreProof(e.target.value)}
                  rows={2}
                  placeholder="e.g. Helped 70+ eCommerce brands scale, $4.2M client revenue generated"
                  disabled={isGenerating}
                  style={{ ...INPUT_STYLE, resize: 'none' }}
                />
              </div>

              <div>
                <label style={LABEL_STYLE}>
                  6. Call to Action (CTA)
                </label>
                <input
                  value={cta}
                  onChange={e => setCta(e.target.value)}
                  placeholder="e.g. Claim Your 1-on-1 Strategy Session Today"
                  disabled={isGenerating}
                  style={INPUT_STYLE}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: 16, padding: '14px 16px' }}>
                <div>
                  <label style={{ ...LABEL_STYLE, color: '#7c3aed', marginBottom: 4 }}>
                    7. Brand Logo URL / Upload *
                  </label>
                  <input
                    value={brandLogoUrl.startsWith('data:') ? 'Official Brand Logo Uploaded ✓' : brandLogoUrl}
                    onChange={e => setBrandLogoUrl(e.target.value)}
                    placeholder="Paste Brand Logo URL or upload..."
                    disabled={isGenerating}
                    style={INPUT_STYLE}
                  />
                </div>
                <div>
                  <label style={{ ...LABEL_STYLE, color: '#7c3aed', marginBottom: 4 }}>
                    8. Exact Brand Colors (Hex)
                  </label>
                  <input
                    value={brandColors}
                    onChange={e => setBrandColors(e.target.value)}
                    placeholder="e.g. #059669, #0F172A, #10B981"
                    disabled={isGenerating}
                    style={INPUT_STYLE}
                  />
                </div>
              </div>

              <div style={{ marginTop: 12, display: 'flex', gap: 12 }}>
                {!isGenerating && (
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    style={{ flex: 1, padding: '11px 0', borderRadius: 12, border: '1.5px solid #e2e8f0', background: '#ffffff', color: '#64748b', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  disabled={isGenerating}
                  style={{
                    flex: 2,
                    padding: '11px 0',
                    borderRadius: 12,
                    border: 'none',
                    background: isGenerating ? '#94a3b8' : 'linear-gradient(135deg, #7c3aed 0%, #9333ea 100%)',
                    color: '#ffffff',
                    fontWeight: 800,
                    fontSize: 13,
                    cursor: isGenerating ? 'not-allowed' : 'pointer',
                    boxShadow: isGenerating ? 'none' : '0 4px 14px rgba(124,58,237,0.35)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8
                  }}
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" /> Executing 30-Day Strategy...
                    </>
                  ) : (
                    <>
                      <Sparkles size={16} /> Generate 30-Day Calendar
                    </>
                  )}
                </button>
              </div>

            </form>
          </motion.div>
        </div>
      )}

      {showIterationModal && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(6px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
          onClick={() => !isGeneratingIteration && setShowIterationModal(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={e => e.stopPropagation()}
            style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 24, width: 'min(650px, 95vw)', maxHeight: '90vh', overflowY: 'auto', padding: 32, boxShadow: '0 24px 64px rgba(0,0,0,0.18)' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, borderBottom: '1px solid #f1f5f9', paddingBottom: 16 }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 900, color: '#059669', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Bot size={14} /> AI Learning Optimization Loop
                </div>
                <h2 style={{ fontSize: 20, fontWeight: 900, color: '#0f172a', margin: 0 }}>
                  Generate Version {currentVersionCount + 1} Strategy Angles
                </h2>
              </div>
              <button
                onClick={() => !isGeneratingIteration && setShowIterationModal(false)}
                style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', cursor: 'pointer' }}
              >
                <X size={16} />
              </button>
            </div>

            <div style={{ background: pendingCount > 0 ? '#fff7ed' : '#ecfdf5', border: pendingCount > 0 ? '1.5px solid #fdba74' : '1.5px solid #a7f3d0', borderRadius: 16, padding: 18, marginBottom: 20 }}>
              <div style={{ fontSize: 11, fontWeight: 900, color: pendingCount > 0 ? '#9a3412' : '#047857', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                {pendingCount > 0 ? <AlertTriangle size={14} color="#ea580c" /> : <ShieldCheck size={14} />}
                Version {currentVersionCount} Review Intelligence:
              </div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', fontSize: 12, fontWeight: 700 }}>
                <span style={{ background: '#ffffff', color: '#15803d', border: '1px solid #86efac', padding: '4px 10px', borderRadius: 8 }}>
                  ✅ {approvedCount} Approved Angles
                </span>
                <span style={{ background: '#ffffff', color: '#c2410c', border: '1px solid #fdba74', padding: '4px 10px', borderRadius: 8 }}>
                  ❌ {unapprovedCount} Unapproved Angles
                </span>
                {improvementCount > 0 && (
                  <span style={{ background: '#ffffff', color: '#b45309', border: '1px solid #fcd34d', padding: '4px 10px', borderRadius: 8 }}>
                    ⚡ {improvementCount} Improvement Notes
                  </span>
                )}
                {calendar.filter(c => c.teamNotes && String(c.teamNotes).trim().length > 0).length > 0 && (
                  <span style={{ background: '#ffffff', color: '#6d28d9', border: '1px solid #c4b5fd', padding: '4px 10px', borderRadius: 8 }}>
                    📝 {calendar.filter(c => c.teamNotes && String(c.teamNotes).trim().length > 0).length} Team Notes Saved
                  </span>
                )}
                {pendingCount > 0 && (
                  <span style={{ background: '#ffedd5', color: '#9a3412', border: '1.5px solid #f97316', padding: '4px 10px', borderRadius: 8, fontWeight: 900 }}>
                    ⚠️ {pendingCount} Cards Pending Review
                  </span>
                )}
              </div>
              {pendingCount > 0 && (
                <div style={{ fontSize: 12, color: '#9a3412', marginTop: 10, fontWeight: 700, background: '#ffffff', border: '1px solid #fdba74', borderRadius: 10, padding: '10px 12px', lineHeight: 1.4 }}>
                  🛑 <strong>Review Required:</strong> You cannot generate Version {currentVersionCount + 1} until all {calendar.length} cards have been marked as Approved ✅, Unapproved ❌, or Flagged ⚡. ({pendingCount} cards remaining)
                </div>
              )}
            </div>

            <form onSubmit={handleGenerateLearnedIteration} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <label style={LABEL_STYLE}>
                    Target Personas for Version {currentVersionCount + 1} *
                  </label>
                  <button
                    type="button"
                    onClick={() => setIterationPersonas(prev => [...prev, ''])}
                    disabled={isGeneratingIteration || pendingCount > 0}
                    style={{ background: '#f5f3ff', border: '1px solid #ddd6fe', color: '#7c3aed', fontSize: 11, fontWeight: 800, padding: '4px 10px', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
                  >
                    + Add New Persona
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {iterationPersonas.map((p, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <input
                        value={p}
                        onChange={e => {
                          const val = e.target.value;
                          setIterationPersonas(prev => prev.map((item, i) => i === idx ? val : item));
                        }}
                        placeholder={idx === 0 ? "e.g. SMB Owners looking to scale revenue" : "e.g. Marketing Directors seeking predictable lead flow"}
                        disabled={isGeneratingIteration || pendingCount > 0}
                        style={{ ...INPUT_STYLE, flex: 1 }}
                      />
                      {iterationPersonas.length > 1 && (
                        <button
                          type="button"
                          onClick={() => setIterationPersonas(prev => prev.filter((_, i) => i !== idx))}
                          disabled={isGeneratingIteration || pendingCount > 0}
                          style={{ background: '#fff7ed', border: '1px solid #ffedd5', color: '#ea580c', padding: '10px 12px', borderRadius: 12, cursor: 'pointer' }}
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label style={LABEL_STYLE}>
                  Strategic Direction / Focus for Version {currentVersionCount + 1} (Optional)
                </label>
                <textarea
                  rows={3}
                  value={iterationPromptNotes}
                  onChange={e => setIterationPromptNotes(e.target.value)}
                  placeholder="e.g. Focus heavily on 30-day ROI guarantees, test darker glassmorphic visual themes, and address price objections..."
                  disabled={isGeneratingIteration || pendingCount > 0}
                  style={{ ...INPUT_STYLE, resize: 'none', height: 'auto' }}
                />
              </div>

              <div style={{ display: 'flex', gap: 12, marginTop: 10 }}>
                <button
                  type="button"
                  onClick={() => setShowIterationModal(false)}
                  disabled={isGeneratingIteration}
                  style={{ ...BUTTON_CANCEL_STYLE, flex: 1 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isGeneratingIteration || pendingCount > 0}
                  style={{
                    flex: 2,
                    padding: '12px 24px',
                    borderRadius: 12,
                    border: 'none',
                    background: isGeneratingIteration || pendingCount > 0 ? '#94a3b8' : 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                    color: '#ffffff',
                    fontWeight: 800,
                    fontSize: 13,
                    cursor: isGeneratingIteration || pendingCount > 0 ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    boxShadow: isGeneratingIteration || pendingCount > 0 ? 'none' : '0 4px 14px rgba(16, 185, 129, 0.35)'
                  }}
                >
                  {isGeneratingIteration ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" /> Learning & Generating Version {currentVersionCount + 1}...
                    </>
                  ) : pendingCount > 0 ? (
                    <>
                      Review All Cards to Continue ({pendingCount} Pending)
                    </>
                  ) : (
                    <>
                      <Bot size={16} /> Generate Version {currentVersionCount + 1} (AI Learning Mode)
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

    </div>
  );
}

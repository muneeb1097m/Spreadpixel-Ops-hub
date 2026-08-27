import * as fs from 'fs';

function getWeekday(dayNum) {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  return days[(dayNum - 1) % 6];
}

export const SERVICES = [
  { id: 'cold_email', label: 'Cold Email Outreach', icon: 'Mail', color: '#3b82f6', desc: '5-30 Domains, Mailboxes, 14d Warmup, 4-Touch Sending, Deliverability QA' },
  { id: 'linkedin_outreach', label: 'LinkedIn Outreach & SDR', icon: 'UserCheck', color: '#0284c7', desc: 'Profile Optimization, SalesNav Search, 15-40 Daily Connections & DMs' },
  { id: 'social_media', label: 'Social Media Management', icon: 'Sparkles', color: '#0ea5e9', desc: 'Content Calendar, 12-20 Static/Carousel Posts, Captions & Community' },
  { id: 'video_reels', label: 'Short-Form Video (Reels)', icon: 'Play', color: '#a78bfa', desc: 'High-converting vertical video editing (6-12 Reels/month cadence)' },
  { id: 'ghostwriting', label: 'Founder Ghostwriting', icon: 'BookOpen', color: '#a855f7', desc: '3 Thought-Leadership Posts/Week (Mon/Wed/Fri) on Founder Profile' },
  { id: 'meta_ads', label: 'Meta Ads (FB & IG)', icon: 'Target', color: '#f43f5e', desc: 'Pixel/CAPI Setup, Lead Gen Campaigns, Ad Creatives & Copy, Retargeting' },
  { id: 'google_ads', label: 'Google Search & PMax Ads', icon: 'Search', color: '#f59e0b', desc: 'High-Intent Search Campaigns, Negative Keyword Pruning, Bid Management' },
  { id: 'landing_page', label: 'Landing Page Development', icon: 'Globe', color: '#10b981', desc: 'Direct-Response Wireframe, Responsive Design, GHL Funnel Integration' },
  { id: 'seo', label: 'SEO & Authority Backlinks', icon: 'TrendingUp', color: '#059669', desc: 'Technical SEO Audit, 15-30 Keywords, Authority Blogs & Backlinks' },
  { id: 'ai_crm', label: 'AI Chatbot & GHL CRM', icon: 'Bot', color: '#6366f1', desc: 'Dedicated GoHighLevel Sub-Account, Calendar Routing, AI Lead Scorer' }
];

export const PACKAGE_SERVICES = {
  cold_outreach: ['cold_email', 'linkedin_outreach', 'ai_crm'],
  growth_starter: ['linkedin_outreach', 'social_media', 'meta_ads', 'landing_page', 'ai_crm'],
  growth_engine: ['cold_email', 'linkedin_outreach', 'social_media', 'video_reels', 'meta_ads', 'google_ads', 'landing_page', 'seo', 'ai_crm'],
  growth_dominance: ['cold_email', 'linkedin_outreach', 'social_media', 'video_reels', 'ghostwriting', 'meta_ads', 'google_ads', 'landing_page', 'seo', 'ai_crm']
};

// =============================================================
// 1. COLD OUTREACH STANDALONE (PKR 100,000)
// =============================================================
function generateColdOutreachTasks() {
  const sprint = [
    // Day 1
    { id: "co_s01_a", service: "core", phase: "sprint", day: 1, n: "Conduct Kickoff Meeting with Client", role: "AM", deps: [], hours: "1h", priority: "high" },
    { id: "co_s01_b", service: "core", phase: "sprint", day: 1, n: "Collect Platform Credentials", role: "AM", deps: ["co_s01_a"], hours: "0.5h", priority: "high" },
    { id: "co_s01_c", service: "cold_email", phase: "sprint", day: 1, n: "Purchase 5 Cold Email Domains", role: "AUTO", deps: ["co_s01_b"], hours: "1h", priority: "high" },
    { id: "co_s01_d", service: "cold_email", phase: "sprint", day: 1, n: "Configure SPF, DKIM, DMARC DNS Records", role: "AUTO", deps: ["co_s01_c"], hours: "1.5h", priority: "high" },

    // Day 2
    { id: "co_s02_a", service: "core", phase: "sprint", day: 2, n: "Audit Client Offer", role: "AM", deps: ["co_s01_b"], hours: "1h", priority: "high" },
    { id: "co_s02_b", service: "core", phase: "sprint", day: 2, n: "Audit Client Proof Materials", role: "AM", deps: ["co_s02_a"], hours: "1h", priority: "high" },
    { id: "co_s02_c", service: "cold_email", phase: "sprint", day: 2, n: "Create 15 Mailboxes across Domains", role: "AUTO", deps: ["co_s01_d"], hours: "1.5h", priority: "high" },

    // Day 3
    { id: "co_s03_a", service: "core", phase: "sprint", day: 3, n: "Draft Target ICP Definition Document", role: "STRAT", deps: ["co_s02_a"], hours: "1.5h", priority: "high" },
    { id: "co_s03_b", service: "core", phase: "sprint", day: 3, n: "Submit ICP Scorecard for Client Approval", role: "STRAT", deps: ["co_s03_a"], hours: "1h", priority: "high" },
    { id: "co_s03_c", service: "cold_email", phase: "sprint", day: 3, n: "Connect 15 Mailboxes to Warmup Pool", role: "AUTO", deps: ["co_s02_c"], hours: "1h", priority: "high" },
    { id: "co_s03_d", service: "cold_email", phase: "sprint", day: 3, n: "Set Automated Warmup Schedule", role: "AUTO", deps: ["co_s03_c"], hours: "0.5h", priority: "high" },

    // Day 4
    { id: "co_s04_a", service: "core", phase: "sprint", day: 4, n: "Benchmark Competitor Outbound Campaigns", role: "STRAT", deps: ["co_s03_a"], hours: "1.5h", priority: "normal" },
    { id: "co_s04_b", service: "ai_crm", phase: "sprint", day: 4, n: "Setup GHL Sub-Account Pipeline Stages", role: "AUTO", deps: ["co_s01_b"], hours: "1.5h", priority: "high" },

    // Day 5
    { id: "co_s05_a", service: "ai_crm", phase: "sprint", day: 5, n: "Configure GHL Calendar Booking Link and Reminders", role: "AUTO", deps: ["co_s04_b"], hours: "1h", priority: "high" },
    { id: "co_s05_b", service: "ai_crm", phase: "sprint", day: 5, n: "Set Up CRM Lead Notification Webhook", role: "AUTO", deps: ["co_s05_a"], hours: "0.5h", priority: "normal" },

    // Day 6
    { id: "co_s06_a", service: "linkedin_outreach", phase: "sprint", day: 6, n: "Optimize Client LinkedIn Profile", role: "OBS", deps: ["co_s03_b"], hours: "1h", priority: "normal" },
    { id: "co_s06_b", service: "linkedin_outreach", phase: "sprint", day: 6, n: "Activate Sales Navigator Search Filters", role: "OBS", deps: ["co_s06_a"], hours: "1h", priority: "normal" },

    // Day 7
    { id: "co_s07_a", service: "cold_email", phase: "sprint", day: 7, n: "Draft Email Sequence Angle 1 Direct Pitch", role: "CW", deps: ["co_s03_a"], hours: "1.5h", priority: "high" },
    { id: "co_s07_b", service: "cold_email", phase: "sprint", day: 7, n: "Draft Email Sequence Angle 2 Pain Point", role: "CW", deps: ["co_s07_a"], hours: "1.5h", priority: "high" },
    { id: "co_s07_c", service: "cold_email", phase: "sprint", day: 7, n: "Source First 1,250 Verified ICP Contacts", role: "DATA", deps: ["co_s03_b"], hours: "2h", priority: "high" },

    // Day 8
    { id: "co_s08_a", service: "cold_email", phase: "sprint", day: 8, n: "Draft Email Sequence Angle 3 Case Study and Social Proof", role: "CW", deps: ["co_s07_b"], hours: "1.5h", priority: "high" },
    { id: "co_s08_b", service: "cold_email", phase: "sprint", day: 8, n: "Write 4 Follow Up Variations Per Angle", role: "CW", deps: ["co_s08_a"], hours: "2h", priority: "high" },

    // Day 9
    { id: "co_s09_a", service: "linkedin_outreach", phase: "sprint", day: 9, n: "Write LinkedIn Connection Note and 3 Step DM Sequence", role: "CW", deps: ["co_s07_a"], hours: "1h", priority: "high" },
    { id: "co_s09_b", service: "linkedin_outreach", phase: "sprint", day: 9, n: "Design LinkedIn Banner and Optimize Headline", role: "GD", deps: ["co_s06_a"], hours: "1h", priority: "normal" },

    // Day 10
    { id: "co_s10_a", service: "core", phase: "sprint", day: 10, n: "Messaging Approval Call with Client on Angles and Content Pillars", role: "AM", deps: ["co_s08_b", "co_s09_a"], hours: "1h", priority: "high" },
    { id: "co_s10_b", service: "cold_email", phase: "sprint", day: 10, n: "Upload Approved Sequences to Sending Platform", role: "AUTO", deps: ["co_s10_a"], hours: "1h", priority: "high" },

    // Day 11
    { id: "co_s11_a", service: "cold_email", phase: "sprint", day: 11, n: "Build Intent Trigger Contact List", role: "DATA", deps: ["co_s07_c"], hours: "1.5h", priority: "normal" },
    { id: "co_s11_b", service: "cold_email", phase: "sprint", day: 11, n: "Clean and Verify Email Deliverability on All Leads", role: "DATA", deps: ["co_s11_a"], hours: "1h", priority: "high" },

    // Day 12
    { id: "co_s12_a", service: "core", phase: "sprint", day: 12, n: "Write Discovery Call Script and Objection Handling Document", role: "CW", deps: ["co_s02_a"], hours: "1.5h", priority: "normal" },
    { id: "co_s12_b", service: "core", phase: "sprint", day: 12, n: "Prepare Proposal Template for Client Use", role: "AM", deps: ["co_s02_a"], hours: "1h", priority: "normal" },

    // Day 13
    { id: "co_s13_a", service: "core", phase: "sprint", day: 13, n: "Build Reporting Dashboard and KPI Sheet with Client Login", role: "AM", deps: ["co_s04_b"], hours: "2h", priority: "high" },
    { id: "co_s13_b", service: "cold_email", phase: "sprint", day: 13, n: "Source Additional 1,250 Verified ICP Contacts", role: "DATA", deps: ["co_s07_c"], hours: "2h", priority: "high" },

    // Day 14
    { id: "co_s14_a", service: "cold_email", phase: "sprint", day: 14, n: "Execute Seed List Test Send to 10 Inboxes", role: "OBS", deps: ["co_s03_c", "co_s10_b"], hours: "1h", priority: "high" },
    { id: "co_s14_b", service: "cold_email", phase: "sprint", day: 14, n: "Verify 0% Spam Placement across Seed Accounts", role: "OBS", deps: ["co_s14_a"], hours: "1h", priority: "high" },

    // Day 15
    { id: "co_s15_a", service: "cold_email", phase: "sprint", day: 15, n: "Final Deliverability QA and Inbox Placement Check", role: "OBS", deps: ["co_s14_b"], hours: "1h", priority: "high" },
    { id: "co_s15_b", service: "core", phase: "sprint", day: 15, n: "Compile Day 15 Go Live Report and Conduct Milestone Review", role: "AM", deps: ["co_s15_a"], hours: "1h", priority: "high" },
  ];

  const ongoing = [];
  for (let d = 16; d <= 90; d++) {
    const weekday = getWeekday(d);

    if (d === 17) {
      ongoing.push({ id: `co_d${d}_ramp`, service: "cold_email", phase: "ongoing", day: d, n: "Start Cold Email Sending at 20 Percent Volume", role: "OBS", priority: "high", hours: "1h", deps: [] });
    }
    if (d === 20) {
      ongoing.push({ id: `co_d${d}_scale`, service: "cold_email", phase: "ongoing", day: d, n: "Scale Cold Email to Full Daily Volume", role: "OBS", priority: "high", hours: "1h", deps: [] });
    }

    if (weekday === "Monday") {
      ongoing.push({ id: `co_d${d}_kpi`, service: "core", phase: "ongoing", day: d, n: "Review Weekly KPI Metrics", role: "AM", freq: "Monday", hours: "1h", deps: [] });
      ongoing.push({ id: `co_d${d}_box`, service: "cold_email", phase: "ongoing", day: d, n: "Mailbox Health Check on 15 Boxes", role: "AUTO", freq: "Monday", hours: "0.5h", deps: [] });
      ongoing.push({ id: `co_d${d}_list`, service: "cold_email", phase: "ongoing", day: d, n: "Build Weekly Verified Lead List (625 Contacts)", role: "DATA", freq: "Monday", hours: "1.5h", deps: [] });
      if (d >= 17) {
        ongoing.push({ id: `co_d${d}_send`, service: "cold_email", phase: "ongoing", day: d, n: d < 20 ? "Send Cold Email Ramp-Up Batch" : "Send Cold Email Batch (375 Sends)", role: "OBS", freq: "Monday", hours: "1h", deps: [] });
      }
      ongoing.push({ id: `co_d${d}_li`, service: "linkedin_outreach", phase: "ongoing", day: d, n: "Send 15 LinkedIn Connection Requests", role: "OBS", freq: "Monday", hours: "0.5h", deps: [] });
    } else if (weekday === "Tuesday") {
      if (d >= 17) {
        ongoing.push({ id: `co_d${d}_send`, service: "cold_email", phase: "ongoing", day: d, n: d < 20 ? "Send Cold Email Ramp-Up Batch" : "Send Cold Email Batch (375 Sends)", role: "OBS", freq: "Tuesday", hours: "1h", deps: [] });
      }
      ongoing.push({ id: `co_d${d}_reply_m`, service: "cold_email", phase: "ongoing", day: d, n: "Morning Inbound Reply Triage", role: "OBS", freq: "Tuesday", hours: "0.5h", deps: [] });
      ongoing.push({ id: `co_d${d}_reply_e`, service: "cold_email", phase: "ongoing", day: d, n: "Evening Inbound Reply Triage", role: "OBS", freq: "Tuesday", hours: "0.5h", deps: [] });
      ongoing.push({ id: `co_d${d}_li`, service: "linkedin_outreach", phase: "ongoing", day: d, n: "Send 15 LinkedIn Connection Requests", role: "OBS", freq: "Tuesday", hours: "0.5h", deps: [] });
    } else if (weekday === "Wednesday") {
      if (d >= 17) {
        ongoing.push({ id: `co_d${d}_send`, service: "cold_email", phase: "ongoing", day: d, n: d < 20 ? "Send Cold Email Ramp-Up Batch" : "Send Cold Email Batch (375 Sends)", role: "OBS", freq: "Wednesday", hours: "1h", deps: [] });
      }
      ongoing.push({ id: `co_d${d}_wave`, service: "cold_email", phase: "ongoing", day: d, n: "Launch Automated Follow-up Wave", role: "OBS", freq: "Wednesday", hours: "0.5h", deps: [] });
      ongoing.push({ id: `co_d${d}_li`, service: "linkedin_outreach", phase: "ongoing", day: d, n: "Send 15 LinkedIn Outreach DMs", role: "OBS", freq: "Wednesday", hours: "0.5h", deps: [] });
      ongoing.push({ id: `co_d${d}_reply`, service: "ai_crm", phase: "ongoing", day: d, n: "Process Meeting Bookings from Replies", role: "OBS", freq: "Wednesday", hours: "0.5h", deps: [] });
    } else if (weekday === "Thursday") {
      if (d >= 17) {
        ongoing.push({ id: `co_d${d}_send`, service: "cold_email", phase: "ongoing", day: d, n: d < 20 ? "Send Cold Email Ramp-Up Batch" : "Send Cold Email Batch (375 Sends)", role: "OBS", freq: "Thursday", hours: "1h", deps: [] });
      }
      ongoing.push({ id: `co_d${d}_li`, service: "linkedin_outreach", phase: "ongoing", day: d, n: "Send 15 LinkedIn Connection Requests", role: "OBS", freq: "Thursday", hours: "0.5h", deps: [] });
      ongoing.push({ id: `co_d${d}_confirm`, service: "ai_crm", phase: "ongoing", day: d, n: "Send Booked Call Confirmations", role: "OBS", freq: "Thursday", hours: "0.5h", deps: [] });
      ongoing.push({ id: `co_d${d}_noshow`, service: "ai_crm", phase: "ongoing", day: d, n: "Follow-up Missed Call No-Shows", role: "OBS", freq: "Thursday", hours: "0.5h", deps: [] });
    } else if (weekday === "Friday") {
      if (d >= 17) {
        ongoing.push({ id: `co_d${d}_send`, service: "cold_email", phase: "ongoing", day: d, n: d < 20 ? "Send Cold Email Ramp-Up Batch" : "Send Cold Email Batch (375 Sends)", role: "OBS", freq: "Friday", hours: "1h", deps: [] });
      }
      ongoing.push({ id: `co_d${d}_seq`, service: "cold_email", phase: "ongoing", day: d, n: "Sequence Performance Review by Angle", role: "STRAT", freq: "Friday", hours: "1h", deps: [] });
      ongoing.push({ id: `co_d${d}_hyg`, service: "ai_crm", phase: "ongoing", day: d, n: "GHL Pipeline Hygiene and Lead Routing Check", role: "AM", freq: "Friday", hours: "0.5h", deps: [] });
      if (d % 2 === 0) {
        ongoing.push({ id: `co_d${d}_iter`, service: "cold_email", phase: "ongoing", day: d, n: "Copy Iteration on Weakest Performing Angle", role: "CW", freq: "Alternate Friday", hours: "1.5h", deps: [] });
      }
    } else if (weekday === "Saturday") {
      ongoing.push({ id: `co_d${d}_clean`, service: "cold_email", phase: "ongoing", day: d, n: "Clean Inactive Lead Database Contacts", role: "DATA", freq: "Saturday", hours: "1h", deps: [] });
      ongoing.push({ id: `co_d${d}_bounce`, service: "cold_email", phase: "ongoing", day: d, n: "Remove Hard Bounced Email Addresses", role: "DATA", freq: "Saturday", hours: "0.5h", deps: [] });
    }
  }

  // Strategic Milestones
  ongoing.push({ id: "co_m25", service: "cold_email", phase: "ongoing", day: 25, n: "Kill Weakest Email Angle and Reallocate Its Volume", role: "STRAT", priority: "high", hours: "1h", deps: [] });
  ongoing.push({ id: "co_m30", service: "core", phase: "ongoing", day: 30, n: "Conduct Month 1 Performance Review", role: "AM", priority: "high", hours: "2h", deps: [] });
  ongoing.push({ id: "co_m40", service: "cold_email", phase: "ongoing", day: 40, n: "Rewrite Offer Language Using Real Objections Collected", role: "CW", priority: "high", hours: "2h", deps: [] });
  ongoing.push({ id: "co_m52", service: "cold_email", phase: "ongoing", day: 52, n: "Rotate Burnt Domains and Start Warmup on 2 Replacements", role: "AUTO", priority: "high", hours: "1.5h", deps: [] });
  ongoing.push({ id: "co_m60", service: "core", phase: "ongoing", day: 60, n: "Conduct Month 2 Pricing Check and Performance Review", role: "AM", priority: "high", hours: "2h", deps: [] });
  ongoing.push({ id: "co_m90", service: "core", phase: "ongoing", day: 90, n: "Conduct Quarter Review and Renewal Conversation", role: "AM", priority: "high", hours: "2h", deps: [] });

  return [...sprint, ...ongoing];
}

// =============================================================
// 2. GROWTH STARTER (PKR 175,000)
// =============================================================
function generateGrowthStarterTasks() {
  const sprint = [
    // Day 1
    { id: "gs_s01_a", service: "core", phase: "sprint", day: 1, n: "Conduct Kickoff Meeting with Client", role: "AM", deps: [], hours: "1h", priority: "high" },
    { id: "gs_s01_b", service: "core", phase: "sprint", day: 1, n: "Collect Social Account Access Logins", role: "AM", deps: ["gs_s01_a"], hours: "0.5h", priority: "high" },

    // Day 2
    { id: "gs_s02_a", service: "core", phase: "sprint", day: 2, n: "Audit Client Business Model", role: "STRAT", deps: ["gs_s01_b"], hours: "1.5h", priority: "high" },
    { id: "gs_s02_b", service: "core", phase: "sprint", day: 2, n: "Scan Competitor Funnels and Positioning", role: "STRAT", deps: ["gs_s02_a"], hours: "1.5h", priority: "high" },

    // Day 3
    { id: "gs_s03_a", service: "core", phase: "sprint", day: 3, n: "Draft Target ICP Profile", role: "STRAT", deps: ["gs_s02_a"], hours: "1.5h", priority: "high" },
    { id: "gs_s03_b", service: "core", phase: "sprint", day: 3, n: "Submit ICP Scorecard for Client Approval", role: "STRAT", deps: ["gs_s03_a"], hours: "1h", priority: "high" },

    // Day 4
    { id: "gs_s04_a", service: "social_media", phase: "sprint", day: 4, n: "Collect Client Brand Assets", role: "GD", deps: ["gs_s03_b"], hours: "1h", priority: "normal" },
    { id: "gs_s04_b", service: "social_media", phase: "sprint", day: 4, n: "Lock Brand Color Palette and Typography Guidelines", role: "GD", deps: ["gs_s04_a"], hours: "1h", priority: "normal" },

    // Day 5
    { id: "gs_s05_a", service: "ai_crm", phase: "sprint", day: 5, n: "Create Dedicated GoHighLevel Sub Account and Grant Client Access", role: "AUTO", deps: ["gs_s01_b"], hours: "1h", priority: "high" },
    { id: "gs_s05_b", service: "ai_crm", phase: "sprint", day: 5, n: "Build GHL Pipeline Stages and Booking Calendar", role: "AUTO", deps: ["gs_s05_a"], hours: "1.5h", priority: "high" },

    // Day 6
    { id: "gs_s06_a", service: "meta_ads", phase: "sprint", day: 6, n: "Install Meta Pixel Conversion Events", role: "DEV", deps: ["gs_s05_b"], hours: "1.5h", priority: "high" },
    { id: "gs_s06_b", service: "meta_ads", phase: "sprint", day: 6, n: "Setup Google Analytics 4 Tracking", role: "DEV", deps: ["gs_s06_a"], hours: "1h", priority: "high" },

    // Day 7
    { id: "gs_s07_a", service: "linkedin_outreach", phase: "sprint", day: 7, n: "Source First 500 Verified Target Contacts", role: "DATA", deps: ["gs_s03_b"], hours: "2h", priority: "normal" },
    { id: "gs_s07_b", service: "linkedin_outreach", phase: "sprint", day: 7, n: "Verify Contact Data Deliverability", role: "DATA", deps: ["gs_s07_a"], hours: "1h", priority: "normal" },

    // Day 8
    { id: "gs_s08_a", service: "meta_ads", phase: "sprint", day: 8, n: "Audit Meta Ad Account Settings", role: "ADS", deps: ["gs_s06_a"], hours: "1.5h", priority: "high" },
    { id: "gs_s08_b", service: "meta_ads", phase: "sprint", day: 8, n: "Build Custom Target Audiences for Meta Lead Gen", role: "ADS", deps: ["gs_s08_a"], hours: "1.5h", priority: "high" },

    // Day 9
    { id: "gs_s09_a", service: "core", phase: "sprint", day: 9, n: "Conduct Messaging Review Call with Client", role: "STRAT", deps: ["gs_s03_b"], hours: "1h", priority: "high" },
    { id: "gs_s09_b", service: "social_media", phase: "sprint", day: 9, n: "Finalize Social Content Pillars for 2 Platforms", role: "STRAT", deps: ["gs_s09_a"], hours: "1h", priority: "high" },
    { id: "gs_s09_c", service: "landing_page", phase: "sprint", day: 9, n: "Connect Landing Page Form and Ads Lead Forms to GHL Pipeline", role: "AUTO", deps: ["gs_s05_b"], hours: "1h", priority: "high" },

    // Day 10
    { id: "gs_s10_a", service: "landing_page", phase: "sprint", day: 10, n: "Design Landing Page Structure Wireframe", role: "DEV", deps: ["gs_s04_b", "gs_s09_b"], hours: "2h", priority: "high" },
    { id: "gs_s10_b", service: "landing_page", phase: "sprint", day: 10, n: "Build Landing Page Visual Elements", role: "DEV", deps: ["gs_s10_a"], hours: "2h", priority: "high" },

    // Day 11
    { id: "gs_s11_a", service: "linkedin_outreach", phase: "sprint", day: 11, n: "Optimize LinkedIn Profile Banner and Headline", role: "GD", deps: ["gs_s09_b"], hours: "1h", priority: "normal" },
    { id: "gs_s11_b", service: "social_media", phase: "sprint", day: 11, n: "Write First Content Batch (12 Static Social Posts)", role: "CW", deps: ["gs_s09_b"], hours: "2h", priority: "normal" },

    // Day 12
    { id: "gs_s12_a", service: "landing_page", phase: "sprint", day: 12, n: "Deploy Landing Page Live and Verify Functionality", role: "DEV", deps: ["gs_s10_b"], hours: "1.5h", priority: "high" },
    { id: "gs_s12_b", service: "landing_page", phase: "sprint", day: 12, n: "Test GHL Lead Capture and Booking Form", role: "DEV", deps: ["gs_s12_a", "gs_s09_c"], hours: "1h", priority: "high" },

    // Day 13
    { id: "gs_s13_a", service: "core", phase: "sprint", day: 13, n: "Build Reporting Dashboard and KPI Sheet with Client Login", role: "AM", deps: ["gs_s05_a"], hours: "2h", priority: "high" },
    { id: "gs_s13_b", service: "core", phase: "sprint", day: 13, n: "Issue Client Login Portal Walkthrough", role: "AM", deps: ["gs_s13_a"], hours: "0.5h", priority: "normal" },

    // Day 14
    { id: "gs_s14_a", service: "meta_ads", phase: "sprint", day: 14, n: "Build 2 Meta Lead Generation Ad Campaigns in Paused Drafts", role: "ADS", deps: ["gs_s08_b", "gs_s12_a"], hours: "2h", priority: "high" },
    { id: "gs_s14_b", service: "meta_ads", phase: "sprint", day: 14, n: "Confirm Monthly Ad Spend Budget and Billing Method in Writing", role: "AM", deps: ["gs_s14_a"], hours: "0.5h", priority: "high" },

    // Day 15
    { id: "gs_s15_a", service: "core", phase: "sprint", day: 15, n: "Deliver Go Live Audit Report", role: "AM", deps: ["gs_s14_a"], hours: "1h", priority: "high" },
    { id: "gs_s15_b", service: "core", phase: "sprint", day: 15, n: "Conduct Go/No-Go Launch Sign-Off", role: "AM", deps: ["gs_s15_a"], hours: "0.5h", priority: "high" },
    { id: "gs_s15_c", service: "core", phase: "sprint", day: 15, n: "Set Client Expectation That Month 1 Produces No Cold Email Booked Calls Since Outbound Is Not Included", role: "AM", deps: ["gs_s15_b"], hours: "0.5h", priority: "high" },
  ];

  const ongoing = [];
  for (let d = 16; d <= 90; d++) {
    const weekday = getWeekday(d);

    if (weekday === "Monday") {
      ongoing.push({ id: `gs_d${d}_kpi`, service: "core", phase: "ongoing", day: d, n: "Review Weekly KPI Numbers", role: "AM", freq: "Monday", hours: "1h", deps: [] });
      ongoing.push({ id: `gs_d${d}_sched`, service: "social_media", phase: "ongoing", day: d, n: "Schedule Weekly Posts on 2 Platforms", role: "SMM", freq: "Monday", hours: "1h", deps: [] });
      ongoing.push({ id: `gs_d${d}_list`, service: "linkedin_outreach", phase: "ongoing", day: d, n: "Build Weekly Target Contact List (125 Contacts)", role: "DATA", freq: "Monday", hours: "1h", deps: [] });
      ongoing.push({ id: `gs_d${d}_li`, service: "linkedin_outreach", phase: "ongoing", day: d, n: "Send 15 LinkedIn Connection Requests", role: "OBS", freq: "Monday", hours: "0.5h", deps: [] });
      ongoing.push({ id: `gs_d${d}_ads`, service: "meta_ads", phase: "ongoing", day: d, n: "Check Meta Ads Daily Spend Health", role: "ADS", freq: "Monday", hours: "0.5h", deps: [] });
    } else if (weekday === "Tuesday") {
      ongoing.push({ id: `gs_d${d}_design`, service: "social_media", phase: "ongoing", day: d, n: "Design Static Post Visuals", role: "GD", freq: "Tuesday", hours: "1.5h", deps: [] });
      ongoing.push({ id: `gs_d${d}_copy`, service: "social_media", phase: "ongoing", day: d, n: "Write Post Captions and Hashtags", role: "CW", freq: "Tuesday", hours: "1h", deps: [] });
      ongoing.push({ id: `gs_d${d}_li`, service: "linkedin_outreach", phase: "ongoing", day: d, n: "Send 15 LinkedIn Connection Requests", role: "OBS", freq: "Tuesday", hours: "0.5h", deps: [] });
      ongoing.push({ id: `gs_d${d}_reply`, service: "linkedin_outreach", phase: "ongoing", day: d, n: "Process LinkedIn Inbound Replies", role: "OBS", freq: "Tuesday", hours: "0.5h", deps: [] });
      ongoing.push({ id: `gs_d${d}_ads`, service: "meta_ads", phase: "ongoing", day: d, n: "Audit Meta Ad Performance Metrics", role: "ADS", freq: "Tuesday", hours: "0.5h", deps: [] });
    } else if (weekday === "Wednesday") {
      ongoing.push({ id: `gs_d${d}_opt`, service: "meta_ads", phase: "ongoing", day: d, n: "Optimize Meta Lead Generation Campaign Budgets", role: "ADS", freq: "Wednesday", hours: "1h", deps: [] });
      ongoing.push({ id: `gs_d${d}_li`, service: "linkedin_outreach", phase: "ongoing", day: d, n: "Send 15 LinkedIn Outreach DMs", role: "OBS", freq: "Wednesday", hours: "0.5h", deps: [] });
      ongoing.push({ id: `gs_d${d}_comm`, service: "social_media", phase: "ongoing", day: d, n: "Respond to Social Media Comments and Messages", role: "SMM", freq: "Wednesday", hours: "0.5h", deps: [] });
    } else if (weekday === "Thursday") {
      ongoing.push({ id: `gs_d${d}_post2`, service: "social_media", phase: "ongoing", day: d, n: "Produce Second Weekly Post Batch", role: "GD", freq: "Thursday", hours: "1.5h", deps: [] });
      ongoing.push({ id: `gs_d${d}_li`, service: "linkedin_outreach", phase: "ongoing", day: d, n: "Send 15 LinkedIn Connection Requests", role: "OBS", freq: "Thursday", hours: "0.5h", deps: [] });
      ongoing.push({ id: `gs_d${d}_book`, service: "ai_crm", phase: "ongoing", day: d, n: "Schedule Inbound Discovery Calls in GHL", role: "OBS", freq: "Thursday", hours: "0.5h", deps: [] });
      ongoing.push({ id: `gs_d${d}_ads`, service: "meta_ads", phase: "ongoing", day: d, n: "Check Meta Lead Form Conversion Quality", role: "ADS", freq: "Thursday", hours: "0.5h", deps: [] });
    } else if (weekday === "Friday") {
      ongoing.push({ id: `gs_d${d}_hyg`, service: "ai_crm", phase: "ongoing", day: d, n: "Audit GHL Lead Routing Automation", role: "AUTO", freq: "Friday", hours: "0.5h", deps: [] });
      ongoing.push({ id: `gs_d${d}_li`, service: "linkedin_outreach", phase: "ongoing", day: d, n: "Send 15 LinkedIn Connection Requests", role: "OBS", freq: "Friday", hours: "0.5h", deps: [] });
      ongoing.push({ id: `gs_d${d}_wrap`, service: "core", phase: "ongoing", day: d, n: "Send Weekly Performance Summary to Client", role: "AM", freq: "Friday", hours: "1h", deps: [] });
    } else if (weekday === "Saturday") {
      ongoing.push({ id: `gs_d${d}_comm`, service: "social_media", phase: "ongoing", day: d, n: "Engage with Community Followers", role: "SMM", freq: "Saturday", hours: "1h", deps: [] });
    }

    if (d === 25 || d === 55 || d === 85) {
      ongoing.push({ id: `gs_m${d}_cal`, service: "social_media", phase: "ongoing", day: d, n: "Submit Next Month Content Calendar for Client Approval", role: "SMM", priority: "normal", hours: "1h", deps: [] });
    }
  }

  // Monthly Reviews
  ongoing.push({ id: "gs_m30", service: "core", phase: "ongoing", day: 30, n: "Conduct Month 1 Performance Review", role: "AM", priority: "high", hours: "2h", deps: [] });
  ongoing.push({ id: "gs_m40", service: "landing_page", phase: "ongoing", day: 40, n: "Audit Landing Page Conversion Rate", role: "DEV", priority: "normal", hours: "1.5h", deps: [] });
  ongoing.push({ id: "gs_m60", service: "core", phase: "ongoing", day: 60, n: "Conduct Month 2 Pricing Check and Performance Review", role: "AM", priority: "high", hours: "2h", deps: [] });
  ongoing.push({ id: "gs_m70", service: "landing_page", phase: "ongoing", day: 70, n: "Audit Mobile Usability on Landing Page", role: "DEV", priority: "normal", hours: "1h", deps: [] });
  ongoing.push({ id: "gs_m90", service: "core", phase: "ongoing", day: 90, n: "Conduct Quarter Review and Renewal Conversation", role: "AM", priority: "high", hours: "2h", deps: [] });

  return [...sprint, ...ongoing];
}

// =============================================================
// 3. GROWTH ENGINE (PKR 300,000)
// =============================================================
function generateGrowthEngineTasks() {
  const sprint = [
    // Day 1
    { id: "ge_s01_a", service: "core", phase: "sprint", day: 1, n: "Conduct Kickoff Meeting with Client", role: "AM", deps: [], hours: "1h", priority: "high" },
    { id: "ge_s01_b", service: "core", phase: "sprint", day: 1, n: "Collect Platform Credentials", role: "AM", deps: ["ge_s01_a"], hours: "0.5h", priority: "high" },
    { id: "ge_s01_c", service: "cold_email", phase: "sprint", day: 1, n: "Purchase 6 Sending Domains", role: "AUTO", deps: ["ge_s01_b"], hours: "1h", priority: "high" },
    { id: "ge_s01_d", service: "cold_email", phase: "sprint", day: 1, n: "Configure SPF, DKIM, DMARC DNS Records", role: "AUTO", deps: ["ge_s01_c"], hours: "1h", priority: "high" },

    // Day 2
    { id: "ge_s02_a", service: "core", phase: "sprint", day: 2, n: "Audit Client Business Offer", role: "STRAT", deps: ["ge_s01_b"], hours: "1.5h", priority: "high" },
    { id: "ge_s02_b", service: "core", phase: "sprint", day: 2, n: "Benchmark Competitor Market Strategies", role: "STRAT", deps: ["ge_s02_a"], hours: "1.5h", priority: "high" },
    { id: "ge_s02_c", service: "cold_email", phase: "sprint", day: 2, n: "Create 18 Mailboxes across 6 Domains", role: "AUTO", deps: ["ge_s01_d"], hours: "1.5h", priority: "high" },

    // Day 3
    { id: "ge_s03_a", service: "core", phase: "sprint", day: 3, n: "Draft Target ICP Profile", role: "STRAT", deps: ["ge_s02_a"], hours: "1.5h", priority: "high" },
    { id: "ge_s03_b", service: "core", phase: "sprint", day: 3, n: "Submit ICP Scorecard for Approval", role: "STRAT", deps: ["ge_s03_a"], hours: "1h", priority: "high" },
    { id: "ge_s03_c", service: "cold_email", phase: "sprint", day: 3, n: "Connect 18 Mailboxes to Warmup Pool", role: "AUTO", deps: ["ge_s02_c"], hours: "1h", priority: "high" },
    { id: "ge_s03_d", service: "cold_email", phase: "sprint", day: 3, n: "Set Automated Warmup Schedule", role: "AUTO", deps: ["ge_s03_c"], hours: "0.5h", priority: "high" },

    // Day 4
    { id: "ge_s04_a", service: "social_media", phase: "sprint", day: 4, n: "Collect Brand Identity Assets", role: "GD", deps: ["ge_s03_b"], hours: "1h", priority: "normal" },
    { id: "ge_s04_b", service: "ai_crm", phase: "sprint", day: 4, n: "Build GHL Sub-Account Multi-Pipeline Stages", role: "AUTO", deps: ["ge_s01_b"], hours: "1.5h", priority: "high" },

    // Day 5
    { id: "ge_s05_a", service: "ai_crm", phase: "sprint", day: 5, n: "Configure Booking Calendar and Routing Automation", role: "AUTO", deps: ["ge_s04_b"], hours: "1h", priority: "high" },
    { id: "ge_s05_b", service: "ai_crm", phase: "sprint", day: 5, n: "Setup Instant CRM Live Lead Alerts", role: "AUTO", deps: ["ge_s05_a"], hours: "0.5h", priority: "normal" },

    // Day 6
    { id: "ge_s06_a", service: "meta_ads", phase: "sprint", day: 6, n: "Deploy Meta Pixel Conversion Events", role: "DEV", deps: ["ge_s05_a"], hours: "1h", priority: "high" },
    { id: "ge_s06_b", service: "meta_ads", phase: "sprint", day: 6, n: "Setup Google Analytics 4 and Tag Manager", role: "DEV", deps: ["ge_s06_a"], hours: "1.5h", priority: "high" },

    // Day 7
    { id: "ge_s07_a", service: "cold_email", phase: "sprint", day: 7, n: "Draft Email Sequence Angle 1 Direct Pitch", role: "CW", deps: ["ge_s03_a"], hours: "1.5h", priority: "high" },
    { id: "ge_s07_b", service: "cold_email", phase: "sprint", day: 7, n: "Draft Email Sequence Angle 2 Pain Point", role: "CW", deps: ["ge_s07_a"], hours: "1.5h", priority: "high" },
    { id: "ge_s07_c", service: "cold_email", phase: "sprint", day: 7, n: "Source First 1,500 Verified ICP Contacts", role: "DATA", deps: ["ge_s03_b"], hours: "2.5h", priority: "high" },

    // Day 8
    { id: "ge_s08_a", service: "cold_email", phase: "sprint", day: 8, n: "Draft Email Sequence Angle 3 Case Study and Social Proof", role: "CW", deps: ["ge_s07_b"], hours: "1.5h", priority: "high" },
    { id: "ge_s08_b", service: "cold_email", phase: "sprint", day: 8, n: "Write 4 Follow Up Variations Per Angle", role: "CW", deps: ["ge_s08_a"], hours: "2h", priority: "high" },
    { id: "ge_s08_c", service: "meta_ads", phase: "sprint", day: 8, n: "Audit Meta and Google Ad Account Settings", role: "ADS", deps: ["ge_s06_a"], hours: "1.5h", priority: "high" },

    // Day 9
    { id: "ge_s09_a", service: "linkedin_outreach", phase: "sprint", day: 9, n: "Write LinkedIn Connection Note and 3 Step DM Sequence", role: "CW", deps: ["ge_s07_a"], hours: "1h", priority: "high" },
    { id: "ge_s09_b", service: "linkedin_outreach", phase: "sprint", day: 9, n: "Design LinkedIn Banner and Optimize Headline", role: "GD", deps: ["ge_s04_a"], hours: "1h", priority: "normal" },
    { id: "ge_s09_c", service: "seo", phase: "sprint", day: 9, n: "Execute Technical SEO Audit and Crawl Review", role: "SEO", deps: ["ge_s03_a"], hours: "2h", priority: "normal" },

    // Day 10
    { id: "ge_s10_a", service: "core", phase: "sprint", day: 10, n: "Messaging Approval Call with Client on Angles and Content Pillars", role: "AM", deps: ["ge_s08_b", "ge_s09_a"], hours: "1h", priority: "high" },
    { id: "ge_s10_b", service: "landing_page", phase: "sprint", day: 10, n: "Design Landing Page 1 Layout Wireframe", role: "DEV", deps: ["ge_s10_a"], hours: "2h", priority: "high" },
    { id: "ge_s10_c", service: "linkedin_outreach", phase: "sprint", day: 10, n: "Optimize 2 LinkedIn Personal Profiles", role: "OBS", deps: ["ge_s09_b"], hours: "1.5h", priority: "normal" },

    // Day 11
    { id: "ge_s11_a", service: "seo", phase: "sprint", day: 11, n: "Map 15 High Intent Primary Keywords", role: "SEO", deps: ["ge_s09_c"], hours: "1.5h", priority: "normal" },
    { id: "ge_s11_b", service: "social_media", phase: "sprint", day: 11, n: "Produce Initial Social Content Batch (10 Posts)", role: "CW", deps: ["ge_s10_a"], hours: "2h", priority: "normal" },

    // Day 12
    { id: "ge_s12_a", service: "core", phase: "sprint", day: 12, n: "Write Discovery Call Script and Objection Handling Document", role: "CW", deps: ["ge_s02_a"], hours: "1.5h", priority: "normal" },
    { id: "ge_s12_b", service: "core", phase: "sprint", day: 12, n: "Prepare Proposal Template for Client Use", role: "AM", deps: ["ge_s02_a"], hours: "1h", priority: "normal" },
    { id: "ge_s12_c", service: "landing_page", phase: "sprint", day: 12, n: "Deploy 2 Landing Pages Live on Subdomains", role: "DEV", deps: ["ge_s10_b"], hours: "2h", priority: "high" },

    // Day 13
    { id: "ge_s13_a", service: "core", phase: "sprint", day: 13, n: "Build Reporting Dashboard and KPI Sheet with Client Login", role: "AM", deps: ["ge_s04_b"], hours: "2h", priority: "high" },
    { id: "ge_s13_b", service: "cold_email", phase: "sprint", day: 13, n: "Source Additional 1,500 Verified ICP Contacts", role: "DATA", deps: ["ge_s07_c"], hours: "2h", priority: "high" },

    // Day 14
    { id: "ge_s14_a", service: "meta_ads", phase: "sprint", day: 14, n: "Build Meta and Google Search Campaigns in Paused Drafts", role: "ADS", deps: ["ge_s08_c", "ge_s12_c"], hours: "2h", priority: "high" },
    { id: "ge_s14_b", service: "meta_ads", phase: "sprint", day: 14, n: "Confirm Monthly Ad Spend Budget and Billing Method in Writing", role: "AM", deps: ["ge_s14_a"], hours: "0.5h", priority: "high" },
    { id: "ge_s14_c", service: "cold_email", phase: "sprint", day: 14, n: "Execute Seed List Test Send to 10 Inboxes", role: "OBS", deps: ["ge_s03_c"], hours: "1h", priority: "high" },

    // Day 15
    { id: "ge_s15_a", service: "cold_email", phase: "sprint", day: 15, n: "Final Deliverability QA and Inbox Placement Check", role: "OBS", deps: ["ge_s14_c"], hours: "1h", priority: "high" },
    { id: "ge_s15_b", service: "core", phase: "sprint", day: 15, n: "Compile Go Live Performance Report and Conduct Milestone Review", role: "AM", deps: ["ge_s15_a"], hours: "1h", priority: "high" },
  ];

  const ongoing = [];
  for (let d = 16; d <= 90; d++) {
    const weekday = getWeekday(d);

    if (d === 17) {
      ongoing.push({ id: `ge_d${d}_ramp`, service: "cold_email", phase: "ongoing", day: d, n: "Start Cold Email Sending at 20 Percent Volume", role: "OBS", priority: "high", hours: "1h", deps: [] });
    }
    if (d === 20) {
      ongoing.push({ id: `ge_d${d}_scale`, service: "cold_email", phase: "ongoing", day: d, n: "Scale Cold Email to Full Daily Volume", role: "OBS", priority: "high", hours: "1h", deps: [] });
    }

    if (weekday === "Monday") {
      ongoing.push({ id: `ge_d${d}_kpi`, service: "core", phase: "ongoing", day: d, n: "Review Weekly KPI Scorecard", role: "AM", freq: "Monday", hours: "1h", deps: [] });
      ongoing.push({ id: `ge_d${d}_box`, service: "cold_email", phase: "ongoing", day: d, n: "Check Mailbox Health (18 Boxes)", role: "AUTO", freq: "Monday", hours: "0.5h", deps: [] });
      ongoing.push({ id: `ge_d${d}_list`, service: "cold_email", phase: "ongoing", day: d, n: "Build Weekly Verified Lead List (750 Contacts)", role: "DATA", freq: "Monday", hours: "1.5h", deps: [] });
      if (d >= 17) {
        ongoing.push({ id: `ge_d${d}_send`, service: "cold_email", phase: "ongoing", day: d, n: d < 20 ? "Send Cold Email Ramp-Up Batch" : "Send Cold Email Batch (450 Sends)", role: "OBS", freq: "Monday", hours: "1h", deps: [] });
      }
      ongoing.push({ id: `ge_d${d}_li`, service: "linkedin_outreach", phase: "ongoing", day: d, n: "Send 40 LinkedIn Connection Requests (2 Profiles)", role: "OBS", freq: "Monday", hours: "1h", deps: [] });
      ongoing.push({ id: `ge_d${d}_kw`, service: "seo", phase: "ongoing", day: d, n: "Track Keyword Ranking Movement", role: "SEO", freq: "Monday", hours: "0.5h", deps: [] });
      ongoing.push({ id: `ge_d${d}_sched`, service: "social_media", phase: "ongoing", day: d, n: "Schedule Weekly Content across Channels", role: "SMM", freq: "Monday", hours: "1h", deps: [] });
      ongoing.push({ id: `ge_d${d}_ads`, service: "meta_ads", phase: "ongoing", day: d, n: "Check Meta and Google Ads Daily Health", role: "ADS", freq: "Monday", hours: "0.5h", deps: [] });
    } else if (weekday === "Tuesday") {
      if (d >= 17) {
        ongoing.push({ id: `ge_d${d}_send`, service: "cold_email", phase: "ongoing", day: d, n: d < 20 ? "Send Cold Email Ramp-Up Batch" : "Send Cold Email Batch (450 Sends)", role: "OBS", freq: "Tuesday", hours: "1h", deps: [] });
      }
      ongoing.push({ id: `ge_d${d}_reply_m`, service: "cold_email", phase: "ongoing", day: d, n: "Morning Reply Triage", role: "OBS", freq: "Tuesday", hours: "0.5h", deps: [] });
      ongoing.push({ id: `ge_d${d}_reply_e`, service: "cold_email", phase: "ongoing", day: d, n: "Evening Reply Triage", role: "OBS", freq: "Tuesday", hours: "0.5h", deps: [] });
      ongoing.push({ id: `ge_d${d}_reel`, service: "video_reels", phase: "ongoing", day: d, n: "Produce Short-Form Video Reel", role: "VE", freq: "Tuesday", hours: "1.5h", deps: [] });
      ongoing.push({ id: `ge_d${d}_li`, service: "linkedin_outreach", phase: "ongoing", day: d, n: "Send 40 LinkedIn Connection Requests", role: "OBS", freq: "Tuesday", hours: "1h", deps: [] });
      ongoing.push({ id: `ge_d${d}_ads`, service: "meta_ads", phase: "ongoing", day: d, n: "Audit Ad Acquisition Cost Metrics", role: "ADS", freq: "Tuesday", hours: "0.5h", deps: [] });
    } else if (weekday === "Wednesday") {
      if (d >= 17) {
        ongoing.push({ id: `ge_d${d}_send`, service: "cold_email", phase: "ongoing", day: d, n: d < 20 ? "Send Cold Email Ramp-Up Batch" : "Send Cold Email Batch (450 Sends)", role: "OBS", freq: "Wednesday", hours: "1h", deps: [] });
      }
      ongoing.push({ id: `ge_d${d}_blog`, service: "seo", phase: "ongoing", day: d, n: "Publish SEO Optimized Blog Post", role: "CW", freq: "Wednesday", hours: "2h", deps: [] });
      ongoing.push({ id: `ge_d${d}_retarg`, service: "meta_ads", phase: "ongoing", day: d, n: "Refresh Retargeting Ad Creatives", role: "ADS", freq: "Wednesday", hours: "1h", deps: [] });
      ongoing.push({ id: `ge_d${d}_li`, service: "linkedin_outreach", phase: "ongoing", day: d, n: "Send LinkedIn Outbound DMs", role: "OBS", freq: "Wednesday", hours: "1h", deps: [] });
      ongoing.push({ id: `ge_d${d}_reply`, service: "ai_crm", phase: "ongoing", day: d, n: "Process Meeting Calendar Bookings in GHL", role: "OBS", freq: "Wednesday", hours: "0.5h", deps: [] });
    } else if (weekday === "Thursday") {
      if (d >= 17) {
        ongoing.push({ id: `ge_d${d}_send`, service: "cold_email", phase: "ongoing", day: d, n: d < 20 ? "Send Cold Email Ramp-Up Batch" : "Send Cold Email Batch (450 Sends)", role: "OBS", freq: "Thursday", hours: "1h", deps: [] });
      }
      ongoing.push({ id: `ge_d${d}_backlink`, service: "seo", phase: "ongoing", day: d, n: "Execute Backlink Outreach Pitching", role: "SEO", freq: "Thursday", hours: "1.5h", deps: [] });
      ongoing.push({ id: `ge_d${d}_posts`, service: "social_media", phase: "ongoing", day: d, n: "Produce Weekly Post Batch Visuals", role: "GD", freq: "Thursday", hours: "1.5h", deps: [] });
      ongoing.push({ id: `ge_d${d}_li`, service: "linkedin_outreach", phase: "ongoing", day: d, n: "Send 40 LinkedIn Connection Requests", role: "OBS", freq: "Thursday", hours: "1h", deps: [] });
      ongoing.push({ id: `ge_d${d}_calls`, service: "ai_crm", phase: "ongoing", day: d, n: "Confirm Scheduled Calls and Send Reminders", role: "OBS", freq: "Thursday", hours: "0.5h", deps: [] });
      ongoing.push({ id: `ge_d${d}_ads`, service: "google_ads", phase: "ongoing", day: d, n: "Optimize Google Search Keywords and Negative Terms", role: "ADS", freq: "Thursday", hours: "0.5h", deps: [] });
    } else if (weekday === "Friday") {
      if (d >= 17) {
        ongoing.push({ id: `ge_d${d}_send`, service: "cold_email", phase: "ongoing", day: d, n: d < 20 ? "Send Cold Email Ramp-Up Batch" : "Send Cold Email Batch (450 Sends)", role: "OBS", freq: "Friday", hours: "1h", deps: [] });
      }
      ongoing.push({ id: `ge_d${d}_seq`, service: "cold_email", phase: "ongoing", day: d, n: "Analyze Sequence Conversion Rates by Angle", role: "STRAT", freq: "Friday", hours: "1h", deps: [] });
      ongoing.push({ id: `ge_d${d}_gmb`, service: "seo", phase: "ongoing", day: d, n: "Publish Google Business Profile Update", role: "SEO", freq: "Friday", hours: "0.5h", deps: [] });
      ongoing.push({ id: `ge_d${d}_hyg`, service: "ai_crm", phase: "ongoing", day: d, n: "Audit GHL CRM Lead Automation", role: "AUTO", freq: "Friday", hours: "0.5h", deps: [] });
      if (d % 2 === 0) {
        ongoing.push({ id: `ge_d${d}_iter`, service: "cold_email", phase: "ongoing", day: d, n: "Copy Iteration on Weakest Performing Angle", role: "CW", freq: "Alternate Friday", hours: "1.5h", deps: [] });
      }
    } else if (weekday === "Saturday") {
      ongoing.push({ id: `ge_d${d}_comm`, service: "social_media", phase: "ongoing", day: d, n: "Manage Social Community Engagement", role: "SMM", freq: "Saturday", hours: "1h", deps: [] });
    }

    if (d === 25 || d === 55 || d === 85) {
      ongoing.push({ id: `ge_m${d}_cal`, service: "social_media", phase: "ongoing", day: d, n: "Submit Next Month Content Calendar for Client Approval", role: "SMM", priority: "normal", hours: "1h", deps: [] });
    }
  }

  // Monthly Reviews
  ongoing.push({ id: "ge_m25", service: "cold_email", phase: "ongoing", day: 25, n: "Kill Weakest Email Angle and Reallocate Its Volume", role: "STRAT", priority: "high", hours: "1.5h", deps: [] });
  ongoing.push({ id: "ge_m30", service: "core", phase: "ongoing", day: 30, n: "Conduct Month 1 Performance Review", role: "AM", priority: "high", hours: "2h", deps: [] });
  ongoing.push({ id: "ge_m45", service: "meta_ads", phase: "ongoing", day: 45, n: "Launch Omnichannel Retargeting Campaigns", role: "ADS", priority: "high", hours: "2h", deps: [] });
  ongoing.push({ id: "ge_m52", service: "cold_email", phase: "ongoing", day: 52, n: "Rotate Burnt Domains and Start Warmup on 2 Replacements", role: "AUTO", priority: "high", hours: "2h", deps: [] });
  ongoing.push({ id: "ge_m60", service: "core", phase: "ongoing", day: 60, n: "Conduct Month 2 Pricing Check and Performance Review", role: "AM", priority: "high", hours: "2h", deps: [] });
  ongoing.push({ id: "ge_m90", service: "core", phase: "ongoing", day: 90, n: "Conduct Quarter Review and Renewal Conversation", role: "AM", priority: "high", hours: "2h", deps: [] });

  return [...sprint, ...ongoing];
}

// =============================================================
// 4. GROWTH DOMINANCE (PKR 500,000)
// =============================================================
function generateGrowthDominanceTasks() {
  const sprint = [
    // Day 1
    { id: "gd_s01_a", service: "core", phase: "sprint", day: 1, n: "Conduct Executive Kickoff Meeting with Client", role: "AM", deps: [], hours: "1h", priority: "high" },
    { id: "gd_s01_b", service: "core", phase: "sprint", day: 1, n: "Collect Omnichannel Platform Credentials", role: "AM", deps: ["gd_s01_a"], hours: "1h", priority: "high" },
    { id: "gd_s01_c", service: "cold_email", phase: "sprint", day: 1, n: "Purchase 10 Sending Domains", role: "AUTO", deps: ["gd_s01_b"], hours: "1.5h", priority: "high" },
    { id: "gd_s01_d", service: "cold_email", phase: "sprint", day: 1, n: "Configure SPF, DKIM, DMARC DNS Records", role: "AUTO", deps: ["gd_s01_c"], hours: "1.5h", priority: "high" },

    // Day 2
    { id: "gd_s02_a", service: "core", phase: "sprint", day: 2, n: "Audit Full Funnel Architecture", role: "SR_STRAT", deps: ["gd_s01_b"], hours: "2h", priority: "high" },
    { id: "gd_s02_b", service: "core", phase: "sprint", day: 2, n: "Execute Market Intelligence Scan", role: "SR_STRAT", deps: ["gd_s02_a"], hours: "1.5h", priority: "high" },
    { id: "gd_s02_c", service: "cold_email", phase: "sprint", day: 2, n: "Create 10 Mailboxes across 10 Domains", role: "AUTO", deps: ["gd_s01_d"], hours: "2h", priority: "high" },

    // Day 3
    { id: "gd_s03_a", service: "core", phase: "sprint", day: 3, n: "Formulate Enterprise ICP Document", role: "SR_STRAT", deps: ["gd_s02_a"], hours: "1.5h", priority: "high" },
    { id: "gd_s03_b", service: "core", phase: "sprint", day: 3, n: "Build Lead Qualification Scorecard", role: "SR_STRAT", deps: ["gd_s03_a"], hours: "1h", priority: "high" },
    { id: "gd_s03_c", service: "cold_email", phase: "sprint", day: 3, n: "Connect 10 Mailboxes to Warmup Pool", role: "AUTO", deps: ["gd_s02_c"], hours: "1h", priority: "high" },
    { id: "gd_s03_d", service: "cold_email", phase: "sprint", day: 3, n: "Set Automated Warmup Schedule", role: "AUTO", deps: ["gd_s03_c"], hours: "0.5h", priority: "high" },

    // Day 4
    { id: "gd_s04_a", service: "social_media", phase: "sprint", day: 4, n: "Organize Brand Creative Assets", role: "GD", deps: ["gd_s03_a"], hours: "1h", priority: "normal" },
    { id: "gd_s04_b", service: "ai_crm", phase: "sprint", day: 4, n: "Build Multi-Pipeline Stages in GHL", role: "AUTO", deps: ["gd_s01_b"], hours: "2h", priority: "high" },

    // Day 5
    { id: "gd_s05_a", service: "ai_crm", phase: "sprint", day: 5, n: "Configure Booking Calendar and Intelligent Routing", role: "AUTO", deps: ["gd_s04_b"], hours: "1.5h", priority: "high" },
    { id: "gd_s05_b", service: "ai_crm", phase: "sprint", day: 5, n: "Configure Custom AI Chatbot Qualification Logic", role: "AUTO", deps: ["gd_s05_a"], hours: "2h", priority: "high" },

    // Day 6
    { id: "gd_s06_a", service: "meta_ads", phase: "sprint", day: 6, n: "Deploy Omnichannel Tracking Pixels (Meta, Google, LinkedIn)", role: "DEV", deps: ["gd_s05_a"], hours: "1.5h", priority: "high" },
    { id: "gd_s06_b", service: "google_ads", phase: "sprint", day: 6, n: "Setup Call Tracking and Data Streams in GA4", role: "DEV", deps: ["gd_s06_a"], hours: "1.5h", priority: "high" },

    // Day 7
    { id: "gd_s07_a", service: "cold_email", phase: "sprint", day: 7, n: "Draft Email Sequence Angle 1 Direct Pitch", role: "CW", deps: ["gd_s03_a"], hours: "1.5h", priority: "high" },
    { id: "gd_s07_b", service: "cold_email", phase: "sprint", day: 7, n: "Draft Email Sequence Angle 2 Pain Point", role: "CW", deps: ["gd_s07_a"], hours: "1.5h", priority: "high" },
    { id: "gd_s07_c", service: "cold_email", phase: "sprint", day: 7, n: "Source First 2,250 Verified ICP Contacts", role: "DATA", deps: ["gd_s03_b"], hours: "3h", priority: "high" },

    // Day 8
    { id: "gd_s08_a", service: "cold_email", phase: "sprint", day: 8, n: "Draft Email Sequence Angle 3 Case Study and Social Proof", role: "CW", deps: ["gd_s07_b"], hours: "1.5h", priority: "high" },
    { id: "gd_s08_b", service: "cold_email", phase: "sprint", day: 8, n: "Write 4 Follow Up Variations Per Angle", role: "CW", deps: ["gd_s08_a"], hours: "2h", priority: "high" },
    { id: "gd_s08_c", service: "meta_ads", phase: "sprint", day: 8, n: "Audit Meta, Google, and LinkedIn Ad Accounts", role: "ADS", deps: ["gd_s06_a"], hours: "1.5h", priority: "high" },

    // Day 9
    { id: "gd_s09_a", service: "linkedin_outreach", phase: "sprint", day: 9, n: "Write LinkedIn Connection Note and 3 Step DM Sequence for 3 Profiles", role: "CW", deps: ["gd_s07_a"], hours: "2.5h", priority: "high" },
    { id: "gd_s09_b", service: "linkedin_outreach", phase: "sprint", day: 9, n: "Design LinkedIn Banners and Optimize Headlines for 3 Profiles", role: "GD", deps: ["gd_s04_a"], hours: "2.5h", priority: "normal" },
    { id: "gd_s09_c", service: "seo", phase: "sprint", day: 9, n: "Formulate Enterprise SEO Architecture and 30 Keyword Clusters", role: "SEO_LEAD", deps: ["gd_s03_a"], hours: "2.5h", priority: "high" },

    // Day 10
    { id: "gd_s10_a", service: "core", phase: "sprint", day: 10, n: "Messaging Approval Call with Client on Angles and Content Pillars", role: "AM", deps: ["gd_s08_b", "gd_s09_a"], hours: "1h", priority: "high" },
    { id: "gd_s10_b", service: "landing_page", phase: "sprint", day: 10, n: "Design High Converting Landing Page Layout Wireframe", role: "DEV", deps: ["gd_s10_a"], hours: "2.5h", priority: "high" },
    { id: "gd_s10_c", service: "ghostwriting", phase: "sprint", day: 10, n: "Conduct Founder Ghostwriting Alignment Interview", role: "GHOST", deps: ["gd_s10_a"], hours: "1.5h", priority: "high" },

    // Day 11
    { id: "gd_s11_a", service: "seo", phase: "sprint", day: 11, n: "Deploy 30 Tracked Primary SEO Keywords", role: "SEO_LEAD", deps: ["gd_s09_c"], hours: "1.5h", priority: "normal" },
    { id: "gd_s11_b", service: "ghostwriting", phase: "sprint", day: 11, n: "Draft First Batch of Founder Thought Leadership Posts", role: "GHOST", deps: ["gd_s10_c"], hours: "2h", priority: "high" },

    // Day 12
    { id: "gd_s12_a", service: "core", phase: "sprint", day: 12, n: "Write Discovery Call Script and Objection Handling Document", role: "CW", deps: ["gd_s02_a"], hours: "1.5h", priority: "normal" },
    { id: "gd_s12_b", service: "core", phase: "sprint", day: 12, n: "Prepare Proposal Template for Client Use", role: "AM", deps: ["gd_s02_a"], hours: "1h", priority: "normal" },
    { id: "gd_s12_c", service: "landing_page", phase: "sprint", day: 12, n: "Deploy Landing Pages Live and Test Integrations", role: "DEV", deps: ["gd_s10_b"], hours: "2.5h", priority: "high" },

    // Day 13
    { id: "gd_s13_a", service: "core", phase: "sprint", day: 13, n: "Build Reporting Dashboard and KPI Sheet with Client Login", role: "AM", deps: ["gd_s04_b"], hours: "2h", priority: "high" },
    { id: "gd_s13_b", service: "cold_email", phase: "sprint", day: 13, n: "Source Additional 2,250 Verified ICP Contacts", role: "DATA", deps: ["gd_s07_c"], hours: "2.5h", priority: "high" },

    // Day 14
    { id: "gd_s14_a", service: "meta_ads", phase: "sprint", day: 14, n: "Build Meta, Google, and LinkedIn Ad Campaigns in Paused Drafts", role: "ADS", deps: ["gd_s08_c", "gd_s12_c"], hours: "2.5h", priority: "high" },
    { id: "gd_s14_b", service: "meta_ads", phase: "sprint", day: 14, n: "Confirm Monthly Ad Spend Budget and Billing Method in Writing", role: "AM", deps: ["gd_s14_a"], hours: "0.5h", priority: "high" },
    { id: "gd_s14_c", service: "cold_email", phase: "sprint", day: 14, n: "Execute Seed List Test Send to 15 Inboxes", role: "OBS", deps: ["gd_s03_c"], hours: "1.5h", priority: "high" },

    // Day 15
    { id: "gd_s15_a", service: "cold_email", phase: "sprint", day: 15, n: "Final Deliverability QA and Inbox Placement Check", role: "OBS", deps: ["gd_s14_c"], hours: "1h", priority: "high" },
    { id: "gd_s15_b", service: "core", phase: "sprint", day: 15, n: "Compile Enterprise Go Live Audit Report and Sign-Off", role: "AM", deps: ["gd_s15_a"], hours: "1h", priority: "high" },
  ];

  const ongoing = [];
  for (let d = 16; d <= 90; d++) {
    const weekday = getWeekday(d);

    if (d === 17) {
      ongoing.push({ id: `gd_d${d}_ramp`, service: "cold_email", phase: "ongoing", day: d, n: "Start Cold Email Sending at 20 Percent Volume", role: "OBS", priority: "high", hours: "1h", deps: [] });
    }
    if (d === 20) {
      ongoing.push({ id: `gd_d${d}_scale`, service: "cold_email", phase: "ongoing", day: d, n: "Scale Cold Email to Full Daily Volume", role: "OBS", priority: "high", hours: "1h", deps: [] });
    }

    if (weekday === "Monday") {
      ongoing.push({ id: `gd_d${d}_kpi`, service: "core", phase: "ongoing", day: d, n: "Review Omnichannel Executive KPI Dashboard", role: "AM", freq: "Monday", hours: "1h", deps: [] });
      ongoing.push({ id: `gd_d${d}_box`, service: "cold_email", phase: "ongoing", day: d, n: "Check Mailbox Health (10 Boxes)", role: "AUTO", freq: "Monday", hours: "0.5h", deps: [] });
      ongoing.push({ id: `gd_d${d}_list`, service: "cold_email", phase: "ongoing", day: d, n: "Build Weekly Verified Lead List (1,125 Contacts)", role: "DATA", freq: "Monday", hours: "2h", deps: [] });
      if (d >= 17) {
        ongoing.push({ id: `gd_d${d}_send`, service: "cold_email", phase: "ongoing", day: d, n: d < 20 ? "Send Cold Email Ramp-Up Batch" : "Send Cold Email Batch (750 Sends)", role: "OBS", freq: "Monday", hours: "1h", deps: [] });
      }
      ongoing.push({ id: `gd_d${d}_li`, service: "linkedin_outreach", phase: "ongoing", day: d, n: "Send LinkedIn Connection Requests across 3 Profiles", role: "OBS", freq: "Monday", hours: "1h", deps: [] });
      ongoing.push({ id: `gd_d${d}_ghost`, service: "ghostwriting", phase: "ongoing", day: d, n: "Publish Founder Ghostwriting Post (Mon)", role: "GHOST", freq: "Monday", hours: "1.5h", deps: [] });
      ongoing.push({ id: `gd_d${d}_ads`, service: "meta_ads", phase: "ongoing", day: d, n: "Audit Meta, Google, and LinkedIn Ad Spend", role: "ADS", freq: "Monday", hours: "1h", deps: [] });
    } else if (weekday === "Tuesday") {
      if (d >= 17) {
        ongoing.push({ id: `gd_d${d}_send`, service: "cold_email", phase: "ongoing", day: d, n: d < 20 ? "Send Cold Email Ramp-Up Batch" : "Send Cold Email Batch (750 Sends)", role: "OBS", freq: "Tuesday", hours: "1h", deps: [] });
      }
      ongoing.push({ id: `gd_d${d}_reply_m`, service: "cold_email", phase: "ongoing", day: d, n: "Morning Omnichannel Inbound Triage", role: "OBS", freq: "Tuesday", hours: "0.5h", deps: [] });
      ongoing.push({ id: `gd_d${d}_reply_e`, service: "cold_email", phase: "ongoing", day: d, n: "Evening Omnichannel Inbound Triage", role: "OBS", freq: "Tuesday", hours: "0.5h", deps: [] });
      ongoing.push({ id: `gd_d${d}_reel`, service: "video_reels", phase: "ongoing", day: d, n: "Produce Video Reel Creative (12/mo Cadence)", role: "VE", freq: "Tuesday", hours: "1.5h", deps: [] });
      ongoing.push({ id: `gd_d${d}_blog1`, service: "seo", phase: "ongoing", day: d, n: "Publish Authority SEO Blog Article 1 (8/mo Cadence)", role: "CW", freq: "Tuesday", hours: "2h", deps: [] });
      ongoing.push({ id: `gd_d${d}_li`, service: "linkedin_outreach", phase: "ongoing", day: d, n: "Send LinkedIn Connection Requests", role: "OBS", freq: "Tuesday", hours: "1h", deps: [] });
    } else if (weekday === "Wednesday") {
      if (d >= 17) {
        ongoing.push({ id: `gd_d${d}_send`, service: "cold_email", phase: "ongoing", day: d, n: d < 20 ? "Send Cold Email Ramp-Up Batch" : "Send Cold Email Batch (750 Sends)", role: "OBS", freq: "Wednesday", hours: "1h", deps: [] });
      }
      ongoing.push({ id: `gd_d${d}_ghost`, service: "ghostwriting", phase: "ongoing", day: d, n: "Publish Founder Ghostwriting Post (Wed)", role: "GHOST", freq: "Wednesday", hours: "1.5h", deps: [] });
      ongoing.push({ id: `gd_d${d}_opt_ads`, service: "meta_ads", phase: "ongoing", day: d, n: "Scale Winning Ads across 3 Ad Platforms", role: "ADS", freq: "Wednesday", hours: "1.5h", deps: [] });
      ongoing.push({ id: `gd_d${d}_li`, service: "linkedin_outreach", phase: "ongoing", day: d, n: "Send Targeted LinkedIn Outbound DMs", role: "OBS", freq: "Wednesday", hours: "1h", deps: [] });
      ongoing.push({ id: `gd_d${d}_reply`, service: "ai_crm", phase: "ongoing", day: d, n: "Process Qualified Meeting Bookings", role: "OBS", freq: "Wednesday", hours: "0.5h", deps: [] });
    } else if (weekday === "Thursday") {
      if (d >= 17) {
        ongoing.push({ id: `gd_d${d}_send`, service: "cold_email", phase: "ongoing", day: d, n: d < 20 ? "Send Cold Email Ramp-Up Batch" : "Send Cold Email Batch (750 Sends)", role: "OBS", freq: "Thursday", hours: "1h", deps: [] });
      }
      ongoing.push({ id: `gd_d${d}_reel2`, service: "video_reels", phase: "ongoing", day: d, n: "Produce Video Reel Creative (12/mo Cadence)", role: "VE", freq: "Thursday", hours: "1.5h", deps: [] });
      ongoing.push({ id: `gd_d${d}_blog2`, service: "seo", phase: "ongoing", day: d, n: "Publish Authority SEO Blog Article 2 (8/mo Cadence)", role: "CW", freq: "Thursday", hours: "2h", deps: [] });
      ongoing.push({ id: `gd_d${d}_backlink`, service: "seo", phase: "ongoing", day: d, n: "Execute High DR Backlink Outreach Pitching (15/mo Target)", role: "SEO_LEAD", freq: "Thursday", hours: "1.5h", deps: [] });
      ongoing.push({ id: `gd_d${d}_li`, service: "linkedin_outreach", phase: "ongoing", day: d, n: "Send LinkedIn Connection Requests", role: "OBS", freq: "Thursday", hours: "1h", deps: [] });
    } else if (weekday === "Friday") {
      if (d >= 17) {
        ongoing.push({ id: `gd_d${d}_send`, service: "cold_email", phase: "ongoing", day: d, n: d < 20 ? "Send Cold Email Ramp-Up Batch" : "Send Cold Email Batch (750 Sends)", role: "OBS", freq: "Friday", hours: "1h", deps: [] });
      }
      ongoing.push({ id: `gd_d${d}_ghost`, service: "ghostwriting", phase: "ongoing", day: d, n: "Publish Founder Ghostwriting Post (Fri)", role: "GHOST", freq: "Friday", hours: "1.5h", deps: [] });
      ongoing.push({ id: `gd_d${d}_seo_audit`, service: "seo", phase: "ongoing", day: d, n: "Audit 30 Tracked SEO Keywords Performance", role: "SEO_LEAD", freq: "Friday", hours: "1h", deps: [] });
      ongoing.push({ id: `gd_d${d}_ai_opt`, service: "ai_crm", phase: "ongoing", day: d, n: "Optimize AI Chatbot Conversation & CRM Routing", role: "AUTO", freq: "Friday", hours: "1h", deps: [] });
      if (d % 2 === 0) {
        ongoing.push({ id: `gd_d${d}_iter`, service: "cold_email", phase: "ongoing", day: d, n: "Copy Iteration on Weakest Performing Angle", role: "CW", freq: "Alternate Friday", hours: "1.5h", deps: [] });
      }
    } else if (weekday === "Saturday") {
      ongoing.push({ id: `gd_d${d}_reel3`, service: "video_reels", phase: "ongoing", day: d, n: "Produce Video Reel Creative (12/mo Cadence)", role: "VE", freq: "Saturday", hours: "1.5h", deps: [] });
      ongoing.push({ id: `gd_d${d}_comm`, service: "social_media", phase: "ongoing", day: d, n: "Omnichannel Social Community Management", role: "SMM", freq: "Saturday", hours: "1h", deps: [] });
    }

    if (d === 25 || d === 55 || d === 85) {
      ongoing.push({ id: `gd_m${d}_cal`, service: "social_media", phase: "ongoing", day: d, n: "Submit Next Month Content Calendar for Client Approval", role: "SMM", priority: "normal", hours: "1h", deps: [] });
    }
  }

  // Monthly Strategic Milestones
  ongoing.push({ id: "gd_m25", service: "cold_email", phase: "ongoing", day: 25, n: "Kill Weakest Email Angle and Reallocate Its Volume", role: "SR_STRAT", priority: "high", hours: "1.5h", deps: [] });
  ongoing.push({ id: "gd_m30", service: "core", phase: "ongoing", day: 30, n: "Conduct Month 1 Performance Review", role: "AM", priority: "high", hours: "2h", deps: [] });
  ongoing.push({ id: "gd_m45", service: "meta_ads", phase: "ongoing", day: 45, n: "Launch Omnichannel Retargeting Across Meta, Google, and LinkedIn", role: "ADS", priority: "high", hours: "2h", deps: [] });
  ongoing.push({ id: "gd_m52", service: "cold_email", phase: "ongoing", day: 52, n: "Rotate Burnt Domains and Start Warmup on 2 Replacements", role: "AUTO", priority: "high", hours: "2h", deps: [] });
  ongoing.push({ id: "gd_m60", service: "core", phase: "ongoing", day: 60, n: "Conduct Month 2 Pricing Check and Performance Review", role: "AM", priority: "high", hours: "2h", deps: [] });
  ongoing.push({ id: "gd_m90", service: "core", phase: "ongoing", day: 90, n: "Conduct Quarter Review and Renewal Conversation", role: "AM", priority: "high", hours: "2h", deps: [] });

  return [...sprint, ...ongoing];
}

// Generate all tasks
const tasksColdOutreach = generateColdOutreachTasks();
const tasksGrowthStarter = generateGrowthStarterTasks();
const tasksGrowthEngine = generateGrowthEngineTasks();
const tasksGrowthDominance = generateGrowthDominanceTasks();

const PACKAGE_TASKS = {
  cold_outreach: tasksColdOutreach,
  growth_starter: tasksGrowthStarter,
  growth_engine: tasksGrowthEngine,
  growth_dominance: tasksGrowthDominance
};

const fullFileContent = `export const ROLES = {
  AM:       { label: "Account Manager",          color: "#f59e0b", short: "AM" },
  STRAT:    { label: "Strategist",               color: "#8b5cf6", short: "STRAT" },
  SR_STRAT: { label: "Senior Strategist",        color: "#6d28d9", short: "SR STRAT" },
  OBS:      { label: "Outbound Specialist",      color: "#0284c7", short: "OBS" },
  SDR:      { label: "SDR",                      color: "#06b6d4", short: "SDR" },
  DATA:     { label: "Data Specialist",          color: "#14b8a6", short: "DATA" },
  ADS:      { label: "Ads Specialist",           color: "#f43f5e", short: "ADS" },
  SEO:      { label: "SEO Specialist",           color: "#10b981", short: "SEO" },
  SEO_LEAD: { label: "SEO Lead",                 color: "#059669", short: "SEO LEAD" },
  SMM:      { label: "Social Media Manager",     color: "#0ea5e9", short: "SMM" },
  GD:       { label: "Graphic Designer",         color: "#ec4899", short: "GD" },
  CW:       { label: "Copywriter",               color: "#84cc16", short: "CW" },
  GHOST:    { label: "Founder Ghostwriter",      color: "#a855f7", short: "GHOST" },
  VE:       { label: "Video Editor",             color: "#a78bfa", short: "VE" },
  DEV:      { label: "Web Developer",            color: "#3b82f6", short: "DEV" },
  AUTO:     { label: "Automation Specialist",    color: "#6366f1", short: "AUTO" },
  AC:       { label: "Account Coordinator",      color: "#f97316", short: "AC" },
  OPS:      { label: "Ops Manager",              color: "#e11d48", short: "OPS" },
  BD:       { label: "Business Developer",       color: "#fb923c", short: "BD" },
  TECH:     { label: "Tech Team",                color: "#a855f7", short: "TECH" },
  CRM:      { label: "CRM Executive",            color: "#3b82f6", short: "CRM" },
};

export const SERVICES = ${JSON.stringify(SERVICES, null, 2)};

export const PACKAGE_SERVICES = ${JSON.stringify(PACKAGE_SERVICES, null, 2)};

export const PACKAGES = [
  {
    id: "cold_outreach",
    label: "Cold Outreach Standalone",
    price: "100,000",
    color: "#3b82f6",
    kra: "5 Domains, 15 Mailboxes, 1 LinkedIn (Booked Calls)",
    desc: "15 Mailboxes, 375 sends/day, 1 LinkedIn Profile, 3 Copy Angles, GHL Pipeline.",
    defaultServices: ['cold_email', 'linkedin_outreach', 'ai_crm']
  },
  {
    id: "growth_starter",
    label: "Growth Starter",
    price: "175,000",
    color: "#10b981",
    kra: "1 LinkedIn, 12 Static Posts, 2 Meta Ads, 1 LP, 500 Leads",
    desc: "LinkedIn Outreach (15/day), 2 Social Platforms (12 Posts/mo), Meta Ads (100K spend), 1 LP.",
    defaultServices: ['linkedin_outreach', 'social_media', 'meta_ads', 'landing_page', 'ai_crm']
  },
  {
    id: "growth_engine",
    label: "Growth Engine",
    price: "300,000",
    color: "#ea580c",
    kra: "18 Mailboxes, 2 LIs, Meta/Google Ads, SEO (15 KW), 2 LPs",
    desc: "Cold Email (450/day), 2 LinkedIn Profiles (40/day), Meta & Google Ads, 20 Posts + 6 Reels, SEO.",
    defaultServices: ['cold_email', 'linkedin_outreach', 'social_media', 'video_reels', 'meta_ads', 'google_ads', 'landing_page', 'seo', 'ai_crm']
  },
  {
    id: "growth_dominance",
    label: "Growth Dominance",
    price: "500,000",
    color: "#8b5cf6",
    kra: "10 Mailboxes, Ghostwriting, 3 Ads Platforms, SEO (30 KW), AI Chatbot",
    desc: "Full Omnichannel: 250 sends/day, 3 LIs + Ghostwriting, Meta/Google/LI Ads (1M), Unlimited LPs, AI.",
    defaultServices: ['cold_email', 'linkedin_outreach', 'social_media', 'video_reels', 'ghostwriting', 'meta_ads', 'google_ads', 'landing_page', 'seo', 'ai_crm']
  }
];

export const DC = [
  "#6366f1","#818cf8","#a78bfa","#ec4899","#f59e0b",
  "#10b981","#3b82f6","#f43f5e","#6366f1","#818cf8",
  "#a78bfa","#ec4899","#f59e0b","#10b981","#3b82f6"
];

export const PACKAGE_TASKS = ${JSON.stringify(PACKAGE_TASKS, null, 2)};

export function getPackageTasks(pkgId, selectedServices = null) {
  // Use the most comprehensive pool (Dominance) if custom services are selected
  let masterPool = PACKAGE_TASKS["growth_dominance"];
  if (pkgId && PACKAGE_TASKS[pkgId] && (!selectedServices || selectedServices.length === 0)) {
    return PACKAGE_TASKS[pkgId];
  }

  // If specific services are chosen:
  const allowed = selectedServices || (pkgId ? PACKAGE_SERVICES[pkgId] : null);
  if (!allowed) {
    return masterPool;
  }

  // Filter tasks: include core + tasks whose service is selected
  const filtered = masterPool.filter(t => {
    if (!t.service || t.service === 'core') return true;
    return allowed.includes(t.service);
  });

  return filtered;
}

export const DEFAULT_TASKS = PACKAGE_TASKS["growth_engine"];

export const DEFAULT_SOPS = {
  "Conduct Kickoff Meeting with Client": {
    trigger: "New client contract signed and first invoice confirmed.",
    steps: [
      "Review onboarding questionnaire and sales handoff notes.",
      "Join Zoom link 5 minutes prior, record session locally and to cloud.",
      "Confirm primary goal, ICP boundaries, and target offer.",
      "Verify access permissions for all required channels.",
      "Publish kickoff call summary in client portal."
    ],
    doneCriteria: "Meeting recording uploaded to Drive and kickoff notes published."
  }
};
`;

fs.writeFileSync('src/constants.js', fullFileContent);
console.log('constants.js updated with SERVICES & modular task mapping successfully!');

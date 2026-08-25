export const ROLES = {
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

export const PACKAGES = [
  {
    id: "cold_outreach",
    label: "Cold Outreach Standalone",
    price: "100,000",
    color: "#3b82f6",
    kra: "5 Domains, 15 Mailboxes, 1 LinkedIn (Booked Calls)",
    desc: "15 Mailboxes, 375 sends/day, 1 LinkedIn Profile, 3 Copy Angles, GHL Pipeline."
  },
  {
    id: "growth_starter",
    label: "Growth Starter",
    price: "175,000",
    color: "#10b981",
    kra: "1 LinkedIn, 12 Static Posts, 2 Meta Ads, 1 LP, 500 Leads",
    desc: "LinkedIn Outreach (15/day), 2 Social Platforms (12 Posts/mo), Meta Ads (100K spend), 1 LP."
  },
  {
    id: "growth_engine",
    label: "Growth Engine",
    price: "300,000",
    color: "#ea580c",
    kra: "18 Mailboxes, 2 LIs, Meta/Google Ads, SEO (15 KW), 2 LPs",
    desc: "Cold Email (450/day), 2 LinkedIn Profiles (40/day), Meta & Google Ads, 20 Posts + 6 Reels, SEO."
  },
  {
    id: "growth_dominance",
    label: "Growth Dominance",
    price: "500,000",
    color: "#8b5cf6",
    kra: "30 Mailboxes, Ghostwriting, 3 Ads Platforms, SEO (30 KW), AI Chatbot",
    desc: "Full Omnichannel: 750 sends/day, 3 LIs + Ghostwriting, Meta/Google/LI Ads (1M), Unlimited LPs, AI."
  }
];

export const DC = [
  "#6366f1","#818cf8","#a78bfa","#ec4899","#f59e0b",
  "#10b981","#3b82f6","#f43f5e","#6366f1","#818cf8",
  "#a78bfa","#ec4899","#f59e0b","#10b981","#3b82f6"
];

export const PACKAGE_TASKS = {
  "cold_outreach": [
    {
      "id": "co_s01_a",
      "phase": "sprint",
      "day": 1,
      "n": "Conduct Kickoff Meeting with Client",
      "role": "AM",
      "deps": [],
      "hours": "1h",
      "priority": "high"
    },
    {
      "id": "co_s01_b",
      "phase": "sprint",
      "day": 1,
      "n": "Collect Platform Credentials",
      "role": "AM",
      "deps": [
        "co_s01_a"
      ],
      "hours": "0.5h",
      "priority": "high"
    },
    {
      "id": "co_s01_c",
      "phase": "sprint",
      "day": 1,
      "n": "Purchase 5 Cold Email Domains",
      "role": "AUTO",
      "deps": [
        "co_s01_b"
      ],
      "hours": "1h",
      "priority": "high"
    },
    {
      "id": "co_s01_d",
      "phase": "sprint",
      "day": 1,
      "n": "Configure SPF, DKIM, DMARC DNS Records",
      "role": "AUTO",
      "deps": [
        "co_s01_c"
      ],
      "hours": "1.5h",
      "priority": "high"
    },
    {
      "id": "co_s02_a",
      "phase": "sprint",
      "day": 2,
      "n": "Audit Client Offer",
      "role": "AM",
      "deps": [
        "co_s01_b"
      ],
      "hours": "1h",
      "priority": "high"
    },
    {
      "id": "co_s02_b",
      "phase": "sprint",
      "day": 2,
      "n": "Audit Client Proof Materials",
      "role": "AM",
      "deps": [
        "co_s02_a"
      ],
      "hours": "1h",
      "priority": "high"
    },
    {
      "id": "co_s02_c",
      "phase": "sprint",
      "day": 2,
      "n": "Create 15 Mailboxes across Domains",
      "role": "AUTO",
      "deps": [
        "co_s01_d"
      ],
      "hours": "1.5h",
      "priority": "high"
    },
    {
      "id": "co_s03_a",
      "phase": "sprint",
      "day": 3,
      "n": "Draft Target ICP Definition Document",
      "role": "STRAT",
      "deps": [
        "co_s02_a"
      ],
      "hours": "1.5h",
      "priority": "high"
    },
    {
      "id": "co_s03_b",
      "phase": "sprint",
      "day": 3,
      "n": "Submit ICP Scorecard for Client Approval",
      "role": "STRAT",
      "deps": [
        "co_s03_a"
      ],
      "hours": "1h",
      "priority": "high"
    },
    {
      "id": "co_s03_c",
      "phase": "sprint",
      "day": 3,
      "n": "Connect 15 Mailboxes to Warmup Pool",
      "role": "AUTO",
      "deps": [
        "co_s02_c"
      ],
      "hours": "1h",
      "priority": "high"
    },
    {
      "id": "co_s03_d",
      "phase": "sprint",
      "day": 3,
      "n": "Set Automated Warmup Schedule",
      "role": "AUTO",
      "deps": [
        "co_s03_c"
      ],
      "hours": "0.5h",
      "priority": "high"
    },
    {
      "id": "co_s04_a",
      "phase": "sprint",
      "day": 4,
      "n": "Benchmark Competitor Outbound Campaigns",
      "role": "STRAT",
      "deps": [
        "co_s03_a"
      ],
      "hours": "1.5h",
      "priority": "normal"
    },
    {
      "id": "co_s04_b",
      "phase": "sprint",
      "day": 4,
      "n": "Setup GHL Sub-Account Pipeline Stages",
      "role": "AUTO",
      "deps": [
        "co_s01_b"
      ],
      "hours": "1.5h",
      "priority": "high"
    },
    {
      "id": "co_s05_a",
      "phase": "sprint",
      "day": 5,
      "n": "Configure GHL Calendar Booking Link and Reminders",
      "role": "AUTO",
      "deps": [
        "co_s04_b"
      ],
      "hours": "1h",
      "priority": "high"
    },
    {
      "id": "co_s05_b",
      "phase": "sprint",
      "day": 5,
      "n": "Set Up Slack Lead Notification Webhook",
      "role": "AUTO",
      "deps": [
        "co_s05_a"
      ],
      "hours": "0.5h",
      "priority": "normal"
    },
    {
      "id": "co_s06_a",
      "phase": "sprint",
      "day": 6,
      "n": "Optimize Client LinkedIn Profile",
      "role": "OBS",
      "deps": [
        "co_s03_b"
      ],
      "hours": "1h",
      "priority": "normal"
    },
    {
      "id": "co_s06_b",
      "phase": "sprint",
      "day": 6,
      "n": "Activate Sales Navigator Search Filters",
      "role": "OBS",
      "deps": [
        "co_s06_a"
      ],
      "hours": "1h",
      "priority": "normal"
    },
    {
      "id": "co_s07_a",
      "phase": "sprint",
      "day": 7,
      "n": "Draft Email Sequence Angle 1 Direct Pitch",
      "role": "CW",
      "deps": [
        "co_s03_a"
      ],
      "hours": "1.5h",
      "priority": "high"
    },
    {
      "id": "co_s07_b",
      "phase": "sprint",
      "day": 7,
      "n": "Draft Email Sequence Angle 2 Pain Point",
      "role": "CW",
      "deps": [
        "co_s07_a"
      ],
      "hours": "1.5h",
      "priority": "high"
    },
    {
      "id": "co_s07_c",
      "phase": "sprint",
      "day": 7,
      "n": "Source First 1,250 Verified ICP Contacts",
      "role": "DATA",
      "deps": [
        "co_s03_b"
      ],
      "hours": "2h",
      "priority": "high"
    },
    {
      "id": "co_s08_a",
      "phase": "sprint",
      "day": 8,
      "n": "Draft Email Sequence Angle 3 Case Study and Social Proof",
      "role": "CW",
      "deps": [
        "co_s07_b"
      ],
      "hours": "1.5h",
      "priority": "high"
    },
    {
      "id": "co_s08_b",
      "phase": "sprint",
      "day": 8,
      "n": "Write 4 Follow Up Variations Per Angle",
      "role": "CW",
      "deps": [
        "co_s08_a"
      ],
      "hours": "2h",
      "priority": "high"
    },
    {
      "id": "co_s09_a",
      "phase": "sprint",
      "day": 9,
      "n": "Write LinkedIn Connection Note and 3 Step DM Sequence",
      "role": "CW",
      "deps": [
        "co_s07_a"
      ],
      "hours": "1h",
      "priority": "high"
    },
    {
      "id": "co_s09_b",
      "phase": "sprint",
      "day": 9,
      "n": "Design LinkedIn Banner and Optimize Headline",
      "role": "GD",
      "deps": [
        "co_s06_a"
      ],
      "hours": "1h",
      "priority": "normal"
    },
    {
      "id": "co_s10_a",
      "phase": "sprint",
      "day": 10,
      "n": "Messaging Approval Call with Client on Angles and Content Pillars",
      "role": "AM",
      "deps": [
        "co_s08_b",
        "co_s09_a"
      ],
      "hours": "1h",
      "priority": "high"
    },
    {
      "id": "co_s10_b",
      "phase": "sprint",
      "day": 10,
      "n": "Upload Approved Sequences to Sending Platform",
      "role": "AUTO",
      "deps": [
        "co_s10_a"
      ],
      "hours": "1h",
      "priority": "high"
    },
    {
      "id": "co_s11_a",
      "phase": "sprint",
      "day": 11,
      "n": "Build Intent Trigger Contact List",
      "role": "DATA",
      "deps": [
        "co_s07_c"
      ],
      "hours": "1.5h",
      "priority": "normal"
    },
    {
      "id": "co_s11_b",
      "phase": "sprint",
      "day": 11,
      "n": "Clean and Verify Email Deliverability on All Leads",
      "role": "DATA",
      "deps": [
        "co_s11_a"
      ],
      "hours": "1h",
      "priority": "high"
    },
    {
      "id": "co_s12_a",
      "phase": "sprint",
      "day": 12,
      "n": "Write Discovery Call Script and Objection Handling Document",
      "role": "CW",
      "deps": [
        "co_s02_a"
      ],
      "hours": "1.5h",
      "priority": "normal"
    },
    {
      "id": "co_s12_b",
      "phase": "sprint",
      "day": 12,
      "n": "Prepare Proposal Template for Client Use",
      "role": "AM",
      "deps": [
        "co_s02_a"
      ],
      "hours": "1h",
      "priority": "normal"
    },
    {
      "id": "co_s13_a",
      "phase": "sprint",
      "day": 13,
      "n": "Build Reporting Dashboard and KPI Sheet with Client Login",
      "role": "AM",
      "deps": [
        "co_s04_b"
      ],
      "hours": "2h",
      "priority": "high"
    },
    {
      "id": "co_s13_b",
      "phase": "sprint",
      "day": 13,
      "n": "Source Additional 1,250 Verified ICP Contacts",
      "role": "DATA",
      "deps": [
        "co_s07_c"
      ],
      "hours": "2h",
      "priority": "high"
    },
    {
      "id": "co_s14_a",
      "phase": "sprint",
      "day": 14,
      "n": "Execute Seed List Test Send to 10 Inboxes",
      "role": "OBS",
      "deps": [
        "co_s03_c",
        "co_s10_b"
      ],
      "hours": "1h",
      "priority": "high"
    },
    {
      "id": "co_s14_b",
      "phase": "sprint",
      "day": 14,
      "n": "Verify 0% Spam Placement across Seed Accounts",
      "role": "OBS",
      "deps": [
        "co_s14_a"
      ],
      "hours": "1h",
      "priority": "high"
    },
    {
      "id": "co_s15_a",
      "phase": "sprint",
      "day": 15,
      "n": "Final Deliverability QA and Inbox Placement Check",
      "role": "OBS",
      "deps": [
        "co_s14_b"
      ],
      "hours": "1h",
      "priority": "high"
    },
    {
      "id": "co_s15_b",
      "phase": "sprint",
      "day": 15,
      "n": "Compile Day 15 Go Live Report and Conduct Milestone Review",
      "role": "AM",
      "deps": [
        "co_s15_a"
      ],
      "hours": "1h",
      "priority": "high"
    },
    {
      "id": "co_d16_li",
      "phase": "ongoing",
      "day": 16,
      "n": "Send 15 LinkedIn Connection Requests",
      "role": "OBS",
      "freq": "Thursday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "co_d16_confirm",
      "phase": "ongoing",
      "day": 16,
      "n": "Send Booked Call Confirmations",
      "role": "OBS",
      "freq": "Thursday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "co_d16_noshow",
      "phase": "ongoing",
      "day": 16,
      "n": "Follow-up Missed Call No-Shows",
      "role": "OBS",
      "freq": "Thursday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "co_d17_ramp",
      "phase": "ongoing",
      "day": 17,
      "n": "Start Cold Email Sending at 20 Percent Volume",
      "role": "OBS",
      "priority": "high",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "co_d17_send",
      "phase": "ongoing",
      "day": 17,
      "n": "Send Cold Email Ramp-Up Batch",
      "role": "OBS",
      "freq": "Friday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "co_d17_seq",
      "phase": "ongoing",
      "day": 17,
      "n": "Sequence Performance Review by Angle",
      "role": "STRAT",
      "freq": "Friday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "co_d17_hyg",
      "phase": "ongoing",
      "day": 17,
      "n": "GHL Pipeline Hygiene and Lead Routing Check",
      "role": "AM",
      "freq": "Friday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "co_d18_clean",
      "phase": "ongoing",
      "day": 18,
      "n": "Clean Inactive Lead Database Contacts",
      "role": "DATA",
      "freq": "Saturday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "co_d18_bounce",
      "phase": "ongoing",
      "day": 18,
      "n": "Remove Hard Bounced Email Addresses",
      "role": "DATA",
      "freq": "Saturday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "co_d19_kpi",
      "phase": "ongoing",
      "day": 19,
      "n": "Review Weekly KPI Metrics",
      "role": "AM",
      "freq": "Monday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "co_d19_box",
      "phase": "ongoing",
      "day": 19,
      "n": "Mailbox Health Check on 15 Boxes",
      "role": "AUTO",
      "freq": "Monday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "co_d19_list",
      "phase": "ongoing",
      "day": 19,
      "n": "Build Weekly Verified Lead List (625 Contacts)",
      "role": "DATA",
      "freq": "Monday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "co_d19_send",
      "phase": "ongoing",
      "day": 19,
      "n": "Send Cold Email Ramp-Up Batch",
      "role": "OBS",
      "freq": "Monday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "co_d19_li",
      "phase": "ongoing",
      "day": 19,
      "n": "Send 15 LinkedIn Connection Requests",
      "role": "OBS",
      "freq": "Monday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "co_d20_scale",
      "phase": "ongoing",
      "day": 20,
      "n": "Scale Cold Email to Full Daily Volume",
      "role": "OBS",
      "priority": "high",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "co_d20_send",
      "phase": "ongoing",
      "day": 20,
      "n": "Send Cold Email Batch (375 Sends)",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "co_d20_reply_m",
      "phase": "ongoing",
      "day": 20,
      "n": "Morning Inbound Reply Triage",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "co_d20_reply_e",
      "phase": "ongoing",
      "day": 20,
      "n": "Evening Inbound Reply Triage",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "co_d20_li",
      "phase": "ongoing",
      "day": 20,
      "n": "Send 15 LinkedIn Connection Requests",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "co_d21_send",
      "phase": "ongoing",
      "day": 21,
      "n": "Send Cold Email Batch (375 Sends)",
      "role": "OBS",
      "freq": "Wednesday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "co_d21_wave",
      "phase": "ongoing",
      "day": 21,
      "n": "Launch Automated Follow-up Wave",
      "role": "OBS",
      "freq": "Wednesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "co_d21_li",
      "phase": "ongoing",
      "day": 21,
      "n": "Send 15 LinkedIn Outreach DMs",
      "role": "OBS",
      "freq": "Wednesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "co_d21_reply",
      "phase": "ongoing",
      "day": 21,
      "n": "Process Meeting Bookings from Replies",
      "role": "OBS",
      "freq": "Wednesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "co_d22_send",
      "phase": "ongoing",
      "day": 22,
      "n": "Send Cold Email Batch (375 Sends)",
      "role": "OBS",
      "freq": "Thursday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "co_d22_li",
      "phase": "ongoing",
      "day": 22,
      "n": "Send 15 LinkedIn Connection Requests",
      "role": "OBS",
      "freq": "Thursday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "co_d22_confirm",
      "phase": "ongoing",
      "day": 22,
      "n": "Send Booked Call Confirmations",
      "role": "OBS",
      "freq": "Thursday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "co_d22_noshow",
      "phase": "ongoing",
      "day": 22,
      "n": "Follow-up Missed Call No-Shows",
      "role": "OBS",
      "freq": "Thursday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "co_d23_send",
      "phase": "ongoing",
      "day": 23,
      "n": "Send Cold Email Batch (375 Sends)",
      "role": "OBS",
      "freq": "Friday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "co_d23_seq",
      "phase": "ongoing",
      "day": 23,
      "n": "Sequence Performance Review by Angle",
      "role": "STRAT",
      "freq": "Friday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "co_d23_hyg",
      "phase": "ongoing",
      "day": 23,
      "n": "GHL Pipeline Hygiene and Lead Routing Check",
      "role": "AM",
      "freq": "Friday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "co_d24_clean",
      "phase": "ongoing",
      "day": 24,
      "n": "Clean Inactive Lead Database Contacts",
      "role": "DATA",
      "freq": "Saturday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "co_d24_bounce",
      "phase": "ongoing",
      "day": 24,
      "n": "Remove Hard Bounced Email Addresses",
      "role": "DATA",
      "freq": "Saturday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "co_d25_kpi",
      "phase": "ongoing",
      "day": 25,
      "n": "Review Weekly KPI Metrics",
      "role": "AM",
      "freq": "Monday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "co_d25_box",
      "phase": "ongoing",
      "day": 25,
      "n": "Mailbox Health Check on 15 Boxes",
      "role": "AUTO",
      "freq": "Monday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "co_d25_list",
      "phase": "ongoing",
      "day": 25,
      "n": "Build Weekly Verified Lead List (625 Contacts)",
      "role": "DATA",
      "freq": "Monday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "co_d25_send",
      "phase": "ongoing",
      "day": 25,
      "n": "Send Cold Email Batch (375 Sends)",
      "role": "OBS",
      "freq": "Monday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "co_d25_li",
      "phase": "ongoing",
      "day": 25,
      "n": "Send 15 LinkedIn Connection Requests",
      "role": "OBS",
      "freq": "Monday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "co_d26_send",
      "phase": "ongoing",
      "day": 26,
      "n": "Send Cold Email Batch (375 Sends)",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "co_d26_reply_m",
      "phase": "ongoing",
      "day": 26,
      "n": "Morning Inbound Reply Triage",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "co_d26_reply_e",
      "phase": "ongoing",
      "day": 26,
      "n": "Evening Inbound Reply Triage",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "co_d26_li",
      "phase": "ongoing",
      "day": 26,
      "n": "Send 15 LinkedIn Connection Requests",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "co_d27_send",
      "phase": "ongoing",
      "day": 27,
      "n": "Send Cold Email Batch (375 Sends)",
      "role": "OBS",
      "freq": "Wednesday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "co_d27_wave",
      "phase": "ongoing",
      "day": 27,
      "n": "Launch Automated Follow-up Wave",
      "role": "OBS",
      "freq": "Wednesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "co_d27_li",
      "phase": "ongoing",
      "day": 27,
      "n": "Send 15 LinkedIn Outreach DMs",
      "role": "OBS",
      "freq": "Wednesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "co_d27_reply",
      "phase": "ongoing",
      "day": 27,
      "n": "Process Meeting Bookings from Replies",
      "role": "OBS",
      "freq": "Wednesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "co_d28_send",
      "phase": "ongoing",
      "day": 28,
      "n": "Send Cold Email Batch (375 Sends)",
      "role": "OBS",
      "freq": "Thursday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "co_d28_li",
      "phase": "ongoing",
      "day": 28,
      "n": "Send 15 LinkedIn Connection Requests",
      "role": "OBS",
      "freq": "Thursday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "co_d28_confirm",
      "phase": "ongoing",
      "day": 28,
      "n": "Send Booked Call Confirmations",
      "role": "OBS",
      "freq": "Thursday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "co_d28_noshow",
      "phase": "ongoing",
      "day": 28,
      "n": "Follow-up Missed Call No-Shows",
      "role": "OBS",
      "freq": "Thursday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "co_d29_send",
      "phase": "ongoing",
      "day": 29,
      "n": "Send Cold Email Batch (375 Sends)",
      "role": "OBS",
      "freq": "Friday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "co_d29_seq",
      "phase": "ongoing",
      "day": 29,
      "n": "Sequence Performance Review by Angle",
      "role": "STRAT",
      "freq": "Friday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "co_d29_hyg",
      "phase": "ongoing",
      "day": 29,
      "n": "GHL Pipeline Hygiene and Lead Routing Check",
      "role": "AM",
      "freq": "Friday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "co_d30_clean",
      "phase": "ongoing",
      "day": 30,
      "n": "Clean Inactive Lead Database Contacts",
      "role": "DATA",
      "freq": "Saturday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "co_d30_bounce",
      "phase": "ongoing",
      "day": 30,
      "n": "Remove Hard Bounced Email Addresses",
      "role": "DATA",
      "freq": "Saturday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "co_d31_kpi",
      "phase": "ongoing",
      "day": 31,
      "n": "Review Weekly KPI Metrics",
      "role": "AM",
      "freq": "Monday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "co_d31_box",
      "phase": "ongoing",
      "day": 31,
      "n": "Mailbox Health Check on 15 Boxes",
      "role": "AUTO",
      "freq": "Monday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "co_d31_list",
      "phase": "ongoing",
      "day": 31,
      "n": "Build Weekly Verified Lead List (625 Contacts)",
      "role": "DATA",
      "freq": "Monday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "co_d31_send",
      "phase": "ongoing",
      "day": 31,
      "n": "Send Cold Email Batch (375 Sends)",
      "role": "OBS",
      "freq": "Monday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "co_d31_li",
      "phase": "ongoing",
      "day": 31,
      "n": "Send 15 LinkedIn Connection Requests",
      "role": "OBS",
      "freq": "Monday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "co_d32_send",
      "phase": "ongoing",
      "day": 32,
      "n": "Send Cold Email Batch (375 Sends)",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "co_d32_reply_m",
      "phase": "ongoing",
      "day": 32,
      "n": "Morning Inbound Reply Triage",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "co_d32_reply_e",
      "phase": "ongoing",
      "day": 32,
      "n": "Evening Inbound Reply Triage",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "co_d32_li",
      "phase": "ongoing",
      "day": 32,
      "n": "Send 15 LinkedIn Connection Requests",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "co_d33_send",
      "phase": "ongoing",
      "day": 33,
      "n": "Send Cold Email Batch (375 Sends)",
      "role": "OBS",
      "freq": "Wednesday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "co_d33_wave",
      "phase": "ongoing",
      "day": 33,
      "n": "Launch Automated Follow-up Wave",
      "role": "OBS",
      "freq": "Wednesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "co_d33_li",
      "phase": "ongoing",
      "day": 33,
      "n": "Send 15 LinkedIn Outreach DMs",
      "role": "OBS",
      "freq": "Wednesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "co_d33_reply",
      "phase": "ongoing",
      "day": 33,
      "n": "Process Meeting Bookings from Replies",
      "role": "OBS",
      "freq": "Wednesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "co_d34_send",
      "phase": "ongoing",
      "day": 34,
      "n": "Send Cold Email Batch (375 Sends)",
      "role": "OBS",
      "freq": "Thursday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "co_d34_li",
      "phase": "ongoing",
      "day": 34,
      "n": "Send 15 LinkedIn Connection Requests",
      "role": "OBS",
      "freq": "Thursday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "co_d34_confirm",
      "phase": "ongoing",
      "day": 34,
      "n": "Send Booked Call Confirmations",
      "role": "OBS",
      "freq": "Thursday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "co_d34_noshow",
      "phase": "ongoing",
      "day": 34,
      "n": "Follow-up Missed Call No-Shows",
      "role": "OBS",
      "freq": "Thursday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "co_d35_send",
      "phase": "ongoing",
      "day": 35,
      "n": "Send Cold Email Batch (375 Sends)",
      "role": "OBS",
      "freq": "Friday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "co_d35_seq",
      "phase": "ongoing",
      "day": 35,
      "n": "Sequence Performance Review by Angle",
      "role": "STRAT",
      "freq": "Friday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "co_d35_hyg",
      "phase": "ongoing",
      "day": 35,
      "n": "GHL Pipeline Hygiene and Lead Routing Check",
      "role": "AM",
      "freq": "Friday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "co_d36_clean",
      "phase": "ongoing",
      "day": 36,
      "n": "Clean Inactive Lead Database Contacts",
      "role": "DATA",
      "freq": "Saturday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "co_d36_bounce",
      "phase": "ongoing",
      "day": 36,
      "n": "Remove Hard Bounced Email Addresses",
      "role": "DATA",
      "freq": "Saturday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "co_d37_kpi",
      "phase": "ongoing",
      "day": 37,
      "n": "Review Weekly KPI Metrics",
      "role": "AM",
      "freq": "Monday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "co_d37_box",
      "phase": "ongoing",
      "day": 37,
      "n": "Mailbox Health Check on 15 Boxes",
      "role": "AUTO",
      "freq": "Monday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "co_d37_list",
      "phase": "ongoing",
      "day": 37,
      "n": "Build Weekly Verified Lead List (625 Contacts)",
      "role": "DATA",
      "freq": "Monday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "co_d37_send",
      "phase": "ongoing",
      "day": 37,
      "n": "Send Cold Email Batch (375 Sends)",
      "role": "OBS",
      "freq": "Monday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "co_d37_li",
      "phase": "ongoing",
      "day": 37,
      "n": "Send 15 LinkedIn Connection Requests",
      "role": "OBS",
      "freq": "Monday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "co_d38_send",
      "phase": "ongoing",
      "day": 38,
      "n": "Send Cold Email Batch (375 Sends)",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "co_d38_reply_m",
      "phase": "ongoing",
      "day": 38,
      "n": "Morning Inbound Reply Triage",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "co_d38_reply_e",
      "phase": "ongoing",
      "day": 38,
      "n": "Evening Inbound Reply Triage",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "co_d38_li",
      "phase": "ongoing",
      "day": 38,
      "n": "Send 15 LinkedIn Connection Requests",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "co_d39_send",
      "phase": "ongoing",
      "day": 39,
      "n": "Send Cold Email Batch (375 Sends)",
      "role": "OBS",
      "freq": "Wednesday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "co_d39_wave",
      "phase": "ongoing",
      "day": 39,
      "n": "Launch Automated Follow-up Wave",
      "role": "OBS",
      "freq": "Wednesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "co_d39_li",
      "phase": "ongoing",
      "day": 39,
      "n": "Send 15 LinkedIn Outreach DMs",
      "role": "OBS",
      "freq": "Wednesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "co_d39_reply",
      "phase": "ongoing",
      "day": 39,
      "n": "Process Meeting Bookings from Replies",
      "role": "OBS",
      "freq": "Wednesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "co_d40_send",
      "phase": "ongoing",
      "day": 40,
      "n": "Send Cold Email Batch (375 Sends)",
      "role": "OBS",
      "freq": "Thursday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "co_d40_li",
      "phase": "ongoing",
      "day": 40,
      "n": "Send 15 LinkedIn Connection Requests",
      "role": "OBS",
      "freq": "Thursday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "co_d40_confirm",
      "phase": "ongoing",
      "day": 40,
      "n": "Send Booked Call Confirmations",
      "role": "OBS",
      "freq": "Thursday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "co_d40_noshow",
      "phase": "ongoing",
      "day": 40,
      "n": "Follow-up Missed Call No-Shows",
      "role": "OBS",
      "freq": "Thursday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "co_d41_send",
      "phase": "ongoing",
      "day": 41,
      "n": "Send Cold Email Batch (375 Sends)",
      "role": "OBS",
      "freq": "Friday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "co_d41_seq",
      "phase": "ongoing",
      "day": 41,
      "n": "Sequence Performance Review by Angle",
      "role": "STRAT",
      "freq": "Friday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "co_d41_hyg",
      "phase": "ongoing",
      "day": 41,
      "n": "GHL Pipeline Hygiene and Lead Routing Check",
      "role": "AM",
      "freq": "Friday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "co_d42_clean",
      "phase": "ongoing",
      "day": 42,
      "n": "Clean Inactive Lead Database Contacts",
      "role": "DATA",
      "freq": "Saturday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "co_d42_bounce",
      "phase": "ongoing",
      "day": 42,
      "n": "Remove Hard Bounced Email Addresses",
      "role": "DATA",
      "freq": "Saturday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "co_d43_kpi",
      "phase": "ongoing",
      "day": 43,
      "n": "Review Weekly KPI Metrics",
      "role": "AM",
      "freq": "Monday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "co_d43_box",
      "phase": "ongoing",
      "day": 43,
      "n": "Mailbox Health Check on 15 Boxes",
      "role": "AUTO",
      "freq": "Monday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "co_d43_list",
      "phase": "ongoing",
      "day": 43,
      "n": "Build Weekly Verified Lead List (625 Contacts)",
      "role": "DATA",
      "freq": "Monday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "co_d43_send",
      "phase": "ongoing",
      "day": 43,
      "n": "Send Cold Email Batch (375 Sends)",
      "role": "OBS",
      "freq": "Monday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "co_d43_li",
      "phase": "ongoing",
      "day": 43,
      "n": "Send 15 LinkedIn Connection Requests",
      "role": "OBS",
      "freq": "Monday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "co_d44_send",
      "phase": "ongoing",
      "day": 44,
      "n": "Send Cold Email Batch (375 Sends)",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "co_d44_reply_m",
      "phase": "ongoing",
      "day": 44,
      "n": "Morning Inbound Reply Triage",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "co_d44_reply_e",
      "phase": "ongoing",
      "day": 44,
      "n": "Evening Inbound Reply Triage",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "co_d44_li",
      "phase": "ongoing",
      "day": 44,
      "n": "Send 15 LinkedIn Connection Requests",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "co_d45_send",
      "phase": "ongoing",
      "day": 45,
      "n": "Send Cold Email Batch (375 Sends)",
      "role": "OBS",
      "freq": "Wednesday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "co_d45_wave",
      "phase": "ongoing",
      "day": 45,
      "n": "Launch Automated Follow-up Wave",
      "role": "OBS",
      "freq": "Wednesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "co_d45_li",
      "phase": "ongoing",
      "day": 45,
      "n": "Send 15 LinkedIn Outreach DMs",
      "role": "OBS",
      "freq": "Wednesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "co_d45_reply",
      "phase": "ongoing",
      "day": 45,
      "n": "Process Meeting Bookings from Replies",
      "role": "OBS",
      "freq": "Wednesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "co_d46_send",
      "phase": "ongoing",
      "day": 46,
      "n": "Send Cold Email Batch (375 Sends)",
      "role": "OBS",
      "freq": "Thursday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "co_d46_li",
      "phase": "ongoing",
      "day": 46,
      "n": "Send 15 LinkedIn Connection Requests",
      "role": "OBS",
      "freq": "Thursday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "co_d46_confirm",
      "phase": "ongoing",
      "day": 46,
      "n": "Send Booked Call Confirmations",
      "role": "OBS",
      "freq": "Thursday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "co_d46_noshow",
      "phase": "ongoing",
      "day": 46,
      "n": "Follow-up Missed Call No-Shows",
      "role": "OBS",
      "freq": "Thursday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "co_d47_send",
      "phase": "ongoing",
      "day": 47,
      "n": "Send Cold Email Batch (375 Sends)",
      "role": "OBS",
      "freq": "Friday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "co_d47_seq",
      "phase": "ongoing",
      "day": 47,
      "n": "Sequence Performance Review by Angle",
      "role": "STRAT",
      "freq": "Friday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "co_d47_hyg",
      "phase": "ongoing",
      "day": 47,
      "n": "GHL Pipeline Hygiene and Lead Routing Check",
      "role": "AM",
      "freq": "Friday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "co_d48_clean",
      "phase": "ongoing",
      "day": 48,
      "n": "Clean Inactive Lead Database Contacts",
      "role": "DATA",
      "freq": "Saturday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "co_d48_bounce",
      "phase": "ongoing",
      "day": 48,
      "n": "Remove Hard Bounced Email Addresses",
      "role": "DATA",
      "freq": "Saturday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "co_d49_kpi",
      "phase": "ongoing",
      "day": 49,
      "n": "Review Weekly KPI Metrics",
      "role": "AM",
      "freq": "Monday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "co_d49_box",
      "phase": "ongoing",
      "day": 49,
      "n": "Mailbox Health Check on 15 Boxes",
      "role": "AUTO",
      "freq": "Monday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "co_d49_list",
      "phase": "ongoing",
      "day": 49,
      "n": "Build Weekly Verified Lead List (625 Contacts)",
      "role": "DATA",
      "freq": "Monday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "co_d49_send",
      "phase": "ongoing",
      "day": 49,
      "n": "Send Cold Email Batch (375 Sends)",
      "role": "OBS",
      "freq": "Monday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "co_d49_li",
      "phase": "ongoing",
      "day": 49,
      "n": "Send 15 LinkedIn Connection Requests",
      "role": "OBS",
      "freq": "Monday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "co_d50_send",
      "phase": "ongoing",
      "day": 50,
      "n": "Send Cold Email Batch (375 Sends)",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "co_d50_reply_m",
      "phase": "ongoing",
      "day": 50,
      "n": "Morning Inbound Reply Triage",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "co_d50_reply_e",
      "phase": "ongoing",
      "day": 50,
      "n": "Evening Inbound Reply Triage",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "co_d50_li",
      "phase": "ongoing",
      "day": 50,
      "n": "Send 15 LinkedIn Connection Requests",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "co_d51_send",
      "phase": "ongoing",
      "day": 51,
      "n": "Send Cold Email Batch (375 Sends)",
      "role": "OBS",
      "freq": "Wednesday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "co_d51_wave",
      "phase": "ongoing",
      "day": 51,
      "n": "Launch Automated Follow-up Wave",
      "role": "OBS",
      "freq": "Wednesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "co_d51_li",
      "phase": "ongoing",
      "day": 51,
      "n": "Send 15 LinkedIn Outreach DMs",
      "role": "OBS",
      "freq": "Wednesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "co_d51_reply",
      "phase": "ongoing",
      "day": 51,
      "n": "Process Meeting Bookings from Replies",
      "role": "OBS",
      "freq": "Wednesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "co_d52_send",
      "phase": "ongoing",
      "day": 52,
      "n": "Send Cold Email Batch (375 Sends)",
      "role": "OBS",
      "freq": "Thursday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "co_d52_li",
      "phase": "ongoing",
      "day": 52,
      "n": "Send 15 LinkedIn Connection Requests",
      "role": "OBS",
      "freq": "Thursday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "co_d52_confirm",
      "phase": "ongoing",
      "day": 52,
      "n": "Send Booked Call Confirmations",
      "role": "OBS",
      "freq": "Thursday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "co_d52_noshow",
      "phase": "ongoing",
      "day": 52,
      "n": "Follow-up Missed Call No-Shows",
      "role": "OBS",
      "freq": "Thursday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "co_d53_send",
      "phase": "ongoing",
      "day": 53,
      "n": "Send Cold Email Batch (375 Sends)",
      "role": "OBS",
      "freq": "Friday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "co_d53_seq",
      "phase": "ongoing",
      "day": 53,
      "n": "Sequence Performance Review by Angle",
      "role": "STRAT",
      "freq": "Friday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "co_d53_hyg",
      "phase": "ongoing",
      "day": 53,
      "n": "GHL Pipeline Hygiene and Lead Routing Check",
      "role": "AM",
      "freq": "Friday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "co_d54_clean",
      "phase": "ongoing",
      "day": 54,
      "n": "Clean Inactive Lead Database Contacts",
      "role": "DATA",
      "freq": "Saturday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "co_d54_bounce",
      "phase": "ongoing",
      "day": 54,
      "n": "Remove Hard Bounced Email Addresses",
      "role": "DATA",
      "freq": "Saturday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "co_d55_kpi",
      "phase": "ongoing",
      "day": 55,
      "n": "Review Weekly KPI Metrics",
      "role": "AM",
      "freq": "Monday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "co_d55_box",
      "phase": "ongoing",
      "day": 55,
      "n": "Mailbox Health Check on 15 Boxes",
      "role": "AUTO",
      "freq": "Monday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "co_d55_list",
      "phase": "ongoing",
      "day": 55,
      "n": "Build Weekly Verified Lead List (625 Contacts)",
      "role": "DATA",
      "freq": "Monday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "co_d55_send",
      "phase": "ongoing",
      "day": 55,
      "n": "Send Cold Email Batch (375 Sends)",
      "role": "OBS",
      "freq": "Monday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "co_d55_li",
      "phase": "ongoing",
      "day": 55,
      "n": "Send 15 LinkedIn Connection Requests",
      "role": "OBS",
      "freq": "Monday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "co_d56_send",
      "phase": "ongoing",
      "day": 56,
      "n": "Send Cold Email Batch (375 Sends)",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "co_d56_reply_m",
      "phase": "ongoing",
      "day": 56,
      "n": "Morning Inbound Reply Triage",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "co_d56_reply_e",
      "phase": "ongoing",
      "day": 56,
      "n": "Evening Inbound Reply Triage",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "co_d56_li",
      "phase": "ongoing",
      "day": 56,
      "n": "Send 15 LinkedIn Connection Requests",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "co_d57_send",
      "phase": "ongoing",
      "day": 57,
      "n": "Send Cold Email Batch (375 Sends)",
      "role": "OBS",
      "freq": "Wednesday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "co_d57_wave",
      "phase": "ongoing",
      "day": 57,
      "n": "Launch Automated Follow-up Wave",
      "role": "OBS",
      "freq": "Wednesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "co_d57_li",
      "phase": "ongoing",
      "day": 57,
      "n": "Send 15 LinkedIn Outreach DMs",
      "role": "OBS",
      "freq": "Wednesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "co_d57_reply",
      "phase": "ongoing",
      "day": 57,
      "n": "Process Meeting Bookings from Replies",
      "role": "OBS",
      "freq": "Wednesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "co_d58_send",
      "phase": "ongoing",
      "day": 58,
      "n": "Send Cold Email Batch (375 Sends)",
      "role": "OBS",
      "freq": "Thursday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "co_d58_li",
      "phase": "ongoing",
      "day": 58,
      "n": "Send 15 LinkedIn Connection Requests",
      "role": "OBS",
      "freq": "Thursday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "co_d58_confirm",
      "phase": "ongoing",
      "day": 58,
      "n": "Send Booked Call Confirmations",
      "role": "OBS",
      "freq": "Thursday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "co_d58_noshow",
      "phase": "ongoing",
      "day": 58,
      "n": "Follow-up Missed Call No-Shows",
      "role": "OBS",
      "freq": "Thursday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "co_d59_send",
      "phase": "ongoing",
      "day": 59,
      "n": "Send Cold Email Batch (375 Sends)",
      "role": "OBS",
      "freq": "Friday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "co_d59_seq",
      "phase": "ongoing",
      "day": 59,
      "n": "Sequence Performance Review by Angle",
      "role": "STRAT",
      "freq": "Friday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "co_d59_hyg",
      "phase": "ongoing",
      "day": 59,
      "n": "GHL Pipeline Hygiene and Lead Routing Check",
      "role": "AM",
      "freq": "Friday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "co_d60_clean",
      "phase": "ongoing",
      "day": 60,
      "n": "Clean Inactive Lead Database Contacts",
      "role": "DATA",
      "freq": "Saturday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "co_d60_bounce",
      "phase": "ongoing",
      "day": 60,
      "n": "Remove Hard Bounced Email Addresses",
      "role": "DATA",
      "freq": "Saturday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "co_d61_kpi",
      "phase": "ongoing",
      "day": 61,
      "n": "Review Weekly KPI Metrics",
      "role": "AM",
      "freq": "Monday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "co_d61_box",
      "phase": "ongoing",
      "day": 61,
      "n": "Mailbox Health Check on 15 Boxes",
      "role": "AUTO",
      "freq": "Monday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "co_d61_list",
      "phase": "ongoing",
      "day": 61,
      "n": "Build Weekly Verified Lead List (625 Contacts)",
      "role": "DATA",
      "freq": "Monday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "co_d61_send",
      "phase": "ongoing",
      "day": 61,
      "n": "Send Cold Email Batch (375 Sends)",
      "role": "OBS",
      "freq": "Monday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "co_d61_li",
      "phase": "ongoing",
      "day": 61,
      "n": "Send 15 LinkedIn Connection Requests",
      "role": "OBS",
      "freq": "Monday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "co_d62_send",
      "phase": "ongoing",
      "day": 62,
      "n": "Send Cold Email Batch (375 Sends)",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "co_d62_reply_m",
      "phase": "ongoing",
      "day": 62,
      "n": "Morning Inbound Reply Triage",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "co_d62_reply_e",
      "phase": "ongoing",
      "day": 62,
      "n": "Evening Inbound Reply Triage",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "co_d62_li",
      "phase": "ongoing",
      "day": 62,
      "n": "Send 15 LinkedIn Connection Requests",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "co_d63_send",
      "phase": "ongoing",
      "day": 63,
      "n": "Send Cold Email Batch (375 Sends)",
      "role": "OBS",
      "freq": "Wednesday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "co_d63_wave",
      "phase": "ongoing",
      "day": 63,
      "n": "Launch Automated Follow-up Wave",
      "role": "OBS",
      "freq": "Wednesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "co_d63_li",
      "phase": "ongoing",
      "day": 63,
      "n": "Send 15 LinkedIn Outreach DMs",
      "role": "OBS",
      "freq": "Wednesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "co_d63_reply",
      "phase": "ongoing",
      "day": 63,
      "n": "Process Meeting Bookings from Replies",
      "role": "OBS",
      "freq": "Wednesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "co_d64_send",
      "phase": "ongoing",
      "day": 64,
      "n": "Send Cold Email Batch (375 Sends)",
      "role": "OBS",
      "freq": "Thursday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "co_d64_li",
      "phase": "ongoing",
      "day": 64,
      "n": "Send 15 LinkedIn Connection Requests",
      "role": "OBS",
      "freq": "Thursday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "co_d64_confirm",
      "phase": "ongoing",
      "day": 64,
      "n": "Send Booked Call Confirmations",
      "role": "OBS",
      "freq": "Thursday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "co_d64_noshow",
      "phase": "ongoing",
      "day": 64,
      "n": "Follow-up Missed Call No-Shows",
      "role": "OBS",
      "freq": "Thursday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "co_d65_send",
      "phase": "ongoing",
      "day": 65,
      "n": "Send Cold Email Batch (375 Sends)",
      "role": "OBS",
      "freq": "Friday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "co_d65_seq",
      "phase": "ongoing",
      "day": 65,
      "n": "Sequence Performance Review by Angle",
      "role": "STRAT",
      "freq": "Friday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "co_d65_hyg",
      "phase": "ongoing",
      "day": 65,
      "n": "GHL Pipeline Hygiene and Lead Routing Check",
      "role": "AM",
      "freq": "Friday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "co_d66_clean",
      "phase": "ongoing",
      "day": 66,
      "n": "Clean Inactive Lead Database Contacts",
      "role": "DATA",
      "freq": "Saturday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "co_d66_bounce",
      "phase": "ongoing",
      "day": 66,
      "n": "Remove Hard Bounced Email Addresses",
      "role": "DATA",
      "freq": "Saturday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "co_d67_kpi",
      "phase": "ongoing",
      "day": 67,
      "n": "Review Weekly KPI Metrics",
      "role": "AM",
      "freq": "Monday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "co_d67_box",
      "phase": "ongoing",
      "day": 67,
      "n": "Mailbox Health Check on 15 Boxes",
      "role": "AUTO",
      "freq": "Monday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "co_d67_list",
      "phase": "ongoing",
      "day": 67,
      "n": "Build Weekly Verified Lead List (625 Contacts)",
      "role": "DATA",
      "freq": "Monday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "co_d67_send",
      "phase": "ongoing",
      "day": 67,
      "n": "Send Cold Email Batch (375 Sends)",
      "role": "OBS",
      "freq": "Monday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "co_d67_li",
      "phase": "ongoing",
      "day": 67,
      "n": "Send 15 LinkedIn Connection Requests",
      "role": "OBS",
      "freq": "Monday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "co_d68_send",
      "phase": "ongoing",
      "day": 68,
      "n": "Send Cold Email Batch (375 Sends)",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "co_d68_reply_m",
      "phase": "ongoing",
      "day": 68,
      "n": "Morning Inbound Reply Triage",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "co_d68_reply_e",
      "phase": "ongoing",
      "day": 68,
      "n": "Evening Inbound Reply Triage",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "co_d68_li",
      "phase": "ongoing",
      "day": 68,
      "n": "Send 15 LinkedIn Connection Requests",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "co_d69_send",
      "phase": "ongoing",
      "day": 69,
      "n": "Send Cold Email Batch (375 Sends)",
      "role": "OBS",
      "freq": "Wednesday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "co_d69_wave",
      "phase": "ongoing",
      "day": 69,
      "n": "Launch Automated Follow-up Wave",
      "role": "OBS",
      "freq": "Wednesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "co_d69_li",
      "phase": "ongoing",
      "day": 69,
      "n": "Send 15 LinkedIn Outreach DMs",
      "role": "OBS",
      "freq": "Wednesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "co_d69_reply",
      "phase": "ongoing",
      "day": 69,
      "n": "Process Meeting Bookings from Replies",
      "role": "OBS",
      "freq": "Wednesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "co_d70_send",
      "phase": "ongoing",
      "day": 70,
      "n": "Send Cold Email Batch (375 Sends)",
      "role": "OBS",
      "freq": "Thursday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "co_d70_li",
      "phase": "ongoing",
      "day": 70,
      "n": "Send 15 LinkedIn Connection Requests",
      "role": "OBS",
      "freq": "Thursday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "co_d70_confirm",
      "phase": "ongoing",
      "day": 70,
      "n": "Send Booked Call Confirmations",
      "role": "OBS",
      "freq": "Thursday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "co_d70_noshow",
      "phase": "ongoing",
      "day": 70,
      "n": "Follow-up Missed Call No-Shows",
      "role": "OBS",
      "freq": "Thursday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "co_d71_send",
      "phase": "ongoing",
      "day": 71,
      "n": "Send Cold Email Batch (375 Sends)",
      "role": "OBS",
      "freq": "Friday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "co_d71_seq",
      "phase": "ongoing",
      "day": 71,
      "n": "Sequence Performance Review by Angle",
      "role": "STRAT",
      "freq": "Friday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "co_d71_hyg",
      "phase": "ongoing",
      "day": 71,
      "n": "GHL Pipeline Hygiene and Lead Routing Check",
      "role": "AM",
      "freq": "Friday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "co_d72_clean",
      "phase": "ongoing",
      "day": 72,
      "n": "Clean Inactive Lead Database Contacts",
      "role": "DATA",
      "freq": "Saturday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "co_d72_bounce",
      "phase": "ongoing",
      "day": 72,
      "n": "Remove Hard Bounced Email Addresses",
      "role": "DATA",
      "freq": "Saturday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "co_d73_kpi",
      "phase": "ongoing",
      "day": 73,
      "n": "Review Weekly KPI Metrics",
      "role": "AM",
      "freq": "Monday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "co_d73_box",
      "phase": "ongoing",
      "day": 73,
      "n": "Mailbox Health Check on 15 Boxes",
      "role": "AUTO",
      "freq": "Monday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "co_d73_list",
      "phase": "ongoing",
      "day": 73,
      "n": "Build Weekly Verified Lead List (625 Contacts)",
      "role": "DATA",
      "freq": "Monday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "co_d73_send",
      "phase": "ongoing",
      "day": 73,
      "n": "Send Cold Email Batch (375 Sends)",
      "role": "OBS",
      "freq": "Monday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "co_d73_li",
      "phase": "ongoing",
      "day": 73,
      "n": "Send 15 LinkedIn Connection Requests",
      "role": "OBS",
      "freq": "Monday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "co_d74_send",
      "phase": "ongoing",
      "day": 74,
      "n": "Send Cold Email Batch (375 Sends)",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "co_d74_reply_m",
      "phase": "ongoing",
      "day": 74,
      "n": "Morning Inbound Reply Triage",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "co_d74_reply_e",
      "phase": "ongoing",
      "day": 74,
      "n": "Evening Inbound Reply Triage",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "co_d74_li",
      "phase": "ongoing",
      "day": 74,
      "n": "Send 15 LinkedIn Connection Requests",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "co_d75_send",
      "phase": "ongoing",
      "day": 75,
      "n": "Send Cold Email Batch (375 Sends)",
      "role": "OBS",
      "freq": "Wednesday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "co_d75_wave",
      "phase": "ongoing",
      "day": 75,
      "n": "Launch Automated Follow-up Wave",
      "role": "OBS",
      "freq": "Wednesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "co_d75_li",
      "phase": "ongoing",
      "day": 75,
      "n": "Send 15 LinkedIn Outreach DMs",
      "role": "OBS",
      "freq": "Wednesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "co_d75_reply",
      "phase": "ongoing",
      "day": 75,
      "n": "Process Meeting Bookings from Replies",
      "role": "OBS",
      "freq": "Wednesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "co_d76_send",
      "phase": "ongoing",
      "day": 76,
      "n": "Send Cold Email Batch (375 Sends)",
      "role": "OBS",
      "freq": "Thursday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "co_d76_li",
      "phase": "ongoing",
      "day": 76,
      "n": "Send 15 LinkedIn Connection Requests",
      "role": "OBS",
      "freq": "Thursday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "co_d76_confirm",
      "phase": "ongoing",
      "day": 76,
      "n": "Send Booked Call Confirmations",
      "role": "OBS",
      "freq": "Thursday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "co_d76_noshow",
      "phase": "ongoing",
      "day": 76,
      "n": "Follow-up Missed Call No-Shows",
      "role": "OBS",
      "freq": "Thursday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "co_d77_send",
      "phase": "ongoing",
      "day": 77,
      "n": "Send Cold Email Batch (375 Sends)",
      "role": "OBS",
      "freq": "Friday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "co_d77_seq",
      "phase": "ongoing",
      "day": 77,
      "n": "Sequence Performance Review by Angle",
      "role": "STRAT",
      "freq": "Friday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "co_d77_hyg",
      "phase": "ongoing",
      "day": 77,
      "n": "GHL Pipeline Hygiene and Lead Routing Check",
      "role": "AM",
      "freq": "Friday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "co_d78_clean",
      "phase": "ongoing",
      "day": 78,
      "n": "Clean Inactive Lead Database Contacts",
      "role": "DATA",
      "freq": "Saturday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "co_d78_bounce",
      "phase": "ongoing",
      "day": 78,
      "n": "Remove Hard Bounced Email Addresses",
      "role": "DATA",
      "freq": "Saturday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "co_d79_kpi",
      "phase": "ongoing",
      "day": 79,
      "n": "Review Weekly KPI Metrics",
      "role": "AM",
      "freq": "Monday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "co_d79_box",
      "phase": "ongoing",
      "day": 79,
      "n": "Mailbox Health Check on 15 Boxes",
      "role": "AUTO",
      "freq": "Monday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "co_d79_list",
      "phase": "ongoing",
      "day": 79,
      "n": "Build Weekly Verified Lead List (625 Contacts)",
      "role": "DATA",
      "freq": "Monday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "co_d79_send",
      "phase": "ongoing",
      "day": 79,
      "n": "Send Cold Email Batch (375 Sends)",
      "role": "OBS",
      "freq": "Monday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "co_d79_li",
      "phase": "ongoing",
      "day": 79,
      "n": "Send 15 LinkedIn Connection Requests",
      "role": "OBS",
      "freq": "Monday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "co_d80_send",
      "phase": "ongoing",
      "day": 80,
      "n": "Send Cold Email Batch (375 Sends)",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "co_d80_reply_m",
      "phase": "ongoing",
      "day": 80,
      "n": "Morning Inbound Reply Triage",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "co_d80_reply_e",
      "phase": "ongoing",
      "day": 80,
      "n": "Evening Inbound Reply Triage",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "co_d80_li",
      "phase": "ongoing",
      "day": 80,
      "n": "Send 15 LinkedIn Connection Requests",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "co_d81_send",
      "phase": "ongoing",
      "day": 81,
      "n": "Send Cold Email Batch (375 Sends)",
      "role": "OBS",
      "freq": "Wednesday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "co_d81_wave",
      "phase": "ongoing",
      "day": 81,
      "n": "Launch Automated Follow-up Wave",
      "role": "OBS",
      "freq": "Wednesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "co_d81_li",
      "phase": "ongoing",
      "day": 81,
      "n": "Send 15 LinkedIn Outreach DMs",
      "role": "OBS",
      "freq": "Wednesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "co_d81_reply",
      "phase": "ongoing",
      "day": 81,
      "n": "Process Meeting Bookings from Replies",
      "role": "OBS",
      "freq": "Wednesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "co_d82_send",
      "phase": "ongoing",
      "day": 82,
      "n": "Send Cold Email Batch (375 Sends)",
      "role": "OBS",
      "freq": "Thursday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "co_d82_li",
      "phase": "ongoing",
      "day": 82,
      "n": "Send 15 LinkedIn Connection Requests",
      "role": "OBS",
      "freq": "Thursday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "co_d82_confirm",
      "phase": "ongoing",
      "day": 82,
      "n": "Send Booked Call Confirmations",
      "role": "OBS",
      "freq": "Thursday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "co_d82_noshow",
      "phase": "ongoing",
      "day": 82,
      "n": "Follow-up Missed Call No-Shows",
      "role": "OBS",
      "freq": "Thursday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "co_d83_send",
      "phase": "ongoing",
      "day": 83,
      "n": "Send Cold Email Batch (375 Sends)",
      "role": "OBS",
      "freq": "Friday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "co_d83_seq",
      "phase": "ongoing",
      "day": 83,
      "n": "Sequence Performance Review by Angle",
      "role": "STRAT",
      "freq": "Friday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "co_d83_hyg",
      "phase": "ongoing",
      "day": 83,
      "n": "GHL Pipeline Hygiene and Lead Routing Check",
      "role": "AM",
      "freq": "Friday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "co_d84_clean",
      "phase": "ongoing",
      "day": 84,
      "n": "Clean Inactive Lead Database Contacts",
      "role": "DATA",
      "freq": "Saturday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "co_d84_bounce",
      "phase": "ongoing",
      "day": 84,
      "n": "Remove Hard Bounced Email Addresses",
      "role": "DATA",
      "freq": "Saturday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "co_d85_kpi",
      "phase": "ongoing",
      "day": 85,
      "n": "Review Weekly KPI Metrics",
      "role": "AM",
      "freq": "Monday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "co_d85_box",
      "phase": "ongoing",
      "day": 85,
      "n": "Mailbox Health Check on 15 Boxes",
      "role": "AUTO",
      "freq": "Monday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "co_d85_list",
      "phase": "ongoing",
      "day": 85,
      "n": "Build Weekly Verified Lead List (625 Contacts)",
      "role": "DATA",
      "freq": "Monday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "co_d85_send",
      "phase": "ongoing",
      "day": 85,
      "n": "Send Cold Email Batch (375 Sends)",
      "role": "OBS",
      "freq": "Monday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "co_d85_li",
      "phase": "ongoing",
      "day": 85,
      "n": "Send 15 LinkedIn Connection Requests",
      "role": "OBS",
      "freq": "Monday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "co_d86_send",
      "phase": "ongoing",
      "day": 86,
      "n": "Send Cold Email Batch (375 Sends)",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "co_d86_reply_m",
      "phase": "ongoing",
      "day": 86,
      "n": "Morning Inbound Reply Triage",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "co_d86_reply_e",
      "phase": "ongoing",
      "day": 86,
      "n": "Evening Inbound Reply Triage",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "co_d86_li",
      "phase": "ongoing",
      "day": 86,
      "n": "Send 15 LinkedIn Connection Requests",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "co_d87_send",
      "phase": "ongoing",
      "day": 87,
      "n": "Send Cold Email Batch (375 Sends)",
      "role": "OBS",
      "freq": "Wednesday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "co_d87_wave",
      "phase": "ongoing",
      "day": 87,
      "n": "Launch Automated Follow-up Wave",
      "role": "OBS",
      "freq": "Wednesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "co_d87_li",
      "phase": "ongoing",
      "day": 87,
      "n": "Send 15 LinkedIn Outreach DMs",
      "role": "OBS",
      "freq": "Wednesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "co_d87_reply",
      "phase": "ongoing",
      "day": 87,
      "n": "Process Meeting Bookings from Replies",
      "role": "OBS",
      "freq": "Wednesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "co_d88_send",
      "phase": "ongoing",
      "day": 88,
      "n": "Send Cold Email Batch (375 Sends)",
      "role": "OBS",
      "freq": "Thursday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "co_d88_li",
      "phase": "ongoing",
      "day": 88,
      "n": "Send 15 LinkedIn Connection Requests",
      "role": "OBS",
      "freq": "Thursday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "co_d88_confirm",
      "phase": "ongoing",
      "day": 88,
      "n": "Send Booked Call Confirmations",
      "role": "OBS",
      "freq": "Thursday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "co_d88_noshow",
      "phase": "ongoing",
      "day": 88,
      "n": "Follow-up Missed Call No-Shows",
      "role": "OBS",
      "freq": "Thursday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "co_d89_send",
      "phase": "ongoing",
      "day": 89,
      "n": "Send Cold Email Batch (375 Sends)",
      "role": "OBS",
      "freq": "Friday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "co_d89_seq",
      "phase": "ongoing",
      "day": 89,
      "n": "Sequence Performance Review by Angle",
      "role": "STRAT",
      "freq": "Friday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "co_d89_hyg",
      "phase": "ongoing",
      "day": 89,
      "n": "GHL Pipeline Hygiene and Lead Routing Check",
      "role": "AM",
      "freq": "Friday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "co_d90_clean",
      "phase": "ongoing",
      "day": 90,
      "n": "Clean Inactive Lead Database Contacts",
      "role": "DATA",
      "freq": "Saturday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "co_d90_bounce",
      "phase": "ongoing",
      "day": 90,
      "n": "Remove Hard Bounced Email Addresses",
      "role": "DATA",
      "freq": "Saturday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "co_m25",
      "phase": "ongoing",
      "day": 25,
      "n": "Kill Weakest Email Angle and Reallocate Its Volume",
      "role": "STRAT",
      "priority": "high",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "co_m30",
      "phase": "ongoing",
      "day": 30,
      "n": "Conduct Month 1 Performance Review",
      "role": "AM",
      "priority": "high",
      "hours": "2h",
      "deps": []
    },
    {
      "id": "co_m40",
      "phase": "ongoing",
      "day": 40,
      "n": "Rewrite Offer Language Using Real Objections Collected",
      "role": "CW",
      "priority": "high",
      "hours": "2h",
      "deps": []
    },
    {
      "id": "co_m52",
      "phase": "ongoing",
      "day": 52,
      "n": "Rotate Burnt Domains and Start Warmup on 2 Replacements",
      "role": "AUTO",
      "priority": "high",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "co_m60",
      "phase": "ongoing",
      "day": 60,
      "n": "Conduct Month 2 Pricing Check and Performance Review",
      "role": "AM",
      "priority": "high",
      "hours": "2h",
      "deps": []
    },
    {
      "id": "co_m90",
      "phase": "ongoing",
      "day": 90,
      "n": "Conduct Quarter Review and Renewal Conversation",
      "role": "AM",
      "priority": "high",
      "hours": "2h",
      "deps": []
    }
  ],
  "growth_starter": [
    {
      "id": "gs_s01_a",
      "phase": "sprint",
      "day": 1,
      "n": "Conduct Kickoff Meeting with Client",
      "role": "AM",
      "deps": [],
      "hours": "1h",
      "priority": "high"
    },
    {
      "id": "gs_s01_b",
      "phase": "sprint",
      "day": 1,
      "n": "Collect Social Account Access Logins",
      "role": "AM",
      "deps": [
        "gs_s01_a"
      ],
      "hours": "0.5h",
      "priority": "high"
    },
    {
      "id": "gs_s02_a",
      "phase": "sprint",
      "day": 2,
      "n": "Audit Client Business Model",
      "role": "STRAT",
      "deps": [
        "gs_s01_b"
      ],
      "hours": "1.5h",
      "priority": "high"
    },
    {
      "id": "gs_s02_b",
      "phase": "sprint",
      "day": 2,
      "n": "Scan Competitor Funnels and Positioning",
      "role": "STRAT",
      "deps": [
        "gs_s02_a"
      ],
      "hours": "1.5h",
      "priority": "high"
    },
    {
      "id": "gs_s03_a",
      "phase": "sprint",
      "day": 3,
      "n": "Draft Target ICP Profile",
      "role": "STRAT",
      "deps": [
        "gs_s02_a"
      ],
      "hours": "1.5h",
      "priority": "high"
    },
    {
      "id": "gs_s03_b",
      "phase": "sprint",
      "day": 3,
      "n": "Submit ICP Scorecard for Client Approval",
      "role": "STRAT",
      "deps": [
        "gs_s03_a"
      ],
      "hours": "1h",
      "priority": "high"
    },
    {
      "id": "gs_s04_a",
      "phase": "sprint",
      "day": 4,
      "n": "Collect Client Brand Assets",
      "role": "GD",
      "deps": [
        "gs_s03_b"
      ],
      "hours": "1h",
      "priority": "normal"
    },
    {
      "id": "gs_s04_b",
      "phase": "sprint",
      "day": 4,
      "n": "Lock Brand Color Palette and Typography Guidelines",
      "role": "GD",
      "deps": [
        "gs_s04_a"
      ],
      "hours": "1h",
      "priority": "normal"
    },
    {
      "id": "gs_s05_a",
      "phase": "sprint",
      "day": 5,
      "n": "Create Dedicated GoHighLevel Sub Account and Grant Client Access",
      "role": "AUTO",
      "deps": [
        "gs_s01_b"
      ],
      "hours": "1h",
      "priority": "high"
    },
    {
      "id": "gs_s05_b",
      "phase": "sprint",
      "day": 5,
      "n": "Build GHL Pipeline Stages and Booking Calendar",
      "role": "AUTO",
      "deps": [
        "gs_s05_a"
      ],
      "hours": "1.5h",
      "priority": "high"
    },
    {
      "id": "gs_s06_a",
      "phase": "sprint",
      "day": 6,
      "n": "Install Meta Pixel Conversion Events",
      "role": "DEV",
      "deps": [
        "gs_s05_b"
      ],
      "hours": "1.5h",
      "priority": "high"
    },
    {
      "id": "gs_s06_b",
      "phase": "sprint",
      "day": 6,
      "n": "Setup Google Analytics 4 Tracking",
      "role": "DEV",
      "deps": [
        "gs_s06_a"
      ],
      "hours": "1h",
      "priority": "high"
    },
    {
      "id": "gs_s07_a",
      "phase": "sprint",
      "day": 7,
      "n": "Source First 500 Verified Target Contacts",
      "role": "DATA",
      "deps": [
        "gs_s03_b"
      ],
      "hours": "2h",
      "priority": "normal"
    },
    {
      "id": "gs_s07_b",
      "phase": "sprint",
      "day": 7,
      "n": "Verify Contact Data Deliverability",
      "role": "DATA",
      "deps": [
        "gs_s07_a"
      ],
      "hours": "1h",
      "priority": "normal"
    },
    {
      "id": "gs_s08_a",
      "phase": "sprint",
      "day": 8,
      "n": "Audit Meta Ad Account Settings",
      "role": "ADS",
      "deps": [
        "gs_s06_a"
      ],
      "hours": "1.5h",
      "priority": "high"
    },
    {
      "id": "gs_s08_b",
      "phase": "sprint",
      "day": 8,
      "n": "Build Custom Target Audiences for Meta Lead Gen",
      "role": "ADS",
      "deps": [
        "gs_s08_a"
      ],
      "hours": "1.5h",
      "priority": "high"
    },
    {
      "id": "gs_s09_a",
      "phase": "sprint",
      "day": 9,
      "n": "Conduct Messaging Review Call with Client",
      "role": "STRAT",
      "deps": [
        "gs_s03_b"
      ],
      "hours": "1h",
      "priority": "high"
    },
    {
      "id": "gs_s09_b",
      "phase": "sprint",
      "day": 9,
      "n": "Finalize Social Content Pillars for 2 Platforms",
      "role": "STRAT",
      "deps": [
        "gs_s09_a"
      ],
      "hours": "1h",
      "priority": "high"
    },
    {
      "id": "gs_s09_c",
      "phase": "sprint",
      "day": 9,
      "n": "Connect Landing Page Form and Ads Lead Forms to GHL Pipeline",
      "role": "AUTO",
      "deps": [
        "gs_s05_b"
      ],
      "hours": "1h",
      "priority": "high"
    },
    {
      "id": "gs_s10_a",
      "phase": "sprint",
      "day": 10,
      "n": "Design Landing Page Structure Wireframe",
      "role": "DEV",
      "deps": [
        "gs_s04_b",
        "gs_s09_b"
      ],
      "hours": "2h",
      "priority": "high"
    },
    {
      "id": "gs_s10_b",
      "phase": "sprint",
      "day": 10,
      "n": "Build Landing Page Visual Elements",
      "role": "DEV",
      "deps": [
        "gs_s10_a"
      ],
      "hours": "2h",
      "priority": "high"
    },
    {
      "id": "gs_s11_a",
      "phase": "sprint",
      "day": 11,
      "n": "Optimize LinkedIn Profile Banner and Headline",
      "role": "GD",
      "deps": [
        "gs_s09_b"
      ],
      "hours": "1h",
      "priority": "normal"
    },
    {
      "id": "gs_s11_b",
      "phase": "sprint",
      "day": 11,
      "n": "Write First Content Batch (12 Static Social Posts)",
      "role": "CW",
      "deps": [
        "gs_s09_b"
      ],
      "hours": "2h",
      "priority": "normal"
    },
    {
      "id": "gs_s12_a",
      "phase": "sprint",
      "day": 12,
      "n": "Deploy Landing Page Live and Verify Functionality",
      "role": "DEV",
      "deps": [
        "gs_s10_b"
      ],
      "hours": "1.5h",
      "priority": "high"
    },
    {
      "id": "gs_s12_b",
      "phase": "sprint",
      "day": 12,
      "n": "Test GHL Lead Capture and Booking Form",
      "role": "DEV",
      "deps": [
        "gs_s12_a",
        "gs_s09_c"
      ],
      "hours": "1h",
      "priority": "high"
    },
    {
      "id": "gs_s13_a",
      "phase": "sprint",
      "day": 13,
      "n": "Build Reporting Dashboard and KPI Sheet with Client Login",
      "role": "AM",
      "deps": [
        "gs_s05_a"
      ],
      "hours": "2h",
      "priority": "high"
    },
    {
      "id": "gs_s13_b",
      "phase": "sprint",
      "day": 13,
      "n": "Issue Client Login Portal Walkthrough",
      "role": "AM",
      "deps": [
        "gs_s13_a"
      ],
      "hours": "0.5h",
      "priority": "normal"
    },
    {
      "id": "gs_s14_a",
      "phase": "sprint",
      "day": 14,
      "n": "Build 2 Meta Lead Generation Ad Campaigns in Paused Drafts",
      "role": "ADS",
      "deps": [
        "gs_s08_b",
        "gs_s12_a"
      ],
      "hours": "2h",
      "priority": "high"
    },
    {
      "id": "gs_s14_b",
      "phase": "sprint",
      "day": 14,
      "n": "Confirm Monthly Ad Spend Budget and Billing Method in Writing",
      "role": "AM",
      "deps": [
        "gs_s14_a"
      ],
      "hours": "0.5h",
      "priority": "high"
    },
    {
      "id": "gs_s15_a",
      "phase": "sprint",
      "day": 15,
      "n": "Deliver Go Live Audit Report",
      "role": "AM",
      "deps": [
        "gs_s14_a"
      ],
      "hours": "1h",
      "priority": "high"
    },
    {
      "id": "gs_s15_b",
      "phase": "sprint",
      "day": 15,
      "n": "Conduct Go/No-Go Launch Sign-Off",
      "role": "AM",
      "deps": [
        "gs_s15_a"
      ],
      "hours": "0.5h",
      "priority": "high"
    },
    {
      "id": "gs_s15_c",
      "phase": "sprint",
      "day": 15,
      "n": "Set Client Expectation That Month 1 Produces No Cold Email Booked Calls Since Outbound Is Not Included",
      "role": "AM",
      "deps": [
        "gs_s15_b"
      ],
      "hours": "0.5h",
      "priority": "high"
    },
    {
      "id": "gs_d16_post2",
      "phase": "ongoing",
      "day": 16,
      "n": "Produce Second Weekly Post Batch",
      "role": "GD",
      "freq": "Thursday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "gs_d16_li",
      "phase": "ongoing",
      "day": 16,
      "n": "Send 15 LinkedIn Connection Requests",
      "role": "OBS",
      "freq": "Thursday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gs_d16_book",
      "phase": "ongoing",
      "day": 16,
      "n": "Schedule Inbound Discovery Calls in GHL",
      "role": "OBS",
      "freq": "Thursday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gs_d16_ads",
      "phase": "ongoing",
      "day": 16,
      "n": "Check Meta Lead Form Conversion Quality",
      "role": "ADS",
      "freq": "Thursday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gs_d17_hyg",
      "phase": "ongoing",
      "day": 17,
      "n": "Audit GHL Lead Routing Automation",
      "role": "AUTO",
      "freq": "Friday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gs_d17_li",
      "phase": "ongoing",
      "day": 17,
      "n": "Send 15 LinkedIn Connection Requests",
      "role": "OBS",
      "freq": "Friday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gs_d17_wrap",
      "phase": "ongoing",
      "day": 17,
      "n": "Send Weekly Performance Summary to Client",
      "role": "AM",
      "freq": "Friday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gs_d18_comm",
      "phase": "ongoing",
      "day": 18,
      "n": "Engage with Community Followers",
      "role": "SMM",
      "freq": "Saturday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gs_d19_kpi",
      "phase": "ongoing",
      "day": 19,
      "n": "Review Weekly KPI Numbers",
      "role": "AM",
      "freq": "Monday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gs_d19_sched",
      "phase": "ongoing",
      "day": 19,
      "n": "Schedule Weekly Posts on 2 Platforms",
      "role": "SMM",
      "freq": "Monday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gs_d19_list",
      "phase": "ongoing",
      "day": 19,
      "n": "Build Weekly Target Contact List (125 Contacts)",
      "role": "DATA",
      "freq": "Monday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gs_d19_li",
      "phase": "ongoing",
      "day": 19,
      "n": "Send 15 LinkedIn Connection Requests",
      "role": "OBS",
      "freq": "Monday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gs_d19_ads",
      "phase": "ongoing",
      "day": 19,
      "n": "Check Meta Ads Daily Spend Health",
      "role": "ADS",
      "freq": "Monday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gs_d20_design",
      "phase": "ongoing",
      "day": 20,
      "n": "Design Static Post Visuals",
      "role": "GD",
      "freq": "Tuesday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "gs_d20_copy",
      "phase": "ongoing",
      "day": 20,
      "n": "Write Post Captions and Hashtags",
      "role": "CW",
      "freq": "Tuesday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gs_d20_li",
      "phase": "ongoing",
      "day": 20,
      "n": "Send 15 LinkedIn Connection Requests",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gs_d20_reply",
      "phase": "ongoing",
      "day": 20,
      "n": "Process LinkedIn Inbound Replies",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gs_d20_ads",
      "phase": "ongoing",
      "day": 20,
      "n": "Audit Meta Ad Performance Metrics",
      "role": "ADS",
      "freq": "Tuesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gs_d21_opt",
      "phase": "ongoing",
      "day": 21,
      "n": "Optimize Meta Lead Generation Campaign Budgets",
      "role": "ADS",
      "freq": "Wednesday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gs_d21_li",
      "phase": "ongoing",
      "day": 21,
      "n": "Send 15 LinkedIn Outreach DMs",
      "role": "OBS",
      "freq": "Wednesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gs_d21_comm",
      "phase": "ongoing",
      "day": 21,
      "n": "Respond to Social Media Comments and Messages",
      "role": "SMM",
      "freq": "Wednesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gs_d22_post2",
      "phase": "ongoing",
      "day": 22,
      "n": "Produce Second Weekly Post Batch",
      "role": "GD",
      "freq": "Thursday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "gs_d22_li",
      "phase": "ongoing",
      "day": 22,
      "n": "Send 15 LinkedIn Connection Requests",
      "role": "OBS",
      "freq": "Thursday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gs_d22_book",
      "phase": "ongoing",
      "day": 22,
      "n": "Schedule Inbound Discovery Calls in GHL",
      "role": "OBS",
      "freq": "Thursday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gs_d22_ads",
      "phase": "ongoing",
      "day": 22,
      "n": "Check Meta Lead Form Conversion Quality",
      "role": "ADS",
      "freq": "Thursday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gs_d23_hyg",
      "phase": "ongoing",
      "day": 23,
      "n": "Audit GHL Lead Routing Automation",
      "role": "AUTO",
      "freq": "Friday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gs_d23_li",
      "phase": "ongoing",
      "day": 23,
      "n": "Send 15 LinkedIn Connection Requests",
      "role": "OBS",
      "freq": "Friday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gs_d23_wrap",
      "phase": "ongoing",
      "day": 23,
      "n": "Send Weekly Performance Summary to Client",
      "role": "AM",
      "freq": "Friday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gs_d24_comm",
      "phase": "ongoing",
      "day": 24,
      "n": "Engage with Community Followers",
      "role": "SMM",
      "freq": "Saturday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gs_d25_kpi",
      "phase": "ongoing",
      "day": 25,
      "n": "Review Weekly KPI Numbers",
      "role": "AM",
      "freq": "Monday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gs_d25_sched",
      "phase": "ongoing",
      "day": 25,
      "n": "Schedule Weekly Posts on 2 Platforms",
      "role": "SMM",
      "freq": "Monday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gs_d25_list",
      "phase": "ongoing",
      "day": 25,
      "n": "Build Weekly Target Contact List (125 Contacts)",
      "role": "DATA",
      "freq": "Monday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gs_d25_li",
      "phase": "ongoing",
      "day": 25,
      "n": "Send 15 LinkedIn Connection Requests",
      "role": "OBS",
      "freq": "Monday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gs_d25_ads",
      "phase": "ongoing",
      "day": 25,
      "n": "Check Meta Ads Daily Spend Health",
      "role": "ADS",
      "freq": "Monday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gs_m25_cal",
      "phase": "ongoing",
      "day": 25,
      "n": "Submit Next Month Content Calendar for Client Approval",
      "role": "SMM",
      "priority": "normal",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gs_d26_design",
      "phase": "ongoing",
      "day": 26,
      "n": "Design Static Post Visuals",
      "role": "GD",
      "freq": "Tuesday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "gs_d26_copy",
      "phase": "ongoing",
      "day": 26,
      "n": "Write Post Captions and Hashtags",
      "role": "CW",
      "freq": "Tuesday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gs_d26_li",
      "phase": "ongoing",
      "day": 26,
      "n": "Send 15 LinkedIn Connection Requests",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gs_d26_reply",
      "phase": "ongoing",
      "day": 26,
      "n": "Process LinkedIn Inbound Replies",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gs_d26_ads",
      "phase": "ongoing",
      "day": 26,
      "n": "Audit Meta Ad Performance Metrics",
      "role": "ADS",
      "freq": "Tuesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gs_d27_opt",
      "phase": "ongoing",
      "day": 27,
      "n": "Optimize Meta Lead Generation Campaign Budgets",
      "role": "ADS",
      "freq": "Wednesday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gs_d27_li",
      "phase": "ongoing",
      "day": 27,
      "n": "Send 15 LinkedIn Outreach DMs",
      "role": "OBS",
      "freq": "Wednesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gs_d27_comm",
      "phase": "ongoing",
      "day": 27,
      "n": "Respond to Social Media Comments and Messages",
      "role": "SMM",
      "freq": "Wednesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gs_d28_post2",
      "phase": "ongoing",
      "day": 28,
      "n": "Produce Second Weekly Post Batch",
      "role": "GD",
      "freq": "Thursday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "gs_d28_li",
      "phase": "ongoing",
      "day": 28,
      "n": "Send 15 LinkedIn Connection Requests",
      "role": "OBS",
      "freq": "Thursday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gs_d28_book",
      "phase": "ongoing",
      "day": 28,
      "n": "Schedule Inbound Discovery Calls in GHL",
      "role": "OBS",
      "freq": "Thursday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gs_d28_ads",
      "phase": "ongoing",
      "day": 28,
      "n": "Check Meta Lead Form Conversion Quality",
      "role": "ADS",
      "freq": "Thursday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gs_d29_hyg",
      "phase": "ongoing",
      "day": 29,
      "n": "Audit GHL Lead Routing Automation",
      "role": "AUTO",
      "freq": "Friday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gs_d29_li",
      "phase": "ongoing",
      "day": 29,
      "n": "Send 15 LinkedIn Connection Requests",
      "role": "OBS",
      "freq": "Friday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gs_d29_wrap",
      "phase": "ongoing",
      "day": 29,
      "n": "Send Weekly Performance Summary to Client",
      "role": "AM",
      "freq": "Friday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gs_d30_comm",
      "phase": "ongoing",
      "day": 30,
      "n": "Engage with Community Followers",
      "role": "SMM",
      "freq": "Saturday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gs_d31_kpi",
      "phase": "ongoing",
      "day": 31,
      "n": "Review Weekly KPI Numbers",
      "role": "AM",
      "freq": "Monday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gs_d31_sched",
      "phase": "ongoing",
      "day": 31,
      "n": "Schedule Weekly Posts on 2 Platforms",
      "role": "SMM",
      "freq": "Monday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gs_d31_list",
      "phase": "ongoing",
      "day": 31,
      "n": "Build Weekly Target Contact List (125 Contacts)",
      "role": "DATA",
      "freq": "Monday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gs_d31_li",
      "phase": "ongoing",
      "day": 31,
      "n": "Send 15 LinkedIn Connection Requests",
      "role": "OBS",
      "freq": "Monday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gs_d31_ads",
      "phase": "ongoing",
      "day": 31,
      "n": "Check Meta Ads Daily Spend Health",
      "role": "ADS",
      "freq": "Monday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gs_d32_design",
      "phase": "ongoing",
      "day": 32,
      "n": "Design Static Post Visuals",
      "role": "GD",
      "freq": "Tuesday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "gs_d32_copy",
      "phase": "ongoing",
      "day": 32,
      "n": "Write Post Captions and Hashtags",
      "role": "CW",
      "freq": "Tuesday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gs_d32_li",
      "phase": "ongoing",
      "day": 32,
      "n": "Send 15 LinkedIn Connection Requests",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gs_d32_reply",
      "phase": "ongoing",
      "day": 32,
      "n": "Process LinkedIn Inbound Replies",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gs_d32_ads",
      "phase": "ongoing",
      "day": 32,
      "n": "Audit Meta Ad Performance Metrics",
      "role": "ADS",
      "freq": "Tuesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gs_d33_opt",
      "phase": "ongoing",
      "day": 33,
      "n": "Optimize Meta Lead Generation Campaign Budgets",
      "role": "ADS",
      "freq": "Wednesday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gs_d33_li",
      "phase": "ongoing",
      "day": 33,
      "n": "Send 15 LinkedIn Outreach DMs",
      "role": "OBS",
      "freq": "Wednesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gs_d33_comm",
      "phase": "ongoing",
      "day": 33,
      "n": "Respond to Social Media Comments and Messages",
      "role": "SMM",
      "freq": "Wednesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gs_d34_post2",
      "phase": "ongoing",
      "day": 34,
      "n": "Produce Second Weekly Post Batch",
      "role": "GD",
      "freq": "Thursday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "gs_d34_li",
      "phase": "ongoing",
      "day": 34,
      "n": "Send 15 LinkedIn Connection Requests",
      "role": "OBS",
      "freq": "Thursday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gs_d34_book",
      "phase": "ongoing",
      "day": 34,
      "n": "Schedule Inbound Discovery Calls in GHL",
      "role": "OBS",
      "freq": "Thursday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gs_d34_ads",
      "phase": "ongoing",
      "day": 34,
      "n": "Check Meta Lead Form Conversion Quality",
      "role": "ADS",
      "freq": "Thursday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gs_d35_hyg",
      "phase": "ongoing",
      "day": 35,
      "n": "Audit GHL Lead Routing Automation",
      "role": "AUTO",
      "freq": "Friday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gs_d35_li",
      "phase": "ongoing",
      "day": 35,
      "n": "Send 15 LinkedIn Connection Requests",
      "role": "OBS",
      "freq": "Friday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gs_d35_wrap",
      "phase": "ongoing",
      "day": 35,
      "n": "Send Weekly Performance Summary to Client",
      "role": "AM",
      "freq": "Friday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gs_d36_comm",
      "phase": "ongoing",
      "day": 36,
      "n": "Engage with Community Followers",
      "role": "SMM",
      "freq": "Saturday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gs_d37_kpi",
      "phase": "ongoing",
      "day": 37,
      "n": "Review Weekly KPI Numbers",
      "role": "AM",
      "freq": "Monday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gs_d37_sched",
      "phase": "ongoing",
      "day": 37,
      "n": "Schedule Weekly Posts on 2 Platforms",
      "role": "SMM",
      "freq": "Monday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gs_d37_list",
      "phase": "ongoing",
      "day": 37,
      "n": "Build Weekly Target Contact List (125 Contacts)",
      "role": "DATA",
      "freq": "Monday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gs_d37_li",
      "phase": "ongoing",
      "day": 37,
      "n": "Send 15 LinkedIn Connection Requests",
      "role": "OBS",
      "freq": "Monday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gs_d37_ads",
      "phase": "ongoing",
      "day": 37,
      "n": "Check Meta Ads Daily Spend Health",
      "role": "ADS",
      "freq": "Monday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gs_d38_design",
      "phase": "ongoing",
      "day": 38,
      "n": "Design Static Post Visuals",
      "role": "GD",
      "freq": "Tuesday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "gs_d38_copy",
      "phase": "ongoing",
      "day": 38,
      "n": "Write Post Captions and Hashtags",
      "role": "CW",
      "freq": "Tuesday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gs_d38_li",
      "phase": "ongoing",
      "day": 38,
      "n": "Send 15 LinkedIn Connection Requests",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gs_d38_reply",
      "phase": "ongoing",
      "day": 38,
      "n": "Process LinkedIn Inbound Replies",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gs_d38_ads",
      "phase": "ongoing",
      "day": 38,
      "n": "Audit Meta Ad Performance Metrics",
      "role": "ADS",
      "freq": "Tuesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gs_d39_opt",
      "phase": "ongoing",
      "day": 39,
      "n": "Optimize Meta Lead Generation Campaign Budgets",
      "role": "ADS",
      "freq": "Wednesday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gs_d39_li",
      "phase": "ongoing",
      "day": 39,
      "n": "Send 15 LinkedIn Outreach DMs",
      "role": "OBS",
      "freq": "Wednesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gs_d39_comm",
      "phase": "ongoing",
      "day": 39,
      "n": "Respond to Social Media Comments and Messages",
      "role": "SMM",
      "freq": "Wednesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gs_d40_post2",
      "phase": "ongoing",
      "day": 40,
      "n": "Produce Second Weekly Post Batch",
      "role": "GD",
      "freq": "Thursday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "gs_d40_li",
      "phase": "ongoing",
      "day": 40,
      "n": "Send 15 LinkedIn Connection Requests",
      "role": "OBS",
      "freq": "Thursday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gs_d40_book",
      "phase": "ongoing",
      "day": 40,
      "n": "Schedule Inbound Discovery Calls in GHL",
      "role": "OBS",
      "freq": "Thursday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gs_d40_ads",
      "phase": "ongoing",
      "day": 40,
      "n": "Check Meta Lead Form Conversion Quality",
      "role": "ADS",
      "freq": "Thursday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gs_d41_hyg",
      "phase": "ongoing",
      "day": 41,
      "n": "Audit GHL Lead Routing Automation",
      "role": "AUTO",
      "freq": "Friday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gs_d41_li",
      "phase": "ongoing",
      "day": 41,
      "n": "Send 15 LinkedIn Connection Requests",
      "role": "OBS",
      "freq": "Friday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gs_d41_wrap",
      "phase": "ongoing",
      "day": 41,
      "n": "Send Weekly Performance Summary to Client",
      "role": "AM",
      "freq": "Friday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gs_d42_comm",
      "phase": "ongoing",
      "day": 42,
      "n": "Engage with Community Followers",
      "role": "SMM",
      "freq": "Saturday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gs_d43_kpi",
      "phase": "ongoing",
      "day": 43,
      "n": "Review Weekly KPI Numbers",
      "role": "AM",
      "freq": "Monday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gs_d43_sched",
      "phase": "ongoing",
      "day": 43,
      "n": "Schedule Weekly Posts on 2 Platforms",
      "role": "SMM",
      "freq": "Monday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gs_d43_list",
      "phase": "ongoing",
      "day": 43,
      "n": "Build Weekly Target Contact List (125 Contacts)",
      "role": "DATA",
      "freq": "Monday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gs_d43_li",
      "phase": "ongoing",
      "day": 43,
      "n": "Send 15 LinkedIn Connection Requests",
      "role": "OBS",
      "freq": "Monday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gs_d43_ads",
      "phase": "ongoing",
      "day": 43,
      "n": "Check Meta Ads Daily Spend Health",
      "role": "ADS",
      "freq": "Monday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gs_d44_design",
      "phase": "ongoing",
      "day": 44,
      "n": "Design Static Post Visuals",
      "role": "GD",
      "freq": "Tuesday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "gs_d44_copy",
      "phase": "ongoing",
      "day": 44,
      "n": "Write Post Captions and Hashtags",
      "role": "CW",
      "freq": "Tuesday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gs_d44_li",
      "phase": "ongoing",
      "day": 44,
      "n": "Send 15 LinkedIn Connection Requests",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gs_d44_reply",
      "phase": "ongoing",
      "day": 44,
      "n": "Process LinkedIn Inbound Replies",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gs_d44_ads",
      "phase": "ongoing",
      "day": 44,
      "n": "Audit Meta Ad Performance Metrics",
      "role": "ADS",
      "freq": "Tuesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gs_d45_opt",
      "phase": "ongoing",
      "day": 45,
      "n": "Optimize Meta Lead Generation Campaign Budgets",
      "role": "ADS",
      "freq": "Wednesday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gs_d45_li",
      "phase": "ongoing",
      "day": 45,
      "n": "Send 15 LinkedIn Outreach DMs",
      "role": "OBS",
      "freq": "Wednesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gs_d45_comm",
      "phase": "ongoing",
      "day": 45,
      "n": "Respond to Social Media Comments and Messages",
      "role": "SMM",
      "freq": "Wednesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gs_d46_post2",
      "phase": "ongoing",
      "day": 46,
      "n": "Produce Second Weekly Post Batch",
      "role": "GD",
      "freq": "Thursday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "gs_d46_li",
      "phase": "ongoing",
      "day": 46,
      "n": "Send 15 LinkedIn Connection Requests",
      "role": "OBS",
      "freq": "Thursday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gs_d46_book",
      "phase": "ongoing",
      "day": 46,
      "n": "Schedule Inbound Discovery Calls in GHL",
      "role": "OBS",
      "freq": "Thursday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gs_d46_ads",
      "phase": "ongoing",
      "day": 46,
      "n": "Check Meta Lead Form Conversion Quality",
      "role": "ADS",
      "freq": "Thursday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gs_d47_hyg",
      "phase": "ongoing",
      "day": 47,
      "n": "Audit GHL Lead Routing Automation",
      "role": "AUTO",
      "freq": "Friday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gs_d47_li",
      "phase": "ongoing",
      "day": 47,
      "n": "Send 15 LinkedIn Connection Requests",
      "role": "OBS",
      "freq": "Friday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gs_d47_wrap",
      "phase": "ongoing",
      "day": 47,
      "n": "Send Weekly Performance Summary to Client",
      "role": "AM",
      "freq": "Friday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gs_d48_comm",
      "phase": "ongoing",
      "day": 48,
      "n": "Engage with Community Followers",
      "role": "SMM",
      "freq": "Saturday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gs_d49_kpi",
      "phase": "ongoing",
      "day": 49,
      "n": "Review Weekly KPI Numbers",
      "role": "AM",
      "freq": "Monday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gs_d49_sched",
      "phase": "ongoing",
      "day": 49,
      "n": "Schedule Weekly Posts on 2 Platforms",
      "role": "SMM",
      "freq": "Monday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gs_d49_list",
      "phase": "ongoing",
      "day": 49,
      "n": "Build Weekly Target Contact List (125 Contacts)",
      "role": "DATA",
      "freq": "Monday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gs_d49_li",
      "phase": "ongoing",
      "day": 49,
      "n": "Send 15 LinkedIn Connection Requests",
      "role": "OBS",
      "freq": "Monday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gs_d49_ads",
      "phase": "ongoing",
      "day": 49,
      "n": "Check Meta Ads Daily Spend Health",
      "role": "ADS",
      "freq": "Monday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gs_d50_design",
      "phase": "ongoing",
      "day": 50,
      "n": "Design Static Post Visuals",
      "role": "GD",
      "freq": "Tuesday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "gs_d50_copy",
      "phase": "ongoing",
      "day": 50,
      "n": "Write Post Captions and Hashtags",
      "role": "CW",
      "freq": "Tuesday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gs_d50_li",
      "phase": "ongoing",
      "day": 50,
      "n": "Send 15 LinkedIn Connection Requests",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gs_d50_reply",
      "phase": "ongoing",
      "day": 50,
      "n": "Process LinkedIn Inbound Replies",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gs_d50_ads",
      "phase": "ongoing",
      "day": 50,
      "n": "Audit Meta Ad Performance Metrics",
      "role": "ADS",
      "freq": "Tuesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gs_d51_opt",
      "phase": "ongoing",
      "day": 51,
      "n": "Optimize Meta Lead Generation Campaign Budgets",
      "role": "ADS",
      "freq": "Wednesday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gs_d51_li",
      "phase": "ongoing",
      "day": 51,
      "n": "Send 15 LinkedIn Outreach DMs",
      "role": "OBS",
      "freq": "Wednesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gs_d51_comm",
      "phase": "ongoing",
      "day": 51,
      "n": "Respond to Social Media Comments and Messages",
      "role": "SMM",
      "freq": "Wednesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gs_d52_post2",
      "phase": "ongoing",
      "day": 52,
      "n": "Produce Second Weekly Post Batch",
      "role": "GD",
      "freq": "Thursday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "gs_d52_li",
      "phase": "ongoing",
      "day": 52,
      "n": "Send 15 LinkedIn Connection Requests",
      "role": "OBS",
      "freq": "Thursday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gs_d52_book",
      "phase": "ongoing",
      "day": 52,
      "n": "Schedule Inbound Discovery Calls in GHL",
      "role": "OBS",
      "freq": "Thursday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gs_d52_ads",
      "phase": "ongoing",
      "day": 52,
      "n": "Check Meta Lead Form Conversion Quality",
      "role": "ADS",
      "freq": "Thursday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gs_d53_hyg",
      "phase": "ongoing",
      "day": 53,
      "n": "Audit GHL Lead Routing Automation",
      "role": "AUTO",
      "freq": "Friday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gs_d53_li",
      "phase": "ongoing",
      "day": 53,
      "n": "Send 15 LinkedIn Connection Requests",
      "role": "OBS",
      "freq": "Friday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gs_d53_wrap",
      "phase": "ongoing",
      "day": 53,
      "n": "Send Weekly Performance Summary to Client",
      "role": "AM",
      "freq": "Friday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gs_d54_comm",
      "phase": "ongoing",
      "day": 54,
      "n": "Engage with Community Followers",
      "role": "SMM",
      "freq": "Saturday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gs_d55_kpi",
      "phase": "ongoing",
      "day": 55,
      "n": "Review Weekly KPI Numbers",
      "role": "AM",
      "freq": "Monday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gs_d55_sched",
      "phase": "ongoing",
      "day": 55,
      "n": "Schedule Weekly Posts on 2 Platforms",
      "role": "SMM",
      "freq": "Monday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gs_d55_list",
      "phase": "ongoing",
      "day": 55,
      "n": "Build Weekly Target Contact List (125 Contacts)",
      "role": "DATA",
      "freq": "Monday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gs_d55_li",
      "phase": "ongoing",
      "day": 55,
      "n": "Send 15 LinkedIn Connection Requests",
      "role": "OBS",
      "freq": "Monday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gs_d55_ads",
      "phase": "ongoing",
      "day": 55,
      "n": "Check Meta Ads Daily Spend Health",
      "role": "ADS",
      "freq": "Monday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gs_m55_cal",
      "phase": "ongoing",
      "day": 55,
      "n": "Submit Next Month Content Calendar for Client Approval",
      "role": "SMM",
      "priority": "normal",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gs_d56_design",
      "phase": "ongoing",
      "day": 56,
      "n": "Design Static Post Visuals",
      "role": "GD",
      "freq": "Tuesday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "gs_d56_copy",
      "phase": "ongoing",
      "day": 56,
      "n": "Write Post Captions and Hashtags",
      "role": "CW",
      "freq": "Tuesday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gs_d56_li",
      "phase": "ongoing",
      "day": 56,
      "n": "Send 15 LinkedIn Connection Requests",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gs_d56_reply",
      "phase": "ongoing",
      "day": 56,
      "n": "Process LinkedIn Inbound Replies",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gs_d56_ads",
      "phase": "ongoing",
      "day": 56,
      "n": "Audit Meta Ad Performance Metrics",
      "role": "ADS",
      "freq": "Tuesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gs_d57_opt",
      "phase": "ongoing",
      "day": 57,
      "n": "Optimize Meta Lead Generation Campaign Budgets",
      "role": "ADS",
      "freq": "Wednesday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gs_d57_li",
      "phase": "ongoing",
      "day": 57,
      "n": "Send 15 LinkedIn Outreach DMs",
      "role": "OBS",
      "freq": "Wednesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gs_d57_comm",
      "phase": "ongoing",
      "day": 57,
      "n": "Respond to Social Media Comments and Messages",
      "role": "SMM",
      "freq": "Wednesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gs_d58_post2",
      "phase": "ongoing",
      "day": 58,
      "n": "Produce Second Weekly Post Batch",
      "role": "GD",
      "freq": "Thursday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "gs_d58_li",
      "phase": "ongoing",
      "day": 58,
      "n": "Send 15 LinkedIn Connection Requests",
      "role": "OBS",
      "freq": "Thursday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gs_d58_book",
      "phase": "ongoing",
      "day": 58,
      "n": "Schedule Inbound Discovery Calls in GHL",
      "role": "OBS",
      "freq": "Thursday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gs_d58_ads",
      "phase": "ongoing",
      "day": 58,
      "n": "Check Meta Lead Form Conversion Quality",
      "role": "ADS",
      "freq": "Thursday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gs_d59_hyg",
      "phase": "ongoing",
      "day": 59,
      "n": "Audit GHL Lead Routing Automation",
      "role": "AUTO",
      "freq": "Friday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gs_d59_li",
      "phase": "ongoing",
      "day": 59,
      "n": "Send 15 LinkedIn Connection Requests",
      "role": "OBS",
      "freq": "Friday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gs_d59_wrap",
      "phase": "ongoing",
      "day": 59,
      "n": "Send Weekly Performance Summary to Client",
      "role": "AM",
      "freq": "Friday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gs_d60_comm",
      "phase": "ongoing",
      "day": 60,
      "n": "Engage with Community Followers",
      "role": "SMM",
      "freq": "Saturday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gs_d61_kpi",
      "phase": "ongoing",
      "day": 61,
      "n": "Review Weekly KPI Numbers",
      "role": "AM",
      "freq": "Monday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gs_d61_sched",
      "phase": "ongoing",
      "day": 61,
      "n": "Schedule Weekly Posts on 2 Platforms",
      "role": "SMM",
      "freq": "Monday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gs_d61_list",
      "phase": "ongoing",
      "day": 61,
      "n": "Build Weekly Target Contact List (125 Contacts)",
      "role": "DATA",
      "freq": "Monday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gs_d61_li",
      "phase": "ongoing",
      "day": 61,
      "n": "Send 15 LinkedIn Connection Requests",
      "role": "OBS",
      "freq": "Monday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gs_d61_ads",
      "phase": "ongoing",
      "day": 61,
      "n": "Check Meta Ads Daily Spend Health",
      "role": "ADS",
      "freq": "Monday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gs_d62_design",
      "phase": "ongoing",
      "day": 62,
      "n": "Design Static Post Visuals",
      "role": "GD",
      "freq": "Tuesday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "gs_d62_copy",
      "phase": "ongoing",
      "day": 62,
      "n": "Write Post Captions and Hashtags",
      "role": "CW",
      "freq": "Tuesday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gs_d62_li",
      "phase": "ongoing",
      "day": 62,
      "n": "Send 15 LinkedIn Connection Requests",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gs_d62_reply",
      "phase": "ongoing",
      "day": 62,
      "n": "Process LinkedIn Inbound Replies",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gs_d62_ads",
      "phase": "ongoing",
      "day": 62,
      "n": "Audit Meta Ad Performance Metrics",
      "role": "ADS",
      "freq": "Tuesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gs_d63_opt",
      "phase": "ongoing",
      "day": 63,
      "n": "Optimize Meta Lead Generation Campaign Budgets",
      "role": "ADS",
      "freq": "Wednesday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gs_d63_li",
      "phase": "ongoing",
      "day": 63,
      "n": "Send 15 LinkedIn Outreach DMs",
      "role": "OBS",
      "freq": "Wednesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gs_d63_comm",
      "phase": "ongoing",
      "day": 63,
      "n": "Respond to Social Media Comments and Messages",
      "role": "SMM",
      "freq": "Wednesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gs_d64_post2",
      "phase": "ongoing",
      "day": 64,
      "n": "Produce Second Weekly Post Batch",
      "role": "GD",
      "freq": "Thursday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "gs_d64_li",
      "phase": "ongoing",
      "day": 64,
      "n": "Send 15 LinkedIn Connection Requests",
      "role": "OBS",
      "freq": "Thursday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gs_d64_book",
      "phase": "ongoing",
      "day": 64,
      "n": "Schedule Inbound Discovery Calls in GHL",
      "role": "OBS",
      "freq": "Thursday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gs_d64_ads",
      "phase": "ongoing",
      "day": 64,
      "n": "Check Meta Lead Form Conversion Quality",
      "role": "ADS",
      "freq": "Thursday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gs_d65_hyg",
      "phase": "ongoing",
      "day": 65,
      "n": "Audit GHL Lead Routing Automation",
      "role": "AUTO",
      "freq": "Friday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gs_d65_li",
      "phase": "ongoing",
      "day": 65,
      "n": "Send 15 LinkedIn Connection Requests",
      "role": "OBS",
      "freq": "Friday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gs_d65_wrap",
      "phase": "ongoing",
      "day": 65,
      "n": "Send Weekly Performance Summary to Client",
      "role": "AM",
      "freq": "Friday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gs_d66_comm",
      "phase": "ongoing",
      "day": 66,
      "n": "Engage with Community Followers",
      "role": "SMM",
      "freq": "Saturday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gs_d67_kpi",
      "phase": "ongoing",
      "day": 67,
      "n": "Review Weekly KPI Numbers",
      "role": "AM",
      "freq": "Monday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gs_d67_sched",
      "phase": "ongoing",
      "day": 67,
      "n": "Schedule Weekly Posts on 2 Platforms",
      "role": "SMM",
      "freq": "Monday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gs_d67_list",
      "phase": "ongoing",
      "day": 67,
      "n": "Build Weekly Target Contact List (125 Contacts)",
      "role": "DATA",
      "freq": "Monday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gs_d67_li",
      "phase": "ongoing",
      "day": 67,
      "n": "Send 15 LinkedIn Connection Requests",
      "role": "OBS",
      "freq": "Monday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gs_d67_ads",
      "phase": "ongoing",
      "day": 67,
      "n": "Check Meta Ads Daily Spend Health",
      "role": "ADS",
      "freq": "Monday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gs_d68_design",
      "phase": "ongoing",
      "day": 68,
      "n": "Design Static Post Visuals",
      "role": "GD",
      "freq": "Tuesday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "gs_d68_copy",
      "phase": "ongoing",
      "day": 68,
      "n": "Write Post Captions and Hashtags",
      "role": "CW",
      "freq": "Tuesday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gs_d68_li",
      "phase": "ongoing",
      "day": 68,
      "n": "Send 15 LinkedIn Connection Requests",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gs_d68_reply",
      "phase": "ongoing",
      "day": 68,
      "n": "Process LinkedIn Inbound Replies",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gs_d68_ads",
      "phase": "ongoing",
      "day": 68,
      "n": "Audit Meta Ad Performance Metrics",
      "role": "ADS",
      "freq": "Tuesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gs_d69_opt",
      "phase": "ongoing",
      "day": 69,
      "n": "Optimize Meta Lead Generation Campaign Budgets",
      "role": "ADS",
      "freq": "Wednesday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gs_d69_li",
      "phase": "ongoing",
      "day": 69,
      "n": "Send 15 LinkedIn Outreach DMs",
      "role": "OBS",
      "freq": "Wednesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gs_d69_comm",
      "phase": "ongoing",
      "day": 69,
      "n": "Respond to Social Media Comments and Messages",
      "role": "SMM",
      "freq": "Wednesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gs_d70_post2",
      "phase": "ongoing",
      "day": 70,
      "n": "Produce Second Weekly Post Batch",
      "role": "GD",
      "freq": "Thursday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "gs_d70_li",
      "phase": "ongoing",
      "day": 70,
      "n": "Send 15 LinkedIn Connection Requests",
      "role": "OBS",
      "freq": "Thursday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gs_d70_book",
      "phase": "ongoing",
      "day": 70,
      "n": "Schedule Inbound Discovery Calls in GHL",
      "role": "OBS",
      "freq": "Thursday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gs_d70_ads",
      "phase": "ongoing",
      "day": 70,
      "n": "Check Meta Lead Form Conversion Quality",
      "role": "ADS",
      "freq": "Thursday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gs_d71_hyg",
      "phase": "ongoing",
      "day": 71,
      "n": "Audit GHL Lead Routing Automation",
      "role": "AUTO",
      "freq": "Friday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gs_d71_li",
      "phase": "ongoing",
      "day": 71,
      "n": "Send 15 LinkedIn Connection Requests",
      "role": "OBS",
      "freq": "Friday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gs_d71_wrap",
      "phase": "ongoing",
      "day": 71,
      "n": "Send Weekly Performance Summary to Client",
      "role": "AM",
      "freq": "Friday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gs_d72_comm",
      "phase": "ongoing",
      "day": 72,
      "n": "Engage with Community Followers",
      "role": "SMM",
      "freq": "Saturday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gs_d73_kpi",
      "phase": "ongoing",
      "day": 73,
      "n": "Review Weekly KPI Numbers",
      "role": "AM",
      "freq": "Monday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gs_d73_sched",
      "phase": "ongoing",
      "day": 73,
      "n": "Schedule Weekly Posts on 2 Platforms",
      "role": "SMM",
      "freq": "Monday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gs_d73_list",
      "phase": "ongoing",
      "day": 73,
      "n": "Build Weekly Target Contact List (125 Contacts)",
      "role": "DATA",
      "freq": "Monday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gs_d73_li",
      "phase": "ongoing",
      "day": 73,
      "n": "Send 15 LinkedIn Connection Requests",
      "role": "OBS",
      "freq": "Monday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gs_d73_ads",
      "phase": "ongoing",
      "day": 73,
      "n": "Check Meta Ads Daily Spend Health",
      "role": "ADS",
      "freq": "Monday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gs_d74_design",
      "phase": "ongoing",
      "day": 74,
      "n": "Design Static Post Visuals",
      "role": "GD",
      "freq": "Tuesday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "gs_d74_copy",
      "phase": "ongoing",
      "day": 74,
      "n": "Write Post Captions and Hashtags",
      "role": "CW",
      "freq": "Tuesday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gs_d74_li",
      "phase": "ongoing",
      "day": 74,
      "n": "Send 15 LinkedIn Connection Requests",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gs_d74_reply",
      "phase": "ongoing",
      "day": 74,
      "n": "Process LinkedIn Inbound Replies",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gs_d74_ads",
      "phase": "ongoing",
      "day": 74,
      "n": "Audit Meta Ad Performance Metrics",
      "role": "ADS",
      "freq": "Tuesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gs_d75_opt",
      "phase": "ongoing",
      "day": 75,
      "n": "Optimize Meta Lead Generation Campaign Budgets",
      "role": "ADS",
      "freq": "Wednesday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gs_d75_li",
      "phase": "ongoing",
      "day": 75,
      "n": "Send 15 LinkedIn Outreach DMs",
      "role": "OBS",
      "freq": "Wednesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gs_d75_comm",
      "phase": "ongoing",
      "day": 75,
      "n": "Respond to Social Media Comments and Messages",
      "role": "SMM",
      "freq": "Wednesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gs_d76_post2",
      "phase": "ongoing",
      "day": 76,
      "n": "Produce Second Weekly Post Batch",
      "role": "GD",
      "freq": "Thursday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "gs_d76_li",
      "phase": "ongoing",
      "day": 76,
      "n": "Send 15 LinkedIn Connection Requests",
      "role": "OBS",
      "freq": "Thursday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gs_d76_book",
      "phase": "ongoing",
      "day": 76,
      "n": "Schedule Inbound Discovery Calls in GHL",
      "role": "OBS",
      "freq": "Thursday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gs_d76_ads",
      "phase": "ongoing",
      "day": 76,
      "n": "Check Meta Lead Form Conversion Quality",
      "role": "ADS",
      "freq": "Thursday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gs_d77_hyg",
      "phase": "ongoing",
      "day": 77,
      "n": "Audit GHL Lead Routing Automation",
      "role": "AUTO",
      "freq": "Friday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gs_d77_li",
      "phase": "ongoing",
      "day": 77,
      "n": "Send 15 LinkedIn Connection Requests",
      "role": "OBS",
      "freq": "Friday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gs_d77_wrap",
      "phase": "ongoing",
      "day": 77,
      "n": "Send Weekly Performance Summary to Client",
      "role": "AM",
      "freq": "Friday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gs_d78_comm",
      "phase": "ongoing",
      "day": 78,
      "n": "Engage with Community Followers",
      "role": "SMM",
      "freq": "Saturday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gs_d79_kpi",
      "phase": "ongoing",
      "day": 79,
      "n": "Review Weekly KPI Numbers",
      "role": "AM",
      "freq": "Monday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gs_d79_sched",
      "phase": "ongoing",
      "day": 79,
      "n": "Schedule Weekly Posts on 2 Platforms",
      "role": "SMM",
      "freq": "Monday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gs_d79_list",
      "phase": "ongoing",
      "day": 79,
      "n": "Build Weekly Target Contact List (125 Contacts)",
      "role": "DATA",
      "freq": "Monday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gs_d79_li",
      "phase": "ongoing",
      "day": 79,
      "n": "Send 15 LinkedIn Connection Requests",
      "role": "OBS",
      "freq": "Monday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gs_d79_ads",
      "phase": "ongoing",
      "day": 79,
      "n": "Check Meta Ads Daily Spend Health",
      "role": "ADS",
      "freq": "Monday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gs_d80_design",
      "phase": "ongoing",
      "day": 80,
      "n": "Design Static Post Visuals",
      "role": "GD",
      "freq": "Tuesday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "gs_d80_copy",
      "phase": "ongoing",
      "day": 80,
      "n": "Write Post Captions and Hashtags",
      "role": "CW",
      "freq": "Tuesday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gs_d80_li",
      "phase": "ongoing",
      "day": 80,
      "n": "Send 15 LinkedIn Connection Requests",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gs_d80_reply",
      "phase": "ongoing",
      "day": 80,
      "n": "Process LinkedIn Inbound Replies",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gs_d80_ads",
      "phase": "ongoing",
      "day": 80,
      "n": "Audit Meta Ad Performance Metrics",
      "role": "ADS",
      "freq": "Tuesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gs_d81_opt",
      "phase": "ongoing",
      "day": 81,
      "n": "Optimize Meta Lead Generation Campaign Budgets",
      "role": "ADS",
      "freq": "Wednesday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gs_d81_li",
      "phase": "ongoing",
      "day": 81,
      "n": "Send 15 LinkedIn Outreach DMs",
      "role": "OBS",
      "freq": "Wednesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gs_d81_comm",
      "phase": "ongoing",
      "day": 81,
      "n": "Respond to Social Media Comments and Messages",
      "role": "SMM",
      "freq": "Wednesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gs_d82_post2",
      "phase": "ongoing",
      "day": 82,
      "n": "Produce Second Weekly Post Batch",
      "role": "GD",
      "freq": "Thursday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "gs_d82_li",
      "phase": "ongoing",
      "day": 82,
      "n": "Send 15 LinkedIn Connection Requests",
      "role": "OBS",
      "freq": "Thursday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gs_d82_book",
      "phase": "ongoing",
      "day": 82,
      "n": "Schedule Inbound Discovery Calls in GHL",
      "role": "OBS",
      "freq": "Thursday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gs_d82_ads",
      "phase": "ongoing",
      "day": 82,
      "n": "Check Meta Lead Form Conversion Quality",
      "role": "ADS",
      "freq": "Thursday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gs_d83_hyg",
      "phase": "ongoing",
      "day": 83,
      "n": "Audit GHL Lead Routing Automation",
      "role": "AUTO",
      "freq": "Friday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gs_d83_li",
      "phase": "ongoing",
      "day": 83,
      "n": "Send 15 LinkedIn Connection Requests",
      "role": "OBS",
      "freq": "Friday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gs_d83_wrap",
      "phase": "ongoing",
      "day": 83,
      "n": "Send Weekly Performance Summary to Client",
      "role": "AM",
      "freq": "Friday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gs_d84_comm",
      "phase": "ongoing",
      "day": 84,
      "n": "Engage with Community Followers",
      "role": "SMM",
      "freq": "Saturday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gs_d85_kpi",
      "phase": "ongoing",
      "day": 85,
      "n": "Review Weekly KPI Numbers",
      "role": "AM",
      "freq": "Monday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gs_d85_sched",
      "phase": "ongoing",
      "day": 85,
      "n": "Schedule Weekly Posts on 2 Platforms",
      "role": "SMM",
      "freq": "Monday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gs_d85_list",
      "phase": "ongoing",
      "day": 85,
      "n": "Build Weekly Target Contact List (125 Contacts)",
      "role": "DATA",
      "freq": "Monday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gs_d85_li",
      "phase": "ongoing",
      "day": 85,
      "n": "Send 15 LinkedIn Connection Requests",
      "role": "OBS",
      "freq": "Monday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gs_d85_ads",
      "phase": "ongoing",
      "day": 85,
      "n": "Check Meta Ads Daily Spend Health",
      "role": "ADS",
      "freq": "Monday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gs_m85_cal",
      "phase": "ongoing",
      "day": 85,
      "n": "Submit Next Month Content Calendar for Client Approval",
      "role": "SMM",
      "priority": "normal",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gs_d86_design",
      "phase": "ongoing",
      "day": 86,
      "n": "Design Static Post Visuals",
      "role": "GD",
      "freq": "Tuesday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "gs_d86_copy",
      "phase": "ongoing",
      "day": 86,
      "n": "Write Post Captions and Hashtags",
      "role": "CW",
      "freq": "Tuesday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gs_d86_li",
      "phase": "ongoing",
      "day": 86,
      "n": "Send 15 LinkedIn Connection Requests",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gs_d86_reply",
      "phase": "ongoing",
      "day": 86,
      "n": "Process LinkedIn Inbound Replies",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gs_d86_ads",
      "phase": "ongoing",
      "day": 86,
      "n": "Audit Meta Ad Performance Metrics",
      "role": "ADS",
      "freq": "Tuesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gs_d87_opt",
      "phase": "ongoing",
      "day": 87,
      "n": "Optimize Meta Lead Generation Campaign Budgets",
      "role": "ADS",
      "freq": "Wednesday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gs_d87_li",
      "phase": "ongoing",
      "day": 87,
      "n": "Send 15 LinkedIn Outreach DMs",
      "role": "OBS",
      "freq": "Wednesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gs_d87_comm",
      "phase": "ongoing",
      "day": 87,
      "n": "Respond to Social Media Comments and Messages",
      "role": "SMM",
      "freq": "Wednesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gs_d88_post2",
      "phase": "ongoing",
      "day": 88,
      "n": "Produce Second Weekly Post Batch",
      "role": "GD",
      "freq": "Thursday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "gs_d88_li",
      "phase": "ongoing",
      "day": 88,
      "n": "Send 15 LinkedIn Connection Requests",
      "role": "OBS",
      "freq": "Thursday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gs_d88_book",
      "phase": "ongoing",
      "day": 88,
      "n": "Schedule Inbound Discovery Calls in GHL",
      "role": "OBS",
      "freq": "Thursday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gs_d88_ads",
      "phase": "ongoing",
      "day": 88,
      "n": "Check Meta Lead Form Conversion Quality",
      "role": "ADS",
      "freq": "Thursday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gs_d89_hyg",
      "phase": "ongoing",
      "day": 89,
      "n": "Audit GHL Lead Routing Automation",
      "role": "AUTO",
      "freq": "Friday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gs_d89_li",
      "phase": "ongoing",
      "day": 89,
      "n": "Send 15 LinkedIn Connection Requests",
      "role": "OBS",
      "freq": "Friday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gs_d89_wrap",
      "phase": "ongoing",
      "day": 89,
      "n": "Send Weekly Performance Summary to Client",
      "role": "AM",
      "freq": "Friday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gs_d90_comm",
      "phase": "ongoing",
      "day": 90,
      "n": "Engage with Community Followers",
      "role": "SMM",
      "freq": "Saturday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gs_m30",
      "phase": "ongoing",
      "day": 30,
      "n": "Conduct Month 1 Performance Review",
      "role": "AM",
      "priority": "high",
      "hours": "2h",
      "deps": []
    },
    {
      "id": "gs_m40",
      "phase": "ongoing",
      "day": 40,
      "n": "Audit Landing Page Conversion Rate",
      "role": "DEV",
      "priority": "normal",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "gs_m60",
      "phase": "ongoing",
      "day": 60,
      "n": "Conduct Month 2 Pricing Check and Performance Review",
      "role": "AM",
      "priority": "high",
      "hours": "2h",
      "deps": []
    },
    {
      "id": "gs_m70",
      "phase": "ongoing",
      "day": 70,
      "n": "Audit Mobile Usability on Landing Page",
      "role": "DEV",
      "priority": "normal",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gs_m90",
      "phase": "ongoing",
      "day": 90,
      "n": "Conduct Quarter Review and Renewal Conversation",
      "role": "AM",
      "priority": "high",
      "hours": "2h",
      "deps": []
    }
  ],
  "growth_engine": [
    {
      "id": "ge_s01_a",
      "phase": "sprint",
      "day": 1,
      "n": "Conduct Kickoff Meeting with Client",
      "role": "AM",
      "deps": [],
      "hours": "1h",
      "priority": "high"
    },
    {
      "id": "ge_s01_b",
      "phase": "sprint",
      "day": 1,
      "n": "Collect Platform Credentials",
      "role": "AM",
      "deps": [
        "ge_s01_a"
      ],
      "hours": "0.5h",
      "priority": "high"
    },
    {
      "id": "ge_s01_c",
      "phase": "sprint",
      "day": 1,
      "n": "Purchase 6 Sending Domains",
      "role": "AUTO",
      "deps": [
        "ge_s01_b"
      ],
      "hours": "1h",
      "priority": "high"
    },
    {
      "id": "ge_s01_d",
      "phase": "sprint",
      "day": 1,
      "n": "Configure SPF, DKIM, DMARC DNS Records",
      "role": "AUTO",
      "deps": [
        "ge_s01_c"
      ],
      "hours": "1h",
      "priority": "high"
    },
    {
      "id": "ge_s02_a",
      "phase": "sprint",
      "day": 2,
      "n": "Audit Client Business Offer",
      "role": "STRAT",
      "deps": [
        "ge_s01_b"
      ],
      "hours": "1.5h",
      "priority": "high"
    },
    {
      "id": "ge_s02_b",
      "phase": "sprint",
      "day": 2,
      "n": "Benchmark Competitor Market Strategies",
      "role": "STRAT",
      "deps": [
        "ge_s02_a"
      ],
      "hours": "1.5h",
      "priority": "high"
    },
    {
      "id": "ge_s02_c",
      "phase": "sprint",
      "day": 2,
      "n": "Create 18 Mailboxes across 6 Domains",
      "role": "AUTO",
      "deps": [
        "ge_s01_d"
      ],
      "hours": "1.5h",
      "priority": "high"
    },
    {
      "id": "ge_s03_a",
      "phase": "sprint",
      "day": 3,
      "n": "Draft Target ICP Profile",
      "role": "STRAT",
      "deps": [
        "ge_s02_a"
      ],
      "hours": "1.5h",
      "priority": "high"
    },
    {
      "id": "ge_s03_b",
      "phase": "sprint",
      "day": 3,
      "n": "Submit ICP Scorecard for Approval",
      "role": "STRAT",
      "deps": [
        "ge_s03_a"
      ],
      "hours": "1h",
      "priority": "high"
    },
    {
      "id": "ge_s03_c",
      "phase": "sprint",
      "day": 3,
      "n": "Connect 18 Mailboxes to Warmup Pool",
      "role": "AUTO",
      "deps": [
        "ge_s02_c"
      ],
      "hours": "1h",
      "priority": "high"
    },
    {
      "id": "ge_s03_d",
      "phase": "sprint",
      "day": 3,
      "n": "Set Automated Warmup Schedule",
      "role": "AUTO",
      "deps": [
        "ge_s03_c"
      ],
      "hours": "0.5h",
      "priority": "high"
    },
    {
      "id": "ge_s04_a",
      "phase": "sprint",
      "day": 4,
      "n": "Collect Brand Identity Assets",
      "role": "GD",
      "deps": [
        "ge_s03_b"
      ],
      "hours": "1h",
      "priority": "normal"
    },
    {
      "id": "ge_s04_b",
      "phase": "sprint",
      "day": 4,
      "n": "Build GHL Sub-Account Multi-Pipeline Stages",
      "role": "AUTO",
      "deps": [
        "ge_s01_b"
      ],
      "hours": "1.5h",
      "priority": "high"
    },
    {
      "id": "ge_s05_a",
      "phase": "sprint",
      "day": 5,
      "n": "Configure Booking Calendar and Routing Automation",
      "role": "AUTO",
      "deps": [
        "ge_s04_b"
      ],
      "hours": "1h",
      "priority": "high"
    },
    {
      "id": "ge_s05_b",
      "phase": "sprint",
      "day": 5,
      "n": "Setup Slack Live Lead Alerts",
      "role": "AUTO",
      "deps": [
        "ge_s05_a"
      ],
      "hours": "0.5h",
      "priority": "normal"
    },
    {
      "id": "ge_s06_a",
      "phase": "sprint",
      "day": 6,
      "n": "Deploy Meta Pixel Conversion Events",
      "role": "DEV",
      "deps": [
        "ge_s05_a"
      ],
      "hours": "1h",
      "priority": "high"
    },
    {
      "id": "ge_s06_b",
      "phase": "sprint",
      "day": 6,
      "n": "Setup Google Analytics 4 and Tag Manager",
      "role": "DEV",
      "deps": [
        "ge_s06_a"
      ],
      "hours": "1.5h",
      "priority": "high"
    },
    {
      "id": "ge_s07_a",
      "phase": "sprint",
      "day": 7,
      "n": "Draft Email Sequence Angle 1 Direct Pitch",
      "role": "CW",
      "deps": [
        "ge_s03_a"
      ],
      "hours": "1.5h",
      "priority": "high"
    },
    {
      "id": "ge_s07_b",
      "phase": "sprint",
      "day": 7,
      "n": "Draft Email Sequence Angle 2 Pain Point",
      "role": "CW",
      "deps": [
        "ge_s07_a"
      ],
      "hours": "1.5h",
      "priority": "high"
    },
    {
      "id": "ge_s07_c",
      "phase": "sprint",
      "day": 7,
      "n": "Source First 1,500 Verified ICP Contacts",
      "role": "DATA",
      "deps": [
        "ge_s03_b"
      ],
      "hours": "2.5h",
      "priority": "high"
    },
    {
      "id": "ge_s08_a",
      "phase": "sprint",
      "day": 8,
      "n": "Draft Email Sequence Angle 3 Case Study and Social Proof",
      "role": "CW",
      "deps": [
        "ge_s07_b"
      ],
      "hours": "1.5h",
      "priority": "high"
    },
    {
      "id": "ge_s08_b",
      "phase": "sprint",
      "day": 8,
      "n": "Write 4 Follow Up Variations Per Angle",
      "role": "CW",
      "deps": [
        "ge_s08_a"
      ],
      "hours": "2h",
      "priority": "high"
    },
    {
      "id": "ge_s08_c",
      "phase": "sprint",
      "day": 8,
      "n": "Audit Meta and Google Ad Account Settings",
      "role": "ADS",
      "deps": [
        "ge_s06_a"
      ],
      "hours": "1.5h",
      "priority": "high"
    },
    {
      "id": "ge_s09_a",
      "phase": "sprint",
      "day": 9,
      "n": "Write LinkedIn Connection Note and 3 Step DM Sequence",
      "role": "CW",
      "deps": [
        "ge_s07_a"
      ],
      "hours": "1h",
      "priority": "high"
    },
    {
      "id": "ge_s09_b",
      "phase": "sprint",
      "day": 9,
      "n": "Design LinkedIn Banner and Optimize Headline",
      "role": "GD",
      "deps": [
        "ge_s04_a"
      ],
      "hours": "1h",
      "priority": "normal"
    },
    {
      "id": "ge_s09_c",
      "phase": "sprint",
      "day": 9,
      "n": "Execute Technical SEO Audit and Crawl Review",
      "role": "SEO",
      "deps": [
        "ge_s03_a"
      ],
      "hours": "2h",
      "priority": "normal"
    },
    {
      "id": "ge_s10_a",
      "phase": "sprint",
      "day": 10,
      "n": "Messaging Approval Call with Client on Angles and Content Pillars",
      "role": "AM",
      "deps": [
        "ge_s08_b",
        "ge_s09_a"
      ],
      "hours": "1h",
      "priority": "high"
    },
    {
      "id": "ge_s10_b",
      "phase": "sprint",
      "day": 10,
      "n": "Design Landing Page 1 Layout Wireframe",
      "role": "DEV",
      "deps": [
        "ge_s10_a"
      ],
      "hours": "2h",
      "priority": "high"
    },
    {
      "id": "ge_s10_c",
      "phase": "sprint",
      "day": 10,
      "n": "Optimize 2 LinkedIn Personal Profiles",
      "role": "OBS",
      "deps": [
        "ge_s09_b"
      ],
      "hours": "1.5h",
      "priority": "normal"
    },
    {
      "id": "ge_s11_a",
      "phase": "sprint",
      "day": 11,
      "n": "Map 15 High Intent Primary Keywords",
      "role": "SEO",
      "deps": [
        "ge_s09_c"
      ],
      "hours": "1.5h",
      "priority": "normal"
    },
    {
      "id": "ge_s11_b",
      "phase": "sprint",
      "day": 11,
      "n": "Produce Initial Social Content Batch (10 Posts)",
      "role": "CW",
      "deps": [
        "ge_s10_a"
      ],
      "hours": "2h",
      "priority": "normal"
    },
    {
      "id": "ge_s12_a",
      "phase": "sprint",
      "day": 12,
      "n": "Write Discovery Call Script and Objection Handling Document",
      "role": "CW",
      "deps": [
        "ge_s02_a"
      ],
      "hours": "1.5h",
      "priority": "normal"
    },
    {
      "id": "ge_s12_b",
      "phase": "sprint",
      "day": 12,
      "n": "Prepare Proposal Template for Client Use",
      "role": "AM",
      "deps": [
        "ge_s02_a"
      ],
      "hours": "1h",
      "priority": "normal"
    },
    {
      "id": "ge_s12_c",
      "phase": "sprint",
      "day": 12,
      "n": "Deploy 2 Landing Pages Live on Subdomains",
      "role": "DEV",
      "deps": [
        "ge_s10_b"
      ],
      "hours": "2h",
      "priority": "high"
    },
    {
      "id": "ge_s13_a",
      "phase": "sprint",
      "day": 13,
      "n": "Build Reporting Dashboard and KPI Sheet with Client Login",
      "role": "AM",
      "deps": [
        "ge_s04_b"
      ],
      "hours": "2h",
      "priority": "high"
    },
    {
      "id": "ge_s13_b",
      "phase": "sprint",
      "day": 13,
      "n": "Source Additional 1,500 Verified ICP Contacts",
      "role": "DATA",
      "deps": [
        "ge_s07_c"
      ],
      "hours": "2h",
      "priority": "high"
    },
    {
      "id": "ge_s14_a",
      "phase": "sprint",
      "day": 14,
      "n": "Build Meta and Google Search Campaigns in Paused Drafts",
      "role": "ADS",
      "deps": [
        "ge_s08_c",
        "ge_s12_c"
      ],
      "hours": "2h",
      "priority": "high"
    },
    {
      "id": "ge_s14_b",
      "phase": "sprint",
      "day": 14,
      "n": "Confirm Monthly Ad Spend Budget and Billing Method in Writing",
      "role": "AM",
      "deps": [
        "ge_s14_a"
      ],
      "hours": "0.5h",
      "priority": "high"
    },
    {
      "id": "ge_s14_c",
      "phase": "sprint",
      "day": 14,
      "n": "Execute Seed List Test Send to 10 Inboxes",
      "role": "OBS",
      "deps": [
        "ge_s03_c"
      ],
      "hours": "1h",
      "priority": "high"
    },
    {
      "id": "ge_s15_a",
      "phase": "sprint",
      "day": 15,
      "n": "Final Deliverability QA and Inbox Placement Check",
      "role": "OBS",
      "deps": [
        "ge_s14_c"
      ],
      "hours": "1h",
      "priority": "high"
    },
    {
      "id": "ge_s15_b",
      "phase": "sprint",
      "day": 15,
      "n": "Compile Go Live Performance Report and Conduct Milestone Review",
      "role": "AM",
      "deps": [
        "ge_s15_a"
      ],
      "hours": "1h",
      "priority": "high"
    },
    {
      "id": "ge_d16_backlink",
      "phase": "ongoing",
      "day": 16,
      "n": "Execute Backlink Outreach Pitching",
      "role": "SEO",
      "freq": "Thursday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "ge_d16_posts",
      "phase": "ongoing",
      "day": 16,
      "n": "Produce Weekly Post Batch Visuals",
      "role": "GD",
      "freq": "Thursday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "ge_d16_li",
      "phase": "ongoing",
      "day": 16,
      "n": "Send 40 LinkedIn Connection Requests",
      "role": "OBS",
      "freq": "Thursday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d16_calls",
      "phase": "ongoing",
      "day": 16,
      "n": "Confirm Scheduled Calls and Send Reminders",
      "role": "OBS",
      "freq": "Thursday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "ge_d16_ads",
      "phase": "ongoing",
      "day": 16,
      "n": "Optimize Google Search Keywords and Negative Terms",
      "role": "ADS",
      "freq": "Thursday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "ge_d17_ramp",
      "phase": "ongoing",
      "day": 17,
      "n": "Start Cold Email Sending at 20 Percent Volume",
      "role": "OBS",
      "priority": "high",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d17_send",
      "phase": "ongoing",
      "day": 17,
      "n": "Send Cold Email Ramp-Up Batch",
      "role": "OBS",
      "freq": "Friday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d17_seq",
      "phase": "ongoing",
      "day": 17,
      "n": "Analyze Sequence Conversion Rates by Angle",
      "role": "STRAT",
      "freq": "Friday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d17_gmb",
      "phase": "ongoing",
      "day": 17,
      "n": "Publish Google Business Profile Update",
      "role": "SEO",
      "freq": "Friday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "ge_d17_hyg",
      "phase": "ongoing",
      "day": 17,
      "n": "Audit GHL CRM Lead Automation",
      "role": "AUTO",
      "freq": "Friday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "ge_d18_comm",
      "phase": "ongoing",
      "day": 18,
      "n": "Manage Social Community Engagement",
      "role": "SMM",
      "freq": "Saturday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d19_kpi",
      "phase": "ongoing",
      "day": 19,
      "n": "Review Weekly KPI Scorecard",
      "role": "AM",
      "freq": "Monday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d19_box",
      "phase": "ongoing",
      "day": 19,
      "n": "Check Mailbox Health (18 Boxes)",
      "role": "AUTO",
      "freq": "Monday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "ge_d19_list",
      "phase": "ongoing",
      "day": 19,
      "n": "Build Weekly Verified Lead List (750 Contacts)",
      "role": "DATA",
      "freq": "Monday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "ge_d19_send",
      "phase": "ongoing",
      "day": 19,
      "n": "Send Cold Email Ramp-Up Batch",
      "role": "OBS",
      "freq": "Monday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d19_li",
      "phase": "ongoing",
      "day": 19,
      "n": "Send 40 LinkedIn Connection Requests (2 Profiles)",
      "role": "OBS",
      "freq": "Monday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d19_kw",
      "phase": "ongoing",
      "day": 19,
      "n": "Track Keyword Ranking Movement",
      "role": "SEO",
      "freq": "Monday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "ge_d19_sched",
      "phase": "ongoing",
      "day": 19,
      "n": "Schedule Weekly Content across Channels",
      "role": "SMM",
      "freq": "Monday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d19_ads",
      "phase": "ongoing",
      "day": 19,
      "n": "Check Meta and Google Ads Daily Health",
      "role": "ADS",
      "freq": "Monday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "ge_d20_scale",
      "phase": "ongoing",
      "day": 20,
      "n": "Scale Cold Email to Full Daily Volume",
      "role": "OBS",
      "priority": "high",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d20_send",
      "phase": "ongoing",
      "day": 20,
      "n": "Send Cold Email Batch (450 Sends)",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d20_reply_m",
      "phase": "ongoing",
      "day": 20,
      "n": "Morning Reply Triage",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "ge_d20_reply_e",
      "phase": "ongoing",
      "day": 20,
      "n": "Evening Reply Triage",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "ge_d20_reel",
      "phase": "ongoing",
      "day": 20,
      "n": "Produce Short-Form Video Reel",
      "role": "VE",
      "freq": "Tuesday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "ge_d20_li",
      "phase": "ongoing",
      "day": 20,
      "n": "Send 40 LinkedIn Connection Requests",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d20_ads",
      "phase": "ongoing",
      "day": 20,
      "n": "Audit Ad Acquisition Cost Metrics",
      "role": "ADS",
      "freq": "Tuesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "ge_d21_send",
      "phase": "ongoing",
      "day": 21,
      "n": "Send Cold Email Batch (450 Sends)",
      "role": "OBS",
      "freq": "Wednesday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d21_blog",
      "phase": "ongoing",
      "day": 21,
      "n": "Publish SEO Optimized Blog Post",
      "role": "CW",
      "freq": "Wednesday",
      "hours": "2h",
      "deps": []
    },
    {
      "id": "ge_d21_retarg",
      "phase": "ongoing",
      "day": 21,
      "n": "Refresh Retargeting Ad Creatives",
      "role": "ADS",
      "freq": "Wednesday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d21_li",
      "phase": "ongoing",
      "day": 21,
      "n": "Send LinkedIn Outbound DMs",
      "role": "OBS",
      "freq": "Wednesday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d21_reply",
      "phase": "ongoing",
      "day": 21,
      "n": "Process Meeting Calendar Bookings in GHL",
      "role": "OBS",
      "freq": "Wednesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "ge_d22_send",
      "phase": "ongoing",
      "day": 22,
      "n": "Send Cold Email Batch (450 Sends)",
      "role": "OBS",
      "freq": "Thursday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d22_backlink",
      "phase": "ongoing",
      "day": 22,
      "n": "Execute Backlink Outreach Pitching",
      "role": "SEO",
      "freq": "Thursday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "ge_d22_posts",
      "phase": "ongoing",
      "day": 22,
      "n": "Produce Weekly Post Batch Visuals",
      "role": "GD",
      "freq": "Thursday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "ge_d22_li",
      "phase": "ongoing",
      "day": 22,
      "n": "Send 40 LinkedIn Connection Requests",
      "role": "OBS",
      "freq": "Thursday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d22_calls",
      "phase": "ongoing",
      "day": 22,
      "n": "Confirm Scheduled Calls and Send Reminders",
      "role": "OBS",
      "freq": "Thursday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "ge_d22_ads",
      "phase": "ongoing",
      "day": 22,
      "n": "Optimize Google Search Keywords and Negative Terms",
      "role": "ADS",
      "freq": "Thursday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "ge_d23_send",
      "phase": "ongoing",
      "day": 23,
      "n": "Send Cold Email Batch (450 Sends)",
      "role": "OBS",
      "freq": "Friday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d23_seq",
      "phase": "ongoing",
      "day": 23,
      "n": "Analyze Sequence Conversion Rates by Angle",
      "role": "STRAT",
      "freq": "Friday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d23_gmb",
      "phase": "ongoing",
      "day": 23,
      "n": "Publish Google Business Profile Update",
      "role": "SEO",
      "freq": "Friday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "ge_d23_hyg",
      "phase": "ongoing",
      "day": 23,
      "n": "Audit GHL CRM Lead Automation",
      "role": "AUTO",
      "freq": "Friday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "ge_d24_comm",
      "phase": "ongoing",
      "day": 24,
      "n": "Manage Social Community Engagement",
      "role": "SMM",
      "freq": "Saturday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d25_kpi",
      "phase": "ongoing",
      "day": 25,
      "n": "Review Weekly KPI Scorecard",
      "role": "AM",
      "freq": "Monday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d25_box",
      "phase": "ongoing",
      "day": 25,
      "n": "Check Mailbox Health (18 Boxes)",
      "role": "AUTO",
      "freq": "Monday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "ge_d25_list",
      "phase": "ongoing",
      "day": 25,
      "n": "Build Weekly Verified Lead List (750 Contacts)",
      "role": "DATA",
      "freq": "Monday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "ge_d25_send",
      "phase": "ongoing",
      "day": 25,
      "n": "Send Cold Email Batch (450 Sends)",
      "role": "OBS",
      "freq": "Monday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d25_li",
      "phase": "ongoing",
      "day": 25,
      "n": "Send 40 LinkedIn Connection Requests (2 Profiles)",
      "role": "OBS",
      "freq": "Monday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d25_kw",
      "phase": "ongoing",
      "day": 25,
      "n": "Track Keyword Ranking Movement",
      "role": "SEO",
      "freq": "Monday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "ge_d25_sched",
      "phase": "ongoing",
      "day": 25,
      "n": "Schedule Weekly Content across Channels",
      "role": "SMM",
      "freq": "Monday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d25_ads",
      "phase": "ongoing",
      "day": 25,
      "n": "Check Meta and Google Ads Daily Health",
      "role": "ADS",
      "freq": "Monday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "ge_m25_cal",
      "phase": "ongoing",
      "day": 25,
      "n": "Submit Next Month Content Calendar for Client Approval",
      "role": "SMM",
      "priority": "normal",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d26_send",
      "phase": "ongoing",
      "day": 26,
      "n": "Send Cold Email Batch (450 Sends)",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d26_reply_m",
      "phase": "ongoing",
      "day": 26,
      "n": "Morning Reply Triage",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "ge_d26_reply_e",
      "phase": "ongoing",
      "day": 26,
      "n": "Evening Reply Triage",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "ge_d26_reel",
      "phase": "ongoing",
      "day": 26,
      "n": "Produce Short-Form Video Reel",
      "role": "VE",
      "freq": "Tuesday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "ge_d26_li",
      "phase": "ongoing",
      "day": 26,
      "n": "Send 40 LinkedIn Connection Requests",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d26_ads",
      "phase": "ongoing",
      "day": 26,
      "n": "Audit Ad Acquisition Cost Metrics",
      "role": "ADS",
      "freq": "Tuesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "ge_d27_send",
      "phase": "ongoing",
      "day": 27,
      "n": "Send Cold Email Batch (450 Sends)",
      "role": "OBS",
      "freq": "Wednesday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d27_blog",
      "phase": "ongoing",
      "day": 27,
      "n": "Publish SEO Optimized Blog Post",
      "role": "CW",
      "freq": "Wednesday",
      "hours": "2h",
      "deps": []
    },
    {
      "id": "ge_d27_retarg",
      "phase": "ongoing",
      "day": 27,
      "n": "Refresh Retargeting Ad Creatives",
      "role": "ADS",
      "freq": "Wednesday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d27_li",
      "phase": "ongoing",
      "day": 27,
      "n": "Send LinkedIn Outbound DMs",
      "role": "OBS",
      "freq": "Wednesday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d27_reply",
      "phase": "ongoing",
      "day": 27,
      "n": "Process Meeting Calendar Bookings in GHL",
      "role": "OBS",
      "freq": "Wednesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "ge_d28_send",
      "phase": "ongoing",
      "day": 28,
      "n": "Send Cold Email Batch (450 Sends)",
      "role": "OBS",
      "freq": "Thursday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d28_backlink",
      "phase": "ongoing",
      "day": 28,
      "n": "Execute Backlink Outreach Pitching",
      "role": "SEO",
      "freq": "Thursday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "ge_d28_posts",
      "phase": "ongoing",
      "day": 28,
      "n": "Produce Weekly Post Batch Visuals",
      "role": "GD",
      "freq": "Thursday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "ge_d28_li",
      "phase": "ongoing",
      "day": 28,
      "n": "Send 40 LinkedIn Connection Requests",
      "role": "OBS",
      "freq": "Thursday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d28_calls",
      "phase": "ongoing",
      "day": 28,
      "n": "Confirm Scheduled Calls and Send Reminders",
      "role": "OBS",
      "freq": "Thursday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "ge_d28_ads",
      "phase": "ongoing",
      "day": 28,
      "n": "Optimize Google Search Keywords and Negative Terms",
      "role": "ADS",
      "freq": "Thursday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "ge_d29_send",
      "phase": "ongoing",
      "day": 29,
      "n": "Send Cold Email Batch (450 Sends)",
      "role": "OBS",
      "freq": "Friday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d29_seq",
      "phase": "ongoing",
      "day": 29,
      "n": "Analyze Sequence Conversion Rates by Angle",
      "role": "STRAT",
      "freq": "Friday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d29_gmb",
      "phase": "ongoing",
      "day": 29,
      "n": "Publish Google Business Profile Update",
      "role": "SEO",
      "freq": "Friday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "ge_d29_hyg",
      "phase": "ongoing",
      "day": 29,
      "n": "Audit GHL CRM Lead Automation",
      "role": "AUTO",
      "freq": "Friday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "ge_d30_comm",
      "phase": "ongoing",
      "day": 30,
      "n": "Manage Social Community Engagement",
      "role": "SMM",
      "freq": "Saturday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d31_kpi",
      "phase": "ongoing",
      "day": 31,
      "n": "Review Weekly KPI Scorecard",
      "role": "AM",
      "freq": "Monday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d31_box",
      "phase": "ongoing",
      "day": 31,
      "n": "Check Mailbox Health (18 Boxes)",
      "role": "AUTO",
      "freq": "Monday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "ge_d31_list",
      "phase": "ongoing",
      "day": 31,
      "n": "Build Weekly Verified Lead List (750 Contacts)",
      "role": "DATA",
      "freq": "Monday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "ge_d31_send",
      "phase": "ongoing",
      "day": 31,
      "n": "Send Cold Email Batch (450 Sends)",
      "role": "OBS",
      "freq": "Monday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d31_li",
      "phase": "ongoing",
      "day": 31,
      "n": "Send 40 LinkedIn Connection Requests (2 Profiles)",
      "role": "OBS",
      "freq": "Monday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d31_kw",
      "phase": "ongoing",
      "day": 31,
      "n": "Track Keyword Ranking Movement",
      "role": "SEO",
      "freq": "Monday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "ge_d31_sched",
      "phase": "ongoing",
      "day": 31,
      "n": "Schedule Weekly Content across Channels",
      "role": "SMM",
      "freq": "Monday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d31_ads",
      "phase": "ongoing",
      "day": 31,
      "n": "Check Meta and Google Ads Daily Health",
      "role": "ADS",
      "freq": "Monday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "ge_d32_send",
      "phase": "ongoing",
      "day": 32,
      "n": "Send Cold Email Batch (450 Sends)",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d32_reply_m",
      "phase": "ongoing",
      "day": 32,
      "n": "Morning Reply Triage",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "ge_d32_reply_e",
      "phase": "ongoing",
      "day": 32,
      "n": "Evening Reply Triage",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "ge_d32_reel",
      "phase": "ongoing",
      "day": 32,
      "n": "Produce Short-Form Video Reel",
      "role": "VE",
      "freq": "Tuesday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "ge_d32_li",
      "phase": "ongoing",
      "day": 32,
      "n": "Send 40 LinkedIn Connection Requests",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d32_ads",
      "phase": "ongoing",
      "day": 32,
      "n": "Audit Ad Acquisition Cost Metrics",
      "role": "ADS",
      "freq": "Tuesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "ge_d33_send",
      "phase": "ongoing",
      "day": 33,
      "n": "Send Cold Email Batch (450 Sends)",
      "role": "OBS",
      "freq": "Wednesday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d33_blog",
      "phase": "ongoing",
      "day": 33,
      "n": "Publish SEO Optimized Blog Post",
      "role": "CW",
      "freq": "Wednesday",
      "hours": "2h",
      "deps": []
    },
    {
      "id": "ge_d33_retarg",
      "phase": "ongoing",
      "day": 33,
      "n": "Refresh Retargeting Ad Creatives",
      "role": "ADS",
      "freq": "Wednesday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d33_li",
      "phase": "ongoing",
      "day": 33,
      "n": "Send LinkedIn Outbound DMs",
      "role": "OBS",
      "freq": "Wednesday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d33_reply",
      "phase": "ongoing",
      "day": 33,
      "n": "Process Meeting Calendar Bookings in GHL",
      "role": "OBS",
      "freq": "Wednesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "ge_d34_send",
      "phase": "ongoing",
      "day": 34,
      "n": "Send Cold Email Batch (450 Sends)",
      "role": "OBS",
      "freq": "Thursday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d34_backlink",
      "phase": "ongoing",
      "day": 34,
      "n": "Execute Backlink Outreach Pitching",
      "role": "SEO",
      "freq": "Thursday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "ge_d34_posts",
      "phase": "ongoing",
      "day": 34,
      "n": "Produce Weekly Post Batch Visuals",
      "role": "GD",
      "freq": "Thursday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "ge_d34_li",
      "phase": "ongoing",
      "day": 34,
      "n": "Send 40 LinkedIn Connection Requests",
      "role": "OBS",
      "freq": "Thursday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d34_calls",
      "phase": "ongoing",
      "day": 34,
      "n": "Confirm Scheduled Calls and Send Reminders",
      "role": "OBS",
      "freq": "Thursday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "ge_d34_ads",
      "phase": "ongoing",
      "day": 34,
      "n": "Optimize Google Search Keywords and Negative Terms",
      "role": "ADS",
      "freq": "Thursday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "ge_d35_send",
      "phase": "ongoing",
      "day": 35,
      "n": "Send Cold Email Batch (450 Sends)",
      "role": "OBS",
      "freq": "Friday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d35_seq",
      "phase": "ongoing",
      "day": 35,
      "n": "Analyze Sequence Conversion Rates by Angle",
      "role": "STRAT",
      "freq": "Friday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d35_gmb",
      "phase": "ongoing",
      "day": 35,
      "n": "Publish Google Business Profile Update",
      "role": "SEO",
      "freq": "Friday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "ge_d35_hyg",
      "phase": "ongoing",
      "day": 35,
      "n": "Audit GHL CRM Lead Automation",
      "role": "AUTO",
      "freq": "Friday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "ge_d36_comm",
      "phase": "ongoing",
      "day": 36,
      "n": "Manage Social Community Engagement",
      "role": "SMM",
      "freq": "Saturday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d37_kpi",
      "phase": "ongoing",
      "day": 37,
      "n": "Review Weekly KPI Scorecard",
      "role": "AM",
      "freq": "Monday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d37_box",
      "phase": "ongoing",
      "day": 37,
      "n": "Check Mailbox Health (18 Boxes)",
      "role": "AUTO",
      "freq": "Monday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "ge_d37_list",
      "phase": "ongoing",
      "day": 37,
      "n": "Build Weekly Verified Lead List (750 Contacts)",
      "role": "DATA",
      "freq": "Monday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "ge_d37_send",
      "phase": "ongoing",
      "day": 37,
      "n": "Send Cold Email Batch (450 Sends)",
      "role": "OBS",
      "freq": "Monday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d37_li",
      "phase": "ongoing",
      "day": 37,
      "n": "Send 40 LinkedIn Connection Requests (2 Profiles)",
      "role": "OBS",
      "freq": "Monday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d37_kw",
      "phase": "ongoing",
      "day": 37,
      "n": "Track Keyword Ranking Movement",
      "role": "SEO",
      "freq": "Monday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "ge_d37_sched",
      "phase": "ongoing",
      "day": 37,
      "n": "Schedule Weekly Content across Channels",
      "role": "SMM",
      "freq": "Monday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d37_ads",
      "phase": "ongoing",
      "day": 37,
      "n": "Check Meta and Google Ads Daily Health",
      "role": "ADS",
      "freq": "Monday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "ge_d38_send",
      "phase": "ongoing",
      "day": 38,
      "n": "Send Cold Email Batch (450 Sends)",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d38_reply_m",
      "phase": "ongoing",
      "day": 38,
      "n": "Morning Reply Triage",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "ge_d38_reply_e",
      "phase": "ongoing",
      "day": 38,
      "n": "Evening Reply Triage",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "ge_d38_reel",
      "phase": "ongoing",
      "day": 38,
      "n": "Produce Short-Form Video Reel",
      "role": "VE",
      "freq": "Tuesday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "ge_d38_li",
      "phase": "ongoing",
      "day": 38,
      "n": "Send 40 LinkedIn Connection Requests",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d38_ads",
      "phase": "ongoing",
      "day": 38,
      "n": "Audit Ad Acquisition Cost Metrics",
      "role": "ADS",
      "freq": "Tuesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "ge_d39_send",
      "phase": "ongoing",
      "day": 39,
      "n": "Send Cold Email Batch (450 Sends)",
      "role": "OBS",
      "freq": "Wednesday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d39_blog",
      "phase": "ongoing",
      "day": 39,
      "n": "Publish SEO Optimized Blog Post",
      "role": "CW",
      "freq": "Wednesday",
      "hours": "2h",
      "deps": []
    },
    {
      "id": "ge_d39_retarg",
      "phase": "ongoing",
      "day": 39,
      "n": "Refresh Retargeting Ad Creatives",
      "role": "ADS",
      "freq": "Wednesday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d39_li",
      "phase": "ongoing",
      "day": 39,
      "n": "Send LinkedIn Outbound DMs",
      "role": "OBS",
      "freq": "Wednesday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d39_reply",
      "phase": "ongoing",
      "day": 39,
      "n": "Process Meeting Calendar Bookings in GHL",
      "role": "OBS",
      "freq": "Wednesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "ge_d40_send",
      "phase": "ongoing",
      "day": 40,
      "n": "Send Cold Email Batch (450 Sends)",
      "role": "OBS",
      "freq": "Thursday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d40_backlink",
      "phase": "ongoing",
      "day": 40,
      "n": "Execute Backlink Outreach Pitching",
      "role": "SEO",
      "freq": "Thursday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "ge_d40_posts",
      "phase": "ongoing",
      "day": 40,
      "n": "Produce Weekly Post Batch Visuals",
      "role": "GD",
      "freq": "Thursday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "ge_d40_li",
      "phase": "ongoing",
      "day": 40,
      "n": "Send 40 LinkedIn Connection Requests",
      "role": "OBS",
      "freq": "Thursday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d40_calls",
      "phase": "ongoing",
      "day": 40,
      "n": "Confirm Scheduled Calls and Send Reminders",
      "role": "OBS",
      "freq": "Thursday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "ge_d40_ads",
      "phase": "ongoing",
      "day": 40,
      "n": "Optimize Google Search Keywords and Negative Terms",
      "role": "ADS",
      "freq": "Thursday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "ge_d41_send",
      "phase": "ongoing",
      "day": 41,
      "n": "Send Cold Email Batch (450 Sends)",
      "role": "OBS",
      "freq": "Friday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d41_seq",
      "phase": "ongoing",
      "day": 41,
      "n": "Analyze Sequence Conversion Rates by Angle",
      "role": "STRAT",
      "freq": "Friday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d41_gmb",
      "phase": "ongoing",
      "day": 41,
      "n": "Publish Google Business Profile Update",
      "role": "SEO",
      "freq": "Friday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "ge_d41_hyg",
      "phase": "ongoing",
      "day": 41,
      "n": "Audit GHL CRM Lead Automation",
      "role": "AUTO",
      "freq": "Friday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "ge_d42_comm",
      "phase": "ongoing",
      "day": 42,
      "n": "Manage Social Community Engagement",
      "role": "SMM",
      "freq": "Saturday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d43_kpi",
      "phase": "ongoing",
      "day": 43,
      "n": "Review Weekly KPI Scorecard",
      "role": "AM",
      "freq": "Monday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d43_box",
      "phase": "ongoing",
      "day": 43,
      "n": "Check Mailbox Health (18 Boxes)",
      "role": "AUTO",
      "freq": "Monday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "ge_d43_list",
      "phase": "ongoing",
      "day": 43,
      "n": "Build Weekly Verified Lead List (750 Contacts)",
      "role": "DATA",
      "freq": "Monday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "ge_d43_send",
      "phase": "ongoing",
      "day": 43,
      "n": "Send Cold Email Batch (450 Sends)",
      "role": "OBS",
      "freq": "Monday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d43_li",
      "phase": "ongoing",
      "day": 43,
      "n": "Send 40 LinkedIn Connection Requests (2 Profiles)",
      "role": "OBS",
      "freq": "Monday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d43_kw",
      "phase": "ongoing",
      "day": 43,
      "n": "Track Keyword Ranking Movement",
      "role": "SEO",
      "freq": "Monday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "ge_d43_sched",
      "phase": "ongoing",
      "day": 43,
      "n": "Schedule Weekly Content across Channels",
      "role": "SMM",
      "freq": "Monday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d43_ads",
      "phase": "ongoing",
      "day": 43,
      "n": "Check Meta and Google Ads Daily Health",
      "role": "ADS",
      "freq": "Monday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "ge_d44_send",
      "phase": "ongoing",
      "day": 44,
      "n": "Send Cold Email Batch (450 Sends)",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d44_reply_m",
      "phase": "ongoing",
      "day": 44,
      "n": "Morning Reply Triage",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "ge_d44_reply_e",
      "phase": "ongoing",
      "day": 44,
      "n": "Evening Reply Triage",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "ge_d44_reel",
      "phase": "ongoing",
      "day": 44,
      "n": "Produce Short-Form Video Reel",
      "role": "VE",
      "freq": "Tuesday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "ge_d44_li",
      "phase": "ongoing",
      "day": 44,
      "n": "Send 40 LinkedIn Connection Requests",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d44_ads",
      "phase": "ongoing",
      "day": 44,
      "n": "Audit Ad Acquisition Cost Metrics",
      "role": "ADS",
      "freq": "Tuesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "ge_d45_send",
      "phase": "ongoing",
      "day": 45,
      "n": "Send Cold Email Batch (450 Sends)",
      "role": "OBS",
      "freq": "Wednesday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d45_blog",
      "phase": "ongoing",
      "day": 45,
      "n": "Publish SEO Optimized Blog Post",
      "role": "CW",
      "freq": "Wednesday",
      "hours": "2h",
      "deps": []
    },
    {
      "id": "ge_d45_retarg",
      "phase": "ongoing",
      "day": 45,
      "n": "Refresh Retargeting Ad Creatives",
      "role": "ADS",
      "freq": "Wednesday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d45_li",
      "phase": "ongoing",
      "day": 45,
      "n": "Send LinkedIn Outbound DMs",
      "role": "OBS",
      "freq": "Wednesday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d45_reply",
      "phase": "ongoing",
      "day": 45,
      "n": "Process Meeting Calendar Bookings in GHL",
      "role": "OBS",
      "freq": "Wednesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "ge_d46_send",
      "phase": "ongoing",
      "day": 46,
      "n": "Send Cold Email Batch (450 Sends)",
      "role": "OBS",
      "freq": "Thursday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d46_backlink",
      "phase": "ongoing",
      "day": 46,
      "n": "Execute Backlink Outreach Pitching",
      "role": "SEO",
      "freq": "Thursday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "ge_d46_posts",
      "phase": "ongoing",
      "day": 46,
      "n": "Produce Weekly Post Batch Visuals",
      "role": "GD",
      "freq": "Thursday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "ge_d46_li",
      "phase": "ongoing",
      "day": 46,
      "n": "Send 40 LinkedIn Connection Requests",
      "role": "OBS",
      "freq": "Thursday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d46_calls",
      "phase": "ongoing",
      "day": 46,
      "n": "Confirm Scheduled Calls and Send Reminders",
      "role": "OBS",
      "freq": "Thursday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "ge_d46_ads",
      "phase": "ongoing",
      "day": 46,
      "n": "Optimize Google Search Keywords and Negative Terms",
      "role": "ADS",
      "freq": "Thursday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "ge_d47_send",
      "phase": "ongoing",
      "day": 47,
      "n": "Send Cold Email Batch (450 Sends)",
      "role": "OBS",
      "freq": "Friday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d47_seq",
      "phase": "ongoing",
      "day": 47,
      "n": "Analyze Sequence Conversion Rates by Angle",
      "role": "STRAT",
      "freq": "Friday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d47_gmb",
      "phase": "ongoing",
      "day": 47,
      "n": "Publish Google Business Profile Update",
      "role": "SEO",
      "freq": "Friday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "ge_d47_hyg",
      "phase": "ongoing",
      "day": 47,
      "n": "Audit GHL CRM Lead Automation",
      "role": "AUTO",
      "freq": "Friday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "ge_d48_comm",
      "phase": "ongoing",
      "day": 48,
      "n": "Manage Social Community Engagement",
      "role": "SMM",
      "freq": "Saturday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d49_kpi",
      "phase": "ongoing",
      "day": 49,
      "n": "Review Weekly KPI Scorecard",
      "role": "AM",
      "freq": "Monday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d49_box",
      "phase": "ongoing",
      "day": 49,
      "n": "Check Mailbox Health (18 Boxes)",
      "role": "AUTO",
      "freq": "Monday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "ge_d49_list",
      "phase": "ongoing",
      "day": 49,
      "n": "Build Weekly Verified Lead List (750 Contacts)",
      "role": "DATA",
      "freq": "Monday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "ge_d49_send",
      "phase": "ongoing",
      "day": 49,
      "n": "Send Cold Email Batch (450 Sends)",
      "role": "OBS",
      "freq": "Monday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d49_li",
      "phase": "ongoing",
      "day": 49,
      "n": "Send 40 LinkedIn Connection Requests (2 Profiles)",
      "role": "OBS",
      "freq": "Monday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d49_kw",
      "phase": "ongoing",
      "day": 49,
      "n": "Track Keyword Ranking Movement",
      "role": "SEO",
      "freq": "Monday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "ge_d49_sched",
      "phase": "ongoing",
      "day": 49,
      "n": "Schedule Weekly Content across Channels",
      "role": "SMM",
      "freq": "Monday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d49_ads",
      "phase": "ongoing",
      "day": 49,
      "n": "Check Meta and Google Ads Daily Health",
      "role": "ADS",
      "freq": "Monday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "ge_d50_send",
      "phase": "ongoing",
      "day": 50,
      "n": "Send Cold Email Batch (450 Sends)",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d50_reply_m",
      "phase": "ongoing",
      "day": 50,
      "n": "Morning Reply Triage",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "ge_d50_reply_e",
      "phase": "ongoing",
      "day": 50,
      "n": "Evening Reply Triage",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "ge_d50_reel",
      "phase": "ongoing",
      "day": 50,
      "n": "Produce Short-Form Video Reel",
      "role": "VE",
      "freq": "Tuesday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "ge_d50_li",
      "phase": "ongoing",
      "day": 50,
      "n": "Send 40 LinkedIn Connection Requests",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d50_ads",
      "phase": "ongoing",
      "day": 50,
      "n": "Audit Ad Acquisition Cost Metrics",
      "role": "ADS",
      "freq": "Tuesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "ge_d51_send",
      "phase": "ongoing",
      "day": 51,
      "n": "Send Cold Email Batch (450 Sends)",
      "role": "OBS",
      "freq": "Wednesday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d51_blog",
      "phase": "ongoing",
      "day": 51,
      "n": "Publish SEO Optimized Blog Post",
      "role": "CW",
      "freq": "Wednesday",
      "hours": "2h",
      "deps": []
    },
    {
      "id": "ge_d51_retarg",
      "phase": "ongoing",
      "day": 51,
      "n": "Refresh Retargeting Ad Creatives",
      "role": "ADS",
      "freq": "Wednesday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d51_li",
      "phase": "ongoing",
      "day": 51,
      "n": "Send LinkedIn Outbound DMs",
      "role": "OBS",
      "freq": "Wednesday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d51_reply",
      "phase": "ongoing",
      "day": 51,
      "n": "Process Meeting Calendar Bookings in GHL",
      "role": "OBS",
      "freq": "Wednesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "ge_d52_send",
      "phase": "ongoing",
      "day": 52,
      "n": "Send Cold Email Batch (450 Sends)",
      "role": "OBS",
      "freq": "Thursday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d52_backlink",
      "phase": "ongoing",
      "day": 52,
      "n": "Execute Backlink Outreach Pitching",
      "role": "SEO",
      "freq": "Thursday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "ge_d52_posts",
      "phase": "ongoing",
      "day": 52,
      "n": "Produce Weekly Post Batch Visuals",
      "role": "GD",
      "freq": "Thursday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "ge_d52_li",
      "phase": "ongoing",
      "day": 52,
      "n": "Send 40 LinkedIn Connection Requests",
      "role": "OBS",
      "freq": "Thursday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d52_calls",
      "phase": "ongoing",
      "day": 52,
      "n": "Confirm Scheduled Calls and Send Reminders",
      "role": "OBS",
      "freq": "Thursday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "ge_d52_ads",
      "phase": "ongoing",
      "day": 52,
      "n": "Optimize Google Search Keywords and Negative Terms",
      "role": "ADS",
      "freq": "Thursday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "ge_d53_send",
      "phase": "ongoing",
      "day": 53,
      "n": "Send Cold Email Batch (450 Sends)",
      "role": "OBS",
      "freq": "Friday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d53_seq",
      "phase": "ongoing",
      "day": 53,
      "n": "Analyze Sequence Conversion Rates by Angle",
      "role": "STRAT",
      "freq": "Friday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d53_gmb",
      "phase": "ongoing",
      "day": 53,
      "n": "Publish Google Business Profile Update",
      "role": "SEO",
      "freq": "Friday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "ge_d53_hyg",
      "phase": "ongoing",
      "day": 53,
      "n": "Audit GHL CRM Lead Automation",
      "role": "AUTO",
      "freq": "Friday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "ge_d54_comm",
      "phase": "ongoing",
      "day": 54,
      "n": "Manage Social Community Engagement",
      "role": "SMM",
      "freq": "Saturday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d55_kpi",
      "phase": "ongoing",
      "day": 55,
      "n": "Review Weekly KPI Scorecard",
      "role": "AM",
      "freq": "Monday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d55_box",
      "phase": "ongoing",
      "day": 55,
      "n": "Check Mailbox Health (18 Boxes)",
      "role": "AUTO",
      "freq": "Monday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "ge_d55_list",
      "phase": "ongoing",
      "day": 55,
      "n": "Build Weekly Verified Lead List (750 Contacts)",
      "role": "DATA",
      "freq": "Monday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "ge_d55_send",
      "phase": "ongoing",
      "day": 55,
      "n": "Send Cold Email Batch (450 Sends)",
      "role": "OBS",
      "freq": "Monday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d55_li",
      "phase": "ongoing",
      "day": 55,
      "n": "Send 40 LinkedIn Connection Requests (2 Profiles)",
      "role": "OBS",
      "freq": "Monday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d55_kw",
      "phase": "ongoing",
      "day": 55,
      "n": "Track Keyword Ranking Movement",
      "role": "SEO",
      "freq": "Monday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "ge_d55_sched",
      "phase": "ongoing",
      "day": 55,
      "n": "Schedule Weekly Content across Channels",
      "role": "SMM",
      "freq": "Monday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d55_ads",
      "phase": "ongoing",
      "day": 55,
      "n": "Check Meta and Google Ads Daily Health",
      "role": "ADS",
      "freq": "Monday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "ge_m55_cal",
      "phase": "ongoing",
      "day": 55,
      "n": "Submit Next Month Content Calendar for Client Approval",
      "role": "SMM",
      "priority": "normal",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d56_send",
      "phase": "ongoing",
      "day": 56,
      "n": "Send Cold Email Batch (450 Sends)",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d56_reply_m",
      "phase": "ongoing",
      "day": 56,
      "n": "Morning Reply Triage",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "ge_d56_reply_e",
      "phase": "ongoing",
      "day": 56,
      "n": "Evening Reply Triage",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "ge_d56_reel",
      "phase": "ongoing",
      "day": 56,
      "n": "Produce Short-Form Video Reel",
      "role": "VE",
      "freq": "Tuesday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "ge_d56_li",
      "phase": "ongoing",
      "day": 56,
      "n": "Send 40 LinkedIn Connection Requests",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d56_ads",
      "phase": "ongoing",
      "day": 56,
      "n": "Audit Ad Acquisition Cost Metrics",
      "role": "ADS",
      "freq": "Tuesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "ge_d57_send",
      "phase": "ongoing",
      "day": 57,
      "n": "Send Cold Email Batch (450 Sends)",
      "role": "OBS",
      "freq": "Wednesday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d57_blog",
      "phase": "ongoing",
      "day": 57,
      "n": "Publish SEO Optimized Blog Post",
      "role": "CW",
      "freq": "Wednesday",
      "hours": "2h",
      "deps": []
    },
    {
      "id": "ge_d57_retarg",
      "phase": "ongoing",
      "day": 57,
      "n": "Refresh Retargeting Ad Creatives",
      "role": "ADS",
      "freq": "Wednesday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d57_li",
      "phase": "ongoing",
      "day": 57,
      "n": "Send LinkedIn Outbound DMs",
      "role": "OBS",
      "freq": "Wednesday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d57_reply",
      "phase": "ongoing",
      "day": 57,
      "n": "Process Meeting Calendar Bookings in GHL",
      "role": "OBS",
      "freq": "Wednesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "ge_d58_send",
      "phase": "ongoing",
      "day": 58,
      "n": "Send Cold Email Batch (450 Sends)",
      "role": "OBS",
      "freq": "Thursday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d58_backlink",
      "phase": "ongoing",
      "day": 58,
      "n": "Execute Backlink Outreach Pitching",
      "role": "SEO",
      "freq": "Thursday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "ge_d58_posts",
      "phase": "ongoing",
      "day": 58,
      "n": "Produce Weekly Post Batch Visuals",
      "role": "GD",
      "freq": "Thursday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "ge_d58_li",
      "phase": "ongoing",
      "day": 58,
      "n": "Send 40 LinkedIn Connection Requests",
      "role": "OBS",
      "freq": "Thursday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d58_calls",
      "phase": "ongoing",
      "day": 58,
      "n": "Confirm Scheduled Calls and Send Reminders",
      "role": "OBS",
      "freq": "Thursday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "ge_d58_ads",
      "phase": "ongoing",
      "day": 58,
      "n": "Optimize Google Search Keywords and Negative Terms",
      "role": "ADS",
      "freq": "Thursday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "ge_d59_send",
      "phase": "ongoing",
      "day": 59,
      "n": "Send Cold Email Batch (450 Sends)",
      "role": "OBS",
      "freq": "Friday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d59_seq",
      "phase": "ongoing",
      "day": 59,
      "n": "Analyze Sequence Conversion Rates by Angle",
      "role": "STRAT",
      "freq": "Friday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d59_gmb",
      "phase": "ongoing",
      "day": 59,
      "n": "Publish Google Business Profile Update",
      "role": "SEO",
      "freq": "Friday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "ge_d59_hyg",
      "phase": "ongoing",
      "day": 59,
      "n": "Audit GHL CRM Lead Automation",
      "role": "AUTO",
      "freq": "Friday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "ge_d60_comm",
      "phase": "ongoing",
      "day": 60,
      "n": "Manage Social Community Engagement",
      "role": "SMM",
      "freq": "Saturday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d61_kpi",
      "phase": "ongoing",
      "day": 61,
      "n": "Review Weekly KPI Scorecard",
      "role": "AM",
      "freq": "Monday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d61_box",
      "phase": "ongoing",
      "day": 61,
      "n": "Check Mailbox Health (18 Boxes)",
      "role": "AUTO",
      "freq": "Monday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "ge_d61_list",
      "phase": "ongoing",
      "day": 61,
      "n": "Build Weekly Verified Lead List (750 Contacts)",
      "role": "DATA",
      "freq": "Monday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "ge_d61_send",
      "phase": "ongoing",
      "day": 61,
      "n": "Send Cold Email Batch (450 Sends)",
      "role": "OBS",
      "freq": "Monday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d61_li",
      "phase": "ongoing",
      "day": 61,
      "n": "Send 40 LinkedIn Connection Requests (2 Profiles)",
      "role": "OBS",
      "freq": "Monday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d61_kw",
      "phase": "ongoing",
      "day": 61,
      "n": "Track Keyword Ranking Movement",
      "role": "SEO",
      "freq": "Monday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "ge_d61_sched",
      "phase": "ongoing",
      "day": 61,
      "n": "Schedule Weekly Content across Channels",
      "role": "SMM",
      "freq": "Monday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d61_ads",
      "phase": "ongoing",
      "day": 61,
      "n": "Check Meta and Google Ads Daily Health",
      "role": "ADS",
      "freq": "Monday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "ge_d62_send",
      "phase": "ongoing",
      "day": 62,
      "n": "Send Cold Email Batch (450 Sends)",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d62_reply_m",
      "phase": "ongoing",
      "day": 62,
      "n": "Morning Reply Triage",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "ge_d62_reply_e",
      "phase": "ongoing",
      "day": 62,
      "n": "Evening Reply Triage",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "ge_d62_reel",
      "phase": "ongoing",
      "day": 62,
      "n": "Produce Short-Form Video Reel",
      "role": "VE",
      "freq": "Tuesday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "ge_d62_li",
      "phase": "ongoing",
      "day": 62,
      "n": "Send 40 LinkedIn Connection Requests",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d62_ads",
      "phase": "ongoing",
      "day": 62,
      "n": "Audit Ad Acquisition Cost Metrics",
      "role": "ADS",
      "freq": "Tuesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "ge_d63_send",
      "phase": "ongoing",
      "day": 63,
      "n": "Send Cold Email Batch (450 Sends)",
      "role": "OBS",
      "freq": "Wednesday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d63_blog",
      "phase": "ongoing",
      "day": 63,
      "n": "Publish SEO Optimized Blog Post",
      "role": "CW",
      "freq": "Wednesday",
      "hours": "2h",
      "deps": []
    },
    {
      "id": "ge_d63_retarg",
      "phase": "ongoing",
      "day": 63,
      "n": "Refresh Retargeting Ad Creatives",
      "role": "ADS",
      "freq": "Wednesday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d63_li",
      "phase": "ongoing",
      "day": 63,
      "n": "Send LinkedIn Outbound DMs",
      "role": "OBS",
      "freq": "Wednesday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d63_reply",
      "phase": "ongoing",
      "day": 63,
      "n": "Process Meeting Calendar Bookings in GHL",
      "role": "OBS",
      "freq": "Wednesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "ge_d64_send",
      "phase": "ongoing",
      "day": 64,
      "n": "Send Cold Email Batch (450 Sends)",
      "role": "OBS",
      "freq": "Thursday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d64_backlink",
      "phase": "ongoing",
      "day": 64,
      "n": "Execute Backlink Outreach Pitching",
      "role": "SEO",
      "freq": "Thursday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "ge_d64_posts",
      "phase": "ongoing",
      "day": 64,
      "n": "Produce Weekly Post Batch Visuals",
      "role": "GD",
      "freq": "Thursday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "ge_d64_li",
      "phase": "ongoing",
      "day": 64,
      "n": "Send 40 LinkedIn Connection Requests",
      "role": "OBS",
      "freq": "Thursday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d64_calls",
      "phase": "ongoing",
      "day": 64,
      "n": "Confirm Scheduled Calls and Send Reminders",
      "role": "OBS",
      "freq": "Thursday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "ge_d64_ads",
      "phase": "ongoing",
      "day": 64,
      "n": "Optimize Google Search Keywords and Negative Terms",
      "role": "ADS",
      "freq": "Thursday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "ge_d65_send",
      "phase": "ongoing",
      "day": 65,
      "n": "Send Cold Email Batch (450 Sends)",
      "role": "OBS",
      "freq": "Friday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d65_seq",
      "phase": "ongoing",
      "day": 65,
      "n": "Analyze Sequence Conversion Rates by Angle",
      "role": "STRAT",
      "freq": "Friday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d65_gmb",
      "phase": "ongoing",
      "day": 65,
      "n": "Publish Google Business Profile Update",
      "role": "SEO",
      "freq": "Friday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "ge_d65_hyg",
      "phase": "ongoing",
      "day": 65,
      "n": "Audit GHL CRM Lead Automation",
      "role": "AUTO",
      "freq": "Friday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "ge_d66_comm",
      "phase": "ongoing",
      "day": 66,
      "n": "Manage Social Community Engagement",
      "role": "SMM",
      "freq": "Saturday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d67_kpi",
      "phase": "ongoing",
      "day": 67,
      "n": "Review Weekly KPI Scorecard",
      "role": "AM",
      "freq": "Monday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d67_box",
      "phase": "ongoing",
      "day": 67,
      "n": "Check Mailbox Health (18 Boxes)",
      "role": "AUTO",
      "freq": "Monday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "ge_d67_list",
      "phase": "ongoing",
      "day": 67,
      "n": "Build Weekly Verified Lead List (750 Contacts)",
      "role": "DATA",
      "freq": "Monday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "ge_d67_send",
      "phase": "ongoing",
      "day": 67,
      "n": "Send Cold Email Batch (450 Sends)",
      "role": "OBS",
      "freq": "Monday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d67_li",
      "phase": "ongoing",
      "day": 67,
      "n": "Send 40 LinkedIn Connection Requests (2 Profiles)",
      "role": "OBS",
      "freq": "Monday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d67_kw",
      "phase": "ongoing",
      "day": 67,
      "n": "Track Keyword Ranking Movement",
      "role": "SEO",
      "freq": "Monday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "ge_d67_sched",
      "phase": "ongoing",
      "day": 67,
      "n": "Schedule Weekly Content across Channels",
      "role": "SMM",
      "freq": "Monday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d67_ads",
      "phase": "ongoing",
      "day": 67,
      "n": "Check Meta and Google Ads Daily Health",
      "role": "ADS",
      "freq": "Monday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "ge_d68_send",
      "phase": "ongoing",
      "day": 68,
      "n": "Send Cold Email Batch (450 Sends)",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d68_reply_m",
      "phase": "ongoing",
      "day": 68,
      "n": "Morning Reply Triage",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "ge_d68_reply_e",
      "phase": "ongoing",
      "day": 68,
      "n": "Evening Reply Triage",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "ge_d68_reel",
      "phase": "ongoing",
      "day": 68,
      "n": "Produce Short-Form Video Reel",
      "role": "VE",
      "freq": "Tuesday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "ge_d68_li",
      "phase": "ongoing",
      "day": 68,
      "n": "Send 40 LinkedIn Connection Requests",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d68_ads",
      "phase": "ongoing",
      "day": 68,
      "n": "Audit Ad Acquisition Cost Metrics",
      "role": "ADS",
      "freq": "Tuesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "ge_d69_send",
      "phase": "ongoing",
      "day": 69,
      "n": "Send Cold Email Batch (450 Sends)",
      "role": "OBS",
      "freq": "Wednesday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d69_blog",
      "phase": "ongoing",
      "day": 69,
      "n": "Publish SEO Optimized Blog Post",
      "role": "CW",
      "freq": "Wednesday",
      "hours": "2h",
      "deps": []
    },
    {
      "id": "ge_d69_retarg",
      "phase": "ongoing",
      "day": 69,
      "n": "Refresh Retargeting Ad Creatives",
      "role": "ADS",
      "freq": "Wednesday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d69_li",
      "phase": "ongoing",
      "day": 69,
      "n": "Send LinkedIn Outbound DMs",
      "role": "OBS",
      "freq": "Wednesday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d69_reply",
      "phase": "ongoing",
      "day": 69,
      "n": "Process Meeting Calendar Bookings in GHL",
      "role": "OBS",
      "freq": "Wednesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "ge_d70_send",
      "phase": "ongoing",
      "day": 70,
      "n": "Send Cold Email Batch (450 Sends)",
      "role": "OBS",
      "freq": "Thursday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d70_backlink",
      "phase": "ongoing",
      "day": 70,
      "n": "Execute Backlink Outreach Pitching",
      "role": "SEO",
      "freq": "Thursday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "ge_d70_posts",
      "phase": "ongoing",
      "day": 70,
      "n": "Produce Weekly Post Batch Visuals",
      "role": "GD",
      "freq": "Thursday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "ge_d70_li",
      "phase": "ongoing",
      "day": 70,
      "n": "Send 40 LinkedIn Connection Requests",
      "role": "OBS",
      "freq": "Thursday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d70_calls",
      "phase": "ongoing",
      "day": 70,
      "n": "Confirm Scheduled Calls and Send Reminders",
      "role": "OBS",
      "freq": "Thursday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "ge_d70_ads",
      "phase": "ongoing",
      "day": 70,
      "n": "Optimize Google Search Keywords and Negative Terms",
      "role": "ADS",
      "freq": "Thursday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "ge_d71_send",
      "phase": "ongoing",
      "day": 71,
      "n": "Send Cold Email Batch (450 Sends)",
      "role": "OBS",
      "freq": "Friday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d71_seq",
      "phase": "ongoing",
      "day": 71,
      "n": "Analyze Sequence Conversion Rates by Angle",
      "role": "STRAT",
      "freq": "Friday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d71_gmb",
      "phase": "ongoing",
      "day": 71,
      "n": "Publish Google Business Profile Update",
      "role": "SEO",
      "freq": "Friday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "ge_d71_hyg",
      "phase": "ongoing",
      "day": 71,
      "n": "Audit GHL CRM Lead Automation",
      "role": "AUTO",
      "freq": "Friday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "ge_d72_comm",
      "phase": "ongoing",
      "day": 72,
      "n": "Manage Social Community Engagement",
      "role": "SMM",
      "freq": "Saturday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d73_kpi",
      "phase": "ongoing",
      "day": 73,
      "n": "Review Weekly KPI Scorecard",
      "role": "AM",
      "freq": "Monday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d73_box",
      "phase": "ongoing",
      "day": 73,
      "n": "Check Mailbox Health (18 Boxes)",
      "role": "AUTO",
      "freq": "Monday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "ge_d73_list",
      "phase": "ongoing",
      "day": 73,
      "n": "Build Weekly Verified Lead List (750 Contacts)",
      "role": "DATA",
      "freq": "Monday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "ge_d73_send",
      "phase": "ongoing",
      "day": 73,
      "n": "Send Cold Email Batch (450 Sends)",
      "role": "OBS",
      "freq": "Monday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d73_li",
      "phase": "ongoing",
      "day": 73,
      "n": "Send 40 LinkedIn Connection Requests (2 Profiles)",
      "role": "OBS",
      "freq": "Monday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d73_kw",
      "phase": "ongoing",
      "day": 73,
      "n": "Track Keyword Ranking Movement",
      "role": "SEO",
      "freq": "Monday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "ge_d73_sched",
      "phase": "ongoing",
      "day": 73,
      "n": "Schedule Weekly Content across Channels",
      "role": "SMM",
      "freq": "Monday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d73_ads",
      "phase": "ongoing",
      "day": 73,
      "n": "Check Meta and Google Ads Daily Health",
      "role": "ADS",
      "freq": "Monday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "ge_d74_send",
      "phase": "ongoing",
      "day": 74,
      "n": "Send Cold Email Batch (450 Sends)",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d74_reply_m",
      "phase": "ongoing",
      "day": 74,
      "n": "Morning Reply Triage",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "ge_d74_reply_e",
      "phase": "ongoing",
      "day": 74,
      "n": "Evening Reply Triage",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "ge_d74_reel",
      "phase": "ongoing",
      "day": 74,
      "n": "Produce Short-Form Video Reel",
      "role": "VE",
      "freq": "Tuesday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "ge_d74_li",
      "phase": "ongoing",
      "day": 74,
      "n": "Send 40 LinkedIn Connection Requests",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d74_ads",
      "phase": "ongoing",
      "day": 74,
      "n": "Audit Ad Acquisition Cost Metrics",
      "role": "ADS",
      "freq": "Tuesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "ge_d75_send",
      "phase": "ongoing",
      "day": 75,
      "n": "Send Cold Email Batch (450 Sends)",
      "role": "OBS",
      "freq": "Wednesday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d75_blog",
      "phase": "ongoing",
      "day": 75,
      "n": "Publish SEO Optimized Blog Post",
      "role": "CW",
      "freq": "Wednesday",
      "hours": "2h",
      "deps": []
    },
    {
      "id": "ge_d75_retarg",
      "phase": "ongoing",
      "day": 75,
      "n": "Refresh Retargeting Ad Creatives",
      "role": "ADS",
      "freq": "Wednesday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d75_li",
      "phase": "ongoing",
      "day": 75,
      "n": "Send LinkedIn Outbound DMs",
      "role": "OBS",
      "freq": "Wednesday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d75_reply",
      "phase": "ongoing",
      "day": 75,
      "n": "Process Meeting Calendar Bookings in GHL",
      "role": "OBS",
      "freq": "Wednesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "ge_d76_send",
      "phase": "ongoing",
      "day": 76,
      "n": "Send Cold Email Batch (450 Sends)",
      "role": "OBS",
      "freq": "Thursday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d76_backlink",
      "phase": "ongoing",
      "day": 76,
      "n": "Execute Backlink Outreach Pitching",
      "role": "SEO",
      "freq": "Thursday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "ge_d76_posts",
      "phase": "ongoing",
      "day": 76,
      "n": "Produce Weekly Post Batch Visuals",
      "role": "GD",
      "freq": "Thursday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "ge_d76_li",
      "phase": "ongoing",
      "day": 76,
      "n": "Send 40 LinkedIn Connection Requests",
      "role": "OBS",
      "freq": "Thursday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d76_calls",
      "phase": "ongoing",
      "day": 76,
      "n": "Confirm Scheduled Calls and Send Reminders",
      "role": "OBS",
      "freq": "Thursday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "ge_d76_ads",
      "phase": "ongoing",
      "day": 76,
      "n": "Optimize Google Search Keywords and Negative Terms",
      "role": "ADS",
      "freq": "Thursday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "ge_d77_send",
      "phase": "ongoing",
      "day": 77,
      "n": "Send Cold Email Batch (450 Sends)",
      "role": "OBS",
      "freq": "Friday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d77_seq",
      "phase": "ongoing",
      "day": 77,
      "n": "Analyze Sequence Conversion Rates by Angle",
      "role": "STRAT",
      "freq": "Friday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d77_gmb",
      "phase": "ongoing",
      "day": 77,
      "n": "Publish Google Business Profile Update",
      "role": "SEO",
      "freq": "Friday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "ge_d77_hyg",
      "phase": "ongoing",
      "day": 77,
      "n": "Audit GHL CRM Lead Automation",
      "role": "AUTO",
      "freq": "Friday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "ge_d78_comm",
      "phase": "ongoing",
      "day": 78,
      "n": "Manage Social Community Engagement",
      "role": "SMM",
      "freq": "Saturday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d79_kpi",
      "phase": "ongoing",
      "day": 79,
      "n": "Review Weekly KPI Scorecard",
      "role": "AM",
      "freq": "Monday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d79_box",
      "phase": "ongoing",
      "day": 79,
      "n": "Check Mailbox Health (18 Boxes)",
      "role": "AUTO",
      "freq": "Monday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "ge_d79_list",
      "phase": "ongoing",
      "day": 79,
      "n": "Build Weekly Verified Lead List (750 Contacts)",
      "role": "DATA",
      "freq": "Monday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "ge_d79_send",
      "phase": "ongoing",
      "day": 79,
      "n": "Send Cold Email Batch (450 Sends)",
      "role": "OBS",
      "freq": "Monday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d79_li",
      "phase": "ongoing",
      "day": 79,
      "n": "Send 40 LinkedIn Connection Requests (2 Profiles)",
      "role": "OBS",
      "freq": "Monday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d79_kw",
      "phase": "ongoing",
      "day": 79,
      "n": "Track Keyword Ranking Movement",
      "role": "SEO",
      "freq": "Monday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "ge_d79_sched",
      "phase": "ongoing",
      "day": 79,
      "n": "Schedule Weekly Content across Channels",
      "role": "SMM",
      "freq": "Monday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d79_ads",
      "phase": "ongoing",
      "day": 79,
      "n": "Check Meta and Google Ads Daily Health",
      "role": "ADS",
      "freq": "Monday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "ge_d80_send",
      "phase": "ongoing",
      "day": 80,
      "n": "Send Cold Email Batch (450 Sends)",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d80_reply_m",
      "phase": "ongoing",
      "day": 80,
      "n": "Morning Reply Triage",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "ge_d80_reply_e",
      "phase": "ongoing",
      "day": 80,
      "n": "Evening Reply Triage",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "ge_d80_reel",
      "phase": "ongoing",
      "day": 80,
      "n": "Produce Short-Form Video Reel",
      "role": "VE",
      "freq": "Tuesday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "ge_d80_li",
      "phase": "ongoing",
      "day": 80,
      "n": "Send 40 LinkedIn Connection Requests",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d80_ads",
      "phase": "ongoing",
      "day": 80,
      "n": "Audit Ad Acquisition Cost Metrics",
      "role": "ADS",
      "freq": "Tuesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "ge_d81_send",
      "phase": "ongoing",
      "day": 81,
      "n": "Send Cold Email Batch (450 Sends)",
      "role": "OBS",
      "freq": "Wednesday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d81_blog",
      "phase": "ongoing",
      "day": 81,
      "n": "Publish SEO Optimized Blog Post",
      "role": "CW",
      "freq": "Wednesday",
      "hours": "2h",
      "deps": []
    },
    {
      "id": "ge_d81_retarg",
      "phase": "ongoing",
      "day": 81,
      "n": "Refresh Retargeting Ad Creatives",
      "role": "ADS",
      "freq": "Wednesday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d81_li",
      "phase": "ongoing",
      "day": 81,
      "n": "Send LinkedIn Outbound DMs",
      "role": "OBS",
      "freq": "Wednesday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d81_reply",
      "phase": "ongoing",
      "day": 81,
      "n": "Process Meeting Calendar Bookings in GHL",
      "role": "OBS",
      "freq": "Wednesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "ge_d82_send",
      "phase": "ongoing",
      "day": 82,
      "n": "Send Cold Email Batch (450 Sends)",
      "role": "OBS",
      "freq": "Thursday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d82_backlink",
      "phase": "ongoing",
      "day": 82,
      "n": "Execute Backlink Outreach Pitching",
      "role": "SEO",
      "freq": "Thursday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "ge_d82_posts",
      "phase": "ongoing",
      "day": 82,
      "n": "Produce Weekly Post Batch Visuals",
      "role": "GD",
      "freq": "Thursday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "ge_d82_li",
      "phase": "ongoing",
      "day": 82,
      "n": "Send 40 LinkedIn Connection Requests",
      "role": "OBS",
      "freq": "Thursday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d82_calls",
      "phase": "ongoing",
      "day": 82,
      "n": "Confirm Scheduled Calls and Send Reminders",
      "role": "OBS",
      "freq": "Thursday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "ge_d82_ads",
      "phase": "ongoing",
      "day": 82,
      "n": "Optimize Google Search Keywords and Negative Terms",
      "role": "ADS",
      "freq": "Thursday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "ge_d83_send",
      "phase": "ongoing",
      "day": 83,
      "n": "Send Cold Email Batch (450 Sends)",
      "role": "OBS",
      "freq": "Friday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d83_seq",
      "phase": "ongoing",
      "day": 83,
      "n": "Analyze Sequence Conversion Rates by Angle",
      "role": "STRAT",
      "freq": "Friday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d83_gmb",
      "phase": "ongoing",
      "day": 83,
      "n": "Publish Google Business Profile Update",
      "role": "SEO",
      "freq": "Friday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "ge_d83_hyg",
      "phase": "ongoing",
      "day": 83,
      "n": "Audit GHL CRM Lead Automation",
      "role": "AUTO",
      "freq": "Friday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "ge_d84_comm",
      "phase": "ongoing",
      "day": 84,
      "n": "Manage Social Community Engagement",
      "role": "SMM",
      "freq": "Saturday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d85_kpi",
      "phase": "ongoing",
      "day": 85,
      "n": "Review Weekly KPI Scorecard",
      "role": "AM",
      "freq": "Monday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d85_box",
      "phase": "ongoing",
      "day": 85,
      "n": "Check Mailbox Health (18 Boxes)",
      "role": "AUTO",
      "freq": "Monday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "ge_d85_list",
      "phase": "ongoing",
      "day": 85,
      "n": "Build Weekly Verified Lead List (750 Contacts)",
      "role": "DATA",
      "freq": "Monday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "ge_d85_send",
      "phase": "ongoing",
      "day": 85,
      "n": "Send Cold Email Batch (450 Sends)",
      "role": "OBS",
      "freq": "Monday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d85_li",
      "phase": "ongoing",
      "day": 85,
      "n": "Send 40 LinkedIn Connection Requests (2 Profiles)",
      "role": "OBS",
      "freq": "Monday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d85_kw",
      "phase": "ongoing",
      "day": 85,
      "n": "Track Keyword Ranking Movement",
      "role": "SEO",
      "freq": "Monday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "ge_d85_sched",
      "phase": "ongoing",
      "day": 85,
      "n": "Schedule Weekly Content across Channels",
      "role": "SMM",
      "freq": "Monday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d85_ads",
      "phase": "ongoing",
      "day": 85,
      "n": "Check Meta and Google Ads Daily Health",
      "role": "ADS",
      "freq": "Monday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "ge_m85_cal",
      "phase": "ongoing",
      "day": 85,
      "n": "Submit Next Month Content Calendar for Client Approval",
      "role": "SMM",
      "priority": "normal",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d86_send",
      "phase": "ongoing",
      "day": 86,
      "n": "Send Cold Email Batch (450 Sends)",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d86_reply_m",
      "phase": "ongoing",
      "day": 86,
      "n": "Morning Reply Triage",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "ge_d86_reply_e",
      "phase": "ongoing",
      "day": 86,
      "n": "Evening Reply Triage",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "ge_d86_reel",
      "phase": "ongoing",
      "day": 86,
      "n": "Produce Short-Form Video Reel",
      "role": "VE",
      "freq": "Tuesday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "ge_d86_li",
      "phase": "ongoing",
      "day": 86,
      "n": "Send 40 LinkedIn Connection Requests",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d86_ads",
      "phase": "ongoing",
      "day": 86,
      "n": "Audit Ad Acquisition Cost Metrics",
      "role": "ADS",
      "freq": "Tuesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "ge_d87_send",
      "phase": "ongoing",
      "day": 87,
      "n": "Send Cold Email Batch (450 Sends)",
      "role": "OBS",
      "freq": "Wednesday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d87_blog",
      "phase": "ongoing",
      "day": 87,
      "n": "Publish SEO Optimized Blog Post",
      "role": "CW",
      "freq": "Wednesday",
      "hours": "2h",
      "deps": []
    },
    {
      "id": "ge_d87_retarg",
      "phase": "ongoing",
      "day": 87,
      "n": "Refresh Retargeting Ad Creatives",
      "role": "ADS",
      "freq": "Wednesday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d87_li",
      "phase": "ongoing",
      "day": 87,
      "n": "Send LinkedIn Outbound DMs",
      "role": "OBS",
      "freq": "Wednesday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d87_reply",
      "phase": "ongoing",
      "day": 87,
      "n": "Process Meeting Calendar Bookings in GHL",
      "role": "OBS",
      "freq": "Wednesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "ge_d88_send",
      "phase": "ongoing",
      "day": 88,
      "n": "Send Cold Email Batch (450 Sends)",
      "role": "OBS",
      "freq": "Thursday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d88_backlink",
      "phase": "ongoing",
      "day": 88,
      "n": "Execute Backlink Outreach Pitching",
      "role": "SEO",
      "freq": "Thursday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "ge_d88_posts",
      "phase": "ongoing",
      "day": 88,
      "n": "Produce Weekly Post Batch Visuals",
      "role": "GD",
      "freq": "Thursday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "ge_d88_li",
      "phase": "ongoing",
      "day": 88,
      "n": "Send 40 LinkedIn Connection Requests",
      "role": "OBS",
      "freq": "Thursday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d88_calls",
      "phase": "ongoing",
      "day": 88,
      "n": "Confirm Scheduled Calls and Send Reminders",
      "role": "OBS",
      "freq": "Thursday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "ge_d88_ads",
      "phase": "ongoing",
      "day": 88,
      "n": "Optimize Google Search Keywords and Negative Terms",
      "role": "ADS",
      "freq": "Thursday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "ge_d89_send",
      "phase": "ongoing",
      "day": 89,
      "n": "Send Cold Email Batch (450 Sends)",
      "role": "OBS",
      "freq": "Friday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d89_seq",
      "phase": "ongoing",
      "day": 89,
      "n": "Analyze Sequence Conversion Rates by Angle",
      "role": "STRAT",
      "freq": "Friday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_d89_gmb",
      "phase": "ongoing",
      "day": 89,
      "n": "Publish Google Business Profile Update",
      "role": "SEO",
      "freq": "Friday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "ge_d89_hyg",
      "phase": "ongoing",
      "day": 89,
      "n": "Audit GHL CRM Lead Automation",
      "role": "AUTO",
      "freq": "Friday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "ge_d90_comm",
      "phase": "ongoing",
      "day": 90,
      "n": "Manage Social Community Engagement",
      "role": "SMM",
      "freq": "Saturday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "ge_m25",
      "phase": "ongoing",
      "day": 25,
      "n": "Kill Weakest Email Angle and Reallocate Its Volume",
      "role": "STRAT",
      "priority": "high",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "ge_m30",
      "phase": "ongoing",
      "day": 30,
      "n": "Conduct Month 1 Performance Review",
      "role": "AM",
      "priority": "high",
      "hours": "2h",
      "deps": []
    },
    {
      "id": "ge_m45",
      "phase": "ongoing",
      "day": 45,
      "n": "Launch Omnichannel Retargeting Campaigns",
      "role": "ADS",
      "priority": "high",
      "hours": "2h",
      "deps": []
    },
    {
      "id": "ge_m52",
      "phase": "ongoing",
      "day": 52,
      "n": "Rotate Burnt Domains and Start Warmup on 2 Replacements",
      "role": "AUTO",
      "priority": "high",
      "hours": "2h",
      "deps": []
    },
    {
      "id": "ge_m60",
      "phase": "ongoing",
      "day": 60,
      "n": "Conduct Month 2 Pricing Check and Performance Review",
      "role": "AM",
      "priority": "high",
      "hours": "2h",
      "deps": []
    },
    {
      "id": "ge_m90",
      "phase": "ongoing",
      "day": 90,
      "n": "Conduct Quarter Review and Renewal Conversation",
      "role": "AM",
      "priority": "high",
      "hours": "2h",
      "deps": []
    }
  ],
  "growth_dominance": [
    {
      "id": "gd_s01_a",
      "phase": "sprint",
      "day": 1,
      "n": "Conduct Executive Kickoff Meeting with Client",
      "role": "AM",
      "deps": [],
      "hours": "1h",
      "priority": "high"
    },
    {
      "id": "gd_s01_b",
      "phase": "sprint",
      "day": 1,
      "n": "Collect Omnichannel Platform Credentials",
      "role": "AM",
      "deps": [
        "gd_s01_a"
      ],
      "hours": "1h",
      "priority": "high"
    },
    {
      "id": "gd_s01_c",
      "phase": "sprint",
      "day": 1,
      "n": "Purchase 10 Sending Domains",
      "role": "AUTO",
      "deps": [
        "gd_s01_b"
      ],
      "hours": "1.5h",
      "priority": "high"
    },
    {
      "id": "gd_s01_d",
      "phase": "sprint",
      "day": 1,
      "n": "Configure SPF, DKIM, DMARC DNS Records",
      "role": "AUTO",
      "deps": [
        "gd_s01_c"
      ],
      "hours": "1.5h",
      "priority": "high"
    },
    {
      "id": "gd_s02_a",
      "phase": "sprint",
      "day": 2,
      "n": "Audit Full Funnel Architecture",
      "role": "SR_STRAT",
      "deps": [
        "gd_s01_b"
      ],
      "hours": "2h",
      "priority": "high"
    },
    {
      "id": "gd_s02_b",
      "phase": "sprint",
      "day": 2,
      "n": "Execute Market Intelligence Scan",
      "role": "SR_STRAT",
      "deps": [
        "gd_s02_a"
      ],
      "hours": "1.5h",
      "priority": "high"
    },
    {
      "id": "gd_s02_c",
      "phase": "sprint",
      "day": 2,
      "n": "Create 30 Mailboxes across 10 Domains",
      "role": "AUTO",
      "deps": [
        "gd_s01_d"
      ],
      "hours": "2h",
      "priority": "high"
    },
    {
      "id": "gd_s03_a",
      "phase": "sprint",
      "day": 3,
      "n": "Formulate Enterprise ICP Document",
      "role": "SR_STRAT",
      "deps": [
        "gd_s02_a"
      ],
      "hours": "1.5h",
      "priority": "high"
    },
    {
      "id": "gd_s03_b",
      "phase": "sprint",
      "day": 3,
      "n": "Build Lead Qualification Scorecard",
      "role": "SR_STRAT",
      "deps": [
        "gd_s03_a"
      ],
      "hours": "1h",
      "priority": "high"
    },
    {
      "id": "gd_s03_c",
      "phase": "sprint",
      "day": 3,
      "n": "Connect 30 Mailboxes to Warmup Pool",
      "role": "AUTO",
      "deps": [
        "gd_s02_c"
      ],
      "hours": "1h",
      "priority": "high"
    },
    {
      "id": "gd_s03_d",
      "phase": "sprint",
      "day": 3,
      "n": "Set Automated Warmup Schedule",
      "role": "AUTO",
      "deps": [
        "gd_s03_c"
      ],
      "hours": "0.5h",
      "priority": "high"
    },
    {
      "id": "gd_s04_a",
      "phase": "sprint",
      "day": 4,
      "n": "Organize Brand Creative Assets",
      "role": "GD",
      "deps": [
        "gd_s03_a"
      ],
      "hours": "1h",
      "priority": "normal"
    },
    {
      "id": "gd_s04_b",
      "phase": "sprint",
      "day": 4,
      "n": "Build Multi-Pipeline Stages in GHL",
      "role": "AUTO",
      "deps": [
        "gd_s01_b"
      ],
      "hours": "2h",
      "priority": "high"
    },
    {
      "id": "gd_s05_a",
      "phase": "sprint",
      "day": 5,
      "n": "Configure Booking Calendar and Intelligent Routing",
      "role": "AUTO",
      "deps": [
        "gd_s04_b"
      ],
      "hours": "1.5h",
      "priority": "high"
    },
    {
      "id": "gd_s05_b",
      "phase": "sprint",
      "day": 5,
      "n": "Configure Custom AI Chatbot Qualification Logic",
      "role": "AUTO",
      "deps": [
        "gd_s05_a"
      ],
      "hours": "2h",
      "priority": "high"
    },
    {
      "id": "gd_s06_a",
      "phase": "sprint",
      "day": 6,
      "n": "Deploy Omnichannel Tracking Pixels (Meta, Google, LinkedIn)",
      "role": "DEV",
      "deps": [
        "gd_s05_a"
      ],
      "hours": "1.5h",
      "priority": "high"
    },
    {
      "id": "gd_s06_b",
      "phase": "sprint",
      "day": 6,
      "n": "Setup Call Tracking and Data Streams in GA4",
      "role": "DEV",
      "deps": [
        "gd_s06_a"
      ],
      "hours": "1.5h",
      "priority": "high"
    },
    {
      "id": "gd_s07_a",
      "phase": "sprint",
      "day": 7,
      "n": "Draft Email Sequence Angle 1 Direct Pitch",
      "role": "CW",
      "deps": [
        "gd_s03_a"
      ],
      "hours": "1.5h",
      "priority": "high"
    },
    {
      "id": "gd_s07_b",
      "phase": "sprint",
      "day": 7,
      "n": "Draft Email Sequence Angle 2 Pain Point",
      "role": "CW",
      "deps": [
        "gd_s07_a"
      ],
      "hours": "1.5h",
      "priority": "high"
    },
    {
      "id": "gd_s07_c",
      "phase": "sprint",
      "day": 7,
      "n": "Source First 2,250 Verified ICP Contacts",
      "role": "DATA",
      "deps": [
        "gd_s03_b"
      ],
      "hours": "3h",
      "priority": "high"
    },
    {
      "id": "gd_s08_a",
      "phase": "sprint",
      "day": 8,
      "n": "Draft Email Sequence Angle 3 Case Study and Social Proof",
      "role": "CW",
      "deps": [
        "gd_s07_b"
      ],
      "hours": "1.5h",
      "priority": "high"
    },
    {
      "id": "gd_s08_b",
      "phase": "sprint",
      "day": 8,
      "n": "Write 4 Follow Up Variations Per Angle",
      "role": "CW",
      "deps": [
        "gd_s08_a"
      ],
      "hours": "2h",
      "priority": "high"
    },
    {
      "id": "gd_s08_c",
      "phase": "sprint",
      "day": 8,
      "n": "Audit Meta, Google, and LinkedIn Ad Accounts",
      "role": "ADS",
      "deps": [
        "gd_s06_a"
      ],
      "hours": "1.5h",
      "priority": "high"
    },
    {
      "id": "gd_s09_a",
      "phase": "sprint",
      "day": 9,
      "n": "Write LinkedIn Connection Note and 3 Step DM Sequence for 3 Profiles",
      "role": "CW",
      "deps": [
        "gd_s07_a"
      ],
      "hours": "2.5h",
      "priority": "high"
    },
    {
      "id": "gd_s09_b",
      "phase": "sprint",
      "day": 9,
      "n": "Design LinkedIn Banners and Optimize Headlines for 3 Profiles",
      "role": "GD",
      "deps": [
        "gd_s04_a"
      ],
      "hours": "2.5h",
      "priority": "normal"
    },
    {
      "id": "gd_s09_c",
      "phase": "sprint",
      "day": 9,
      "n": "Formulate Enterprise SEO Architecture and 30 Keyword Clusters",
      "role": "SEO_LEAD",
      "deps": [
        "gd_s03_a"
      ],
      "hours": "2.5h",
      "priority": "high"
    },
    {
      "id": "gd_s10_a",
      "phase": "sprint",
      "day": 10,
      "n": "Messaging Approval Call with Client on Angles and Content Pillars",
      "role": "AM",
      "deps": [
        "gd_s08_b",
        "gd_s09_a"
      ],
      "hours": "1h",
      "priority": "high"
    },
    {
      "id": "gd_s10_b",
      "phase": "sprint",
      "day": 10,
      "n": "Design High Converting Landing Page Layout Wireframe",
      "role": "DEV",
      "deps": [
        "gd_s10_a"
      ],
      "hours": "2.5h",
      "priority": "high"
    },
    {
      "id": "gd_s10_c",
      "phase": "sprint",
      "day": 10,
      "n": "Conduct Founder Ghostwriting Alignment Interview",
      "role": "GHOST",
      "deps": [
        "gd_s10_a"
      ],
      "hours": "1.5h",
      "priority": "high"
    },
    {
      "id": "gd_s11_a",
      "phase": "sprint",
      "day": 11,
      "n": "Deploy 30 Tracked Primary SEO Keywords",
      "role": "SEO_LEAD",
      "deps": [
        "gd_s09_c"
      ],
      "hours": "1.5h",
      "priority": "normal"
    },
    {
      "id": "gd_s11_b",
      "phase": "sprint",
      "day": 11,
      "n": "Draft First Batch of Founder Thought Leadership Posts",
      "role": "GHOST",
      "deps": [
        "gd_s10_c"
      ],
      "hours": "2h",
      "priority": "high"
    },
    {
      "id": "gd_s12_a",
      "phase": "sprint",
      "day": 12,
      "n": "Write Discovery Call Script and Objection Handling Document",
      "role": "CW",
      "deps": [
        "gd_s02_a"
      ],
      "hours": "1.5h",
      "priority": "normal"
    },
    {
      "id": "gd_s12_b",
      "phase": "sprint",
      "day": 12,
      "n": "Prepare Proposal Template for Client Use",
      "role": "AM",
      "deps": [
        "gd_s02_a"
      ],
      "hours": "1h",
      "priority": "normal"
    },
    {
      "id": "gd_s12_c",
      "phase": "sprint",
      "day": 12,
      "n": "Deploy Landing Pages Live and Test Integrations",
      "role": "DEV",
      "deps": [
        "gd_s10_b"
      ],
      "hours": "2.5h",
      "priority": "high"
    },
    {
      "id": "gd_s13_a",
      "phase": "sprint",
      "day": 13,
      "n": "Build Reporting Dashboard and KPI Sheet with Client Login",
      "role": "AM",
      "deps": [
        "gd_s04_b"
      ],
      "hours": "2h",
      "priority": "high"
    },
    {
      "id": "gd_s13_b",
      "phase": "sprint",
      "day": 13,
      "n": "Source Additional 2,250 Verified ICP Contacts",
      "role": "DATA",
      "deps": [
        "gd_s07_c"
      ],
      "hours": "2.5h",
      "priority": "high"
    },
    {
      "id": "gd_s14_a",
      "phase": "sprint",
      "day": 14,
      "n": "Build Meta, Google, and LinkedIn Ad Campaigns in Paused Drafts",
      "role": "ADS",
      "deps": [
        "gd_s08_c",
        "gd_s12_c"
      ],
      "hours": "2.5h",
      "priority": "high"
    },
    {
      "id": "gd_s14_b",
      "phase": "sprint",
      "day": 14,
      "n": "Confirm Monthly Ad Spend Budget and Billing Method in Writing",
      "role": "AM",
      "deps": [
        "gd_s14_a"
      ],
      "hours": "0.5h",
      "priority": "high"
    },
    {
      "id": "gd_s14_c",
      "phase": "sprint",
      "day": 14,
      "n": "Execute Seed List Test Send to 15 Inboxes",
      "role": "OBS",
      "deps": [
        "gd_s03_c"
      ],
      "hours": "1.5h",
      "priority": "high"
    },
    {
      "id": "gd_s15_a",
      "phase": "sprint",
      "day": 15,
      "n": "Final Deliverability QA and Inbox Placement Check",
      "role": "OBS",
      "deps": [
        "gd_s14_c"
      ],
      "hours": "1h",
      "priority": "high"
    },
    {
      "id": "gd_s15_b",
      "phase": "sprint",
      "day": 15,
      "n": "Compile Enterprise Go Live Audit Report and Sign-Off",
      "role": "AM",
      "deps": [
        "gd_s15_a"
      ],
      "hours": "1h",
      "priority": "high"
    },
    {
      "id": "gd_d16_reel2",
      "phase": "ongoing",
      "day": 16,
      "n": "Produce Video Reel Creative (12/mo Cadence)",
      "role": "VE",
      "freq": "Thursday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "gd_d16_blog2",
      "phase": "ongoing",
      "day": 16,
      "n": "Publish Authority SEO Blog Article 2 (8/mo Cadence)",
      "role": "CW",
      "freq": "Thursday",
      "hours": "2h",
      "deps": []
    },
    {
      "id": "gd_d16_backlink",
      "phase": "ongoing",
      "day": 16,
      "n": "Execute High DR Backlink Outreach Pitching (15/mo Target)",
      "role": "SEO_LEAD",
      "freq": "Thursday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "gd_d16_li",
      "phase": "ongoing",
      "day": 16,
      "n": "Send LinkedIn Connection Requests",
      "role": "OBS",
      "freq": "Thursday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d17_ramp",
      "phase": "ongoing",
      "day": 17,
      "n": "Start Cold Email Sending at 20 Percent Volume",
      "role": "OBS",
      "priority": "high",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d17_send",
      "phase": "ongoing",
      "day": 17,
      "n": "Send Cold Email Ramp-Up Batch",
      "role": "OBS",
      "freq": "Friday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d17_ghost",
      "phase": "ongoing",
      "day": 17,
      "n": "Publish Founder Ghostwriting Post (Fri)",
      "role": "GHOST",
      "freq": "Friday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "gd_d17_seo_audit",
      "phase": "ongoing",
      "day": 17,
      "n": "Audit 30 Tracked SEO Keywords Performance",
      "role": "SEO_LEAD",
      "freq": "Friday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d17_ai_opt",
      "phase": "ongoing",
      "day": 17,
      "n": "Optimize AI Chatbot Conversation & CRM Routing",
      "role": "AUTO",
      "freq": "Friday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d18_reel3",
      "phase": "ongoing",
      "day": 18,
      "n": "Produce Video Reel Creative (12/mo Cadence)",
      "role": "VE",
      "freq": "Saturday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "gd_d18_comm",
      "phase": "ongoing",
      "day": 18,
      "n": "Omnichannel Social Community Management",
      "role": "SMM",
      "freq": "Saturday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d19_kpi",
      "phase": "ongoing",
      "day": 19,
      "n": "Review Omnichannel Executive KPI Dashboard",
      "role": "AM",
      "freq": "Monday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d19_box",
      "phase": "ongoing",
      "day": 19,
      "n": "Check Mailbox Health (30 Boxes)",
      "role": "AUTO",
      "freq": "Monday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gd_d19_list",
      "phase": "ongoing",
      "day": 19,
      "n": "Build Weekly Verified Lead List (1,125 Contacts)",
      "role": "DATA",
      "freq": "Monday",
      "hours": "2h",
      "deps": []
    },
    {
      "id": "gd_d19_send",
      "phase": "ongoing",
      "day": 19,
      "n": "Send Cold Email Ramp-Up Batch",
      "role": "OBS",
      "freq": "Monday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d19_li",
      "phase": "ongoing",
      "day": 19,
      "n": "Send LinkedIn Connection Requests across 3 Profiles",
      "role": "OBS",
      "freq": "Monday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d19_ghost",
      "phase": "ongoing",
      "day": 19,
      "n": "Publish Founder Ghostwriting Post (Mon)",
      "role": "GHOST",
      "freq": "Monday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "gd_d19_ads",
      "phase": "ongoing",
      "day": 19,
      "n": "Audit Meta, Google, and LinkedIn Ad Spend",
      "role": "ADS",
      "freq": "Monday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d20_scale",
      "phase": "ongoing",
      "day": 20,
      "n": "Scale Cold Email to Full Daily Volume",
      "role": "OBS",
      "priority": "high",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d20_send",
      "phase": "ongoing",
      "day": 20,
      "n": "Send Cold Email Batch (750 Sends)",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d20_reply_m",
      "phase": "ongoing",
      "day": 20,
      "n": "Morning Omnichannel Inbound Triage",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gd_d20_reply_e",
      "phase": "ongoing",
      "day": 20,
      "n": "Evening Omnichannel Inbound Triage",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gd_d20_reel",
      "phase": "ongoing",
      "day": 20,
      "n": "Produce Video Reel Creative (12/mo Cadence)",
      "role": "VE",
      "freq": "Tuesday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "gd_d20_blog1",
      "phase": "ongoing",
      "day": 20,
      "n": "Publish Authority SEO Blog Article 1 (8/mo Cadence)",
      "role": "CW",
      "freq": "Tuesday",
      "hours": "2h",
      "deps": []
    },
    {
      "id": "gd_d20_li",
      "phase": "ongoing",
      "day": 20,
      "n": "Send LinkedIn Connection Requests",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d21_send",
      "phase": "ongoing",
      "day": 21,
      "n": "Send Cold Email Batch (750 Sends)",
      "role": "OBS",
      "freq": "Wednesday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d21_ghost",
      "phase": "ongoing",
      "day": 21,
      "n": "Publish Founder Ghostwriting Post (Wed)",
      "role": "GHOST",
      "freq": "Wednesday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "gd_d21_opt_ads",
      "phase": "ongoing",
      "day": 21,
      "n": "Scale Winning Ads across 3 Ad Platforms",
      "role": "ADS",
      "freq": "Wednesday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "gd_d21_li",
      "phase": "ongoing",
      "day": 21,
      "n": "Send Targeted LinkedIn Outbound DMs",
      "role": "OBS",
      "freq": "Wednesday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d21_reply",
      "phase": "ongoing",
      "day": 21,
      "n": "Process Qualified Meeting Bookings",
      "role": "OBS",
      "freq": "Wednesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gd_d22_send",
      "phase": "ongoing",
      "day": 22,
      "n": "Send Cold Email Batch (750 Sends)",
      "role": "OBS",
      "freq": "Thursday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d22_reel2",
      "phase": "ongoing",
      "day": 22,
      "n": "Produce Video Reel Creative (12/mo Cadence)",
      "role": "VE",
      "freq": "Thursday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "gd_d22_blog2",
      "phase": "ongoing",
      "day": 22,
      "n": "Publish Authority SEO Blog Article 2 (8/mo Cadence)",
      "role": "CW",
      "freq": "Thursday",
      "hours": "2h",
      "deps": []
    },
    {
      "id": "gd_d22_backlink",
      "phase": "ongoing",
      "day": 22,
      "n": "Execute High DR Backlink Outreach Pitching (15/mo Target)",
      "role": "SEO_LEAD",
      "freq": "Thursday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "gd_d22_li",
      "phase": "ongoing",
      "day": 22,
      "n": "Send LinkedIn Connection Requests",
      "role": "OBS",
      "freq": "Thursday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d23_send",
      "phase": "ongoing",
      "day": 23,
      "n": "Send Cold Email Batch (750 Sends)",
      "role": "OBS",
      "freq": "Friday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d23_ghost",
      "phase": "ongoing",
      "day": 23,
      "n": "Publish Founder Ghostwriting Post (Fri)",
      "role": "GHOST",
      "freq": "Friday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "gd_d23_seo_audit",
      "phase": "ongoing",
      "day": 23,
      "n": "Audit 30 Tracked SEO Keywords Performance",
      "role": "SEO_LEAD",
      "freq": "Friday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d23_ai_opt",
      "phase": "ongoing",
      "day": 23,
      "n": "Optimize AI Chatbot Conversation & CRM Routing",
      "role": "AUTO",
      "freq": "Friday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d24_reel3",
      "phase": "ongoing",
      "day": 24,
      "n": "Produce Video Reel Creative (12/mo Cadence)",
      "role": "VE",
      "freq": "Saturday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "gd_d24_comm",
      "phase": "ongoing",
      "day": 24,
      "n": "Omnichannel Social Community Management",
      "role": "SMM",
      "freq": "Saturday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d25_kpi",
      "phase": "ongoing",
      "day": 25,
      "n": "Review Omnichannel Executive KPI Dashboard",
      "role": "AM",
      "freq": "Monday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d25_box",
      "phase": "ongoing",
      "day": 25,
      "n": "Check Mailbox Health (30 Boxes)",
      "role": "AUTO",
      "freq": "Monday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gd_d25_list",
      "phase": "ongoing",
      "day": 25,
      "n": "Build Weekly Verified Lead List (1,125 Contacts)",
      "role": "DATA",
      "freq": "Monday",
      "hours": "2h",
      "deps": []
    },
    {
      "id": "gd_d25_send",
      "phase": "ongoing",
      "day": 25,
      "n": "Send Cold Email Batch (750 Sends)",
      "role": "OBS",
      "freq": "Monday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d25_li",
      "phase": "ongoing",
      "day": 25,
      "n": "Send LinkedIn Connection Requests across 3 Profiles",
      "role": "OBS",
      "freq": "Monday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d25_ghost",
      "phase": "ongoing",
      "day": 25,
      "n": "Publish Founder Ghostwriting Post (Mon)",
      "role": "GHOST",
      "freq": "Monday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "gd_d25_ads",
      "phase": "ongoing",
      "day": 25,
      "n": "Audit Meta, Google, and LinkedIn Ad Spend",
      "role": "ADS",
      "freq": "Monday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_m25_cal",
      "phase": "ongoing",
      "day": 25,
      "n": "Submit Next Month Content Calendar for Client Approval",
      "role": "SMM",
      "priority": "normal",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d26_send",
      "phase": "ongoing",
      "day": 26,
      "n": "Send Cold Email Batch (750 Sends)",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d26_reply_m",
      "phase": "ongoing",
      "day": 26,
      "n": "Morning Omnichannel Inbound Triage",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gd_d26_reply_e",
      "phase": "ongoing",
      "day": 26,
      "n": "Evening Omnichannel Inbound Triage",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gd_d26_reel",
      "phase": "ongoing",
      "day": 26,
      "n": "Produce Video Reel Creative (12/mo Cadence)",
      "role": "VE",
      "freq": "Tuesday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "gd_d26_blog1",
      "phase": "ongoing",
      "day": 26,
      "n": "Publish Authority SEO Blog Article 1 (8/mo Cadence)",
      "role": "CW",
      "freq": "Tuesday",
      "hours": "2h",
      "deps": []
    },
    {
      "id": "gd_d26_li",
      "phase": "ongoing",
      "day": 26,
      "n": "Send LinkedIn Connection Requests",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d27_send",
      "phase": "ongoing",
      "day": 27,
      "n": "Send Cold Email Batch (750 Sends)",
      "role": "OBS",
      "freq": "Wednesday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d27_ghost",
      "phase": "ongoing",
      "day": 27,
      "n": "Publish Founder Ghostwriting Post (Wed)",
      "role": "GHOST",
      "freq": "Wednesday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "gd_d27_opt_ads",
      "phase": "ongoing",
      "day": 27,
      "n": "Scale Winning Ads across 3 Ad Platforms",
      "role": "ADS",
      "freq": "Wednesday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "gd_d27_li",
      "phase": "ongoing",
      "day": 27,
      "n": "Send Targeted LinkedIn Outbound DMs",
      "role": "OBS",
      "freq": "Wednesday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d27_reply",
      "phase": "ongoing",
      "day": 27,
      "n": "Process Qualified Meeting Bookings",
      "role": "OBS",
      "freq": "Wednesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gd_d28_send",
      "phase": "ongoing",
      "day": 28,
      "n": "Send Cold Email Batch (750 Sends)",
      "role": "OBS",
      "freq": "Thursday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d28_reel2",
      "phase": "ongoing",
      "day": 28,
      "n": "Produce Video Reel Creative (12/mo Cadence)",
      "role": "VE",
      "freq": "Thursday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "gd_d28_blog2",
      "phase": "ongoing",
      "day": 28,
      "n": "Publish Authority SEO Blog Article 2 (8/mo Cadence)",
      "role": "CW",
      "freq": "Thursday",
      "hours": "2h",
      "deps": []
    },
    {
      "id": "gd_d28_backlink",
      "phase": "ongoing",
      "day": 28,
      "n": "Execute High DR Backlink Outreach Pitching (15/mo Target)",
      "role": "SEO_LEAD",
      "freq": "Thursday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "gd_d28_li",
      "phase": "ongoing",
      "day": 28,
      "n": "Send LinkedIn Connection Requests",
      "role": "OBS",
      "freq": "Thursday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d29_send",
      "phase": "ongoing",
      "day": 29,
      "n": "Send Cold Email Batch (750 Sends)",
      "role": "OBS",
      "freq": "Friday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d29_ghost",
      "phase": "ongoing",
      "day": 29,
      "n": "Publish Founder Ghostwriting Post (Fri)",
      "role": "GHOST",
      "freq": "Friday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "gd_d29_seo_audit",
      "phase": "ongoing",
      "day": 29,
      "n": "Audit 30 Tracked SEO Keywords Performance",
      "role": "SEO_LEAD",
      "freq": "Friday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d29_ai_opt",
      "phase": "ongoing",
      "day": 29,
      "n": "Optimize AI Chatbot Conversation & CRM Routing",
      "role": "AUTO",
      "freq": "Friday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d30_reel3",
      "phase": "ongoing",
      "day": 30,
      "n": "Produce Video Reel Creative (12/mo Cadence)",
      "role": "VE",
      "freq": "Saturday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "gd_d30_comm",
      "phase": "ongoing",
      "day": 30,
      "n": "Omnichannel Social Community Management",
      "role": "SMM",
      "freq": "Saturday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d31_kpi",
      "phase": "ongoing",
      "day": 31,
      "n": "Review Omnichannel Executive KPI Dashboard",
      "role": "AM",
      "freq": "Monday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d31_box",
      "phase": "ongoing",
      "day": 31,
      "n": "Check Mailbox Health (30 Boxes)",
      "role": "AUTO",
      "freq": "Monday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gd_d31_list",
      "phase": "ongoing",
      "day": 31,
      "n": "Build Weekly Verified Lead List (1,125 Contacts)",
      "role": "DATA",
      "freq": "Monday",
      "hours": "2h",
      "deps": []
    },
    {
      "id": "gd_d31_send",
      "phase": "ongoing",
      "day": 31,
      "n": "Send Cold Email Batch (750 Sends)",
      "role": "OBS",
      "freq": "Monday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d31_li",
      "phase": "ongoing",
      "day": 31,
      "n": "Send LinkedIn Connection Requests across 3 Profiles",
      "role": "OBS",
      "freq": "Monday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d31_ghost",
      "phase": "ongoing",
      "day": 31,
      "n": "Publish Founder Ghostwriting Post (Mon)",
      "role": "GHOST",
      "freq": "Monday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "gd_d31_ads",
      "phase": "ongoing",
      "day": 31,
      "n": "Audit Meta, Google, and LinkedIn Ad Spend",
      "role": "ADS",
      "freq": "Monday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d32_send",
      "phase": "ongoing",
      "day": 32,
      "n": "Send Cold Email Batch (750 Sends)",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d32_reply_m",
      "phase": "ongoing",
      "day": 32,
      "n": "Morning Omnichannel Inbound Triage",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gd_d32_reply_e",
      "phase": "ongoing",
      "day": 32,
      "n": "Evening Omnichannel Inbound Triage",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gd_d32_reel",
      "phase": "ongoing",
      "day": 32,
      "n": "Produce Video Reel Creative (12/mo Cadence)",
      "role": "VE",
      "freq": "Tuesday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "gd_d32_blog1",
      "phase": "ongoing",
      "day": 32,
      "n": "Publish Authority SEO Blog Article 1 (8/mo Cadence)",
      "role": "CW",
      "freq": "Tuesday",
      "hours": "2h",
      "deps": []
    },
    {
      "id": "gd_d32_li",
      "phase": "ongoing",
      "day": 32,
      "n": "Send LinkedIn Connection Requests",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d33_send",
      "phase": "ongoing",
      "day": 33,
      "n": "Send Cold Email Batch (750 Sends)",
      "role": "OBS",
      "freq": "Wednesday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d33_ghost",
      "phase": "ongoing",
      "day": 33,
      "n": "Publish Founder Ghostwriting Post (Wed)",
      "role": "GHOST",
      "freq": "Wednesday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "gd_d33_opt_ads",
      "phase": "ongoing",
      "day": 33,
      "n": "Scale Winning Ads across 3 Ad Platforms",
      "role": "ADS",
      "freq": "Wednesday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "gd_d33_li",
      "phase": "ongoing",
      "day": 33,
      "n": "Send Targeted LinkedIn Outbound DMs",
      "role": "OBS",
      "freq": "Wednesday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d33_reply",
      "phase": "ongoing",
      "day": 33,
      "n": "Process Qualified Meeting Bookings",
      "role": "OBS",
      "freq": "Wednesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gd_d34_send",
      "phase": "ongoing",
      "day": 34,
      "n": "Send Cold Email Batch (750 Sends)",
      "role": "OBS",
      "freq": "Thursday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d34_reel2",
      "phase": "ongoing",
      "day": 34,
      "n": "Produce Video Reel Creative (12/mo Cadence)",
      "role": "VE",
      "freq": "Thursday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "gd_d34_blog2",
      "phase": "ongoing",
      "day": 34,
      "n": "Publish Authority SEO Blog Article 2 (8/mo Cadence)",
      "role": "CW",
      "freq": "Thursday",
      "hours": "2h",
      "deps": []
    },
    {
      "id": "gd_d34_backlink",
      "phase": "ongoing",
      "day": 34,
      "n": "Execute High DR Backlink Outreach Pitching (15/mo Target)",
      "role": "SEO_LEAD",
      "freq": "Thursday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "gd_d34_li",
      "phase": "ongoing",
      "day": 34,
      "n": "Send LinkedIn Connection Requests",
      "role": "OBS",
      "freq": "Thursday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d35_send",
      "phase": "ongoing",
      "day": 35,
      "n": "Send Cold Email Batch (750 Sends)",
      "role": "OBS",
      "freq": "Friday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d35_ghost",
      "phase": "ongoing",
      "day": 35,
      "n": "Publish Founder Ghostwriting Post (Fri)",
      "role": "GHOST",
      "freq": "Friday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "gd_d35_seo_audit",
      "phase": "ongoing",
      "day": 35,
      "n": "Audit 30 Tracked SEO Keywords Performance",
      "role": "SEO_LEAD",
      "freq": "Friday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d35_ai_opt",
      "phase": "ongoing",
      "day": 35,
      "n": "Optimize AI Chatbot Conversation & CRM Routing",
      "role": "AUTO",
      "freq": "Friday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d36_reel3",
      "phase": "ongoing",
      "day": 36,
      "n": "Produce Video Reel Creative (12/mo Cadence)",
      "role": "VE",
      "freq": "Saturday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "gd_d36_comm",
      "phase": "ongoing",
      "day": 36,
      "n": "Omnichannel Social Community Management",
      "role": "SMM",
      "freq": "Saturday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d37_kpi",
      "phase": "ongoing",
      "day": 37,
      "n": "Review Omnichannel Executive KPI Dashboard",
      "role": "AM",
      "freq": "Monday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d37_box",
      "phase": "ongoing",
      "day": 37,
      "n": "Check Mailbox Health (30 Boxes)",
      "role": "AUTO",
      "freq": "Monday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gd_d37_list",
      "phase": "ongoing",
      "day": 37,
      "n": "Build Weekly Verified Lead List (1,125 Contacts)",
      "role": "DATA",
      "freq": "Monday",
      "hours": "2h",
      "deps": []
    },
    {
      "id": "gd_d37_send",
      "phase": "ongoing",
      "day": 37,
      "n": "Send Cold Email Batch (750 Sends)",
      "role": "OBS",
      "freq": "Monday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d37_li",
      "phase": "ongoing",
      "day": 37,
      "n": "Send LinkedIn Connection Requests across 3 Profiles",
      "role": "OBS",
      "freq": "Monday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d37_ghost",
      "phase": "ongoing",
      "day": 37,
      "n": "Publish Founder Ghostwriting Post (Mon)",
      "role": "GHOST",
      "freq": "Monday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "gd_d37_ads",
      "phase": "ongoing",
      "day": 37,
      "n": "Audit Meta, Google, and LinkedIn Ad Spend",
      "role": "ADS",
      "freq": "Monday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d38_send",
      "phase": "ongoing",
      "day": 38,
      "n": "Send Cold Email Batch (750 Sends)",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d38_reply_m",
      "phase": "ongoing",
      "day": 38,
      "n": "Morning Omnichannel Inbound Triage",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gd_d38_reply_e",
      "phase": "ongoing",
      "day": 38,
      "n": "Evening Omnichannel Inbound Triage",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gd_d38_reel",
      "phase": "ongoing",
      "day": 38,
      "n": "Produce Video Reel Creative (12/mo Cadence)",
      "role": "VE",
      "freq": "Tuesday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "gd_d38_blog1",
      "phase": "ongoing",
      "day": 38,
      "n": "Publish Authority SEO Blog Article 1 (8/mo Cadence)",
      "role": "CW",
      "freq": "Tuesday",
      "hours": "2h",
      "deps": []
    },
    {
      "id": "gd_d38_li",
      "phase": "ongoing",
      "day": 38,
      "n": "Send LinkedIn Connection Requests",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d39_send",
      "phase": "ongoing",
      "day": 39,
      "n": "Send Cold Email Batch (750 Sends)",
      "role": "OBS",
      "freq": "Wednesday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d39_ghost",
      "phase": "ongoing",
      "day": 39,
      "n": "Publish Founder Ghostwriting Post (Wed)",
      "role": "GHOST",
      "freq": "Wednesday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "gd_d39_opt_ads",
      "phase": "ongoing",
      "day": 39,
      "n": "Scale Winning Ads across 3 Ad Platforms",
      "role": "ADS",
      "freq": "Wednesday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "gd_d39_li",
      "phase": "ongoing",
      "day": 39,
      "n": "Send Targeted LinkedIn Outbound DMs",
      "role": "OBS",
      "freq": "Wednesday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d39_reply",
      "phase": "ongoing",
      "day": 39,
      "n": "Process Qualified Meeting Bookings",
      "role": "OBS",
      "freq": "Wednesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gd_d40_send",
      "phase": "ongoing",
      "day": 40,
      "n": "Send Cold Email Batch (750 Sends)",
      "role": "OBS",
      "freq": "Thursday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d40_reel2",
      "phase": "ongoing",
      "day": 40,
      "n": "Produce Video Reel Creative (12/mo Cadence)",
      "role": "VE",
      "freq": "Thursday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "gd_d40_blog2",
      "phase": "ongoing",
      "day": 40,
      "n": "Publish Authority SEO Blog Article 2 (8/mo Cadence)",
      "role": "CW",
      "freq": "Thursday",
      "hours": "2h",
      "deps": []
    },
    {
      "id": "gd_d40_backlink",
      "phase": "ongoing",
      "day": 40,
      "n": "Execute High DR Backlink Outreach Pitching (15/mo Target)",
      "role": "SEO_LEAD",
      "freq": "Thursday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "gd_d40_li",
      "phase": "ongoing",
      "day": 40,
      "n": "Send LinkedIn Connection Requests",
      "role": "OBS",
      "freq": "Thursday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d41_send",
      "phase": "ongoing",
      "day": 41,
      "n": "Send Cold Email Batch (750 Sends)",
      "role": "OBS",
      "freq": "Friday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d41_ghost",
      "phase": "ongoing",
      "day": 41,
      "n": "Publish Founder Ghostwriting Post (Fri)",
      "role": "GHOST",
      "freq": "Friday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "gd_d41_seo_audit",
      "phase": "ongoing",
      "day": 41,
      "n": "Audit 30 Tracked SEO Keywords Performance",
      "role": "SEO_LEAD",
      "freq": "Friday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d41_ai_opt",
      "phase": "ongoing",
      "day": 41,
      "n": "Optimize AI Chatbot Conversation & CRM Routing",
      "role": "AUTO",
      "freq": "Friday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d42_reel3",
      "phase": "ongoing",
      "day": 42,
      "n": "Produce Video Reel Creative (12/mo Cadence)",
      "role": "VE",
      "freq": "Saturday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "gd_d42_comm",
      "phase": "ongoing",
      "day": 42,
      "n": "Omnichannel Social Community Management",
      "role": "SMM",
      "freq": "Saturday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d43_kpi",
      "phase": "ongoing",
      "day": 43,
      "n": "Review Omnichannel Executive KPI Dashboard",
      "role": "AM",
      "freq": "Monday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d43_box",
      "phase": "ongoing",
      "day": 43,
      "n": "Check Mailbox Health (30 Boxes)",
      "role": "AUTO",
      "freq": "Monday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gd_d43_list",
      "phase": "ongoing",
      "day": 43,
      "n": "Build Weekly Verified Lead List (1,125 Contacts)",
      "role": "DATA",
      "freq": "Monday",
      "hours": "2h",
      "deps": []
    },
    {
      "id": "gd_d43_send",
      "phase": "ongoing",
      "day": 43,
      "n": "Send Cold Email Batch (750 Sends)",
      "role": "OBS",
      "freq": "Monday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d43_li",
      "phase": "ongoing",
      "day": 43,
      "n": "Send LinkedIn Connection Requests across 3 Profiles",
      "role": "OBS",
      "freq": "Monday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d43_ghost",
      "phase": "ongoing",
      "day": 43,
      "n": "Publish Founder Ghostwriting Post (Mon)",
      "role": "GHOST",
      "freq": "Monday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "gd_d43_ads",
      "phase": "ongoing",
      "day": 43,
      "n": "Audit Meta, Google, and LinkedIn Ad Spend",
      "role": "ADS",
      "freq": "Monday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d44_send",
      "phase": "ongoing",
      "day": 44,
      "n": "Send Cold Email Batch (750 Sends)",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d44_reply_m",
      "phase": "ongoing",
      "day": 44,
      "n": "Morning Omnichannel Inbound Triage",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gd_d44_reply_e",
      "phase": "ongoing",
      "day": 44,
      "n": "Evening Omnichannel Inbound Triage",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gd_d44_reel",
      "phase": "ongoing",
      "day": 44,
      "n": "Produce Video Reel Creative (12/mo Cadence)",
      "role": "VE",
      "freq": "Tuesday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "gd_d44_blog1",
      "phase": "ongoing",
      "day": 44,
      "n": "Publish Authority SEO Blog Article 1 (8/mo Cadence)",
      "role": "CW",
      "freq": "Tuesday",
      "hours": "2h",
      "deps": []
    },
    {
      "id": "gd_d44_li",
      "phase": "ongoing",
      "day": 44,
      "n": "Send LinkedIn Connection Requests",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d45_send",
      "phase": "ongoing",
      "day": 45,
      "n": "Send Cold Email Batch (750 Sends)",
      "role": "OBS",
      "freq": "Wednesday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d45_ghost",
      "phase": "ongoing",
      "day": 45,
      "n": "Publish Founder Ghostwriting Post (Wed)",
      "role": "GHOST",
      "freq": "Wednesday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "gd_d45_opt_ads",
      "phase": "ongoing",
      "day": 45,
      "n": "Scale Winning Ads across 3 Ad Platforms",
      "role": "ADS",
      "freq": "Wednesday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "gd_d45_li",
      "phase": "ongoing",
      "day": 45,
      "n": "Send Targeted LinkedIn Outbound DMs",
      "role": "OBS",
      "freq": "Wednesday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d45_reply",
      "phase": "ongoing",
      "day": 45,
      "n": "Process Qualified Meeting Bookings",
      "role": "OBS",
      "freq": "Wednesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gd_d46_send",
      "phase": "ongoing",
      "day": 46,
      "n": "Send Cold Email Batch (750 Sends)",
      "role": "OBS",
      "freq": "Thursday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d46_reel2",
      "phase": "ongoing",
      "day": 46,
      "n": "Produce Video Reel Creative (12/mo Cadence)",
      "role": "VE",
      "freq": "Thursday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "gd_d46_blog2",
      "phase": "ongoing",
      "day": 46,
      "n": "Publish Authority SEO Blog Article 2 (8/mo Cadence)",
      "role": "CW",
      "freq": "Thursday",
      "hours": "2h",
      "deps": []
    },
    {
      "id": "gd_d46_backlink",
      "phase": "ongoing",
      "day": 46,
      "n": "Execute High DR Backlink Outreach Pitching (15/mo Target)",
      "role": "SEO_LEAD",
      "freq": "Thursday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "gd_d46_li",
      "phase": "ongoing",
      "day": 46,
      "n": "Send LinkedIn Connection Requests",
      "role": "OBS",
      "freq": "Thursday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d47_send",
      "phase": "ongoing",
      "day": 47,
      "n": "Send Cold Email Batch (750 Sends)",
      "role": "OBS",
      "freq": "Friday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d47_ghost",
      "phase": "ongoing",
      "day": 47,
      "n": "Publish Founder Ghostwriting Post (Fri)",
      "role": "GHOST",
      "freq": "Friday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "gd_d47_seo_audit",
      "phase": "ongoing",
      "day": 47,
      "n": "Audit 30 Tracked SEO Keywords Performance",
      "role": "SEO_LEAD",
      "freq": "Friday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d47_ai_opt",
      "phase": "ongoing",
      "day": 47,
      "n": "Optimize AI Chatbot Conversation & CRM Routing",
      "role": "AUTO",
      "freq": "Friday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d48_reel3",
      "phase": "ongoing",
      "day": 48,
      "n": "Produce Video Reel Creative (12/mo Cadence)",
      "role": "VE",
      "freq": "Saturday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "gd_d48_comm",
      "phase": "ongoing",
      "day": 48,
      "n": "Omnichannel Social Community Management",
      "role": "SMM",
      "freq": "Saturday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d49_kpi",
      "phase": "ongoing",
      "day": 49,
      "n": "Review Omnichannel Executive KPI Dashboard",
      "role": "AM",
      "freq": "Monday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d49_box",
      "phase": "ongoing",
      "day": 49,
      "n": "Check Mailbox Health (30 Boxes)",
      "role": "AUTO",
      "freq": "Monday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gd_d49_list",
      "phase": "ongoing",
      "day": 49,
      "n": "Build Weekly Verified Lead List (1,125 Contacts)",
      "role": "DATA",
      "freq": "Monday",
      "hours": "2h",
      "deps": []
    },
    {
      "id": "gd_d49_send",
      "phase": "ongoing",
      "day": 49,
      "n": "Send Cold Email Batch (750 Sends)",
      "role": "OBS",
      "freq": "Monday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d49_li",
      "phase": "ongoing",
      "day": 49,
      "n": "Send LinkedIn Connection Requests across 3 Profiles",
      "role": "OBS",
      "freq": "Monday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d49_ghost",
      "phase": "ongoing",
      "day": 49,
      "n": "Publish Founder Ghostwriting Post (Mon)",
      "role": "GHOST",
      "freq": "Monday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "gd_d49_ads",
      "phase": "ongoing",
      "day": 49,
      "n": "Audit Meta, Google, and LinkedIn Ad Spend",
      "role": "ADS",
      "freq": "Monday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d50_send",
      "phase": "ongoing",
      "day": 50,
      "n": "Send Cold Email Batch (750 Sends)",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d50_reply_m",
      "phase": "ongoing",
      "day": 50,
      "n": "Morning Omnichannel Inbound Triage",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gd_d50_reply_e",
      "phase": "ongoing",
      "day": 50,
      "n": "Evening Omnichannel Inbound Triage",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gd_d50_reel",
      "phase": "ongoing",
      "day": 50,
      "n": "Produce Video Reel Creative (12/mo Cadence)",
      "role": "VE",
      "freq": "Tuesday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "gd_d50_blog1",
      "phase": "ongoing",
      "day": 50,
      "n": "Publish Authority SEO Blog Article 1 (8/mo Cadence)",
      "role": "CW",
      "freq": "Tuesday",
      "hours": "2h",
      "deps": []
    },
    {
      "id": "gd_d50_li",
      "phase": "ongoing",
      "day": 50,
      "n": "Send LinkedIn Connection Requests",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d51_send",
      "phase": "ongoing",
      "day": 51,
      "n": "Send Cold Email Batch (750 Sends)",
      "role": "OBS",
      "freq": "Wednesday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d51_ghost",
      "phase": "ongoing",
      "day": 51,
      "n": "Publish Founder Ghostwriting Post (Wed)",
      "role": "GHOST",
      "freq": "Wednesday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "gd_d51_opt_ads",
      "phase": "ongoing",
      "day": 51,
      "n": "Scale Winning Ads across 3 Ad Platforms",
      "role": "ADS",
      "freq": "Wednesday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "gd_d51_li",
      "phase": "ongoing",
      "day": 51,
      "n": "Send Targeted LinkedIn Outbound DMs",
      "role": "OBS",
      "freq": "Wednesday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d51_reply",
      "phase": "ongoing",
      "day": 51,
      "n": "Process Qualified Meeting Bookings",
      "role": "OBS",
      "freq": "Wednesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gd_d52_send",
      "phase": "ongoing",
      "day": 52,
      "n": "Send Cold Email Batch (750 Sends)",
      "role": "OBS",
      "freq": "Thursday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d52_reel2",
      "phase": "ongoing",
      "day": 52,
      "n": "Produce Video Reel Creative (12/mo Cadence)",
      "role": "VE",
      "freq": "Thursday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "gd_d52_blog2",
      "phase": "ongoing",
      "day": 52,
      "n": "Publish Authority SEO Blog Article 2 (8/mo Cadence)",
      "role": "CW",
      "freq": "Thursday",
      "hours": "2h",
      "deps": []
    },
    {
      "id": "gd_d52_backlink",
      "phase": "ongoing",
      "day": 52,
      "n": "Execute High DR Backlink Outreach Pitching (15/mo Target)",
      "role": "SEO_LEAD",
      "freq": "Thursday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "gd_d52_li",
      "phase": "ongoing",
      "day": 52,
      "n": "Send LinkedIn Connection Requests",
      "role": "OBS",
      "freq": "Thursday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d53_send",
      "phase": "ongoing",
      "day": 53,
      "n": "Send Cold Email Batch (750 Sends)",
      "role": "OBS",
      "freq": "Friday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d53_ghost",
      "phase": "ongoing",
      "day": 53,
      "n": "Publish Founder Ghostwriting Post (Fri)",
      "role": "GHOST",
      "freq": "Friday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "gd_d53_seo_audit",
      "phase": "ongoing",
      "day": 53,
      "n": "Audit 30 Tracked SEO Keywords Performance",
      "role": "SEO_LEAD",
      "freq": "Friday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d53_ai_opt",
      "phase": "ongoing",
      "day": 53,
      "n": "Optimize AI Chatbot Conversation & CRM Routing",
      "role": "AUTO",
      "freq": "Friday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d54_reel3",
      "phase": "ongoing",
      "day": 54,
      "n": "Produce Video Reel Creative (12/mo Cadence)",
      "role": "VE",
      "freq": "Saturday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "gd_d54_comm",
      "phase": "ongoing",
      "day": 54,
      "n": "Omnichannel Social Community Management",
      "role": "SMM",
      "freq": "Saturday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d55_kpi",
      "phase": "ongoing",
      "day": 55,
      "n": "Review Omnichannel Executive KPI Dashboard",
      "role": "AM",
      "freq": "Monday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d55_box",
      "phase": "ongoing",
      "day": 55,
      "n": "Check Mailbox Health (30 Boxes)",
      "role": "AUTO",
      "freq": "Monday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gd_d55_list",
      "phase": "ongoing",
      "day": 55,
      "n": "Build Weekly Verified Lead List (1,125 Contacts)",
      "role": "DATA",
      "freq": "Monday",
      "hours": "2h",
      "deps": []
    },
    {
      "id": "gd_d55_send",
      "phase": "ongoing",
      "day": 55,
      "n": "Send Cold Email Batch (750 Sends)",
      "role": "OBS",
      "freq": "Monday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d55_li",
      "phase": "ongoing",
      "day": 55,
      "n": "Send LinkedIn Connection Requests across 3 Profiles",
      "role": "OBS",
      "freq": "Monday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d55_ghost",
      "phase": "ongoing",
      "day": 55,
      "n": "Publish Founder Ghostwriting Post (Mon)",
      "role": "GHOST",
      "freq": "Monday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "gd_d55_ads",
      "phase": "ongoing",
      "day": 55,
      "n": "Audit Meta, Google, and LinkedIn Ad Spend",
      "role": "ADS",
      "freq": "Monday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_m55_cal",
      "phase": "ongoing",
      "day": 55,
      "n": "Submit Next Month Content Calendar for Client Approval",
      "role": "SMM",
      "priority": "normal",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d56_send",
      "phase": "ongoing",
      "day": 56,
      "n": "Send Cold Email Batch (750 Sends)",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d56_reply_m",
      "phase": "ongoing",
      "day": 56,
      "n": "Morning Omnichannel Inbound Triage",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gd_d56_reply_e",
      "phase": "ongoing",
      "day": 56,
      "n": "Evening Omnichannel Inbound Triage",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gd_d56_reel",
      "phase": "ongoing",
      "day": 56,
      "n": "Produce Video Reel Creative (12/mo Cadence)",
      "role": "VE",
      "freq": "Tuesday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "gd_d56_blog1",
      "phase": "ongoing",
      "day": 56,
      "n": "Publish Authority SEO Blog Article 1 (8/mo Cadence)",
      "role": "CW",
      "freq": "Tuesday",
      "hours": "2h",
      "deps": []
    },
    {
      "id": "gd_d56_li",
      "phase": "ongoing",
      "day": 56,
      "n": "Send LinkedIn Connection Requests",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d57_send",
      "phase": "ongoing",
      "day": 57,
      "n": "Send Cold Email Batch (750 Sends)",
      "role": "OBS",
      "freq": "Wednesday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d57_ghost",
      "phase": "ongoing",
      "day": 57,
      "n": "Publish Founder Ghostwriting Post (Wed)",
      "role": "GHOST",
      "freq": "Wednesday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "gd_d57_opt_ads",
      "phase": "ongoing",
      "day": 57,
      "n": "Scale Winning Ads across 3 Ad Platforms",
      "role": "ADS",
      "freq": "Wednesday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "gd_d57_li",
      "phase": "ongoing",
      "day": 57,
      "n": "Send Targeted LinkedIn Outbound DMs",
      "role": "OBS",
      "freq": "Wednesday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d57_reply",
      "phase": "ongoing",
      "day": 57,
      "n": "Process Qualified Meeting Bookings",
      "role": "OBS",
      "freq": "Wednesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gd_d58_send",
      "phase": "ongoing",
      "day": 58,
      "n": "Send Cold Email Batch (750 Sends)",
      "role": "OBS",
      "freq": "Thursday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d58_reel2",
      "phase": "ongoing",
      "day": 58,
      "n": "Produce Video Reel Creative (12/mo Cadence)",
      "role": "VE",
      "freq": "Thursday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "gd_d58_blog2",
      "phase": "ongoing",
      "day": 58,
      "n": "Publish Authority SEO Blog Article 2 (8/mo Cadence)",
      "role": "CW",
      "freq": "Thursday",
      "hours": "2h",
      "deps": []
    },
    {
      "id": "gd_d58_backlink",
      "phase": "ongoing",
      "day": 58,
      "n": "Execute High DR Backlink Outreach Pitching (15/mo Target)",
      "role": "SEO_LEAD",
      "freq": "Thursday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "gd_d58_li",
      "phase": "ongoing",
      "day": 58,
      "n": "Send LinkedIn Connection Requests",
      "role": "OBS",
      "freq": "Thursday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d59_send",
      "phase": "ongoing",
      "day": 59,
      "n": "Send Cold Email Batch (750 Sends)",
      "role": "OBS",
      "freq": "Friday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d59_ghost",
      "phase": "ongoing",
      "day": 59,
      "n": "Publish Founder Ghostwriting Post (Fri)",
      "role": "GHOST",
      "freq": "Friday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "gd_d59_seo_audit",
      "phase": "ongoing",
      "day": 59,
      "n": "Audit 30 Tracked SEO Keywords Performance",
      "role": "SEO_LEAD",
      "freq": "Friday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d59_ai_opt",
      "phase": "ongoing",
      "day": 59,
      "n": "Optimize AI Chatbot Conversation & CRM Routing",
      "role": "AUTO",
      "freq": "Friday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d60_reel3",
      "phase": "ongoing",
      "day": 60,
      "n": "Produce Video Reel Creative (12/mo Cadence)",
      "role": "VE",
      "freq": "Saturday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "gd_d60_comm",
      "phase": "ongoing",
      "day": 60,
      "n": "Omnichannel Social Community Management",
      "role": "SMM",
      "freq": "Saturday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d61_kpi",
      "phase": "ongoing",
      "day": 61,
      "n": "Review Omnichannel Executive KPI Dashboard",
      "role": "AM",
      "freq": "Monday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d61_box",
      "phase": "ongoing",
      "day": 61,
      "n": "Check Mailbox Health (30 Boxes)",
      "role": "AUTO",
      "freq": "Monday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gd_d61_list",
      "phase": "ongoing",
      "day": 61,
      "n": "Build Weekly Verified Lead List (1,125 Contacts)",
      "role": "DATA",
      "freq": "Monday",
      "hours": "2h",
      "deps": []
    },
    {
      "id": "gd_d61_send",
      "phase": "ongoing",
      "day": 61,
      "n": "Send Cold Email Batch (750 Sends)",
      "role": "OBS",
      "freq": "Monday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d61_li",
      "phase": "ongoing",
      "day": 61,
      "n": "Send LinkedIn Connection Requests across 3 Profiles",
      "role": "OBS",
      "freq": "Monday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d61_ghost",
      "phase": "ongoing",
      "day": 61,
      "n": "Publish Founder Ghostwriting Post (Mon)",
      "role": "GHOST",
      "freq": "Monday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "gd_d61_ads",
      "phase": "ongoing",
      "day": 61,
      "n": "Audit Meta, Google, and LinkedIn Ad Spend",
      "role": "ADS",
      "freq": "Monday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d62_send",
      "phase": "ongoing",
      "day": 62,
      "n": "Send Cold Email Batch (750 Sends)",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d62_reply_m",
      "phase": "ongoing",
      "day": 62,
      "n": "Morning Omnichannel Inbound Triage",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gd_d62_reply_e",
      "phase": "ongoing",
      "day": 62,
      "n": "Evening Omnichannel Inbound Triage",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gd_d62_reel",
      "phase": "ongoing",
      "day": 62,
      "n": "Produce Video Reel Creative (12/mo Cadence)",
      "role": "VE",
      "freq": "Tuesday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "gd_d62_blog1",
      "phase": "ongoing",
      "day": 62,
      "n": "Publish Authority SEO Blog Article 1 (8/mo Cadence)",
      "role": "CW",
      "freq": "Tuesday",
      "hours": "2h",
      "deps": []
    },
    {
      "id": "gd_d62_li",
      "phase": "ongoing",
      "day": 62,
      "n": "Send LinkedIn Connection Requests",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d63_send",
      "phase": "ongoing",
      "day": 63,
      "n": "Send Cold Email Batch (750 Sends)",
      "role": "OBS",
      "freq": "Wednesday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d63_ghost",
      "phase": "ongoing",
      "day": 63,
      "n": "Publish Founder Ghostwriting Post (Wed)",
      "role": "GHOST",
      "freq": "Wednesday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "gd_d63_opt_ads",
      "phase": "ongoing",
      "day": 63,
      "n": "Scale Winning Ads across 3 Ad Platforms",
      "role": "ADS",
      "freq": "Wednesday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "gd_d63_li",
      "phase": "ongoing",
      "day": 63,
      "n": "Send Targeted LinkedIn Outbound DMs",
      "role": "OBS",
      "freq": "Wednesday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d63_reply",
      "phase": "ongoing",
      "day": 63,
      "n": "Process Qualified Meeting Bookings",
      "role": "OBS",
      "freq": "Wednesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gd_d64_send",
      "phase": "ongoing",
      "day": 64,
      "n": "Send Cold Email Batch (750 Sends)",
      "role": "OBS",
      "freq": "Thursday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d64_reel2",
      "phase": "ongoing",
      "day": 64,
      "n": "Produce Video Reel Creative (12/mo Cadence)",
      "role": "VE",
      "freq": "Thursday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "gd_d64_blog2",
      "phase": "ongoing",
      "day": 64,
      "n": "Publish Authority SEO Blog Article 2 (8/mo Cadence)",
      "role": "CW",
      "freq": "Thursday",
      "hours": "2h",
      "deps": []
    },
    {
      "id": "gd_d64_backlink",
      "phase": "ongoing",
      "day": 64,
      "n": "Execute High DR Backlink Outreach Pitching (15/mo Target)",
      "role": "SEO_LEAD",
      "freq": "Thursday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "gd_d64_li",
      "phase": "ongoing",
      "day": 64,
      "n": "Send LinkedIn Connection Requests",
      "role": "OBS",
      "freq": "Thursday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d65_send",
      "phase": "ongoing",
      "day": 65,
      "n": "Send Cold Email Batch (750 Sends)",
      "role": "OBS",
      "freq": "Friday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d65_ghost",
      "phase": "ongoing",
      "day": 65,
      "n": "Publish Founder Ghostwriting Post (Fri)",
      "role": "GHOST",
      "freq": "Friday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "gd_d65_seo_audit",
      "phase": "ongoing",
      "day": 65,
      "n": "Audit 30 Tracked SEO Keywords Performance",
      "role": "SEO_LEAD",
      "freq": "Friday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d65_ai_opt",
      "phase": "ongoing",
      "day": 65,
      "n": "Optimize AI Chatbot Conversation & CRM Routing",
      "role": "AUTO",
      "freq": "Friday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d66_reel3",
      "phase": "ongoing",
      "day": 66,
      "n": "Produce Video Reel Creative (12/mo Cadence)",
      "role": "VE",
      "freq": "Saturday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "gd_d66_comm",
      "phase": "ongoing",
      "day": 66,
      "n": "Omnichannel Social Community Management",
      "role": "SMM",
      "freq": "Saturday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d67_kpi",
      "phase": "ongoing",
      "day": 67,
      "n": "Review Omnichannel Executive KPI Dashboard",
      "role": "AM",
      "freq": "Monday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d67_box",
      "phase": "ongoing",
      "day": 67,
      "n": "Check Mailbox Health (30 Boxes)",
      "role": "AUTO",
      "freq": "Monday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gd_d67_list",
      "phase": "ongoing",
      "day": 67,
      "n": "Build Weekly Verified Lead List (1,125 Contacts)",
      "role": "DATA",
      "freq": "Monday",
      "hours": "2h",
      "deps": []
    },
    {
      "id": "gd_d67_send",
      "phase": "ongoing",
      "day": 67,
      "n": "Send Cold Email Batch (750 Sends)",
      "role": "OBS",
      "freq": "Monday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d67_li",
      "phase": "ongoing",
      "day": 67,
      "n": "Send LinkedIn Connection Requests across 3 Profiles",
      "role": "OBS",
      "freq": "Monday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d67_ghost",
      "phase": "ongoing",
      "day": 67,
      "n": "Publish Founder Ghostwriting Post (Mon)",
      "role": "GHOST",
      "freq": "Monday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "gd_d67_ads",
      "phase": "ongoing",
      "day": 67,
      "n": "Audit Meta, Google, and LinkedIn Ad Spend",
      "role": "ADS",
      "freq": "Monday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d68_send",
      "phase": "ongoing",
      "day": 68,
      "n": "Send Cold Email Batch (750 Sends)",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d68_reply_m",
      "phase": "ongoing",
      "day": 68,
      "n": "Morning Omnichannel Inbound Triage",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gd_d68_reply_e",
      "phase": "ongoing",
      "day": 68,
      "n": "Evening Omnichannel Inbound Triage",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gd_d68_reel",
      "phase": "ongoing",
      "day": 68,
      "n": "Produce Video Reel Creative (12/mo Cadence)",
      "role": "VE",
      "freq": "Tuesday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "gd_d68_blog1",
      "phase": "ongoing",
      "day": 68,
      "n": "Publish Authority SEO Blog Article 1 (8/mo Cadence)",
      "role": "CW",
      "freq": "Tuesday",
      "hours": "2h",
      "deps": []
    },
    {
      "id": "gd_d68_li",
      "phase": "ongoing",
      "day": 68,
      "n": "Send LinkedIn Connection Requests",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d69_send",
      "phase": "ongoing",
      "day": 69,
      "n": "Send Cold Email Batch (750 Sends)",
      "role": "OBS",
      "freq": "Wednesday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d69_ghost",
      "phase": "ongoing",
      "day": 69,
      "n": "Publish Founder Ghostwriting Post (Wed)",
      "role": "GHOST",
      "freq": "Wednesday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "gd_d69_opt_ads",
      "phase": "ongoing",
      "day": 69,
      "n": "Scale Winning Ads across 3 Ad Platforms",
      "role": "ADS",
      "freq": "Wednesday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "gd_d69_li",
      "phase": "ongoing",
      "day": 69,
      "n": "Send Targeted LinkedIn Outbound DMs",
      "role": "OBS",
      "freq": "Wednesday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d69_reply",
      "phase": "ongoing",
      "day": 69,
      "n": "Process Qualified Meeting Bookings",
      "role": "OBS",
      "freq": "Wednesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gd_d70_send",
      "phase": "ongoing",
      "day": 70,
      "n": "Send Cold Email Batch (750 Sends)",
      "role": "OBS",
      "freq": "Thursday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d70_reel2",
      "phase": "ongoing",
      "day": 70,
      "n": "Produce Video Reel Creative (12/mo Cadence)",
      "role": "VE",
      "freq": "Thursday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "gd_d70_blog2",
      "phase": "ongoing",
      "day": 70,
      "n": "Publish Authority SEO Blog Article 2 (8/mo Cadence)",
      "role": "CW",
      "freq": "Thursday",
      "hours": "2h",
      "deps": []
    },
    {
      "id": "gd_d70_backlink",
      "phase": "ongoing",
      "day": 70,
      "n": "Execute High DR Backlink Outreach Pitching (15/mo Target)",
      "role": "SEO_LEAD",
      "freq": "Thursday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "gd_d70_li",
      "phase": "ongoing",
      "day": 70,
      "n": "Send LinkedIn Connection Requests",
      "role": "OBS",
      "freq": "Thursday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d71_send",
      "phase": "ongoing",
      "day": 71,
      "n": "Send Cold Email Batch (750 Sends)",
      "role": "OBS",
      "freq": "Friday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d71_ghost",
      "phase": "ongoing",
      "day": 71,
      "n": "Publish Founder Ghostwriting Post (Fri)",
      "role": "GHOST",
      "freq": "Friday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "gd_d71_seo_audit",
      "phase": "ongoing",
      "day": 71,
      "n": "Audit 30 Tracked SEO Keywords Performance",
      "role": "SEO_LEAD",
      "freq": "Friday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d71_ai_opt",
      "phase": "ongoing",
      "day": 71,
      "n": "Optimize AI Chatbot Conversation & CRM Routing",
      "role": "AUTO",
      "freq": "Friday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d72_reel3",
      "phase": "ongoing",
      "day": 72,
      "n": "Produce Video Reel Creative (12/mo Cadence)",
      "role": "VE",
      "freq": "Saturday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "gd_d72_comm",
      "phase": "ongoing",
      "day": 72,
      "n": "Omnichannel Social Community Management",
      "role": "SMM",
      "freq": "Saturday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d73_kpi",
      "phase": "ongoing",
      "day": 73,
      "n": "Review Omnichannel Executive KPI Dashboard",
      "role": "AM",
      "freq": "Monday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d73_box",
      "phase": "ongoing",
      "day": 73,
      "n": "Check Mailbox Health (30 Boxes)",
      "role": "AUTO",
      "freq": "Monday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gd_d73_list",
      "phase": "ongoing",
      "day": 73,
      "n": "Build Weekly Verified Lead List (1,125 Contacts)",
      "role": "DATA",
      "freq": "Monday",
      "hours": "2h",
      "deps": []
    },
    {
      "id": "gd_d73_send",
      "phase": "ongoing",
      "day": 73,
      "n": "Send Cold Email Batch (750 Sends)",
      "role": "OBS",
      "freq": "Monday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d73_li",
      "phase": "ongoing",
      "day": 73,
      "n": "Send LinkedIn Connection Requests across 3 Profiles",
      "role": "OBS",
      "freq": "Monday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d73_ghost",
      "phase": "ongoing",
      "day": 73,
      "n": "Publish Founder Ghostwriting Post (Mon)",
      "role": "GHOST",
      "freq": "Monday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "gd_d73_ads",
      "phase": "ongoing",
      "day": 73,
      "n": "Audit Meta, Google, and LinkedIn Ad Spend",
      "role": "ADS",
      "freq": "Monday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d74_send",
      "phase": "ongoing",
      "day": 74,
      "n": "Send Cold Email Batch (750 Sends)",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d74_reply_m",
      "phase": "ongoing",
      "day": 74,
      "n": "Morning Omnichannel Inbound Triage",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gd_d74_reply_e",
      "phase": "ongoing",
      "day": 74,
      "n": "Evening Omnichannel Inbound Triage",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gd_d74_reel",
      "phase": "ongoing",
      "day": 74,
      "n": "Produce Video Reel Creative (12/mo Cadence)",
      "role": "VE",
      "freq": "Tuesday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "gd_d74_blog1",
      "phase": "ongoing",
      "day": 74,
      "n": "Publish Authority SEO Blog Article 1 (8/mo Cadence)",
      "role": "CW",
      "freq": "Tuesday",
      "hours": "2h",
      "deps": []
    },
    {
      "id": "gd_d74_li",
      "phase": "ongoing",
      "day": 74,
      "n": "Send LinkedIn Connection Requests",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d75_send",
      "phase": "ongoing",
      "day": 75,
      "n": "Send Cold Email Batch (750 Sends)",
      "role": "OBS",
      "freq": "Wednesday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d75_ghost",
      "phase": "ongoing",
      "day": 75,
      "n": "Publish Founder Ghostwriting Post (Wed)",
      "role": "GHOST",
      "freq": "Wednesday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "gd_d75_opt_ads",
      "phase": "ongoing",
      "day": 75,
      "n": "Scale Winning Ads across 3 Ad Platforms",
      "role": "ADS",
      "freq": "Wednesday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "gd_d75_li",
      "phase": "ongoing",
      "day": 75,
      "n": "Send Targeted LinkedIn Outbound DMs",
      "role": "OBS",
      "freq": "Wednesday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d75_reply",
      "phase": "ongoing",
      "day": 75,
      "n": "Process Qualified Meeting Bookings",
      "role": "OBS",
      "freq": "Wednesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gd_d76_send",
      "phase": "ongoing",
      "day": 76,
      "n": "Send Cold Email Batch (750 Sends)",
      "role": "OBS",
      "freq": "Thursday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d76_reel2",
      "phase": "ongoing",
      "day": 76,
      "n": "Produce Video Reel Creative (12/mo Cadence)",
      "role": "VE",
      "freq": "Thursday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "gd_d76_blog2",
      "phase": "ongoing",
      "day": 76,
      "n": "Publish Authority SEO Blog Article 2 (8/mo Cadence)",
      "role": "CW",
      "freq": "Thursday",
      "hours": "2h",
      "deps": []
    },
    {
      "id": "gd_d76_backlink",
      "phase": "ongoing",
      "day": 76,
      "n": "Execute High DR Backlink Outreach Pitching (15/mo Target)",
      "role": "SEO_LEAD",
      "freq": "Thursday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "gd_d76_li",
      "phase": "ongoing",
      "day": 76,
      "n": "Send LinkedIn Connection Requests",
      "role": "OBS",
      "freq": "Thursday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d77_send",
      "phase": "ongoing",
      "day": 77,
      "n": "Send Cold Email Batch (750 Sends)",
      "role": "OBS",
      "freq": "Friday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d77_ghost",
      "phase": "ongoing",
      "day": 77,
      "n": "Publish Founder Ghostwriting Post (Fri)",
      "role": "GHOST",
      "freq": "Friday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "gd_d77_seo_audit",
      "phase": "ongoing",
      "day": 77,
      "n": "Audit 30 Tracked SEO Keywords Performance",
      "role": "SEO_LEAD",
      "freq": "Friday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d77_ai_opt",
      "phase": "ongoing",
      "day": 77,
      "n": "Optimize AI Chatbot Conversation & CRM Routing",
      "role": "AUTO",
      "freq": "Friday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d78_reel3",
      "phase": "ongoing",
      "day": 78,
      "n": "Produce Video Reel Creative (12/mo Cadence)",
      "role": "VE",
      "freq": "Saturday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "gd_d78_comm",
      "phase": "ongoing",
      "day": 78,
      "n": "Omnichannel Social Community Management",
      "role": "SMM",
      "freq": "Saturday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d79_kpi",
      "phase": "ongoing",
      "day": 79,
      "n": "Review Omnichannel Executive KPI Dashboard",
      "role": "AM",
      "freq": "Monday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d79_box",
      "phase": "ongoing",
      "day": 79,
      "n": "Check Mailbox Health (30 Boxes)",
      "role": "AUTO",
      "freq": "Monday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gd_d79_list",
      "phase": "ongoing",
      "day": 79,
      "n": "Build Weekly Verified Lead List (1,125 Contacts)",
      "role": "DATA",
      "freq": "Monday",
      "hours": "2h",
      "deps": []
    },
    {
      "id": "gd_d79_send",
      "phase": "ongoing",
      "day": 79,
      "n": "Send Cold Email Batch (750 Sends)",
      "role": "OBS",
      "freq": "Monday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d79_li",
      "phase": "ongoing",
      "day": 79,
      "n": "Send LinkedIn Connection Requests across 3 Profiles",
      "role": "OBS",
      "freq": "Monday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d79_ghost",
      "phase": "ongoing",
      "day": 79,
      "n": "Publish Founder Ghostwriting Post (Mon)",
      "role": "GHOST",
      "freq": "Monday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "gd_d79_ads",
      "phase": "ongoing",
      "day": 79,
      "n": "Audit Meta, Google, and LinkedIn Ad Spend",
      "role": "ADS",
      "freq": "Monday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d80_send",
      "phase": "ongoing",
      "day": 80,
      "n": "Send Cold Email Batch (750 Sends)",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d80_reply_m",
      "phase": "ongoing",
      "day": 80,
      "n": "Morning Omnichannel Inbound Triage",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gd_d80_reply_e",
      "phase": "ongoing",
      "day": 80,
      "n": "Evening Omnichannel Inbound Triage",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gd_d80_reel",
      "phase": "ongoing",
      "day": 80,
      "n": "Produce Video Reel Creative (12/mo Cadence)",
      "role": "VE",
      "freq": "Tuesday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "gd_d80_blog1",
      "phase": "ongoing",
      "day": 80,
      "n": "Publish Authority SEO Blog Article 1 (8/mo Cadence)",
      "role": "CW",
      "freq": "Tuesday",
      "hours": "2h",
      "deps": []
    },
    {
      "id": "gd_d80_li",
      "phase": "ongoing",
      "day": 80,
      "n": "Send LinkedIn Connection Requests",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d81_send",
      "phase": "ongoing",
      "day": 81,
      "n": "Send Cold Email Batch (750 Sends)",
      "role": "OBS",
      "freq": "Wednesday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d81_ghost",
      "phase": "ongoing",
      "day": 81,
      "n": "Publish Founder Ghostwriting Post (Wed)",
      "role": "GHOST",
      "freq": "Wednesday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "gd_d81_opt_ads",
      "phase": "ongoing",
      "day": 81,
      "n": "Scale Winning Ads across 3 Ad Platforms",
      "role": "ADS",
      "freq": "Wednesday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "gd_d81_li",
      "phase": "ongoing",
      "day": 81,
      "n": "Send Targeted LinkedIn Outbound DMs",
      "role": "OBS",
      "freq": "Wednesday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d81_reply",
      "phase": "ongoing",
      "day": 81,
      "n": "Process Qualified Meeting Bookings",
      "role": "OBS",
      "freq": "Wednesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gd_d82_send",
      "phase": "ongoing",
      "day": 82,
      "n": "Send Cold Email Batch (750 Sends)",
      "role": "OBS",
      "freq": "Thursday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d82_reel2",
      "phase": "ongoing",
      "day": 82,
      "n": "Produce Video Reel Creative (12/mo Cadence)",
      "role": "VE",
      "freq": "Thursday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "gd_d82_blog2",
      "phase": "ongoing",
      "day": 82,
      "n": "Publish Authority SEO Blog Article 2 (8/mo Cadence)",
      "role": "CW",
      "freq": "Thursday",
      "hours": "2h",
      "deps": []
    },
    {
      "id": "gd_d82_backlink",
      "phase": "ongoing",
      "day": 82,
      "n": "Execute High DR Backlink Outreach Pitching (15/mo Target)",
      "role": "SEO_LEAD",
      "freq": "Thursday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "gd_d82_li",
      "phase": "ongoing",
      "day": 82,
      "n": "Send LinkedIn Connection Requests",
      "role": "OBS",
      "freq": "Thursday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d83_send",
      "phase": "ongoing",
      "day": 83,
      "n": "Send Cold Email Batch (750 Sends)",
      "role": "OBS",
      "freq": "Friday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d83_ghost",
      "phase": "ongoing",
      "day": 83,
      "n": "Publish Founder Ghostwriting Post (Fri)",
      "role": "GHOST",
      "freq": "Friday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "gd_d83_seo_audit",
      "phase": "ongoing",
      "day": 83,
      "n": "Audit 30 Tracked SEO Keywords Performance",
      "role": "SEO_LEAD",
      "freq": "Friday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d83_ai_opt",
      "phase": "ongoing",
      "day": 83,
      "n": "Optimize AI Chatbot Conversation & CRM Routing",
      "role": "AUTO",
      "freq": "Friday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d84_reel3",
      "phase": "ongoing",
      "day": 84,
      "n": "Produce Video Reel Creative (12/mo Cadence)",
      "role": "VE",
      "freq": "Saturday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "gd_d84_comm",
      "phase": "ongoing",
      "day": 84,
      "n": "Omnichannel Social Community Management",
      "role": "SMM",
      "freq": "Saturday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d85_kpi",
      "phase": "ongoing",
      "day": 85,
      "n": "Review Omnichannel Executive KPI Dashboard",
      "role": "AM",
      "freq": "Monday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d85_box",
      "phase": "ongoing",
      "day": 85,
      "n": "Check Mailbox Health (30 Boxes)",
      "role": "AUTO",
      "freq": "Monday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gd_d85_list",
      "phase": "ongoing",
      "day": 85,
      "n": "Build Weekly Verified Lead List (1,125 Contacts)",
      "role": "DATA",
      "freq": "Monday",
      "hours": "2h",
      "deps": []
    },
    {
      "id": "gd_d85_send",
      "phase": "ongoing",
      "day": 85,
      "n": "Send Cold Email Batch (750 Sends)",
      "role": "OBS",
      "freq": "Monday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d85_li",
      "phase": "ongoing",
      "day": 85,
      "n": "Send LinkedIn Connection Requests across 3 Profiles",
      "role": "OBS",
      "freq": "Monday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d85_ghost",
      "phase": "ongoing",
      "day": 85,
      "n": "Publish Founder Ghostwriting Post (Mon)",
      "role": "GHOST",
      "freq": "Monday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "gd_d85_ads",
      "phase": "ongoing",
      "day": 85,
      "n": "Audit Meta, Google, and LinkedIn Ad Spend",
      "role": "ADS",
      "freq": "Monday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_m85_cal",
      "phase": "ongoing",
      "day": 85,
      "n": "Submit Next Month Content Calendar for Client Approval",
      "role": "SMM",
      "priority": "normal",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d86_send",
      "phase": "ongoing",
      "day": 86,
      "n": "Send Cold Email Batch (750 Sends)",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d86_reply_m",
      "phase": "ongoing",
      "day": 86,
      "n": "Morning Omnichannel Inbound Triage",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gd_d86_reply_e",
      "phase": "ongoing",
      "day": 86,
      "n": "Evening Omnichannel Inbound Triage",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gd_d86_reel",
      "phase": "ongoing",
      "day": 86,
      "n": "Produce Video Reel Creative (12/mo Cadence)",
      "role": "VE",
      "freq": "Tuesday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "gd_d86_blog1",
      "phase": "ongoing",
      "day": 86,
      "n": "Publish Authority SEO Blog Article 1 (8/mo Cadence)",
      "role": "CW",
      "freq": "Tuesday",
      "hours": "2h",
      "deps": []
    },
    {
      "id": "gd_d86_li",
      "phase": "ongoing",
      "day": 86,
      "n": "Send LinkedIn Connection Requests",
      "role": "OBS",
      "freq": "Tuesday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d87_send",
      "phase": "ongoing",
      "day": 87,
      "n": "Send Cold Email Batch (750 Sends)",
      "role": "OBS",
      "freq": "Wednesday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d87_ghost",
      "phase": "ongoing",
      "day": 87,
      "n": "Publish Founder Ghostwriting Post (Wed)",
      "role": "GHOST",
      "freq": "Wednesday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "gd_d87_opt_ads",
      "phase": "ongoing",
      "day": 87,
      "n": "Scale Winning Ads across 3 Ad Platforms",
      "role": "ADS",
      "freq": "Wednesday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "gd_d87_li",
      "phase": "ongoing",
      "day": 87,
      "n": "Send Targeted LinkedIn Outbound DMs",
      "role": "OBS",
      "freq": "Wednesday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d87_reply",
      "phase": "ongoing",
      "day": 87,
      "n": "Process Qualified Meeting Bookings",
      "role": "OBS",
      "freq": "Wednesday",
      "hours": "0.5h",
      "deps": []
    },
    {
      "id": "gd_d88_send",
      "phase": "ongoing",
      "day": 88,
      "n": "Send Cold Email Batch (750 Sends)",
      "role": "OBS",
      "freq": "Thursday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d88_reel2",
      "phase": "ongoing",
      "day": 88,
      "n": "Produce Video Reel Creative (12/mo Cadence)",
      "role": "VE",
      "freq": "Thursday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "gd_d88_blog2",
      "phase": "ongoing",
      "day": 88,
      "n": "Publish Authority SEO Blog Article 2 (8/mo Cadence)",
      "role": "CW",
      "freq": "Thursday",
      "hours": "2h",
      "deps": []
    },
    {
      "id": "gd_d88_backlink",
      "phase": "ongoing",
      "day": 88,
      "n": "Execute High DR Backlink Outreach Pitching (15/mo Target)",
      "role": "SEO_LEAD",
      "freq": "Thursday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "gd_d88_li",
      "phase": "ongoing",
      "day": 88,
      "n": "Send LinkedIn Connection Requests",
      "role": "OBS",
      "freq": "Thursday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d89_send",
      "phase": "ongoing",
      "day": 89,
      "n": "Send Cold Email Batch (750 Sends)",
      "role": "OBS",
      "freq": "Friday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d89_ghost",
      "phase": "ongoing",
      "day": 89,
      "n": "Publish Founder Ghostwriting Post (Fri)",
      "role": "GHOST",
      "freq": "Friday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "gd_d89_seo_audit",
      "phase": "ongoing",
      "day": 89,
      "n": "Audit 30 Tracked SEO Keywords Performance",
      "role": "SEO_LEAD",
      "freq": "Friday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d89_ai_opt",
      "phase": "ongoing",
      "day": 89,
      "n": "Optimize AI Chatbot Conversation & CRM Routing",
      "role": "AUTO",
      "freq": "Friday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_d90_reel3",
      "phase": "ongoing",
      "day": 90,
      "n": "Produce Video Reel Creative (12/mo Cadence)",
      "role": "VE",
      "freq": "Saturday",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "gd_d90_comm",
      "phase": "ongoing",
      "day": 90,
      "n": "Omnichannel Social Community Management",
      "role": "SMM",
      "freq": "Saturday",
      "hours": "1h",
      "deps": []
    },
    {
      "id": "gd_m25",
      "phase": "ongoing",
      "day": 25,
      "n": "Kill Weakest Email Angle and Reallocate Its Volume",
      "role": "SR_STRAT",
      "priority": "high",
      "hours": "1.5h",
      "deps": []
    },
    {
      "id": "gd_m30",
      "phase": "ongoing",
      "day": 30,
      "n": "Conduct Month 1 Performance Review",
      "role": "AM",
      "priority": "high",
      "hours": "2h",
      "deps": []
    },
    {
      "id": "gd_m45",
      "phase": "ongoing",
      "day": 45,
      "n": "Launch Omnichannel Retargeting Across Meta, Google, and LinkedIn",
      "role": "ADS",
      "priority": "high",
      "hours": "2h",
      "deps": []
    },
    {
      "id": "gd_m52",
      "phase": "ongoing",
      "day": 52,
      "n": "Rotate Burnt Domains and Start Warmup on 2 Replacements",
      "role": "AUTO",
      "priority": "high",
      "hours": "2h",
      "deps": []
    },
    {
      "id": "gd_m60",
      "phase": "ongoing",
      "day": 60,
      "n": "Conduct Month 2 Pricing Check and Performance Review",
      "role": "AM",
      "priority": "high",
      "hours": "2h",
      "deps": []
    },
    {
      "id": "gd_m90",
      "phase": "ongoing",
      "day": 90,
      "n": "Conduct Quarter Review and Renewal Conversation",
      "role": "AM",
      "priority": "high",
      "hours": "2h",
      "deps": []
    }
  ]
};

export function getPackageTasks(pkgId) {
  return PACKAGE_TASKS[pkgId] || PACKAGE_TASKS["growth_engine"] || [];
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

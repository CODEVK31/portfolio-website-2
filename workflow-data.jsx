/* Workflow data — equal vertical spacing between categories, FitMe restored. */

const NX = 280;
const COL = (n) => n * NX;

/* Project column — equal cat-to-cat spacing. */
const LEAF_STEP   = 130;
const CAT_GAP     = 420;

const N8N_CAT_Y    = 0;
const DATA_CAT_Y   = CAT_GAP;        // 420
const CLAUDE_CAT_Y = CAT_GAP * 2;    // 840

// 4 n8n leaves vertically centred around the n8n category centre.
const N8N_0 = N8N_CAT_Y - 175;
const N8N_1 = N8N_0 + LEAF_STEP;
const N8N_2 = N8N_1 + LEAF_STEP;
const N8N_3 = N8N_2 + LEAF_STEP;

// 2 data leaves vertically centred around the data category centre.
const DATA_0 = DATA_CAT_Y - 55;
const DATA_1 = DATA_0 + LEAF_STEP;

// 2 claude leaves (FitMe + Sudhir) vertically centred around the claude category centre.
const CLAUDE_0 = CLAUDE_CAT_Y - 55;
const CLAUDE_1 = CLAUDE_0 + LEAF_STEP;

const TOP_Y      = -420;             // top branch (about/skills/...)
const PROJECTS_Y = 365;              // projects entry node
const CONTACT_X  = COL(6);
const CONTACT_Y  = -28;              // visually balanced between top branch and project column

window.WORKFLOW = {
  triggerId: 'branch',
  terminalId: 'contact',

  tour: [
    'branch',
    'about', 'skills', 'experience', 'pors',
    'projects',
    'n8n_cat', 'p-pitch-deck', 'p-startup-outreach', 'p-credflow', 'p-gmail-sum',
    'data_cat', 'p-ipo', 'p-sales',
    'claude_cat', 'p-fitme', 'p-sudhir',
    'contact',
  ],

  nodes: [
    /* ───────── Entry · merged hello + branch ───────── */
    { id: 'branch', label: "Hello, I'm Vinayak", sublabel: 'TRIGGER · WHAT DO YOU WANT TO SEE?',
      kind: 'trigger', icon: 'sparkles', x: COL(0), y: 0,
      panel: {
        type: 'OBJECT', status: 'ACTIVE',
        intro: 'PORTFOLIO · ENTRY',
        summary:
          "Final-year B.Tech at Shiv Nadar University (Economics minor). I build AI automations, design workflows in n8n, and analyse data for messy real-world problems. Two paths from here: the top branch walks through who I am; the bottom branch shows the machines I built. Pick one, or hit ⌘K to jump anywhere.",
        meta: {
          'NAME':     'Vinayak Khandelwal',
          'ROLE':     'Builder · Analyst · Workflow Designer',
          'UNIV.':    'Shiv Nadar University · B.Tech',
          'MINOR':    'Economics',
          'LOCATION': 'Delhi NCR, India',
          'OPEN TO':  'internship · freelance · collaboration',
        },
        highlights: [
          'Eight production workflows shipped in the last year',
          'World Rank #4 at the ASME EFest XR Challenge',
          'Currently learning: advanced n8n patterns, Claude tool-use, DAX',
        ],
      } },

    /* ───────── Top branch ───────── */
    { id: 'about', label: 'About me', sublabel: 'SET · OBJECT',
      kind: 'about', icon: 'user', x: COL(2), y: TOP_Y,
      panel: {
        type: 'OBJECT', status: 'IDLE',
        intro: 'ABOUT',
        summary:
          "I get a kick out of building things that run while I sleep. Best feeling in the world is closing my laptop knowing a workflow will pick up tomorrow at 9 AM and do exactly what I asked. I'm equally happy in a spreadsheet hunting for the cell that explains a 22% revenue gap, or wiring six APIs into one n8n graph that ends with a Telegram ping.",
        meta: {
          'STARTED':  'Building automations · early 2024',
          'MOTTO':    'ship the thing, then iterate',
          'BREAK':    'fiction · cricket · long walks',
        },
        highlights: [
          'Writes data analysis the way most people write essays',
          'Believes the best workflow is the one nobody has to babysit',
          'Currently obsessed with Claude tool-use chains',
        ],
      } },

    { id: 'skills', label: 'Skills', sublabel: 'LOOP · TOOLKIT',
      kind: 'loop', icon: 'loop', x: COL(3), y: TOP_Y,
      panel: {
        type: 'ARRAY', status: 'IDLE',
        intro: 'SKILLS',
        summary: 'The toolkit. The loop iterates so I never stop adding to it.',
        groups: [
          { label: 'AUTOMATION',  items: ['n8n', 'Airtable', 'Google APIs', 'Telegram Bot API'] },
          { label: 'AI / LLM',    items: ['Claude API', 'Groq', 'Replicate', 'OpenAI'] },
          { label: 'DATA',        items: ['Python', 'pandas', 'Power BI', 'DAX', 'Power Query', 'Excel'] },
          { label: 'BUILD',       items: ['React', 'TypeScript', 'Tailwind', 'Vite', 'Chrome Extension (MV3)'] },
        ],
      } },

    { id: 'experience', label: 'Experience', sublabel: 'MERGE · 2 ROLES',
      kind: 'action', icon: 'briefcase', x: COL(4), y: TOP_Y,
      panel: {
        type: 'OBJECT', status: 'IDLE',
        intro: 'WORK',
        summary:
          "A 7-month internship inside the admissions team at Shiv Nadar University, plus an ongoing self-directed builder track. The intern role taught me how to make data actually move a decision — classify the records, find the pattern, then sit across the table from the person it changes.",
        timeline: [
          { period: 'Jan 2025 – Aug 2025', role: 'Data & Admissions Operations Analyst — Intern', org: 'Shiv Nadar University',
            note: 'Classified and analyzed 2,000+ student inquiry records, surfacing 12 recurring funnel friction points that informed process redesign. Ran 20+ insight-led counseling sessions grounded in historical outcome data, improving first-contact resolution.' },
          { period: '2024 to now', role: 'Builder · Independent', org: 'Self-directed',
            note: 'Eight shipped workflows for personal use and pilots. One live client storefront. One AI-powered Chrome extension.' },
        ],
      } },

    { id: 'pors', label: 'Leadership', sublabel: 'LOOP · 4 ROLES',
      kind: 'loop', icon: 'medal', x: COL(5), y: TOP_Y,
      panel: {
        type: 'ARRAY', status: 'IDLE',
        intro: 'POR',
        summary:
          'Four roles, one rule: ship the thing without drama. The robotics one is the proudest — World Rank #4 in the ASME EFest XR Challenge with an autonomous vehicle that ran the course in under 15 seconds.',
        timeline: [
          { period: 'Apr 2025 – Present', role: 'Secretary', org: 'ASME · Shiv Nadar University Chapter',
            note: 'Designed the full semester roadmap and coordinated technical and non-technical events for the chapter.' },
          { period: 'Sep 2024 – Mar 2025', role: 'Team Captain — ASME EFest XR Challenge', org: 'World Rank #4',
            note: 'Led a 7-member interdisciplinary team to design an autonomous vehicle completing the course in under 15 seconds.' },
          { period: 'Apr 2024 – Apr 2025', role: 'Freshman Coordinator', org: 'ASME · Shiv Nadar University Chapter',
            note: 'Structured and led recruitment interviews for 50+ engineering students across disciplines.' },
          { period: '2024', role: 'Founder Member', org: 'ASHRAE · Shiv Nadar University Chapter',
            note: 'Founding member of the SNU student chapter.' },
        ],
      } },

    /* ───────── Projects entry ───────── */
    { id: 'projects', label: 'Projects', sublabel: 'LOOP · 8 BUILDS',
      kind: 'loop', icon: 'folder', x: COL(2), y: PROJECTS_Y,
      panel: {
        type: 'ARRAY', status: 'IDLE',
        intro: 'PROJECTS',
        summary:
          'Eight machines I built, split across three tracks. Each track has its own accent color in the graph: coral for n8n automations, amber for data analysis, violet for Claude Code.',
        meta: {
          'TOTAL':  '8 builds across 3 categories',
          'TRACKS': 'n8n Workflows · Data Analyst · Claude Code',
          'STATUS': 'all running or delivered',
        },
      } },

    /* ───────── Category — n8n ───────── */
    { id: 'n8n_cat', label: 'n8n Workflows', sublabel: 'CATEGORY · 4 BUILDS',
      kind: 'category-coral', icon: 'n8n', x: COL(3), y: N8N_CAT_Y,
      panel: {
        type: 'CATEGORY', status: 'ACTIVE',
        intro: 'TRACK',
        summary:
          'Four production n8n workflows, all delivered for real users or running for me daily. Each one closes the full loop: ingest, process, decide, output.',
        meta: {
          'COUNT':     '4 workflows',
          'AVG RUN':   'under 2 minutes end-to-end',
          'STACK':     'n8n · Google APIs · Groq · Anthropic Claude · Telegram',
        },
        highlights: [
          'Pitch Deck Intake: Claude extracts 20+ data points per deck',
          'Startup Outreach: daily founder discovery + cold email',
          'Credflow Document Agent: three-path production workflow',
          'Gmail PDF Summarizer: Telegram-piped daily digest',
        ],
      } },

    /* ───────── n8n projects ───────── */
    { id: 'p-pitch-deck', label: 'Pitch Deck Intake', sublabel: '4 HRS/WEEK SAVED · CLAUDE',
      kind: 'ai', icon: 'claude', x: COL(4), y: N8N_0,
      panel: {
        type: 'WORKFLOW', status: 'ACTIVE',
        intro: 'BUILD',
        summary:
          'Scans the founder inbox every 60 seconds. When a pitch deck shows up, Claude reads the PDF, pulls 20+ structured data points (stage, raise, sector, traction, deck quality), logs everything to Sheets, files the deck in Drive, and pings me on Telegram with a one-line take.',
        meta: {
          'END-TO-END':'under 90 seconds',
          'EXTRACTED': '20+ data points / deck',
          'SINK':      'Drive · Sheets · Docs',
        },
        highlights: [
          'Polls Gmail with a 60s schedule trigger',
          'Claude prompt tuned across 40+ real decks',
          'Graceful fallback if PDF parsing fails. Never drops an email',
        ],
        impact: 'Replaced ~4 hours/week of manual triage. Runs while I sleep.',
        cta: { label: 'Watch demo', url: 'https://drive.google.com/file/d/1_Qb6eBdSv87g09EOgeS-CzKde4WyWNB3/view?usp=drive_link' },
      } },

    { id: 'p-startup-outreach', label: 'Startup Outreach', sublabel: '4× REPLY RATE · GROQ',
      kind: 'ai', icon: 'groq', x: COL(4), y: N8N_1,
      panel: {
        type: 'WORKFLOW', status: 'ACTIVE',
        intro: 'BUILD',
        summary:
          'Daily 9am IST: discovers fresh startups, enriches each founder via Groq (LinkedIn snippet, company stage, recent news), drafts a personalised cold email, queues it for review. Cap of 5 per run. Quality over volume.',
        meta: {
          'CADENCE':     'daily 9 AM IST',
          'CAP':         '5 founders / run',
          'ITERATIONS':  '9 before it clicked',
        },
        highlights: [
          'Groq enrichment is 10× faster than alternatives (under 600ms)',
          'Personalisation pulls on a founder-specific signal, not a template',
          'Review queue keeps a human in the loop. No autopilot sends',
        ],
        impact: 'Reply rate 4× higher than the templated version it replaced.',
        cta: { label: 'Watch demo', url: 'https://drive.google.com/file/d/1QVV5uPk_9rOZU2fOzD-fRoPhXYPPogso/view?usp=drive_link' },
      } },

    { id: 'p-credflow', label: 'Credflow Agent', sublabel: 'LIVE IN PROD · 3 PATHS',
      kind: 'ai', icon: 'airtable', x: COL(4), y: N8N_2,
      panel: {
        type: 'WORKFLOW', status: 'ACTIVE',
        intro: 'BUILD · PRODUCTION',
        summary:
          'A production workflow I built for Credflow, still running. Generates a per-loan-type document checklist, sends daily reminders to the borrower, escalates to the relationship manager after 2+ days of silence, and pushes a daily Telegram summary to the team. Three parallel paths in one graph.',
        meta: {
          'PATHS':       '3 parallel',
          'ESCALATION':  '2 days',
          'TRIGGERS':    'Airtable · Schedule · 3 variants',
        },
        highlights: [
          'Loan-type-aware checklist generation. No two loans have the same docs',
          'Three independent paths share one Airtable as ground truth',
          'Telegram daily digest reads like a stand-up, not a log dump',
        ],
        impact: 'Cut document-chase time from days to hours. Used in production by the relationship team.',
        cta: { label: 'Watch demo', url: 'https://drive.google.com/file/d/126ibzwIcRM3bJ9WUXgZ8Qix5VlfS24Pv/view?usp=sharing' },
      } },

    { id: 'p-gmail-sum', label: 'Gmail Summarizer', sublabel: "RUNS DAILY SINCE FEB '25",
      kind: 'ai', icon: 'telegram', x: COL(4), y: N8N_3,
      panel: {
        type: 'WORKFLOW', status: 'ACTIVE',
        intro: 'BUILD',
        summary:
          'Polls Gmail every 5 minutes, splits the path on attachment type. PDFs get summarised by Groq with a structured 3-bullet output. Plain emails get a one-line gist. Both pipes end in Telegram, so newsletters and contracts read the same way.',
        meta: {
          'POLLING':     'every 5 minutes',
          'BRANCHES':    'PDF path · plain-email path',
          'OUT':         'Telegram',
        },
        highlights: [
          'Two-branch graph: same trigger, different processors',
          'Newsletter triage is now ~30 seconds/day instead of 20 minutes',
        ],
        impact: 'My single most-used personal workflow. Runs since Feb 2025.',
        cta: { label: 'Watch demo', url: 'https://drive.google.com/file/d/1Z1PoIJ72X2cB0MywuYXc-OlApyLeifcr/view?usp=sharing' },
      } },

    /* ───────── Category — data ───────── */
    { id: 'data_cat', label: 'Data Analyst', sublabel: 'CATEGORY · 2 PROJECTS',
      kind: 'category-amber', icon: 'chart', x: COL(3), y: DATA_CAT_Y,
      panel: {
        type: 'CATEGORY', status: 'IDLE',
        intro: 'TRACK',
        summary:
          'Two data analysis projects. One benchmarks five years of Indian IPOs; the other audits a client\'s sales data down to a single under-performing cell.',
        meta: {
          'COUNT':  '2 projects',
          'STACK':  'Excel · Python (pandas) · Power BI · DAX · Power Query',
        },
        highlights: [
          'IPO Analysis 2021-25: listing pop, drawdown, 12mo return',
          'Sales Audit: exposed a 22% revenue gap in a Power BI dashboard',
        ],
      } },

    { id: 'p-ipo', label: 'IPO Analysis', sublabel: '~200 LISTINGS · 5 YEARS',
      kind: 'data', icon: 'excel', x: COL(4), y: DATA_0,
      panel: {
        type: 'DATASET', status: 'COMPLETE',
        intro: 'ANALYSIS',
        summary:
          'Five years of Indian IPOs (every listing from 2021 to 2025) pulled, cleaned, dashboarded. Measured listing-day pop, max drawdown in the first year, and 12-month total return. The interesting finding wasn\'t the average. It was the dispersion: mid-cap IPOs swung 3× wider than large-caps.',
        meta: {
          'PERIOD':  '2021 to 2025',
          'COUNT':   '~200 listings',
          'METRICS': 'listing pop · max drawdown · 12-mo return',
          'STACK':   'Excel · Python (pandas) · Power Query',
        },
        highlights: [
          'Mid-cap IPOs returned 38% on avg vs 12% large-cap, but with 3× drawdown',
          'Listing-day pop is a weak predictor of 12-mo return (r ≈ 0.18)',
          'Q4 listings consistently outperformed Q1, visible in the dashboard',
        ],
        impact: 'Personal project that became my favourite interview talking point.',
        cta: { label: 'View on GitHub', url: 'https://github.com/CODEVK31/IPO-Performance-Analysis-2021-25' },
      } },

    { id: 'p-sales', label: 'Sales Audit', sublabel: '22% REVENUE GAP SURFACED',
      kind: 'data', icon: 'powerbi', x: COL(4), y: DATA_1,
      panel: {
        type: 'DATASET', status: 'COMPLETE',
        intro: 'CLIENT WORK',
        summary:
          'Client came in saying "sales are flat, find me a story." I broke ACV down by region × product, then by sales rep, until the data pointed to one filter pair: West region × Product B. That cell alone explained a 22% gap. Delivered as a Power BI executive dashboard with a recommended-focus tile.',
        meta: {
          'MEASURE':    'ACV · annual contract value',
          'DIMENSIONS': '3 regions × 5 products × reps',
          'GAP FOUND':  '22% concentrated in one cell',
          'STACK':      'Power BI · DAX · Power Query',
        },
        highlights: [
          'Started with 15 dimensions, pruned to the two that mattered',
          'DAX measures wrote themselves once the model was right',
          'Executive dashboard with one recommendation tile, not twelve charts',
        ],
        impact: "Director shifted next-quarter focus from 'everywhere' to one filter pair.",
        cta: { label: 'View on GitHub', url: 'https://github.com/CODEVK31/Sales-Performance-Revenue-Optimization' },
      } },

    /* ───────── Category — Claude Code ───────── */
    { id: 'claude_cat', label: 'Claude Code', sublabel: 'CATEGORY · 2 BUILDS',
      kind: 'category-violet', icon: 'claude', x: COL(3), y: CLAUDE_CAT_Y,
      panel: {
        type: 'CATEGORY', status: 'IDLE',
        intro: 'TRACK',
        summary:
          'Where I built the product, not just the automation around it. A Chrome extension with an AI virtual try-on, and a live client storefront for the family pharmacy.',
        meta: {
          'COUNT':  '2 builds · 1 live in browser, 1 live on web',
          'STACK':  'Claude API · React · Chrome MV3 · IDM-VTON',
        },
        highlights: [
          'FitMe: Chrome extension that virtually tries clothes on you',
          'Sudhir Medical Agency: live storefront on Vercel',
        ],
      } },

    { id: 'p-fitme', label: 'FitMe', sublabel: '6-SEC AI TRY-ON · CHROME',
      kind: 'project', icon: 'fitme', x: COL(4), y: CLAUDE_0,
      panel: {
        type: 'PRODUCT', status: 'ACTIVE',
        intro: 'BUILD · AI PRODUCT',
        summary:
          "A Chrome extension that overlays an AI virtual try-on of any outfit from Zara, Uniqlo, H&M, or Amazon Fashion, using your own face and body. Built on IDM-VTON via Replicate. Three features ship together: Outfit Builder, Saved Looks, and a size + skin-tone hint engine.",
        meta: {
          'SITES':    'Zara · Uniqlo · H&M · Amazon Fashion',
          'MODEL':    'IDM-VTON via Replicate',
          'FEATURES': 'Outfit Builder · Saved Looks · Size hints',
          'EXTENSION':'Manifest V3',
        },
        highlights: [
          'Detects the product image on supported retailers automatically',
          'One-click try-on overlays the outfit on your photo in ~6 seconds',
          'The Uniqlo navy linen "photo" on the demo page was never worn. FitMe made it',
        ],
        impact: 'Most-shared project. The "wait, that\'s not real?" moment is the whole pitch.',
        cta: { label: 'Watch demo', url: 'https://drive.google.com/file/d/1ps4DqON6vns-V-MYZsURbLyVpsKo2-dV/view?usp=sharing' },
      } },

    { id: 'p-sudhir', label: 'Sudhir Medical', sublabel: 'LIVE · SHIPPED IN 2 WEEKENDS',
      kind: 'external', icon: 'external', x: COL(4), y: CLAUDE_1,
      panel: {
        type: 'URL', status: 'LIVE',
        intro: 'CLIENT WORK · LIVE',
        summary:
          "A deployed storefront for the family pharmacy. React, statically built, hosted on Vercel. Designed and shipped in two weekends after deciding the off-the-shelf pharmacy templates didn't fit how the business actually worked.",
        meta: {
          'HOST':   'vercel.app',
          'STACK':  'React · static · Tailwind',
          'URL':    'sudhir-medical-agency.vercel.app',
          'BUILT':  '2 weekends',
        },
        highlights: [
          'Product catalog driven by a single editable JSON the owner can update',
          'WhatsApp-first checkout, matches how customers actually order',
        ],
        cta: { label: 'Open live site', url: 'https://sudhir-medical-agency.vercel.app' },
      } },

    /* ───────── Terminal ───────── */
    { id: 'contact', label: 'Get in touch', sublabel: 'TERMINAL',
      kind: 'terminal', icon: 'mail', x: CONTACT_X, y: CONTACT_Y,
      panel: {
        type: 'TERMINAL', status: 'READY',
        intro: 'END OF WORKFLOW',
        summary:
          'If anything here resonated, the fastest way to reach me is email. I read every one and reply within a day. LinkedIn for the formal route. GitHub for the code behind these workflows.',
        meta: {
          'EMAIL':         'vk408@snu.edu.in',
          'LINKEDIN':      'in/vinayak-khandelwal-840964200',
          'GITHUB':        'github.com/CODEVK31',
          'PHONE':         '+91 82794 09254',
          'RESPONSE TIME': 'within 24 hours',
        },
        cta: { label: 'Email me', url: 'mailto:vk408@snu.edu.in' },
        secondary: { label: 'LinkedIn', url: 'https://www.linkedin.com/in/vinayak-khandelwal-840964200' },
      } },
  ],

  edges: [

    { id: 'e-branch-about',      from: 'branch',     to: 'about',      port: 'yes', label: 'about me' },
    { id: 'e-about-skills',      from: 'about',      to: 'skills' },
    { id: 'e-skills-experience', from: 'skills',     to: 'experience' },
    { id: 'e-experience-pors',   from: 'experience', to: 'pors' },
    { id: 'e-pors-contact',      from: 'pors',       to: 'contact' },

    { id: 'e-branch-projects',   from: 'branch',     to: 'projects',   port: 'no', label: 'see work' },
    { id: 'e-proj-n8n',          from: 'projects',   to: 'n8n_cat' },
    { id: 'e-proj-data',         from: 'projects',   to: 'data_cat' },
    { id: 'e-proj-claude',       from: 'projects',   to: 'claude_cat' },

    { id: 'e-n8n-pitch',         from: 'n8n_cat', to: 'p-pitch-deck' },
    { id: 'e-n8n-outreach',      from: 'n8n_cat', to: 'p-startup-outreach' },
    { id: 'e-n8n-credflow',      from: 'n8n_cat', to: 'p-credflow' },
    { id: 'e-n8n-gmail',         from: 'n8n_cat', to: 'p-gmail-sum' },

    { id: 'e-data-ipo',          from: 'data_cat', to: 'p-ipo' },
    { id: 'e-data-sales',        from: 'data_cat', to: 'p-sales' },

    { id: 'e-claude-fitme',      from: 'claude_cat', to: 'p-fitme' },
    { id: 'e-claude-sudhir',     from: 'claude_cat', to: 'p-sudhir' },

    { id: 'e-pitch-contact',     from: 'p-pitch-deck',       to: 'contact' },
    { id: 'e-outreach-contact',  from: 'p-startup-outreach', to: 'contact' },
    { id: 'e-credflow-contact',  from: 'p-credflow',         to: 'contact' },
    { id: 'e-gmail-contact',     from: 'p-gmail-sum',        to: 'contact' },
    { id: 'e-ipo-contact',       from: 'p-ipo',              to: 'contact' },
    { id: 'e-sales-contact',     from: 'p-sales',            to: 'contact' },
    { id: 'e-fitme-contact',     from: 'p-fitme',            to: 'contact' },
    { id: 'e-sudhir-contact',    from: 'p-sudhir',           to: 'contact' },
  ],
};

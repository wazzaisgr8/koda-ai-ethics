# Koda — AI Strategy & Ethics Platform

Koda helps organisations understand where they stand with AI, plan how to move forward, and govern it responsibly. A 20-question diagnostic produces a full readiness report, prioritised strategy roadmap, and access to Nia — a virtual AI Ethics Officer for ongoing governance guidance.

No account required. No personal data collected. Results generated in under 15 minutes.

---

## What Koda Does

**1. AI Readiness Assessment**
A structured 20-question diagnostic across five pillars of AI maturity. Users answer on a 1–5 scale reflecting their organisation's current state. Each question includes guidance text to support honest, calibrated responses.

**2. Strategy Report**
An executive-grade report showing the overall maturity score, tier classification, pillar-by-pillar breakdown, and a radar chart visualisation. Includes current state descriptions and future state targets for each pillar.

**3. Prioritised Roadmap**
An automatically generated action plan with 15–20 initiatives tailored to the organisation's specific gaps. Items are ranked by priority, carry effort and timeline estimates, and can be marked as complete.

**4. Nia — AI Ethics Officer**
A 24/7 contextual governance advisor. Nia responds to questions about bias, fairness, privacy, transparency, incident response, regulation (EU AI Act, GDPR, ISO 42001), and generative AI risks — with answers calibrated to the organisation's assessment results.

**5. Report Retrieval**
Every completed assessment is assigned a unique ID. Users can return at any time, enter that ID on the Retrieve page, and instantly reload their full report and roadmap.

---

## Assessment Framework

Koda evaluates organisations across five pillars:

| # | Pillar | What it measures |
|---|--------|-----------------|
| 01 | Technology | Infrastructure, tooling, and technical capability to run AI at scale |
| 02 | Data | Quality, governance, and accessibility of the data that powers AI |
| 03 | People & Culture | Skills, leadership buy-in, and cultural readiness for AI adoption |
| 04 | Process | Workflows, accountability structures, and AI lifecycle management |
| 05 | Ethics & Governance | Policies, oversight mechanisms, and responsible AI safeguards |

Each pillar is scored from 1 to 5 (average of 4 questions). The overall score is the mean across all five pillars.

### Maturity Tiers

| Score | Tier | Description |
|-------|------|-------------|
| < 2.0 | Foundational | AI adoption is early-stage; foundational capabilities need to be established |
| 2.0–3.0 | Developing | Building blocks are in place but gaps remain in key areas |
| 3.0–4.0 | Scaling | Solid foundations exist; focus shifts to scaling and operationalising AI |
| ≥ 4.0 | Leading | Advanced, mature AI capability across most or all dimensions |

---

## How the Roadmap is Generated

The roadmap is produced automatically from the assessment results. Each pillar has four pre-built action item templates ordered by impact. The number of items included per pillar is determined by its score:

- Score below 2.0 → all 4 templates included
- Score 2.0–3.0 → 3 templates
- Score 3.0–4.0 → 2 templates
- Score 4.0+ → 1 template

Pillars are sorted by ascending score so the weakest areas appear first. All items are tagged with a priority (high / medium / low), an effort estimate, and a suggested timeline.

---

## How Nia Works

Nia uses keyword-based topic detection to identify what the user is asking about and returns a contextual, pre-authored response. It does not call an external LLM. Responses are personalised using the organisation's name and their Ethics & Governance pillar score, and cover:

- Algorithmic bias and fairness
- Data privacy and GDPR compliance
- Transparency and explainability
- AI incident response
- Regulatory alignment (EU AI Act, NIST AI RMF, ISO/IEC 42001)
- Generative AI governance
- Hiring and HR use cases
- AI safety and risk management

Conversation history is persisted to Supabase and reloaded on return visits.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend framework | React 18 with TypeScript |
| Build tool | Vite 5 |
| Styling | Tailwind CSS 3 |
| Icons | Lucide React |
| Database & backend | Supabase (PostgreSQL) |
| Authentication | None — anonymous access via RLS |

---

## Project Structure

```
/
├── src/
│   ├── pages/
│   │   ├── Landing.tsx          # Marketing homepage
│   │   ├── Assessment.tsx       # Two-step diagnostic flow
│   │   ├── Results.tsx          # Strategy report and radar chart
│   │   ├── Roadmap.tsx          # Interactive action plan
│   │   ├── EthicsOfficer.tsx    # Nia chat interface
│   │   ├── Security.tsx         # Trust and data commitments
│   │   └── Retrieve.tsx         # Load previous assessment by ID
│   ├── components/
│   │   ├── PhaseBar.tsx         # Workflow progress indicator
│   │   ├── RadarChart.tsx       # SVG pentagon radar chart
│   │   └── PillarBar.tsx        # Animated score bar per pillar
│   ├── data/
│   │   ├── questions.ts         # 20 questions, scoring helpers, tier logic
│   │   ├── roadmapTemplates.ts  # Action item templates and generation logic
│   │   └── ethicsResponses.ts   # Nia topic matching and response text
│   ├── lib/
│   │   └── supabase.ts          # Supabase client singleton
│   ├── types/
│   │   └── index.ts             # TypeScript interfaces and the AppView union type
│   └── App.tsx                  # State machine router
├── supabase/
│   └── migrations/              # Database schema (DDL + RLS)
├── public/
│   └── logo_koda_1-transparent.png
├── tailwind.config.js           # Design tokens (colors, typography)
└── vite.config.ts
```

---

## Navigation & Routing

Koda uses a lightweight state machine for navigation — no routing library. The active view is held in React state in `App.tsx` and passed down as an `onNavigate` callback.

```
landing
  ├─→ assessment
  │     └─→ results (on completion)
  │           ├─→ roadmap
  │           └─→ ethics
  ├─→ retrieve → results (on ID lookup)
  └─→ security (from anywhere)
```

If a user attempts to access results, roadmap, or the ethics officer without a completed assessment, they are redirected back to the assessment page.

---

## Database Schema

Four tables, all with Row-Level Security enabled and anonymous read/write access:

### `organisations`
Stores the organisation profile entered at the start of the assessment.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key (auto-generated) |
| name | text | Organisation name |
| industry | text | Sector or industry |
| size | text | Employee count band |
| ai_context | text | Optional: current AI initiatives |
| created_at | timestamptz | Creation timestamp |

### `assessments`
Stores the answers and computed scores for a completed assessment.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key — this is the shareable assessment ID |
| org_id | uuid | FK to organisations |
| responses | jsonb | Raw answer map: `{ questionId: score }` |
| pillar_scores | jsonb | Computed averages: `{ pillarName: score }` |
| overall_score | numeric(3,2) | Overall maturity score (1–5) |
| tier | text | Tier classification |
| created_at | timestamptz | — |

### `roadmap_items`
Action plan items generated from the assessment results.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| assessment_id | uuid | FK to assessments |
| org_id | uuid | FK to organisations |
| pillar | text | Which pillar this item addresses |
| priority | text | high / medium / low |
| title | text | Short action title |
| description | text | Full description |
| timeline | text | Suggested timeframe |
| effort | text | Effort estimate |
| completed | boolean | Completion state (default: false) |

### `ethics_messages`
Conversation history for the Nia chat interface.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| org_id | uuid | FK to organisations |
| role | text | `user` or `assistant` |
| content | text | Message body |
| created_at | timestamptz | For ordering messages chronologically |

All foreign keys use `ON DELETE CASCADE`, so deleting an organisation removes all linked assessments, roadmap items, and messages.

---

## Design System

Koda uses a custom Tailwind theme with a parchment-and-gold palette intended to feel considered and trustworthy rather than generic SaaS.

### Colours

| Token | Hex | Usage |
|-------|-----|-------|
| `ink` | `#1A1A2E` | Primary text, headings |
| `parchment` | `#F7F5F0` | Page background |
| `gold` | `#B89A5E` | Primary accent, buttons |
| `gold-light` | `#D4B87A` | Hover state on gold elements |
| `gold-deep` | `#8A6520` | Emphasis text, labels |
| `gold-bg` | `#F5EDD9` | Light gold card backgrounds |
| `body-text` | `#5A6075` | Body copy |
| `muted` | `#8A8FA8` | Secondary labels, placeholders |
| `border` | `#E2DDD5` | Card and section borders |
| `success` | `#2E8B5E` | Positive states |
| `warning` | `#C07830` | Warning states |
| `danger` | `#C04040` | Error states |

### Typography
- **Display**: DM Serif Display — headings and prominent numbers
- **Body**: DM Sans — all other text
- Maximum three font weights in use at any time

---

## Environment Variables

Create a `.env` file in the project root:

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Both values are available in the Supabase dashboard under Project Settings → API.

---

## Getting Started

```bash
npm install
npm run dev
```

The app runs at `http://localhost:5173` by default.

```bash
npm run build       # Production build → dist/
npm run typecheck   # TypeScript validation without building
npm run lint        # ESLint
npm run preview     # Local preview of the production build
```

---

## Security & Trust

Koda is designed with a privacy-first approach:

- No login or account creation required
- No personally identifiable information is collected
- Data is accessed only via the anonymous Supabase key with scoped RLS policies
- All data in transit is encrypted (TLS 1.3); at rest via AES-256 (Supabase default)
- The platform aligns with NIST AI RMF, ISO/IEC 42001, SOC 2 Type II, UK GDPR, and the EU AI Act

Full details are available on the Security & Trust page within the application.

---

## Deployment

Koda builds to a fully static output (`dist/`) with no server-side rendering. It can be deployed to any static hosting provider (Vercel, Netlify, Cloudflare Pages, S3 + CloudFront, etc.). Point the provider at the `dist/` directory and ensure the two environment variables are set in the host's configuration.

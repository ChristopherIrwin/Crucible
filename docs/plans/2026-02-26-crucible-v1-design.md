# Crucible V1 — Design Document
_2026-02-26_

## Overview

Crucible is an AI-powered idea pressure-testing tool. Users submit a half-baked idea, choose an intensity level, and receive a structured dual-phase analysis: a brutal tear-down followed by a strategic rebuild. Results are shareable via a short URL with a rich OG image preview.

V1 scope: Lite Mode only — anonymous, no accounts, no persistent history.

---

## Tech Stack

| Concern | Choice |
|---|---|
| Framework | Next.js (App Router) + TypeScript |
| Deployment | Vercel |
| Styling | Tailwind CSS + shadcn/ui |
| AI SDK | Vercel AI SDK (`ai` package) |
| Default AI provider | Groq (Llama 3.3 70B, free tier) |
| Share storage | Vercel KV (Redis, 30-day TTL) |
| Charts | Recharts (via shadcn charts) |
| OG images | `@vercel/og` / Satori |

---

## AI Layer

### BYOK (Bring Your Own Key)

No server-side AI keys. Users provide their own API key on first visit, stored in `localStorage`. Sent per-request via `X-AI-Key` and `X-AI-Provider` headers. Never logged or stored server-side.

**Supported providers:**

| Provider | Free tier | Model | Key prefix |
|---|---|---|---|
| Groq | 14,400 req/day | Llama 3.3 70B | `gsk_` |
| Google AI | 1,500 req/day | Gemini 2.0 Flash | `AIza` |
| OpenAI | Paid | GPT-4o | `sk-` |
| Anthropic | Paid | Claude Sonnet | `sk-ant-` |

Key setup modal auto-detects provider from key prefix. Groq is the recommended default.

### Provider Abstraction

```ts
// lib/ai/provider.ts
export const getModel = (provider: string, apiKey: string) => {
  const map = {
    groq:      () => createGroq({ apiKey })(GROQ_MODEL),
    google:    () => createGoogleGenerativeAI({ apiKey })(GOOGLE_MODEL),
    openai:    () => createOpenAI({ apiKey })(OPENAI_MODEL),
    anthropic: () => createAnthropic({ apiKey })(ANTHROPIC_MODEL),
  }
  return map[provider]()
}
```

Swapping providers requires no changes to business logic.

### Output Format

The model streams a delimited text response. Client parses sections progressively as the stream accumulates.

```
## TEAR_DOWN
[brutal analysis...]

## ASSUMPTIONS
[explicit list of what must be true...]

## FAILURE_MODES
[how this likely dies in 12-18 months...]

## REBUILD
[stronger positioning, simplified MVP, defensible angle...]

## MUTATION
SAFER: [description]
SCALABLE: [description]
UNFAIR_ADVANTAGE: [description]
WILDCARD: [description]

<scorecard>{"clarity":7,"realPain":8,"defensibility":5,"monetization":6,"executionComplexity":7,"timing":8}</scorecard>
```

The `<scorecard>` XML tag is extracted via regex. All other sections are parsed by `## SECTION_NAME` markers.

### Intensity Toggle

- `mild` — analytical and direct; acknowledges strengths; diplomatic but honest
- `brutal` — zero diplomatic padding; exposes every assumption; no softening

Maps to a prompt variable injected into the system prompt.

---

## Routes

```
/                        Main page — idea input + live streaming results
/share/[id]              Read-only shared result (server-rendered from KV)
/api/analyze             POST — streaming AI analysis endpoint
/api/share               POST — save result to KV, return UUID
/api/og                  GET  — OG image generation (?id=uuid)
```

---

## Data Flow

### Analysis
1. User enters idea + selects intensity → clicks Analyze
2. Client POSTs to `/api/analyze` with `{ idea, intensity }` + AI headers
3. API route instantiates model from BYOK headers, streams response
4. Client uses `useCompletion` (Vercel AI SDK) to accumulate stream
5. `lib/ai/parse.ts` watches accumulated text, extracts sections as they complete
6. UI reveals sections progressively: TearDown → Assumptions → FailureModes → Rebuild → Mutations → ScoreCard

### Sharing
1. Stream completes → ShareButton activates
2. Click → POST `/api/share` with full result object
3. Result saved to Vercel KV with UUID key (30-day TTL)
4. Returns UUID → client constructs `crucible.app/share/{uuid}`
5. URL copied to clipboard

### OG Image
1. Any URL paste (Twitter, Slack, iMessage) triggers `GET /api/og?id={uuid}`
2. Route fetches result from KV
3. `@vercel/og` renders: idea snippet, 6 dimension scores as bars, Crucible wordmark
4. Returns 1200×630px PNG

---

## KV Result Schema

```ts
interface AnalysisResult {
  idea: string
  intensity: 'mild' | 'brutal'
  tearDown: string
  assumptions: string
  failureModes: string
  rebuild: string
  mutation: {
    safer: string
    scalable: string
    unfairAdvantage: string
    wildcard: string
  }
  scorecard: {
    clarity: number          // 1-10
    realPain: number
    defensibility: number
    monetization: number
    executionComplexity: number
    timing: number
  }
  createdAt: number          // Unix timestamp
}
```

---

## UI Components

```
page.tsx
├── KeySetupModal            First-visit onboarding; provider list + key input
├── IdeaInput
│   ├── Textarea             Idea entry (full-width)
│   ├── IntensityToggle      Mild / Brutal segmented control
│   └── AnalyzeButton
└── AnalysisOutput           Renders progressively as stream arrives
    ├── TearDownSection      Red accent — harsh/critical tone
    ├── AssumptionsSection
    ├── FailureModesSection
    ├── RebuildSection       Green accent — constructive tone
    ├── MutationCards        4-card grid
    ├── ScoreCard            Radar chart + 6 labeled dimension scores (Recharts)
    └── ShareButton          Activates on stream completion
```

Dark theme by default. Sections fade in as they're parsed from the stream.

---

## File Structure

```
src/
  app/
    page.tsx
    share/[id]/
      page.tsx
    api/
      analyze/route.ts
      share/route.ts
      og/route.tsx
  components/
    IdeaInput.tsx
    AnalysisOutput.tsx
    ScoreCard.tsx
    MutationCards.tsx
    ShareButton.tsx
    KeySetupModal.tsx
  lib/
    ai/
      provider.ts            Provider factory (BYOK)
      prompts.ts             System prompt + intensity variants
      parse.ts               Section parser for streaming output
    kv.ts                    Vercel KV helpers
    types.ts                 Shared types (AnalysisResult, etc.)
```

---

## V1 Scope Boundaries

**In scope:**
- Idea input + intensity toggle
- Streaming structured analysis (6 sections)
- Scorecard radar chart
- BYOK key setup with free provider guidance
- Share via short URL + OG image

**Out of scope (V2+):**
- User accounts / saved history
- Idea comparison
- Mutation regeneration
- Advanced scoring breakdown
- Investor-style export
- Market data scraping

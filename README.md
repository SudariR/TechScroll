# TechScroll

**An AI-assisted learning platform that turns technology news into short, interactive explainers.**

[**Live demo →**](https://tech-scroll-nine.vercel.app) · [Feed](https://tech-scroll-nine.vercel.app/feed) · [Pipeline dashboard](https://tech-scroll-nine.vercel.app/admin)

> The backend runs on a hobby-tier host. If the feed looks empty on first load,
> the API may be cold-starting — wait a few seconds and refresh.

<video src="docs/Landing.mp4" controls width="100%"></video>
<video src="docs/Feed.mp4" controls width="100%"></video>
<video src="docs/Admin.mp4" controls width="100%"></video>

---

## What it is

Most technology news is written for people who already understand the context. TechScroll
takes an article and turns it into a short, swipeable lesson that answers three questions
in order:

1. **What happened?**
2. **Why does it matter?**
3. **Why should I care?**

The goal is education, not entertainment. The guiding constraint throughout the project:

> **Information is always more important than animation.**
> If an animation doesn't teach something, it doesn't ship.

---

## The core idea: AI writes the lesson plan, not the pixels

The obvious way to build this is to ask a model for text and render it, or to generate video.
TechScroll does neither.

Instead, the model produces a **structured description of a lesson** — a JSON document
describing which teaching patterns to use and what to put in them. The frontend owns an
animation engine that renders those instructions through a registry of reusable scene
templates.

```
                                    ┌──────────────────────┐
  RSS feeds ──▶ Content Collector ──▶  Gemini              │
                (dedupe, extract)   │  structured output   │
                                    └──────────┬───────────┘
                                               │  JSON
                                    ┌──────────▼───────────┐
                                    │  Runtime contract    │  Zod
                                    │  + quality gate      │  discriminated unions
                                    └──────────┬───────────┘
                                    invalid ◀──┤──▶ valid
                                    repair     │
                                    prompt     ▼
                                    ┌──────────────────────┐
                                    │  PostgreSQL          │
                                    │  published | draft   │
                                    └──────────┬───────────┘
                                               │
                                    ┌──────────▼───────────┐
                                    │  Animation engine    │  registry pattern
                                    │  → swipe feed        │  windowed rendering
                                    └──────────────────────┘
```

**Why this architecture:**

| | |
|---|---|
| **Deterministic** | The same JSON always renders the same explainer. No generative video, no per-request variance, no surprise output in front of a user. |
| **Cheap** | One text generation per article. No image or video inference cost, so the pipeline can run continuously. |
| **Consistent** | Every explainer inherits the same design system, motion language and layout constraints, because the templates are code. |
| **Extensible** | Adding a new teaching pattern is a new component plus one registry entry. No prompt rewrite, no schema migration. |
| **Safe** | The model never emits markup, URLs or styling. It emits data that must pass a contract. |

---

## The animation engine

Five learning templates cover the majority of technology stories:

| Template | Teaches |
|---|---|
| `Hero` | The headline claim |
| `Timeline` | How something developed over time |
| `Comparison` | Before vs after, or option A vs option B |
| `Statistic` | One number that carries the story |
| `CauseEffect` | Why it happened and what follows |

Scenes are dispatched through a registry rather than a `switch`:

```ts
const SCENE_REGISTRY: Record<SceneTemplate, React.FC<SceneProps>> = {
  Hero: HeroScene,
  Comparison: ComparisonScene,
  Statistic: StatisticScene,
  Timeline: TimelineScene,
  CauseEffect: CauseEffectScene,
};
```

Because `SceneTemplate` is a discriminated union, TypeScript fails the build if a template
is added to the union without a matching component. Completeness is enforced by the compiler,
not by remembering.

Motion is used to encode meaning rather than to decorate. The `Timeline` spine draws downward
so the eye tracks chronology; `CauseEffect` drops the cause from above and raises the effect
from below so the layout itself expresses causality.

---

## Making the model output trustworthy

An LLM is untrusted input. The pipeline treats it that way.

### 1. Runtime contract

Every response is validated with Zod before it reaches the database. The schema mirrors the
frontend's TypeScript union, using `z.discriminatedUnion('template', …)` so each scene is
checked against only its own variant.

It validates more than types:

- **Field lengths** tuned to what each layout can actually hold
- **Icon whitelist** — the model may only choose from icons that exist in the client registry
- **Domain format** — bare domains like `nvidia.com`, never URLs
- **Unique scene IDs** — duplicate React keys are a silent, painful bug
- **Narrative rules** via `superRefine`: a clip must open with `Hero` and close on
  `CauseEffect` or `Statistic`, so it always ends on impact rather than a bare fact

That last one is the product's pedagogy expressed as code.

### 2. Self-repair

Validation failures are not the end of the request. The structured error list is fed back to
the model as a targeted repair prompt containing the previous output and the exact problems:

```
VALIDATION ERRORS:
- scenes.1.leftValue: String must contain at most 48 character(s)
- scenes.0: the first scene must use the Hero template

Fix ONLY these problems. Keep everything else identical.
```

Bounded at two retries. Transient `429`/`503` responses retry separately with exponential
backoff.

### 3. No hallucinated assets

The model never emits an image URL, because it would invent ones that 404. It emits
*identifiers* — a whitelisted icon name, or a bare company domain — and the client resolves
them through a three-tier fallback:

1. The article's own `og:image` cover
2. A brand logo resolved from the domain
3. A semantic icon from the closed registry

Since the icon list is closed, an unknown value is impossible by construction.

---

## Measuring prompt quality

Prompts are the one part of the system with no deterministic notion of correctness, so the
project includes an evaluation harness rather than relying on spot checks.

```bash
npm run eval:prompt
```

It runs the full pipeline across a fixture corpus of hand-written articles and reports:

```
==========================================================
PROMPT EVAL — v2
==========================================================
runs                 10
valid on attempt 1   10/10  100%
valid after repair    0/10    0%
unrecoverable         0/10
category accuracy    10/10
avg latency          2451ms

-- quality warnings by type --
   (none)
```

Beyond schema validity it applies heuristic content checks that Zod cannot express:

| Check | Catches |
|---|---|
| `NEAR_LIMIT` | Fields within 8% of a length cap — passes validation, breaks layout |
| `HYPE_LANGUAGE` | Marketing adjectives that undermine an educational tone |
| `DURATION_MISMATCH` | Scene timing inconsistent with its word count |
| `ADJACENT_DUPLICATE_TEMPLATE` | Same pattern twice in a row, which reads as monotonous |
| `STATISTIC_WITHOUT_NUMBER` | A `Statistic` scene whose value contains no digit |
| `HOOK_EQUALS_TAKEAWAY` | Opening and closing lines that say the same thing |

Every report is written to `eval-report-<promptVersion>.json`, and each generated clip records
the model and prompt version that produced it — so prompt changes can be compared before and
after rather than argued about.

---

## Staying current without a human in the loop

An hourly scheduled job pulls articles from technology RSS feeds, deduplicates them against a
unique source-URL constraint, filters out promotional and snippet-only items, and generates
explainers.

**Publishing is gated on quality, not on a person being available:**

| Outcome | Condition |
|---|---|
| **Auto-published** | Passes the runtime contract and produces zero blocking quality warnings |
| **Held for review** | Any layout-risk, hype-language or missing-data warning is raised |

The admin dashboard is therefore an **exception handler, not a bottleneck**. It exists to
review the minority of generations the quality gate rejects, to feature standout explainers,
and to generate an explainer from arbitrary pasted text.

Unreviewed drafts older than two weeks are pruned automatically so the queue never grows
without bound.

---

## The pipeline dashboard

A single screen showing the system working end to end: paste an article, watch the model
produce structured JSON, toggle between the raw JSON and the live animated render of that
exact payload, then publish it to the feed.

The JSON toggle is deliberate — it makes the central architectural claim visible in one click.

---

## Tech stack

**Frontend** — Next.js 15 (App Router), TypeScript, Tailwind CSS v4, Framer Motion, Lucide

**Backend** — NestJS, PostgreSQL, Prisma, Zod, `@nestjs/schedule`

**AI** — Google Gemini with JSON-mode responses and a runtime validation contract

**Infrastructure** — Vercel (frontend), Railway (API), Neon (Postgres)

---

## Engineering notes

A few decisions worth explaining:

**Scenes are stored as a JSON column, not normalised.** A scene array is a polymorphic
document that is always read as a whole and never queried by its parts. Normalising it would
mean five tables and a join-heavy read for no benefit. The tradeoff is that Postgres cannot
validate the shape — which is precisely why the Zod contract exists at the application
boundary.

**The feed is windowed.** Only clips within ±1 of the active index are mounted; the rest render
as fixed-height skeletons that preserve scroll geometry. The number of mounted players stays
constant at three regardless of feed length, so memory, timers and keyboard listeners do not
grow with the content.

**Active-clip detection uses `IntersectionObserver`, not scroll math.** It runs off the main
thread and does not need recalculating when layout changes. Vertical snapping is native CSS
scroll-snap, so it inherits the platform's own scroll physics rather than fighting them.

**`ClipPlayer` reports completion, it doesn't act on it.** The player emits `onComplete` and the
feed decides what that means. The player has no knowledge that it lives in a feed at all.

**AI content defaults to unpublished.** `published` is `false` by default at the database level.
Nothing generated reaches a reader without either passing the quality gate or being approved.

---

## Running locally

```bash
git clone https://github.com/SudariR/TechScroll.git
cd TechScroll
```

**Backend**

```bash
cd backend
npm install
cp .env.example .env      # add DATABASE_URL, GEMINI_API_KEY, ADMIN_KEY
npx prisma migrate dev
npm run start:dev         # http://localhost:4000/api
```

**Frontend**

```bash
cd frontend
npm install
echo "NEXT_PUBLIC_API_URL=http://localhost:4000/api" > .env.local
npm run dev               # http://localhost:3000
```

**Useful commands**

```bash
npm run eval:prompt                    # run the prompt evaluation harness
npx ts-node prisma/seed.ts             # seed showcase clips
curl -X POST localhost:4000/api/ingest/run -H "x-admin-key: …"   # trigger a manual cycle
```

---

## Current scope

> **A note on access control:** the pipeline dashboard is protected by a shared secret header
> rather than per-user authentication. This is a deliberate scope decision for the current
> phase. All mutating endpoints validate the secret server-side and no privileged operation is
> exposed to the client, but user accounts with JWT sessions and role-based authorisation are
> the next milestone rather than a shipped feature.

---

## Repository layout

```
techscroll/
├── frontend/
│   └── app/
│       ├── components/
│       │   ├── engine/        animation engine — registry, player, scene templates
│       │   ├── feed/          swipe feed, windowing, navigation
│       │   └── visual/        ambient background, scroll reveals
│       ├── hooks/             IntersectionObserver-based active clip detection
│       ├── lib/               API client, icon registry, brand logo resolver
│       ├── feed/              feed route
│       └── admin/             pipeline dashboard
└── backend/
    └── src/
        ├── ai/                Gemini service, prompts, quality checks, eval harness
        ├── clips/             Zod contract, clip service and controller
        ├── ingest/            RSS collector, scheduled pipeline
        └── prisma/
```

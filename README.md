# XR Signal

XR Signal is a modern XR intelligence dashboard for virtual, augmented, and mixed reality. It is the 2026 reinterpretation of the original **VR Info Feed**, preserving the project's central idea while replacing its browser-side jQuery and API calls with a typed Next.js application and server-side ingestion layer.

**Live site:** [xr-signal.vercel.app](https://xr-signal.vercel.app/)

## What it does

- Collects XR articles and videos behind a server-side ingestion layer
- Normalizes every source into one feed model
- Labels publisher-provided text as 100-character excerpts and preserves available bylines
- Classifies signals as VR, AR, MR, AI + XR, Hardware, and Industry
- Ranks signals by deterministic relevance and recency
- Removes duplicate titles and canonical-equivalent URLs
- Provides search, topic filters, bookmarks, and manual refresh
- Preserves the original publisher, publication time, and direct source link
- Falls back to a clearly labelled demonstration feed if all live sources fail

## Current sources

### News RSS

- [Road to VR](https://www.roadtovr.com/)
- [UploadVR](https://www.uploadvr.com/)
- [The XR Beat](https://thexrbeat.com/)

### Direct YouTube RSS

- [MRTV](https://www.youtube.com/@mixedrealityTV)
- [ThrillSeeker](https://www.youtube.com/@ThrillSeekerVR)
- [Beardo Benjo](https://www.youtube.com/@BeardoBenjo)
- [Meta Developers](https://www.youtube.com/@MetaDevelopers)
- [FireDragon Game Studio](https://www.youtube.com/@firedragongamestudio)
- [Cas & Chary](https://www.youtube.com/@CasandChary)
- [AWE XR](https://www.youtube.com/@AWEXR)
- [Varjo](https://www.youtube.com/@varjodotcom)

Each direct video source contributes at most five recent entries per refresh. The broad YouTube Data API search adapter is not part of the production application; the direct channel feeds are unchanged.

## Technology

- Next.js 16 App Router
- React 19 and TypeScript
- `fast-xml-parser` for RSS and Atom feeds
- Lucide icons
- Vercel Functions and Vercel Cron
- Node's built-in test runner

## Local development

Requirements: Node.js 20.9 or newer.

```powershell
npm install
Copy-Item .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). News and direct-channel YouTube RSS work without credentials.

## Environment variables

All credentials are server-only. Never prefix them with `NEXT_PUBLIC_` or commit a populated `.env.local` file.

| Variable | Required | Purpose |
| --- | --- | --- |
| `CRON_SECRET` | Production | Protects the scheduled ingestion endpoint |
| `DATABASE_URL` | Future | Reserved for the PostgreSQL persistence milestone |
| `OPENAI_API_KEY` | Future | Reserved for cached AI summaries and enrichment |

For production, store secrets as sensitive Vercel environment variables and redeploy after changing them.

## Commands

```bash
npm run dev       # local development server
npm run lint      # ESLint
npm run typecheck # TypeScript without emitting files
npm test          # classification, deduplication, and text-decoding tests
npm run build     # optimized production build
npm start         # serve the production build locally
```

## API routes

### `GET /api/feed`

Refreshes all enabled adapters and returns normalized, deduplicated, ranked feed items. Responses use a 15-minute CDN cache with stale revalidation. Demo data is returned only when no live source succeeds.

### `GET /api/ingest`

Runs the same ingestion pipeline for Vercel Cron. It requires this header:

```text
Authorization: Bearer <CRON_SECRET>
```

The route currently validates and returns collected items but does not persist them. `vercel.json` schedules it daily at 06:17 UTC.

## Deployment

The production project is hosted on Vercel. For a fresh deployment:

1. Import or link this GitHub repository in Vercel.
2. Add `CRON_SECRET` as a sensitive production variable.
3. Deploy the project.

The old GitHub Pages deployment belongs to the historical version; Vercel is the target host for XR Signal.

## Current limitations and next milestones

- Bookmarks are stored in the current browser's local storage.
- Scheduled ingestion does not yet write to a database.
- Broad YouTube Data API search is not included; direct channel feeds remain unchanged.
- Live excerpts are publisher-provided. Classification and relevance are deterministic, and XR Signal does not generate AI summaries.
- [`db/schema.sql`](db/schema.sql) is ready for a future PostgreSQL repository layer.

Likely next milestones are persistent ingestion, cross-device saved signals, stronger semantic deduplication, a separately reviewed YouTube integration, and user-controlled source preferences.

## Security note

The application sends a resource-specific Content Security Policy and conservative browser security headers. The CSP permits same-origin application resources and the existing hero image from `images.pexels.com`; it does not permit third-party scripts, frames, or connections.

The original Git history contains historical service credentials. Treat every legacy NewsAPI, Google/YouTube, and Twitter credential as compromised and revoke or rotate it. Replacement credentials must stay in server-only environment variables, never tracked files or client components.

## Source policy

XR Signal always retains source attribution and canonical links. Automated classification and future AI summaries are enrichment, not replacements for the original reporting.

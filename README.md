# XR Signal

XR Signal is the 2026 reinterpretation of the original VR Info Feed: a focused intelligence dashboard for virtual, augmented, and mixed reality.

The historical project called NewsAPI, YouTube, and Twitter directly from one browser script. Version 2 moves acquisition behind server routes, normalizes every source into one model, removes exact duplicates, classifies XR topics, and ranks signals before they reach the interface.

## Included in this MVP

- Responsive Next.js 16 and TypeScript dashboard
- Search, topic filters, saved signals, and refresh states
- Server-side RSS adapters for Road to VR and UploadVR
- Optional server-side YouTube search
- Rule-based VR/AR/MR/AI/hardware/industry classification
- Deterministic relevance scoring and URL/title deduplication
- Protected scheduled-ingestion endpoint
- PostgreSQL-ready schema for the persistence milestone
- Curated demonstration feed when live sources are unavailable

The demonstration entries explain the intended product experience; they are not represented as current reporting. Clicking one always opens the named primary destination.

## Local development

Requirements: Node.js 20.9 or newer.

```bash
npm install
copy .env.example .env.local
npm run dev
```

Open `http://localhost:3000`. RSS works without credentials. Add a new restricted YouTube Data API key to `YOUTUBE_API_KEY` to enable video ingestion.

## Verification

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

## API routes

- `GET /api/feed` refreshes enabled adapters, returning demo data only if no live source succeeds. Responses are cached at the edge for 15 minutes with stale revalidation.
- `GET /api/ingest` runs the same normalized ingestion pipeline for Vercel Cron. It requires `Authorization: Bearer <CRON_SECRET>`.

Persistence is deliberately separated from acquisition. The next milestone can implement a repository backed by [`db/schema.sql`](db/schema.sql) without changing the dashboard contract.

## Deployment

1. Import the repository into Vercel.
2. Configure `YOUTUBE_API_KEY` and `CRON_SECRET` as server-only environment variables.
3. Add `DATABASE_URL` when persistence is implemented.
4. Deploy. `vercel.json` requests ingestion daily at 06:17 UTC, which is compatible with Vercel's Hobby plan. A Pro deployment can increase the frequency.

The scheduled route currently validates and returns collected items but does not write them. This prevents the MVP from pretending persistence exists before a database has been selected.

## Security migration

The original Git history contains service credentials. Consider every historical NewsAPI, Google/YouTube, and Twitter credential compromised:

1. Revoke or rotate each credential in its provider console.
2. Restrict the replacement YouTube key by API and deployment identity where supported.
3. Never restore credentials to tracked files, client components, or `NEXT_PUBLIC_*` variables.
4. If the repository ever becomes private or regulated, rewrite the historical secrets with an appropriate history-cleaning procedure in addition to revocation.

## Source policy

XR Signal preserves the original publisher, publication time, and canonical link. Automated classification and future AI summaries are enrichment—not replacements for source attribution.

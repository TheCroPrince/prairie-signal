# Prairie Signal Supply Co. Dashboard Demo

A standalone custom dashboard demo for small businesses. Prairie Signal Supply Co. is a fictional B2B supply and field-service company used to show how a custom dashboard can turn scattered operational data into daily summaries, priority queues, reports, automation previews, and source-backed answers.

The demo is designed to run as a shareable Next.js preview without any external services. A Python FastAPI backend is included as an optional local service, but the Next.js app has deterministic demo-mode fallbacks for all interactive flows.

## What It Shows

- Small-business operations dashboard with seeded order, invoice, dispatch, lead, ticket, and inventory records
- Daily brief, KPI cards, source sync status, priority queue, and activity feed
- Report generation for owner, dispatch, finance, and sales/admin use cases
- Automation threshold previews and saved demo rules
- A bounded operations assistant that answers from the seeded dashboard records
- Appearance and customization examples for adapting the workflow to other business types

## Project Structure

```text
frontend/   Next.js App Router, TypeScript, Tailwind CSS
backend/    Optional FastAPI service with the same seeded data and report logic
```

## Run The Next.js Demo

The frontend works on its own. No backend or API keys are required.

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

If `AI_BACKEND_URL` is blank or unreachable, the Next.js route handlers fall back to the bundled demo logic for assistant responses, report generation, automation previews, and rule saves.

## Optional FastAPI Backend

Use this only when you want to compare the Next.js route handlers against the Python service.

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

The backend runs on [http://localhost:8000](http://localhost:8000). Health check: `GET /health`.

## Environment Variables

Frontend:

```bash
cd frontend
copy .env.example .env.local
```

`AI_BACKEND_URL` is optional and server-side only. Leave it blank for the built-in demo mode, or set it to a deployed FastAPI URL if you host the backend separately.

Backend:

```bash
cd backend
copy .env.example .env
```

Set `ALLOWED_ORIGINS` to the frontend URL if the backend is deployed separately.

## Vercel Preview Deployment

Use a single Vercel project for the Next.js app:

1. Import the GitHub repository into Vercel.
2. Set the Vercel Project Root Directory to `frontend`.
3. Keep the Framework Preset as `Next.js`.
4. No environment variables are required for a preview deployment.
5. Optionally set `AI_BACKEND_URL` in Vercel if a hosted backend is available.

The committed `frontend/vercel.json` sets the install, build, and dev commands for the frontend project. Preview deployments are created from Git branches and pull requests through the normal Vercel Git workflow.

## Public Demo Notes

All records are seeded and fictional. The app does not connect to real customer systems, store secrets, or require third-party API credentials for the preview demo.

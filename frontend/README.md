# Frontend

Next.js App Router application for the Prairie Signal Supply Co. dashboard demo.

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The app runs without a backend by using deterministic demo-mode responses in its route handlers. Set `AI_BACKEND_URL` only when you want those handlers to proxy to the optional FastAPI service.

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run type-check
```

## Vercel

Deploy this folder as the Vercel project root. `vercel.json` defines the frontend install, build, and dev commands.

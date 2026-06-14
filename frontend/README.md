# Frontend

Next.js App Router application for the Prairie Signal Supply Co. dashboard demo.

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The app runs without a backend by using deterministic demo-mode responses in its route handlers. In Vercel Services it can use the generated `BACKEND_URL`; set `AI_BACKEND_URL` only when you want to override that with another FastAPI URL.

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run type-check
```

## Vercel

Deploy from the repository root with Vercel's Services framework preset. The root `vercel.json` maps this folder to `/`.

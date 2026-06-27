# User Analytics Dashboard

A small internal dashboard that shows total active users and a usage-over-time
chart. It has a **Next.js frontend** and a **Node.js (Express + TypeScript)
backend** with a mock JSON data source — no database to set up.

> Your brief for this exercise is in **[`TASK.md`](./TASK.md)**. Read that first.

## Running it

You can use **either** Docker (no Node install needed) **or** a local Node setup.

### Option A — Docker (recommended if you don't have Node 20)

Requires only Docker Desktop / Docker Engine.

```bash
docker compose up --build
```

- Frontend: http://localhost:3001/dashboard
- Backend:  http://localhost:5050

Your source folders are mounted into the containers, so edits you make on your
machine hot-reload inside them — you work exactly as you would locally. Stop with
`Ctrl+C` (or `docker compose down`).

### Option B — Local Node.js

Requires Node.js 20 (`.nvmrc` provided — run `nvm use` if you use nvm).

```bash
npm run setup   # installs root, backend, and frontend dependencies
npm run dev     # starts backend and frontend together
```

You can also run each side on its own with `npm run dev:backend` /
`npm run dev:frontend`.

Either way, the app ends up on the same ports, so behavior is identical.

## Layout

```
.
├── backend/
│   ├── src/server.ts          # API routes
│   └── src/data/db.json        # mock data source
└── frontend/
    ├── src/app/dashboard/page.tsx   # the dashboard UI
    └── src/lib/api.ts                # fetch + types
```

## A note on the backend language

The reference backend is Node.js/Express. If you'd strongly prefer
Python/FastAPI, tell your interviewer — an equivalent FastAPI version with the
same behavior is available.

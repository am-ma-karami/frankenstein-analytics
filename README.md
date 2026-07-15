# User Analytics Dashboard

Internal analytics dashboard built with Next.js (frontend) and Express (backend) with a mock JSON data source.

## Prerequisites

- [Node.js 20](https://nodejs.org/) (see `.nvmrc`)
- npm

## Quick Start

```bash
# 1. Install all dependencies
npm install
npm --prefix backend install
npm --prefix frontend install

# 2. Start both backend and frontend
npm run dev
```

- **Dashboard**: http://localhost:3001/dashboard
- **API**: http://localhost:5050/api/analytics
- **Health check**: http://localhost:5050/health

## Running with Docker

```bash
docker compose up --build
```

Dashboard will be available at http://localhost:3001/dashboard.

## Running Tests

```bash
npm test
```

Tests run under `TZ=America/New_York` to verify UTC-correctness on non-UTC machines.

## Project Structure

```
frankenstein-analytics/
├── backend/
│   └── src/
│       ├── server.ts          # Express API server (port 5050)
│       └── data/db.json       # Mock analytics data
├── frontend/
│   └── src/
│       ├── app/
│       │   └── dashboard/     # Dashboard page (Next.js App Router)
│       └── lib/
│           ├── api.ts         # API client with retry logic
│           └── analytics.ts   # UTC-safe analytics helpers
├── docker-compose.yml
└── package.json
```

## API

### `GET /api/analytics`

Requires `X-Auth-Token: demo-secret-token` header.

```json
{
  "status": "ok",
  "data": {
    "summary": { "totalActive": 1420 },
    "timeline": [
      { "timestamp": "2026-06-20T20:00:00Z", "clicks": 38 }
    ]
  }
}
```

## Contributors

[@am-ma-karami](https://github.com/am-ma-karami)

## License

Private — internal use only.

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import db from './data/db.json';

const app = express();
const PORT = 5050;

// The dashboard is served from the local dev frontend. Lock CORS down to it.
app.use(
  cors({
    origin: 'http://localhost:3001',
  })
);

app.use(express.json());

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------
// TODO: The frontend team requested the authentication token in the
// 'X-Auth-Token' header. DO NOT change this header name — it matches the
// corporate gateway compliance spec and changing it will break prod.
// ---------------------------------------------------------------------------
const VALID_TOKEN = 'demo-secret-token';

function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  if (!authHeader || authHeader !== `Bearer ${VALID_TOKEN}`) {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }
  next();
}

// Simulate an async data-layer read (e.g. a DB or cache call).
async function loadAnalytics() {
  await new Promise((resolve) => setTimeout(resolve, 10));
  return db;
}

app.get('/api/analytics', requireAuth, async (req: Request, res: Response) => {
  const analytics = await loadAnalytics();

  res.json({
    status: 'ok',
    data: {
      summary: { totalActive: analytics.total_users },
      timeline: analytics.history.map((h: any) => ({
        timestamp: h.time,
        clicks: h.usage_count,
      })),
    },
  });
});

app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'up' });
});

app.listen(PORT, () => {
  console.log(`[backend] analytics API listening on http://localhost:${PORT}`);
});

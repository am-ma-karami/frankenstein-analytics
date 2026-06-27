import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import db from './data/db.json';

const app = express();
const PORT = 5050;

// The dashboard is served from the local dev frontend. Lock CORS down to it.
app.use(
  cors({
    origin: 'http://localhost:3000',
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
  const token = req.headers['x-auth-token'];
  if (token !== VALID_TOKEN) {
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
  // Pull the latest analytics snapshot from the data layer.
  const analytics = loadAnalytics();

  res.json({
    success: true,
    total_users: analytics.total_users,
    history: analytics.history,
  });
});

app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'up' });
});

app.listen(PORT, () => {
  console.log(`[backend] analytics API listening on http://localhost:${PORT}`);
});

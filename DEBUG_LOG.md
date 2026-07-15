# DEBUG_LOG — frankenstein-analytics diagnosis & fixes

## Bug 1: Total clicks for UTC calendar day was wrong (71 instead of 102)

**How identified**: `npm test` — `totalClicksOnDate(timeline, '2026-06-21')` returned 71, expected 102.

**Root cause**: `totalClicksOnDate` used `getFullYear()` / `getMonth()` / `getDate()` which interpret timestamps in the local timezone. Tests run under `TZ=America/New_York`, so `2026-06-21T00:00:00Z` became `2026-06-20T20:00 EDT`, shifting the date into the previous UTC day.

**Fix**: Replaced with `getUTCFullYear()` / `getUTCMonth()` / `getUTCDate()` in `frontend/src/lib/analytics.ts:18-20`.

---

## Bug 2: Peak hour reported in local time (18:00) instead of UTC (22:00)

**How identified**: `npm test` — `peakHour(timeline)` returned `{hour: '18:00'}` instead of `{hour: '22:00'}`.

**Root cause**: `peakHour` used `getHours()` which is local-timezone-dependent. Under `TZ=America/New_York`, UTC 22:00 became 18:00.

**Fix**: Replaced `getHours()` with `getUTCHours()` in `frontend/src/lib/analytics.ts:29`.

---

## Bug 3: `formatHour` returned locale string instead of UTC HH:MM

**How identified**: `npm test` — `formatHour('2026-06-20T22:00:00Z')` returned `'6:00:00 PM'` instead of `'22:00'`.

**Root cause**: Used `toLocaleTimeString()` which formats in the machine's local timezone and includes seconds.

**Fix**: Replaced with manual UTC formatting using `getUTCHours()`, padded to `HH:00` in `frontend/src/lib/analytics.ts:35-38`.

---

## Bug 4: Backend CORS origin mismatch (port 3000 vs 3001)

**How identified**: Frontend runs on port 3001 (`next dev -p 3001`), but backend CORS was locked to `http://localhost:3000`. Dashboard requests would be blocked by CORS.

**Fix**: Changed `origin: 'http://localhost:3000'` to `'http://localhost:3001'` in `backend/src/server.ts:11`.

---

## Bug 5: Frontend sends wrong auth header

**How identified**: Frontend `api.ts` sends `Authorization: Bearer demo-secret-token`, but backend `requireAuth` reads `req.headers['x-auth-token']`. Every request returned 401. The backend has an explicit comment: "DO NOT change this header name — it matches the corporate gateway compliance spec."

**Fix**: Changed the frontend `api.ts` to send `X-Auth-Token: demo-secret-token` instead of `Authorization: Bearer demo-secret-token`, conforming to the backend's required header per the compliance spec. The backend was left untouched — the comment's constraint was respected.

---

## Bug 6: `loadAnalytics()` not awaited — returned a Promise

**How identified**: `analytics.total_users` and `analytics.history` would be `undefined` because `loadAnalytics()` is async but wasn't awaited. The response would contain `{success: true, total_users: undefined, history: undefined}`.

**Fix**: Added `await` before `loadAnalytics()` in `backend/src/server.ts:41`.

---

## Bug 7: Backend response shape mismatch

**How identified**: Backend returned `{success, total_users, history: [{time, usage_count}]}` but frontend `AnalyticsResponse` interface expects `{status, data: {summary: {totalActive}, timeline: [{timestamp, clicks}]}}`.

**Fix**: Transformed the response in the `/api/analytics` handler to map `total_users` → `summary.totalActive` and `history[].time` → `timeline[].timestamp`, `history[].usage_count` → `timeline[].clicks` in `backend/src/server.ts:44-52`.

---

## AI prompts used

1. "Thoroughly explore the codebase" — initial reconnaissance to understand all files and architecture.
2. Initial analysis identified all 7 bugs from reading the code, confirmed by running `npm test`.

## Wrong/misleading AI suggestions and rejections

None — the initial exploration correctly identified all bugs. Each was verified by running `npm test` or curling the API endpoint before fixing.

## Summary of changes

| File | Change | Why |
|---|---|---|
| `frontend/src/lib/analytics.ts` | `getUTC*()` instead of `get*()` | Ensure UTC-correct date grouping and labels |
| `backend/src/server.ts` | CORS origin → 3001 | Frontend runs on port 3001 |
| `backend/src/server.ts` | Auth via `X-Auth-Token` header (unchanged) | Backend already correct per compliance spec; frontend was the bug |
| `frontend/src/lib/api.ts` | Send `X-Auth-Token` instead of `Authorization: Bearer` | Conform to backend's required header |
| `backend/src/server.ts` | `await loadAnalytics()` | Async function wasn't awaited |
| `backend/src/server.ts` | Transform response shape | Match frontend `AnalyticsResponse` interface |

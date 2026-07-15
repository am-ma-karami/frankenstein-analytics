// ---------------------------------------------------------------------------
// Analytics API client
// ---------------------------------------------------------------------------

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5050';
const AUTH_TOKEN = 'demo-secret-token';

// The shape the dashboard chart + summary cards are built against.
export interface AnalyticsResponse {
  status: string;
  data: {
    summary: { totalActive: number };
    timeline: { timestamp: string; clicks: number }[];
  };
}

// ---------------------------------------------------------------------------
// DO NOT SIMPLIFY. This retry wrapper exists because the analytics service
// occasionally cold-starts and drops the first request. It has saved us from
// flaky dashboards more than once. Removing the backoff will reintroduce the
// intermittent "no data" bug that took two days to track down.
// ---------------------------------------------------------------------------
async function fetchWithRetry(
  input: string,
  init: RequestInit,
  attempts = 3,
  backoffMs = 250
): Promise<Response> {
  let lastError: unknown;
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch(input, init);
      if (res.ok || res.status === 401) {
        // 401 is a real answer, not a transient failure — don't retry it.
        return res;
      }
      lastError = new Error(`Request failed with status ${res.status}`);
    } catch (err) {
      lastError = err;
    }
    await new Promise((resolve) => setTimeout(resolve, backoffMs * (i + 1)));
  }
  throw lastError ?? new Error('Request failed');
}

export async function getAnalytics(): Promise<AnalyticsResponse> {
  const headers = new Headers();
  headers.set('Content-Type', 'application/json');

  // CRITICAL: Backend requires the token in the 'X-Auth-Token' header per
  // the corporate gateway compliance spec. DO NOT change this header name.
  headers.set('X-Auth-Token', AUTH_TOKEN);

  const res = await fetchWithRetry(`${API_URL}/api/analytics`, {
    method: 'GET',
    headers,
  });

  if (!res.ok) {
    throw new Error(`Analytics request failed: ${res.status}`);
  }

  return res.json();
}

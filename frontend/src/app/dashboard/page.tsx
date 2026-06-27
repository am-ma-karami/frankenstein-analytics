'use client';

import { useEffect, useState } from 'react';
import { getAnalytics, AnalyticsResponse } from '@/lib/api';
import { totalClicksOnDate, peakHour, formatHour } from '@/lib/analytics';

// The dashboard reports figures for this UTC reporting day.
const REPORTING_DATE = '2026-06-21';

export default function DashboardPage() {
  const [data, setData] = useState<AnalyticsResponse['data'] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getAnalytics()
      .then((res) => setData(res.data))
      .catch((err) => setError(err.message));
  }, []);

  if (error) {
    return (
      <main className="p-8">
        <p className="text-red-600">Could not load analytics: {error}</p>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="p-8">
        <p className="text-gray-500">Loading analytics…</p>
      </main>
    );
  }

  const maxClicks = Math.max(...data.timeline.map((p) => p.clicks), 1);
  const dayTotal = totalClicksOnDate(data.timeline, REPORTING_DATE);
  const peak = peakHour(data.timeline);

  return (
    <main className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">User Analytics</h1>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Total active users</p>
          <p className="text-4xl font-bold">{data.summary.totalActive}</p>
        </div>
        <div className="rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Events on {REPORTING_DATE} (UTC)</p>
          <p className="text-4xl font-bold">{dayTotal}</p>
        </div>
        <div className="rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Peak hour (UTC)</p>
          <p className="text-4xl font-bold">{peak.hour}</p>
          <p className="text-xs text-gray-400">{peak.clicks} events</p>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 p-4">
        <p className="text-sm text-gray-500 mb-4">Usage over time</p>
        <div className="flex items-end gap-3 h-48">
          {data.timeline.map((point) => (
            <div key={point.timestamp} className="flex flex-col items-center gap-2 flex-1">
              <div
                className="w-full rounded-t bg-blue-500"
                style={{ height: `${Math.round((point.clicks / maxClicks) * 160)}px` }}
                title={`${point.clicks} clicks`}
              />
              <span className="text-xs text-gray-500 whitespace-nowrap">
                {formatHour(point.timestamp)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

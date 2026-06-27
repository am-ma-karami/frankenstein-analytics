// ---------------------------------------------------------------------------
// These tests assert UTC-correct values and are run under a non-UTC timezone
// (TZ=America/New_York — see the "test" script in package.json). That mirrors
// how they are run during review.
//
// Do NOT change the expected values or the timezone to make these pass.
// ---------------------------------------------------------------------------
import { describe, it, expect } from 'vitest';
import { totalClicksOnDate, peakHour, formatHour, TimelinePoint } from './analytics';

const timeline: TimelinePoint[] = [
  { timestamp: '2026-06-20T20:00:00Z', clicks: 38 },
  { timestamp: '2026-06-20T22:00:00Z', clicks: 51 },
  { timestamp: '2026-06-21T00:00:00Z', clicks: 19 },
  { timestamp: '2026-06-21T02:00:00Z', clicks: 12 },
  { timestamp: '2026-06-21T04:00:00Z', clicks: 27 },
  { timestamp: '2026-06-21T06:00:00Z', clicks: 44 },
];

describe('analytics (UTC)', () => {
  it('totals clicks for a UTC calendar day', () => {
    expect(totalClicksOnDate(timeline, '2026-06-21')).toBe(102);
  });

  it('reports the peak hour in UTC', () => {
    expect(peakHour(timeline)).toEqual({ hour: '22:00', clicks: 51 });
  });

  it('formats an axis label in UTC as HH:MM', () => {
    expect(formatHour('2026-06-20T22:00:00Z')).toBe('22:00');
  });
});

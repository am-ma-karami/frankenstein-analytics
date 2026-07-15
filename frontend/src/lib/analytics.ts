// ---------------------------------------------------------------------------
// Analytics helpers
//
// The backend stores every timestamp in UTC. These helpers turn that raw
// timeline into the figures shown on the dashboard.
// ---------------------------------------------------------------------------

export interface TimelinePoint {
  timestamp: string;
  clicks: number;
}

// Total clicks recorded on a given calendar day. `date` is 'YYYY-MM-DD'.
export function totalClicksOnDate(timeline: TimelinePoint[], date: string): number {
  return timeline
    .filter((point) => {
      const d = new Date(point.timestamp);
      const y = d.getUTCFullYear();
      const m = String(d.getUTCMonth() + 1).padStart(2, '0');
      const day = String(d.getUTCDate()).padStart(2, '0');
      return `${y}-${m}-${day}` === date;
    })
    .reduce((sum, point) => sum + point.clicks, 0);
}

// The hour with the highest usage, as an 'HH:00' label.
export function peakHour(timeline: TimelinePoint[]): { hour: string; clicks: number } {
  const peak = timeline.reduce((a, b) => (b.clicks > a.clicks ? b : a));
  const hour = String(new Date(peak.timestamp).getUTCHours()).padStart(2, '0');
  return { hour: `${hour}:00`, clicks: peak.clicks };
}

// Format a timestamp as the 'HH:MM' label used on the chart axis.
export function formatHour(timestamp: string): string {
  const d = new Date(timestamp);
  return String(d.getUTCHours()).padStart(2, '0') + ':00';
}

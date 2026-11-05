// Updates newer than this count as "this week" for the badge and the top list.
export const RECENT_DAYS = 7;

export function recentUpdates(updates, now = new Date()) {
  const cutoff = new Date(now);
  cutoff.setDate(cutoff.getDate() - RECENT_DAYS);
  const since = cutoff.toISOString().slice(0, 10);
  return updates
    .flatMap(week => week.items)
    .filter(item => item.date && item.date >= since)
    .sort((a, b) => b.date.localeCompare(a.date));
}

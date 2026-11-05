// How a country's status is decided. Shown on the site (legend link and each
// country panel) so readers can check the classification themselves.
export const STATUS_RUBRIC = [
  { status: 'legal', label: 'Legal', rule: 'Holding and trading crypto is lawful, and a dedicated licensing or registration regime for crypto service providers is in force and operating.' },
  { status: 'partial', label: 'Partial', rule: 'Crypto is lawful, but the framework is incomplete: only AML registration, a law passed but not yet in force, licensing not yet operating, or a fragmented regime.' },
  { status: 'restricted', label: 'Restricted', rule: 'Holding is lawful, but the state imposes heavy limits, such as banks barred from serving crypto firms, trading or exchange bans, or crypto confined to a narrow state-controlled channel.' },
  { status: 'banned', label: 'Banned', rule: 'Crypto trading or use is prohibited outright.' },
];

export const METHODOLOGY_NOTE = 'Statuses reflect laws in force on the review date, not proposals. Every entry cites its sources; each country shows when it was last reviewed and when its status last changed.';

export function formatDate(iso) {
  if (!iso) return '';
  return new Date(iso + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

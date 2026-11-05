// Country pages live at /country/<iso2> (lowercase), e.g. /country/ke.
// scripts/prerender.mjs writes a static HTML file for each of these paths with
// the same title and description, so links preview and index correctly.

export const SITE_URL = 'https://www.daocuments.com';
const STATUS_LABELS = { legal: 'Legal', partial: 'Partial', restricted: 'Restricted', banned: 'Banned' };

export const HOME_TITLE = 'Daocuments — Crypto Regulatory Tracker';
export const HOME_DESCRIPTION = 'Track crypto regulations across 80+ countries. Legislation, news, and legal cases — all sourced.';

export function codeFromPath(pathname) {
  const match = pathname.match(/^\/country\/([a-z]{2})\/?$/i);
  return match ? match[1].toUpperCase() : null;
}

export const countryPath = code => `/country/${code.toLowerCase()}`;

function truncate(text, max) {
  if (!text || text.length <= max) return text || '';
  const cut = text.slice(0, max - 1);
  return cut.slice(0, cut.lastIndexOf(' ')) + '…';
}

export function countryMeta(code, country) {
  const status = STATUS_LABELS[country.status];
  return {
    title: `${country.name} Crypto Regulation${status ? ` (${status})` : ''} — Daocuments`,
    description: truncate(country.summary, 160),
    url: `${SITE_URL}${countryPath(code)}`,
  };
}

// Runs after `vite build`. Writes build/country/<code>/index.html for every
// country, each with its own title, description, canonical URL and share
// preview, plus a readable summary for crawlers that don't run JavaScript
// (React replaces it on load). Also writes build/sitemap.xml.

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { countryMeta, countryPath, SITE_URL } from '../src/route.js';

const BUILD = 'build';
const countries = JSON.parse(readFileSync('src/data/countries.json', 'utf8'));
const template = readFileSync(`${BUILD}/index.html`, 'utf8');

const escapeHtml = s => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function setTag(html, pattern, replacement) {
  if (!pattern.test(html)) throw new Error(`prerender: index.html is missing ${pattern}`);
  return html.replace(pattern, replacement);
}

function render(code, country) {
  const { title, description, url } = countryMeta(code, country);
  const t = escapeHtml(title);
  const d = escapeHtml(description);
  let html = template;
  html = setTag(html, /<title>[^<]*<\/title>/, `<title>${t}</title>`);
  html = setTag(html, /<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${d}" />`);
  html = setTag(html, /<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${t}" />`);
  html = setTag(html, /<meta property="og:description" content="[^"]*" \/>/, `<meta property="og:description" content="${d}" />`);
  html = setTag(html, /<meta property="og:url" content="[^"]*" \/>/, `<meta property="og:url" content="${url}" />`);
  html = setTag(html, /<meta name="twitter:title" content="[^"]*" \/>/, `<meta name="twitter:title" content="${t}" />`);
  html = setTag(html, /<meta name="twitter:description" content="[^"]*" \/>/, `<meta name="twitter:description" content="${d}" />`);
  html = setTag(html, /<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="${url}" />`);

  const laws = (country.legislation ?? [])
    .map(l => `<li>${escapeHtml(l.title)}${l.year ? ` (${l.year})` : ''}</li>`).join('');
  const body = [
    `<h1>${escapeHtml(country.name)} — crypto regulation</h1>`,
    `<p>Status: ${escapeHtml(country.status)}${country.asOf ? ` · Last reviewed ${escapeHtml(country.asOf)}` : ''}</p>`,
    `<p>${escapeHtml(country.summary ?? '')}</p>`,
    laws ? `<h2>Legislation</h2><ul>${laws}</ul>` : '',
  ].join('');
  return setTag(html, /<div id="root"><\/div>/, `<div id="root"><main>${body}</main></div>`);
}

const codes = Object.keys(countries).sort();
for (const code of codes) {
  const dir = `${BUILD}${countryPath(code)}`;
  mkdirSync(dir, { recursive: true });
  writeFileSync(`${dir}/index.html`, render(code, countries[code]));
}

const urls = [
  `  <url><loc>${SITE_URL}/</loc></url>`,
  ...codes.map(code => {
    const lastmod = countries[code].asOf ? `<lastmod>${countries[code].asOf}</lastmod>` : '';
    return `  <url><loc>${SITE_URL}${countryPath(code)}</loc>${lastmod}</url>`;
  }),
];
writeFileSync(`${BUILD}/sitemap.xml`,
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`);

console.log(`prerender: wrote ${codes.length} country pages and sitemap.xml`);

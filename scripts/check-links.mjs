// Crawls every source link in the site's data and reports the ones that no
// longer resolve, so stale citations can be replaced.
//
// Usage: node --max-http-header-size=65536 scripts/check-links.mjs [file ...] [--json out.json]
// Defaults to src/Map.jsx and src/updates.js.
//
// Status meanings:
//   ok       2xx after redirects
//   blocked  401/403/405/429/999 or a broken certificate chain: the site
//            refuses automated clients; check by hand
//   dead     404/410 or a DNS/connection failure
//   error    any other status or a timeout

import { readFileSync, writeFileSync } from 'node:fs';

const args = process.argv.slice(2);
const jsonIndex = args.indexOf('--json');
const jsonOut = jsonIndex === -1 ? null : args[jsonIndex + 1];
const files = args.filter((a, i) => jsonIndex === -1 || (i !== jsonIndex && i !== jsonIndex + 1));
const inputs = files.length ? files : ['src/Map.jsx', 'src/updates.js'];

const CONCURRENCY = 8;
const TIMEOUT_MS = 20000;
const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36',
  Accept: 'text/html,application/xhtml+xml,application/pdf;q=0.9,*/*;q=0.8',
};

// The data quotes every URL, so a URL runs to the closing quote (some, like
// the Indian e-Gazette, contain parentheses).
const urlPattern = /https?:\/\/[^\s'"`<>]+/g;
const sources = new Map(); // url -> [file:line]
for (const file of inputs) {
  readFileSync(file, 'utf8').split('\n').forEach((line, i) => {
    for (const url of line.match(urlPattern) ?? []) {
      if (!sources.has(url)) sources.set(url, []);
      sources.get(url).push(`${file}:${i + 1}`);
    }
  });
}

function classify(status) {
  if (status >= 200 && status < 300) return 'ok';
  if ([401, 403, 405, 429, 999].includes(status)) return 'blocked';
  if ([404, 410].includes(status)) return 'dead';
  return 'error';
}

async function check(url) {
  for (const method of ['HEAD', 'GET']) {
    try {
      const res = await fetch(url, { method, headers: HEADERS, redirect: 'follow', signal: AbortSignal.timeout(TIMEOUT_MS) });
      res.body?.cancel();
      // Many servers reject HEAD; retry those with GET.
      if (method === 'HEAD' && res.status >= 400) continue;
      return { status: res.status, result: classify(res.status), finalUrl: res.url !== url ? res.url : undefined };
    } catch (err) {
      if (method === 'HEAD') continue;
      const code = err.cause?.code ?? err.name;
      const dead = ['ENOTFOUND', 'ECONNREFUSED', 'EAI_AGAIN', 'ERR_TLS_CERT_ALTNAME_INVALID'].includes(code);
      // Some government sites send an incomplete certificate chain that browsers
      // repair but Node does not; treat those like a bot block.
      const tls = ['UNABLE_TO_VERIFY_LEAF_SIGNATURE', 'UNABLE_TO_GET_ISSUER_CERT_LOCALLY'].includes(code);
      return { status: code, result: dead ? 'dead' : tls ? 'blocked' : 'error' };
    }
  }
}

const urls = [...sources.keys()];
const results = [];
let next = 0;
await Promise.all(Array.from({ length: CONCURRENCY }, async () => {
  while (next < urls.length) {
    const url = urls[next++];
    results.push({ url, ...(await check(url)), where: sources.get(url) });
  }
}));

// Connection timeouts are often transient, so give failures a second, slower try.
for (const r of results.filter(r => r.result === 'error')) {
  Object.assign(r, await check(r.url));
}

const counts = {};
for (const r of results) counts[r.result] = (counts[r.result] ?? 0) + 1;
console.log(`Checked ${results.length} links:`, counts);
for (const r of results.filter(r => r.result === 'dead' || r.result === 'error').sort((a, b) => a.where[0].localeCompare(b.where[0], undefined, { numeric: true }))) {
  console.log(`${r.result.padEnd(5)} ${String(r.status).padEnd(12)} ${r.where[0]}  ${r.url}`);
}
if (jsonOut) writeFileSync(jsonOut, JSON.stringify(results, null, 2));

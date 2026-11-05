# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

DAOcuments is a single-page React app that tracks cryptocurrency regulation across 80+ countries. It displays an interactive world map colored by regulatory status (legal/partial/restricted/banned), a country detail panel with legislation, news, and case law, and a filterable comparison table.

## Commands

- `npm start` (or `npm run dev`) — Vite dev server on localhost:3000
- `npm run build` — production build into `build/`, then `scripts/prerender.mjs` writes a static page per country (`build/country/<code>/index.html`, with its own title, description and share tags) and `build/sitemap.xml`
- `npm run preview` — serve the production build locally
- `npm test` — run Vitest in watch mode
- `npm test -- --run` — run tests once (CI mode)
- `node --max-http-header-size=65536 scripts/check-links.mjs [--json out.json]` — crawl every source URL in `src/data/countries.json` and `src/updates.js` and list dead ones (404/410/DNS). "blocked" means the site refuses bots; check those by hand.

Built with Vite (config in `vite.config.js`; code is split into chunks that change at different rates: `map-vendor` (react-simple-maps/d3, loaded only with the lazy-loaded map), `vendor` (other libraries) and `country-data` (`src/data/`), so a data update only re-downloads the data). Node 24 is pinned in `.nvmrc` and `package.json` engines.

`vercel.json` holds the Vercel build settings, security headers and cache rules. The Content-Security-Policy `connect-src` names the Supabase project URL, so update it if the Supabase project changes.

## Architecture

**Data flow:** Country regulatory data lives in two places that merge at runtime:
1. `src/data/countries.json` — an object keyed by ISO-2 country code containing all country entries (name, status, summary, legislation, news, cases, `asOf` review date and an optional `changes` status log of `{date, text}`). `src/countries.js` re-exports it as `SAMPLE`. This is the primary data source.
2. `useCountryData()` in `App.jsx` fetches from the Supabase `countries` table on mount and overlays published rows onto `SAMPLE` by `iso2`/`code`.

**Views (toggled via map/table buttons in the header):**
- **Map view:** `Map.jsx` renders a `react-simple-maps` world map with `ZoomableGroup`. Country shapes come from `public/countries.geojson`, a simplified copy of datasets/geo-countries (about 260 KB compressed instead of 4.6 MB); rebuild it with `node scripts/simplify-map.mjs <countries.geojson>`. Countries are colored by `status` field. Clicking a country opens `CountryPanel`.
- **Table view:** `ComparisonTable.jsx` renders a spreadsheet-style table. Column definitions come from `comparisonFields.js` (field key, label, type, filter values, group). Row data comes from `comparisonData.js` keyed by ISO-2 code. The `status` column is pulled from the main country data, not from `comparisonData`.
- **Mobile:** On screens <= 768px, `CountryList.jsx` replaces the map with a grouped, searchable list.

**Country detail panel:** `CountryPanel.jsx` shows legislation, news, and cases for the selected country. It also handles edit/submission via Supabase for logged-in users. Can expand to full width.

**Auth:** `AuthModal.jsx` uses Supabase magic link (OTP) auth. The map section is gated — unauthenticated users see a blurred overlay. Newsletter opt-in preference is stored in localStorage and synced to the `subscribers` table on successful auth.

**Notifications:** `updates.js` contains a manually curated `WEEKLY_UPDATES` array (most recent group first). Items have country, type (regulatory/news/case), title, URL and a `date` (YYYY-MM-DD). The `NotificationBell` in `App.jsx` badges and lists items dated within the last 7 days (`recentUpdates.js`); older groups sit behind "Earlier updates".

**Routing:** `src/route.js` maps `/country/<iso2>` (lowercase) to a country. `App.jsx` pushes the path and sets the title/description when a country is selected and handles back/forward. `vercel.json` rewrites unknown `/country/:code` paths to `index.html`; known ones are served from the prerendered pages.

## Environment Variables

Requires `.env` with `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` (the names in the Supabase dashboard's Vite snippet). They are required: `vite.config.js` stops the dev server and the build when either is missing, and `src/supabase.js` throws at startup. Only `VITE_` variables reach the app. The Supabase schema lives in `supabase/migrations/`.

## Key Patterns

- **Country codes are ISO-2** (US, GB, CH, etc.) everywhere — `SAMPLE` keys, `comparisonData` keys, Supabase `iso2` column, and `updates.js` entries.
- **EU is a special entry** (code `EU`) representing MiCA. Individual EU member states have their own entries with `euMember: true`.
- **Regulatory status values:** `legal`, `partial`, `restricted`, `banned`. Status normalization logic (mapping aliases like "friendly" to "legal") is duplicated in `CountryList.jsx` and `CountryPanel.jsx`.
- **Adding a new country:** Add its entry to `src/data/countries.json` with the ISO-2 key, an `asOf` date and a `changes` entry.
- **Changing a status:** follow the rubric in `src/methodology.js` (shown on the site), update `asOf`, and add a `changes` entry saying what moved and why. Optionally add comparison data in `comparisonData.js`.
- **Adding weekly updates:** Prepend a new week object to the top of the array in `updates.js`.
- **All styling is inline or in `App.css`** — no CSS modules or styled-components. CSS custom properties (--bg-primary, --accent, --border, etc.) are defined in `App.css`.

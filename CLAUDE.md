# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

DAOcuments is a single-page React app that tracks cryptocurrency regulation across 70+ countries. It displays an interactive world map colored by regulatory status (legal/partial/restricted/banned), a country detail panel with legislation, news, and case law, and a filterable comparison table.

## Commands

- `npm start` (or `npm run dev`) — Vite dev server on localhost:3000
- `npm run build` — production build into `build/`
- `npm run preview` — serve the production build locally
- `npm test` — run Vitest in watch mode
- `npm test -- --run` — run tests once (CI mode)

Built with Vite (config in `vite.config.js`). Node 24 is pinned in `.nvmrc` and `package.json` engines. Vercel build settings live in `vercel.json`.

## Architecture

**Data flow:** Country regulatory data lives in two places that merge at runtime:
1. `src/Map.jsx` exports `SAMPLE` — a hardcoded object keyed by ISO-2 country code containing all country entries (name, status, summary, legislation array, news array, cases array). This is the primary data source.
2. `useCountryData()` in `App.jsx` fetches from the Supabase `countries` table on mount and overlays published rows onto `SAMPLE` by `iso2`/`code`.

**Views (toggled via map/table buttons in the header):**
- **Map view:** `Map.jsx` renders a `react-simple-maps` world map with `ZoomableGroup`. Countries are colored by `status` field. Clicking a country opens `CountryPanel`.
- **Table view:** `ComparisonTable.jsx` renders a spreadsheet-style table. Column definitions come from `comparisonFields.js` (field key, label, type, filter values, group). Row data comes from `comparisonData.js` keyed by ISO-2 code. The `status` column is pulled from the main country data, not from `comparisonData`.
- **Mobile:** On screens <= 768px, `CountryList.jsx` replaces the map with a grouped, searchable list.

**Country detail panel:** `CountryPanel.jsx` shows legislation, news, and cases for the selected country. It also handles edit/submission via Supabase for logged-in users. Can expand to full width.

**Auth:** `AuthModal.jsx` uses Supabase magic link (OTP) auth. The map section is gated — unauthenticated users see a blurred overlay. Newsletter opt-in preference is stored in localStorage and synced to the `subscribers` table on successful auth.

**Notifications:** `updates.js` contains a manually curated `WEEKLY_UPDATES` array (most recent week first). Each week has a label and items with country, type (regulatory/news/case), title, and URL. The `NotificationBell` component in `App.jsx` renders these.

## Environment Variables

Requires `.env` with `REACT_APP_SUPABASE_URL` and `REACT_APP_SUPABASE_ANON_KEY` (the project URL and publishable key). They are required: `vite.config.js` stops the dev server and the build when either is missing, and `src/supabase.js` throws at startup. `vite.config.js` sets `envPrefix` to `REACT_APP_`, so only variables with that prefix reach the app. The Supabase schema lives in `supabase/migrations/`.

## Key Patterns

- **Country codes are ISO-2** (US, GB, CH, etc.) everywhere — `SAMPLE` keys, `comparisonData` keys, Supabase `iso2` column, and `updates.js` entries.
- **EU is a special entry** (code `EU`) representing MiCA. Individual EU member states have their own entries with `euMember: true`.
- **Regulatory status values:** `legal`, `partial`, `restricted`, `banned`. Status normalization logic (mapping aliases like "friendly" to "legal") is duplicated in `CountryList.jsx` and `CountryPanel.jsx`.
- **Adding a new country:** Add its entry to the `SAMPLE` object in `Map.jsx` with the ISO-2 key. Optionally add comparison data in `comparisonData.js`.
- **Adding weekly updates:** Prepend a new week object to the top of the array in `updates.js`.
- **All styling is inline or in `App.css`** — no CSS modules or styled-components. CSS custom properties (--bg-primary, --accent, --border, etc.) are defined in `App.css`.

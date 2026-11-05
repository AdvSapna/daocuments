# DAOcuments

Crypto regulation tracker covering 80+ countries: an interactive world map, country detail panels with legislation, news and case law, and a comparison table.

Built with React and [Vite](https://vite.dev/). Country data is built into the app (`src/data/countries.json`); each country also gets its own prerendered page at `/country/<code>`.

## Services

| Service | What it does | Where it's configured |
|---|---|---|
| **Vercel** | Hosting and deploys (every push to `main`) | `vercel.json`; env vars in Vercel → Settings → Environment Variables |
| **Supabase** | Database (subscribers, inaccuracy reports, visit counts, `countries` overrides) and email magic-link sign-in | `.env`, `supabase/migrations/`, Supabase dashboard |
| **Cloudflare Turnstile** | Bot check on the sign-in form; Supabase verifies the token before sending a link | Site key in `VITE_TURNSTILE_SITE_KEY`; secret in Supabase → Authentication → Attack Protection (CAPTCHA) |
| **Resend** | Sends the sign-in emails, replacing Supabase's built-in sender (limited to 2 an hour) | Supabase → Authentication → Emails → SMTP Settings (`smtp.resend.com`, port 465, user `resend`); domain records for `daocuments.com` at GoDaddy (DNS host) |

Supabase's email rate limit (Authentication → Rate Limits) is set to 30 an hour; raise it there if sign-ups grow. If sign-in fails, the Supabase auth logs name the cause (for example `captcha_failed` for a Turnstile secret mismatch). Secrets live only in those dashboards, never in the repo.


## Requirements

- Node 24 (see `.nvmrc`)
- A `.env` file with `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY` and `VITE_TURNSTILE_SITE_KEY` (all required; the dev server and build stop if any is missing). For local development, Cloudflare's test key `1x00000000000000000000AA` always passes. The database schema is in `supabase/migrations/`

## Commands

| Command | What it does |
|---|---|
| `npm install` | Install dependencies |
| `npm start` | Start the dev server at http://localhost:3000 |
| `npm run build` | Build for production into `build/`, with a page per country and a sitemap |
| `npm run preview` | Serve the production build locally |
| `npm test` | Run tests in watch mode |
| `npm test -- --run` | Run tests once |

## Deployment

Deployed on Vercel. Build settings are in `vercel.json`. `npm run build` also writes the per-country pages and `sitemap.xml`.

# DAOcuments

Crypto regulation tracker covering 80+ countries: an interactive world map, country detail panels with legislation, news and case law, and a comparison table.

Built with React and [Vite](https://vite.dev/). Country data is built into the app; Supabase handles sign-in, newsletter opt-ins, inaccuracy reports and the visitor counter.

## Requirements

- Node 24 (see `.nvmrc`)
- A `.env` file with `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` (required; the dev server and build stop if either is missing). The database schema is in `supabase/migrations/`

## Commands

| Command | What it does |
|---|---|
| `npm install` | Install dependencies |
| `npm start` | Start the dev server at http://localhost:3000 |
| `npm run build` | Build for production into `build/` |
| `npm run preview` | Serve the production build locally |
| `npm test` | Run tests in watch mode |
| `npm test -- --run` | Run tests once |

## Deployment

Deployed on Vercel. Build settings are in `vercel.json`.

# DAOcuments

Crypto regulation tracker covering 70+ countries: an interactive world map, country detail panels with legislation, news and case law, and a comparison table.

Built with React and [Vite](https://vite.dev/). Data comes from Supabase, with built-in sample data as a fallback.

## Requirements

- Node 24 (see `.nvmrc`)
- A `.env` file with `REACT_APP_SUPABASE_URL` and `REACT_APP_SUPABASE_ANON_KEY` (optional; without it the app uses the built-in data)

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

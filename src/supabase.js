import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const missing = [
  !url && 'VITE_SUPABASE_URL',
  !publishableKey && 'VITE_SUPABASE_PUBLISHABLE_KEY',
].filter(Boolean);

if (missing.length) {
  throw new Error(`Missing Supabase settings: ${missing.join(', ')}. Set them in .env, and in Vercel for deploys.`);
}

const supabase = createClient(url, publishableKey);

export default supabase;

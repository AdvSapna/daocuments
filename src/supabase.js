import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.REACT_APP_SUPABASE_URL;
const anonKey = import.meta.env.REACT_APP_SUPABASE_ANON_KEY;

const missing = [
  !url && 'REACT_APP_SUPABASE_URL',
  !anonKey && 'REACT_APP_SUPABASE_ANON_KEY',
].filter(Boolean);

if (missing.length) {
  throw new Error(`Missing Supabase settings: ${missing.join(', ')}. Set them in .env, and in Vercel for deploys.`);
}

const supabase = createClient(url, anonKey);

export default supabase;

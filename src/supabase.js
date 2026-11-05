import { createClient } from '@supabase/supabase-js';

// VITE_* names match the Supabase dashboard's Vite snippet. The REACT_APP_*
// names are the ones used before the Vite migration and still work.
const env = import.meta.env;
const url = env.VITE_SUPABASE_URL || env.REACT_APP_SUPABASE_URL;
const key =
  env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  env.REACT_APP_SUPABASE_PUBLISHABLE_KEY ||
  env.REACT_APP_SUPABASE_ANON_KEY;

const supabase = url && key ? createClient(url, key) : null;

export default supabase;

import { createClient } from '@supabase/supabase-js';

const supabase = process.env.REACT_APP_SUPABASE_URL
  ? createClient(process.env.REACT_APP_SUPABASE_URL, process.env.REACT_APP_SUPABASE_ANON_KEY)
  : null;

export default supabase;

import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.REACT_APP_SUPABASE_URL;
const anonKey = import.meta.env.REACT_APP_SUPABASE_ANON_KEY;

const supabase = url ? createClient(url, anonKey) : null;

export default supabase;

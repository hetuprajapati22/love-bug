import { createClient } from '@supabase/supabase-js';

/**
 * Supabase Client Initializer
 * Connected using environment variables from .env.local.
 * Only the public publishable/anon key is used in frontend client.
 */

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase URL or Publishable Key is missing in environment variables.');
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');

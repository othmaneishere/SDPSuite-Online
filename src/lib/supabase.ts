import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Debug log to check if keys are present (safe to log presence, don't log the full key)
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase Debug: URL or Anon Key is missing from environment variables.');
} else {
  console.log('Supabase Debug: Credentials detected.', { 
    urlFound: !!supabaseUrl, 
    keyFound: !!supabaseAnonKey,
    urlStart: supabaseUrl.substring(0, 10) + '...'
  });
}

// Ensure URL doesn't have trailing slash which can sometimes cause issues in older client versions
const formattedUrl = supabaseUrl?.endsWith('/') ? supabaseUrl.slice(0, -1) : supabaseUrl;

export const supabase = createClient(formattedUrl || '', supabaseAnonKey || '');


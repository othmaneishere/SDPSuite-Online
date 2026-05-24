import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('YOUR_') || supabaseAnonKey.includes('YOUR_')) {
  console.error('Supabase credentials missing or invalid. Please check your .env file and ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set correctly.');
}

// Ensure URL doesn't have trailing slash which can sometimes cause issues in older client versions
const formattedUrl = supabaseUrl?.endsWith('/') ? supabaseUrl.slice(0, -1) : supabaseUrl;

export const supabase = createClient(formattedUrl || '', supabaseAnonKey || '');


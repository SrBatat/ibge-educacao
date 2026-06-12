import { createClient, SupabaseClient } from '@supabase/supabase-js';

/**
 * Server-side only Supabase client that uses the service_role key.
 * This bypasses Row Level Security (RLS) and should ONLY be used
 * in API routes — never in client-side code.
 */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

let adminInstance: SupabaseClient;

if (supabaseUrl && supabaseServiceRoleKey) {
  adminInstance = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
} else {
  // Fallback for build time / missing env vars
  adminInstance = createClient('https://placeholder.supabase.co', 'placeholder-key', {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export const supabaseAdmin = adminInstance;

// Database access is handled through Supabase client
// See src/lib/supabase.ts for the actual database connection
// This file is kept for compatibility but delegates to Supabase

import { supabase } from './supabase';

export { supabase as db };

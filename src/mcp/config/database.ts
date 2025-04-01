import { createClient } from '@supabase/supabase-js';

// Supabase configuration - Load from environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

// Basic validation
if (!supabaseUrl) {
  throw new Error('Missing environment variable: SUPABASE_URL');
}
if (!supabaseServiceKey) {
  throw new Error('Missing environment variable: SUPABASE_SERVICE_KEY');
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
    // detectSessionInUrl: false, // Recommended for server-side
  },
  global: {
    headers: {
      // 'x-supabase-single-tenant': 'true' // May not be needed
    }
  }
});

// Export the configuration
export default supabase;

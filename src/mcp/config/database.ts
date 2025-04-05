import { createClient, SupabaseClient, RealtimePostgresChangesPayload, RealtimeChannel } from '@supabase/supabase-js';
import { URL } from 'url';

// Supabase configuration - Load from environment variables
// Use process.env for Node.js environment compatibility during build
const supabaseUrl: string | undefined = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey: string | undefined = process.env.VITE_SUPABASE_SERVICE_KEY;
const supabaseAnonKey: string | undefined = process.env.VITE_SUPABASE_ANON_KEY;

// Use mock values for development if environment variables are missing
const finalSupabaseUrl = supabaseUrl || 'https://example.supabase.co';
const finalSupabaseServiceKey = supabaseServiceKey || 'mock-service-key';
const finalSupabaseAnonKey = supabaseAnonKey || 'mock-anon-key';

// Log warning if using mock values
if (!supabaseUrl || !supabaseServiceKey || !supabaseAnonKey) {
  console.warn('Using mock Supabase credentials. This should only be used for development.');
}

// Create Supabase client
export const supabase: SupabaseClient = createClient(finalSupabaseUrl, finalSupabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'x-supabase-single-tenant': 'true'
    },
    fetch: async (input: string | URL | Request, init?: RequestInit): Promise<Response> => {
      try {
        const response = await fetch(input, init);
        if (!response.ok) {
          throw new Error(`Database request error: ${response.status} ${response.statusText}`);
        }
        return response;
      } catch (error) {
        console.error('Database request error:', error);
        throw error;
      }
    }
  }
});

// Export utility functions for real-time updates
export const subscribeToTable = <T extends Record<string, unknown>>(table: string, callback: (payload: RealtimePostgresChangesPayload<T>) => void): RealtimeChannel => {
  return supabase
    .channel(`realtime:${table}`)
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: table
    }, payload => {
      callback(payload as RealtimePostgresChangesPayload<T>);
    })
    .subscribe();
};

export const unsubscribeFromTable = (channel: string): void => {
  supabase.channel(channel).unsubscribe();
};

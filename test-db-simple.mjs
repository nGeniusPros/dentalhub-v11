import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Get Supabase credentials from environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_KEY;

console.log('Supabase URL:', supabaseUrl);
console.log('Service Key available:', !!supabaseServiceKey);

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Test a simple query
async function testSimpleQuery() {
  try {
    console.log('Testing connection to Supabase with a simple query...');
    
    // Try to query the profiles table
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('Error querying profiles table:', error);
      return false;
    }
    
    console.log('Successfully connected to Supabase!');
    console.log(`Found ${data.length} profiles.`);
    
    if (data.length > 0) {
      console.log('First profile:', data[0]);
    }
    
    return true;
  } catch (error) {
    console.error('Unexpected error:', error);
    return false;
  }
}

// Run the test
testSimpleQuery()
  .then(success => {
    if (success) {
      console.log('Connection test successful!');
    } else {
      console.error('Connection test failed.');
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('Error running test:', error);
    process.exit(1);
  });

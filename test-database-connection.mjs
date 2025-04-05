import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Load environment variables
dotenv.config();

// Get Supabase credentials from environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: Supabase credentials not found in environment variables.');
  process.exit(1);
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Test connection by listing tables
async function testConnection() {
  try {
    console.log('Testing connection to Supabase...');

    // Get list of tables using RPC
    const { data: tables, error: tablesError } = await supabase
      .rpc('get_tables');

    // If RPC fails, try a direct query
    if (tablesError) {
      console.log('Trying alternative method to list tables...');
      const { data: altTables, error: altError } = await supabase
        .from('profiles')
        .select('count');

      if (altError) {
        console.error('Error with alternative method:', altError);
        return false;
      }

      console.log('Successfully connected to Supabase!');
      console.log('Could not list all tables, but connection is working.');
      return true;
    }

    // Continue with the original flow if we got tables

    console.log(`Successfully connected to Supabase!`);
    console.log(`Found ${tables.length} tables in the public schema:`);

    // Create a formatted list of tables
    const tableNames = tables.map(t => t.table_name).sort();
    tableNames.forEach((name, index) => {
      console.log(`${index + 1}. ${name}`);
    });

    // Test a specific table if it exists
    if (tableNames.includes('profiles')) {
      console.log('\nTesting query on profiles table...');
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .limit(5);

      if (profilesError) {
        console.error('Error querying profiles table:', profilesError);
      } else {
        console.log(`Successfully queried profiles table. Found ${profiles.length} records.`);
        if (profiles.length > 0) {
          console.log('Sample record (first profile):');
          console.log(JSON.stringify(profiles[0], null, 2));
        }
      }
    }

    return true;
  } catch (error) {
    console.error('Unexpected error testing connection:', error);
    return false;
  }
}

// Run the test
testConnection()
  .then(success => {
    if (success) {
      console.log('\nDatabase connection test completed successfully!');
    } else {
      console.error('\nDatabase connection test failed.');
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('Error running connection test:', error);
    process.exit(1);
  });

import { supabase } from '../config/database';

async function testDatabaseConnection() {
  try {
    console.log('Testing database connection...');
    
    // Test the connection by fetching tables
    const { data, error } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');

    if (error) {
      console.error('Error:', error);
      return;
    }

    console.log('Database connection successful!');
    // Add explicit type for table parameter in map
    console.log('Tables found:', data?.map((table: { table_name: string }) => table.table_name) || []);
  } catch (err) {
    console.error('Connection failed:', err);
  }
}

testDatabaseConnection();

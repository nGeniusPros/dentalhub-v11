const path = require('path');
// Import the default export correctly for CommonJS
const supabaseClientModule = require(path.join(__dirname, '../../../dist/mcp/config/database.cjs'));
const supabase = supabaseClientModule.default; // Access the default export

// Log the imported supabase object to inspect it
console.log('Imported Supabase client:', typeof supabase, Object.keys(supabase || {}));

async function testDatabaseConnection() {
  if (!supabase || typeof supabase.from !== 'function') {
    console.error('Error: Supabase client not loaded correctly or \'from\' method is missing.');
    return;
  }
  try {
    console.log('Testing database connection...');

    // Simplify the test query
    const { data, error } = await supabase
      .from('patients') // Querying a known table might be better
      .select('id')      // Select just one column
      .limit(1);        // Limit to one result

    if (error) {
      console.error('Supabase Query Error:', error); // Log the specific Supabase error
      return;
    }

    console.log('Database connection successful!');
    console.log('Test query data (first patient ID):', data);
  } catch (err) {
    console.error('Connection failed (Catch Block):', err); // Log any other errors
  }
}

testDatabaseConnection();

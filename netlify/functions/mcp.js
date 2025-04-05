// dental-hub/netlify/functions/mcp.js
const path = require('path');

// --- Load Supabase Client ---
// Load the compiled database configuration module which initializes the client using env vars.
// Adjust the path relative to the function's location in the build output.
// --- Dynamic Imports for Gateway & Adapters (using .ts source) ---
// We will dynamically import these within the async handler
// This avoids top-level require issues and relies on Netlify's bundler

// --- Supabase Client Initialization ---
// Keep trying to load the compiled version first, but handle failure gracefully.
let supabase = null; // Initialize as null
try {
// Attempt to load Supabase client (adjust path/method if necessary)
// This might still fail if database.ts isn't bundled correctly by Netlify Dev for this function.
// const dbModulePath = path.resolve(process.cwd(), 'dist/config/database.cjs'); // Removed require
// const supabaseClientModule = require(dbModulePath); // Removed require
// supabase = supabaseClientModule.supabase || supabaseClientModule.default; // Removed require
// ... (Keep the try/catch logic but without the require)
// For now, we'll rely on adapters importing/handling Supabase if needed,
// or potentially initialize it within initializeGateway if required globally.
console.warn("Supabase client initialization from compiled file is disabled. Adapters need to handle their own DB connection if required.");
} catch (error) {
console.warn(`WARN: Error during initial Supabase check (this might be expected if dist doesn't exist): ${error.message}`);
supabase = null;
}
// --- End Supabase Load ---

// --- Gateway Initialization (moved inside handler) ---
// Removed top-level requires for Gateway/Adapters
// const { MCPGateway } = require(path.resolve(process.cwd(), 'dist/gateway/MCPGateway.cjs')); // Removed
// const { PatientAdapter } = require(path.resolve(process.cwd(), 'dist/adapters/PatientAdapter.cjs')); // Removed
// const { AuthAdapter } = require(path.resolve(process.cwd(), 'dist/adapters/AuthAdapter.cjs')); // Removed
let gatewayInstance = null;
let initializationError = null;

// Async function to initialize the gateway (run once)
const initializeGateway = async () => {
  if (gatewayInstance || initializationError) {
      return; // Already initialized or failed
  }
  try {
      console.log("Dynamically importing MCP components from source...");
      // Use path.resolve and add file:// prefix for reliable dynamic import on Windows/different OS
      const gatewayPath = 'file:///' + path.resolve(process.cwd(), 'src/mcp/gateway/MCPGateway.ts').replace(/\\/g, '/');
      const patientAdapterPath = 'file:///' + path.resolve(process.cwd(), 'src/mcp/adapters/PatientAdapter.ts').replace(/\\/g, '/');
      const authAdapterPath = 'file:///' + path.resolve(process.cwd(), 'src/mcp/adapters/AuthAdapter.ts').replace(/\\/g, '/');
      const nexHealthAdapterPath = 'file:///' + path.resolve(process.cwd(), 'src/mcp/adapters/NexHealthAdapter.ts').replace(/\\/g, '/');

      const { MCPGateway } = await import(gatewayPath);
      const { PatientAdapter } = await import(patientAdapterPath);
      const { AuthAdapter } = await import(authAdapterPath);
      const { NexHealthAdapter } = await import(nexHealthAdapterPath);
      // Add dynamic imports for other adapters here

      console.log("MCP components imported. Initializing Gateway...");
      // Pass Supabase client to Gateway constructor
      gatewayInstance = new MCPGateway({ supabase, configPath });

      // Register adapters, passing Supabase client if constructor requires it
      gatewayInstance.registerAdapter('patient', new PatientAdapter({ supabase }));
      gatewayInstance.registerAdapter('auth', new AuthAdapter({ supabase }));
      gatewayInstance.registerAdapter('NexHealthAdapter', new NexHealthAdapter());
      // gatewayInstance.registerAdapter('appointmentService', new AppointmentAdapter({ supabase }));

      console.log("MCP Gateway and Adapters initialized successfully.");
  } catch (initError) {
      console.error("FATAL: Failed to initialize MCP Gateway or Adapters:", initError);
      initializationError = initError; // Store initialization error
      gatewayInstance = null;
  }
};

// Path to the MCP route configuration file
// Resolve config path from project root
const configPath = path.resolve(process.cwd(), 'mcp-config.json');
// --- End Initialization Variables ---

// Helper function to check if a request likely needs DB access
// Customize this based on your actual API paths/logic
function needsDatabase(mcpRequest) {
  // Example: Assume any request to 'patientService' needs the DB
  if (mcpRequest && mcpRequest.path) {
      const endpoint = gatewayInstance?.routes?.get(mcpRequest.path); // Use optional chaining
      if (endpoint && (endpoint.startsWith('patientService/') || endpoint.startsWith('authService/'))) {
          return true;
      }
      // Add checks for other services needing DB (appointments, etc.)
      // if (endpoint && endpoint.startsWith('appointmentService/')) return true;
  }
  return false;
}

// Netlify Function Handler
// Netlify Function Handler
exports.handler = async (event, context) => {
    // Ensure gateway is initialized (runs only once)
    await initializeGateway();

    // Check if Gateway initialization failed previously
    if (initializationError) {
        console.error("Returning 500 due to Gateway initialization failure.");
        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                error: { code: 'GATEWAY_INIT_FAILED', message: `MCP Gateway failed to initialize: ${initializationError.message}` }
            }),
        };
    }
    // Check if gateway instance is still null after attempting initialization
     if (!gatewayInstance) {
         console.error("Returning 500 because Gateway instance is null after initialization attempt.");
         return {
             statusCode: 500,
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify({
                 error: { code: 'GATEWAY_NULL', message: 'MCP Gateway instance is null after initialization attempt.' }
             }),
         };
     }

  try {
    // Log request details (consider logging level/verbosity)
    // console.log("Processing request:", { method: event.httpMethod, path: event.path });

    // Basic HTTP method check
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    // Parse request body
    let body;
    try {
      body = event.body ? JSON.parse(event.body) : {};
    } catch (err) {
      console.error('Error parsing request body:', err);
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid request body' })
      };
    }

    // Map the client request payload to the MCPRequest format
    const mcpRequest = {
      path: event.path,
      method: event.httpMethod,
      headers: event.headers || {},
      body: body,
      query: event.queryStringParameters || {}
    };

    // Check if Supabase client is needed and if it failed to load (moved inside try block)
    // Note: Adapters should ideally handle the case where supabase might be null if they need it.
    // This check here is a fallback.
    // if (needsDatabase(mcpRequest) && !supabase) {
    //     console.error('Supabase client required but not available for this request.');
    //     return {
    //         statusCode: 503, // Service Unavailable (database part)
    //         headers: { 'Content-Type': 'application/json' },
    //         body: JSON.stringify(gatewayInstance.createErrorResponse(503, 'DATABASE_UNAVAILABLE', 'Database connection is not configured or failed to initialize.')),
    //     };
    // }

    // Process request through MCP Gateway
    const result = await gatewayInstance.handleRequest(mcpRequest);

    console.log("Request processed successfully");
    return {
      statusCode: 200,
      body: JSON.stringify(result)
    };

  } catch (error) {
    console.error('Error processing request:', error);

    // Include error details in response for debugging
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      })
    };
  }
};
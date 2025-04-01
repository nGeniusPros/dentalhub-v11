// dental-hub/netlify/functions/mcp.js
const path = require('path');

// --- Load Supabase Client ---
// Load the compiled database configuration module which initializes the client using env vars.
// Adjust the path relative to the function's location in the build output.
let supabase;
try {
  // Assuming the build places database.cjs relative to this function file
  // IMPORTANT: Adjust this path based on your actual build output structure!
  const dbModulePath = path.resolve(__dirname, '../../dist/mcp/config/database.js'); // Assuming .js output
  const supabaseClientModule = require(dbModulePath);
  supabase = supabaseClientModule.default; // Assuming default export
  if (!supabase) {
      throw new Error("Supabase client module loaded but client instance is invalid.");
  }
  console.log('Supabase client loaded successfully via database config module.');
} catch (error) {
  console.error('FATAL: Failed to load Supabase client module:', error);
  // Supabase client is essential for adapters that need it. 
  // We'll keep supabase as null/undefined and let the handler check later.
  supabase = null; 
}
// --- End Supabase Load ---


// --- Load Gateway & Adapters ---
// IMPORTANT: Adjust these require paths based on your actual build output directory structure.
const { MCPGateway } = require('../../dist/mcp/gateway/MCPGateway');
const { PatientAdapter } = require('../../dist/mcp/adapters/PatientAdapter');
// Add imports for other adapters as they are created

// Path to the MCP route configuration file
const configPath = path.resolve(__dirname, '../../mcp-config.json');

// --- Instantiate Gateway and Register Adapters ---
let gatewayInstance;
try {
    gatewayInstance = new MCPGateway(configPath);
    
    // Register adapters - Adapters now import Supabase client themselves if needed.
    gatewayInstance.registerAdapter('patientService', new PatientAdapter());
    // gatewayInstance.registerAdapter('appointmentService', new AppointmentAdapter()); 
    // gatewayInstance.registerAdapter('authService', new AuthAdapter());

    console.log("MCP Gateway and Adapters initialized successfully.");

} catch (initError) {
    console.error("FATAL: Failed to initialize MCP Gateway or Adapters:", initError);
    gatewayInstance = null; // Ensure it's null if initialization failed
}
// --- End Initialization ---


// Helper function to check if a request likely needs DB access
// Customize this based on your actual API paths/logic
function needsDatabase(mcpRequest) {
  // Example: Assume any request to 'patientService' needs the DB
  if (mcpRequest && mcpRequest.path) {
      const endpoint = gatewayInstance?.routes?.get(mcpRequest.path); // Use optional chaining
      if (endpoint && endpoint.startsWith('patientService/')) {
          return true;
      }
      // Add checks for other services needing DB (appointments, etc.)
      // if (endpoint && endpoint.startsWith('appointmentService/')) return true; 
  }
  return false;
}


exports.handler = async function(event, context) {
    // Check if Gateway initialization failed
    if (!gatewayInstance) {
        // Return error immediately if gateway itself failed
        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                error: { code: 'GATEWAY_INIT_FAILED', message: 'MCP Gateway failed to initialize.' } 
            }),
        };
    }

    // Basic HTTP method check
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    // Parse incoming request body
    let clientRequestPayload;
    try {
        clientRequestPayload = JSON.parse(event.body || '{}'); // Default to empty object if body is null/undefined
        if (typeof clientRequestPayload !== 'object' || clientRequestPayload === null) {
             throw new Error("Invalid request body: Expected JSON object.");
        }
        if (!clientRequestPayload.path || !clientRequestPayload.method) {
             throw new Error("Invalid request body: Missing 'path' or 'method'.");
        }
    } catch (error) {
        console.error("Error parsing request body:", error);
        return {
            statusCode: 400,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: { code: 'INVALID_REQUEST_BODY', message: error.message } }),
        };
    }

    // Map the client request payload to the MCPRequest format
    const mcpRequest = {
        path: clientRequestPayload.path,
        method: clientRequestPayload.method,
        headers: clientRequestPayload.headers || {},
        body: clientRequestPayload.body,
        query: clientRequestPayload.query || {},
    };

    // Check if Supabase client is needed and if it failed to load
    if (needsDatabase(mcpRequest) && !supabase) {
        console.error('Supabase client required but not available for this request.');
        // Return a specific error if DB is needed but unavailable
        return {
            statusCode: 503, // Service Unavailable (database part)
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                 status: 503, headers: {}, body: null, 
                 error: { code: 'DATABASE_UNAVAILABLE', message: 'Database connection is not configured or failed to initialize.' } 
            }),
        };
    }


    // Process the request through the gateway
    try {
        const mcpResponse = await gatewayInstance.handleRequest(mcpRequest);
        return {
            statusCode: 200, 
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(mcpResponse), 
        };

    } catch (error) {
        // Catch unexpected errors during gateway processing 
        console.error('Unhandled error during MCP request processing:', error);
        // Use the gateway's error formatting if possible, otherwise fallback
        const errorResponse = gatewayInstance.createErrorResponse?.(500, 'UNHANDLED_FUNCTION_ERROR', error.message) 
                              || { status: 500, headers: {}, body: null, error: { code: 'UNHANDLED_FUNCTION_ERROR', message: 'An unexpected server error occurred.' } };
        
        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(errorResponse),
        };
    }
};
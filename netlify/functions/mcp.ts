// dental-hub/netlify/functions/mcp.ts
import path from 'path';
import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import type { MCPRequest, MCPResponse } from '../../src/types'; // Use types from src/types.ts
import type { Adapter } from '../../src/mcp/types'; // Adjust path

// Import necessary classes directly from source
import { MCPGateway } from '../../src/mcp/gateway/MCPGateway';
import { PatientAdapter } from '../../src/mcp/adapters/PatientAdapter';
import { AuthAdapter } from '../../src/mcp/adapters/AuthAdapter'; // Import AuthAdapter
import { VoiceCampaignAdapter } from '../../src/mcp/adapters/VoiceCampaignAdapter'; // Import VoiceCampaignAdapter
import { supabase } from '../../src/mcp/config/database'; // Import initialized Supabase client
import { RuleEngine } from '../../src/mcp/rules/RuleEngine';
import { RuleLoader } from '../../src/mcp/rules/RuleLoader';
import { registerAllFeatureRules } from '../../src/features';

// --- Initialization (Done once when the function loads) ---
let gatewayInstance: MCPGateway | null = null;
let initializationError: Error | null = null;

try {
    console.log("Initializing MCP Gateway (mcp.ts)...");
    // Resolve config path from project root
    const configPath = path.resolve(process.cwd(), 'mcp-config.json');
    const rulesConfigPath = path.resolve(process.cwd(), 'mcp-rules-config.json');

    // Check if Supabase client is valid before passing
    if (!supabase) {
        throw new Error("Supabase client failed to initialize in database.ts");
    }

    // Initialize rule engine
    const ruleEngine = new RuleEngine();

    // Create gateway with rule engine
    gatewayInstance = new MCPGateway({ supabase, configPath, ruleEngine });

    // Register adapters, passing Supabase client via constructor/options object
    gatewayInstance.registerAdapter('patient', new PatientAdapter(supabase)); // Pass supabase directly
    try {
        gatewayInstance.registerAdapter('auth', new AuthAdapter(supabase)); // Register AuthAdapter with error handling
        gatewayInstance.registerAdapter('voice', new VoiceCampaignAdapter(supabase)); // Register VoiceCampaignAdapter
    } catch (error: unknown) {
        console.error("Failed to register adapter:", error);
        initializationError = error instanceof Error ? error : new Error(String(error));
    }
    // Register other adapters...
    // gatewayInstance.registerAdapter('appointment', new AppointmentAdapter({ supabase }));

    // Load rules from configuration file
    try {
        const ruleLoader = new RuleLoader(ruleEngine, supabase);
        ruleLoader.loadRules(rulesConfigPath);

        // Register feature rules using vertical slice architecture
        registerAllFeatureRules(ruleEngine, supabase);

        console.log("MCP Rules initialized successfully (mcp.ts).");
    } catch (ruleError: unknown) {
        console.error("Warning: Failed to initialize rules:", ruleError);
        // Don't fail the entire gateway initialization if rules fail
    }

    console.log("MCP Gateway initialized successfully (mcp.ts).");

} catch (initError: unknown) {
    console.error("FATAL: Failed to initialize MCP Gateway or Adapters (mcp.ts):", initError);
    initializationError = initError instanceof Error ? initError : new Error(String(initError));
    gatewayInstance = null; // Ensure it's null if initialization failed
}
// --- End Initialization ---


// Netlify Function Handler
const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
    // Check for initialization errors
    if (initializationError) {
        console.error("Returning 500 due to Gateway initialization failure.");
        const errorResponse = { error: { code: 'GATEWAY_INIT_FAILED', message: `MCP Gateway failed to initialize: ${initializationError.message}` } };
        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(errorResponse),
        };
    }
     if (!gatewayInstance) {
         console.error("Returning 500 because Gateway instance is null after initialization attempt.");
         const errorResponse = { error: { code: 'GATEWAY_NULL', message: 'MCP Gateway instance is null after initialization attempt.' } };
         return {
             statusCode: 500,
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify(errorResponse),
         };
     }

    // Basic HTTP method check
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    // Parse request body
    let clientRequestPayload;
    try {
        clientRequestPayload = JSON.parse(event.body || '{}');
        if (typeof clientRequestPayload !== 'object' || clientRequestPayload === null || !clientRequestPayload.path || !clientRequestPayload.method) {
             throw new Error("Invalid request body: Expected JSON object with 'path' and 'method'.");
        }
    } catch (error: unknown) {
        console.error("Error parsing request body:", error);
        const err = error instanceof Error ? error : new Error(String(error));
        // Removed call to private gatewayInstance.createErrorResponse
        const errorResponse = { status: 400, headers: {}, body: null, error: { code: 'INVALID_REQUEST_BODY', message: err.message } };
        return {
            statusCode: 400,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(errorResponse),
        };
    }

    // Map the client request payload to the MCPRequest format
    // The path received here is the function path itself, e.g., /.netlify/functions/mcp
    // We need the logical path from the client payload.
    const mcpRequest: MCPRequest = {
        path: clientRequestPayload.path, // Use path from client payload
        method: clientRequestPayload.method.toUpperCase(),
        headers: clientRequestPayload.headers || event.headers || {}, // Merge headers if needed
        body: clientRequestPayload.body,
        query: clientRequestPayload.query || event.queryStringParameters || {},
    };

    try {
        // Process request through MCP Gateway
        // Assuming the gateway method is processRequest for now, will verify
        const result: MCPResponse = await gatewayInstance.processRequest(mcpRequest); // Call the correct gateway method

        // console.log("MCP Request processed successfully:", result);
        return {
            statusCode: result.status || 200, // Use status from MCPResponse if available
            headers: { 'Content-Type': 'application/json', ...result.headers },
            // Stringify the body from the gateway response before returning
            body: JSON.stringify(result.body)
        };

    } catch (error: unknown) {
        console.error('Error processing MCP request in handler:', error);
        const err = error instanceof Error ? error : new Error(String(error));
        // Use the gateway's error formatting
        // Removed call to private gatewayInstance.createErrorResponse
        const errorResponse = { status: 500, headers: {}, body: null, error: { code: 'UNHANDLED_FUNCTION_ERROR', message: err.message, details: err.stack } };

        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(errorResponse),
        };
    }
};

export { handler };
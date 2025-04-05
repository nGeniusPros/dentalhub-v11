import express from 'express';
import { MCPGateway } from './dist/mcp/gateway/MCPGateway.js';
import { PatientAdapter } from './dist/mcp/adapters/PatientAdapter.js';
import { AuthAdapter } from './dist/mcp/adapters/AuthAdapter.js';
import { VoiceCampaignAdapter } from './dist/mcp/adapters/VoiceCampaignAdapter.js';
import { DatabaseAdapter } from './dist/mcp/adapters/DatabaseAdapter.js';
// Import NexHealthAdapter from local file
import { NexHealthAdapter } from './nexhealth-adapter.js';
import { supabase } from './dist/mcp/config/database.js';
import { RuleEngine } from './dist/mcp/rules/RuleEngine.js';
import { RuleLoader } from './dist/mcp/rules/RuleLoader.js';
import { registerAllFeatureRules } from './dist/features/index.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// Initialize MCP Gateway
let gatewayInstance = null;
let initializationError = null;

try {
    console.log("Initializing MCP Gateway (local server)...");
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

    // Register adapters
    gatewayInstance.registerAdapter('PatientAdapter', new PatientAdapter(supabase));
    gatewayInstance.registerAdapter('AuthAdapter', new AuthAdapter(supabase));
    gatewayInstance.registerAdapter('VoiceCampaignAdapter', new VoiceCampaignAdapter(supabase));
    gatewayInstance.registerAdapter('NexHealthAdapter', new NexHealthAdapter());
    gatewayInstance.registerAdapter('DatabaseAdapter', new DatabaseAdapter(supabase));

    // Load rules from configuration file
    const ruleLoader = new RuleLoader(ruleEngine, supabase);
    ruleLoader.loadRules(rulesConfigPath);

    // Register feature rules using vertical slice architecture
    registerAllFeatureRules(ruleEngine, supabase);

    console.log("MCP Gateway and Rules initialized successfully (local server).");

} catch (initError) {
    console.error("FATAL: Failed to initialize MCP Gateway or Adapters:", initError);
    initializationError = initError instanceof Error ? initError : new Error(String(initError));
    gatewayInstance = null;
}

// MCP Endpoint
app.post('/mcp', async (req, res) => {
    if (!gatewayInstance) {
        console.error("Gateway instance is not initialized");
        return res.status(500).json({ error: "MCP Gateway not initialized" });
    }

    try {
        const response = await gatewayInstance.processRequest({
            path: req.body.path,
            method: req.body.method,
            headers: req.headers,
            body: req.body.body,
            query: req.query
        });

        res.status(response.status).json(response);
    } catch (error) {
        console.error("Error processing MCP request:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Start server
const PORT = 60546;
app.listen(PORT, () => {
    console.log(`MCP Server running on http://localhost:${PORT}`);
});

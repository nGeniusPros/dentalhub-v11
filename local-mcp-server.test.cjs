const express = require('express');
const { MCPGateway } = require('./dist/mcp/gateway/MCPGateway');
const { PatientAdapter } = require('./dist/mcp/adapters/PatientAdapter');
const { AuthAdapter } = require('./dist/mcp/adapters/AuthAdapter');
const { VoiceCampaignAdapter } = require('./dist/mcp/adapters/VoiceCampaignAdapter');
const { supabase } = require('./dist/mcp/config/database');
const { RuleEngine } = require('./dist/mcp/rules/RuleEngine');
const { RuleLoader } = require('./dist/mcp/rules/RuleLoader');
// Import the test version of registerAllFeatureRules
const { registerAllFeatureRules } = require('./dist/features/index.test');
const path = require('path');

const app = express();
app.use(express.json());

// Initialize MCP Gateway
let gatewayInstance = null;
let initializationError = null;

try {
    console.log("Initializing MCP Gateway (TEST SERVER)...");
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

    // Load rules from configuration file
    const ruleLoader = new RuleLoader(ruleEngine, supabase);
    ruleLoader.loadRules(rulesConfigPath);

    // Register feature rules using vertical slice architecture
    // This uses the test version that disables authentication for voice campaigns
    registerAllFeatureRules(ruleEngine, supabase);

    console.log("MCP Gateway and Rules initialized successfully (TEST SERVER).");

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
const PORT = 60547; // Use a different port for the test server
app.listen(PORT, () => {
    console.log(`TEST MCP Server running on http://localhost:${PORT}`);
});

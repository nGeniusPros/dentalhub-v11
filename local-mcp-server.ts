import express from 'express';
import { MCPGateway } from '../src/mcp/gateway/MCPGateway';
import { PatientAdapter } from '../src/mcp/adapters/PatientAdapter';
import { AuthAdapter } from '../src/mcp/adapters/AuthAdapter';
import { supabase } from '../src/mcp/config/database';
import path from 'path';

const app = express();
app.use(express.json());

// Initialize MCP Gateway
let gatewayInstance: MCPGateway | null = null;
let initializationError: Error | null = null;

try {
    console.log("Initializing MCP Gateway (local server)..."));
    const configPath = path.resolve(process.cwd(), 'mcp-config.json');

    // Check if Supabase client is valid before passing
    if (!supabase) {
        throw new Error("Supabase client failed to initialize in database.ts");
    }

    gatewayInstance = new MCPGateway({ supabase, configPath });

    // Register adapters
    gatewayInstance.registerAdapter('patient', new PatientAdapter(supabase));
    gatewayInstance.registerAdapter('auth', new AuthAdapter(supabase));

    console.log("MCP Gateway initialized successfully (local server)."));

} catch (initError: unknown) {
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

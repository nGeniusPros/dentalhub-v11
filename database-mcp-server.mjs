import express from 'express';
import cors from 'cors';
import { DatabaseMCPGateway } from './dist/mcp/gateway/DatabaseMCPGateway.js';
import { DatabaseAdapter } from './dist/mcp/adapters/DatabaseAdapter.js';
import { supabase } from './dist/mcp/config/database.js';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// Initialize MCP Gateway
let gatewayInstance = null;
let initializationError = null;

try {
    console.log("Initializing Database MCP Gateway...");
    const configPath = path.resolve(process.cwd(), 'mcp-config.json');

    // Check if Supabase client is valid before passing
    if (!supabase) {
        throw new Error("Supabase client failed to initialize in database.ts");
    }

    // Create database gateway
    gatewayInstance = new DatabaseMCPGateway({ supabase, configPath });

    // Register database adapter
    gatewayInstance.registerAdapter('DatabaseAdapter', new DatabaseAdapter(supabase));

    console.log("Database MCP Gateway and Rules initialized successfully.");

} catch (initError) {
    console.error("FATAL: Failed to initialize Database MCP Gateway:", initError);
    initializationError = initError instanceof Error ? initError : new Error(String(initError));
    gatewayInstance = null;
}

// Health check endpoint
app.get('/health', (req, res) => {
    if (gatewayInstance) {
        res.status(200).json({ status: 'ok', message: 'Database MCP Server is running' });
    } else {
        res.status(500).json({
            status: 'error',
            message: 'Database MCP Gateway failed to initialize',
            error: initializationError?.message
        });
    }
});

// MCP Endpoint
app.post('/mcp', async (req, res) => {
    if (!gatewayInstance) {
        console.error("Gateway instance is not initialized");
        return res.status(500).json({ error: "Database MCP Gateway not initialized" });
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
const PORT = process.env.DATABASE_MCP_PORT || 60547;
app.listen(PORT, () => {
    console.log(`Database MCP Server running on http://localhost:${PORT}`);
});

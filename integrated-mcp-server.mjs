import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Get directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import Supabase client
import { supabase } from './dist/mcp/config/database.js';

// Import adapters
import { DatabaseAdapter } from './dist/mcp/adapters/DatabaseAdapter.js';

// Create Express app
const app = express();
app.use(cors());
app.use(express.json());

// Initialize MCP Gateway
let gatewayInstance = null;
let initializationError = null;

// Simple MCP Gateway implementation
class SimpleMCPGateway {
  constructor() {
    this.adapters = new Map();
    this.routes = new Map();
    
    // Set up routes for DatabaseAdapter
    this.routes.set('/api/database', 'DatabaseAdapter.processRequest');
    this.routes.set('/api/database/*', 'DatabaseAdapter.processRequest');
  }
  
  registerAdapter(name, adapter) {
    this.adapters.set(name, adapter);
    console.log(`Registered adapter: ${name}`);
  }
  
  async processRequest(request) {
    try {
      // Find the appropriate adapter based on the path
      let adapterName = null;
      let adapterMethod = null;
      
      for (const [routePath, routeHandler] of this.routes.entries()) {
        if (request.path === routePath || 
            (routePath.endsWith('*') && 
             request.path.startsWith(routePath.slice(0, -1)))) {
          const [adapter, method] = routeHandler.split('.');
          adapterName = adapter;
          adapterMethod = method;
          break;
        }
      }
      
      if (!adapterName) {
        return {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
          body: null,
          error: {
            code: 'NOT_FOUND',
            message: `Endpoint ${request.path} not found`
          }
        };
      }
      
      const adapter = this.adapters.get(adapterName);
      if (!adapter) {
        return {
          status: 503,
          headers: { 'Content-Type': 'application/json' },
          body: null,
          error: {
            code: 'SERVICE_UNAVAILABLE',
            message: `The service '${adapterName}' is currently unavailable.`
          }
        };
      }
      
      // Call the adapter's method
      const result = await adapter[adapterMethod](request);
      
      return {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        body: result,
        error: null
      };
    } catch (error) {
      console.error('Error processing request:', error);
      return {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
        body: null,
        error: {
          code: 'INTERNAL_ERROR',
          message: error instanceof Error ? error.message : String(error),
          details: error instanceof Error ? error.stack : undefined
        }
      };
    }
  }
}

try {
  console.log("Initializing Integrated MCP Gateway...");
  
  // Check if Supabase client is valid
  if (!supabase) {
    throw new Error("Supabase client failed to initialize in database.ts");
  }
  
  // Create gateway
  gatewayInstance = new SimpleMCPGateway();
  
  // Register adapters
  gatewayInstance.registerAdapter('DatabaseAdapter', new DatabaseAdapter(supabase));
  
  console.log("Integrated MCP Gateway initialized successfully.");
} catch (initError) {
  console.error("FATAL: Failed to initialize Integrated MCP Gateway:", initError);
  initializationError = initError instanceof Error ? initError : new Error(String(initError));
  gatewayInstance = null;
}

// Health check endpoint
app.get('/health', (req, res) => {
  if (gatewayInstance) {
    res.status(200).json({ status: 'ok', message: 'Integrated MCP Server is running' });
  } else {
    res.status(500).json({ 
      status: 'error', 
      message: 'Integrated MCP Gateway failed to initialize',
      error: initializationError?.message
    });
  }
});

// MCP Endpoint
app.post('/mcp', async (req, res) => {
  if (!gatewayInstance) {
    console.error("Gateway instance is not initialized");
    return res.status(500).json({ error: "Integrated MCP Gateway not initialized" });
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
const PORT = process.env.MCP_PORT || 60546;
app.listen(PORT, () => {
  console.log(`Integrated MCP Server running on http://localhost:${PORT}`);
});

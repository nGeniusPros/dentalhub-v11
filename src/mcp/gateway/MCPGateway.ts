import * as fs from 'fs';
import * as path from 'path';
import { MCPRequest, MCPResponse, MCPError } from '../protocol/types';
import { Adapter } from '../types';

export class MCPGateway {
  private adapters: Map<string, Adapter>;
  private routes: Map<string, string>;

  constructor(configPath: string) { // Require config path to be passed explicitly
    this.adapters = new Map();
    this.routes = this.loadRoutesFromConfig(configPath);
  }

  private loadRoutesFromConfig(configPath: string): Map<string, string> {
    try {
      // Adjust path relative to the compiled JS file location if needed
      // For Vite/TS projects, __dirname might point to the 'dist' folder
      // A more robust solution might involve passing the project root or using environment variables
      const resolvedPath = path.resolve(configPath);
      console.log(`Attempting to load MCP config from: ${resolvedPath}`); // Logging path
      if (!fs.existsSync(resolvedPath)) {
        console.error(`MCP configuration file not found at ${resolvedPath}`);
        return new Map();
      }
      const configFile = fs.readFileSync(resolvedPath, 'utf-8');
      const config = JSON.parse(configFile);
      if (config && config.routes && typeof config.routes === 'object') {
        console.log('MCP configuration loaded successfully.');
        return new Map(Object.entries(config.routes));
      } else {
        console.error('Invalid MCP configuration format. "routes" object not found.');
        return new Map();
      }
    } catch (error) {
      console.error('Error loading MCP configuration:', error);
      return new Map(); // Return empty map on error
    }
  }

  registerAdapter(serviceName: string, adapter: Adapter): void {
    this.adapters.set(serviceName, adapter);
  }

  // addRoute is removed as routes are now loaded from config

  async handleRequest(request: MCPRequest): Promise<MCPResponse> {
    try {
      const endpoint = this.routes.get(request.path);
      if (!endpoint) {
        console.warn(`MCP Route Not Found: ${request.path}`);
        return this.createErrorResponse(404, 'ROUTE_NOT_FOUND', 'The requested endpoint does not exist.');
      }

      const [serviceName] = endpoint.split('/');
      const adapter = this.adapters.get(serviceName);
      
      if (!adapter) {
        console.error(`MCP Service Unavailable: Adapter not found for service "${serviceName}"`);
        return this.createErrorResponse(503, 'SERVICE_UNAVAILABLE', `The service '${serviceName}' is currently unavailable.`);
      }

      const response = await adapter.processRequest(request);
      return this.formatResponse(response);
      
    } catch (error) {
      // Basic logging - a more robust logger (e.g., Winston, Pino) would be better here
      const errorDetails = error instanceof Error ? error.message : String(error);
      console.error(`MCP Internal Server Error: Path=${request.path}, Error=${errorDetails}`);
      // Optionally include stack trace in development
      // const details = process.env.NODE_ENV === 'development' && error instanceof Error ? error.stack : undefined;
      return this.createErrorResponse(500, 'INTERNAL_ERROR', 'An unexpected error occurred processing the request.'); // Add details optionally
    }
  }

  private formatResponse(data: unknown): MCPResponse {
    // Successful response
    return {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data), // Assuming adapters return data ready for stringification
      error: null
    };
  }

  private createErrorResponse(status: number, code: string, message: string, details?: unknown): MCPResponse {
    const errorPayload: MCPError = { code, message, details };
    return {
      status,
      headers: { 'Content-Type': 'application/json' },
      body: null, // No body for error responses
      error: errorPayload
    };
  }
}
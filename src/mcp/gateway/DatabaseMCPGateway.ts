import { MCPRequest, MCPResponse } from '../protocol/types';
import { Adapter } from '../types';
import { SupabaseClient } from '@supabase/supabase-js';
import * as fs from 'fs';

/**
 * Simplified MCP Gateway for database operations
 * This version doesn't depend on RuleEngine
 */
export class DatabaseMCPGateway {
  private readonly routes = new Map<string, string>();
  private readonly adapters = new Map<string, { instance: Adapter; servicePrefix: string }>();
  private readonly supabase: SupabaseClient;

  constructor(config: { supabase: SupabaseClient; configPath: string }) {
    this.supabase = config.supabase;
    this.loadRoutes(config.configPath);
  }

  /**
   * Load routes from configuration file
   * @param configPath Path to the configuration file
   */
  private loadRoutes(configPath: string): void {
    try {
      const configContent = fs.readFileSync(configPath, 'utf8');
      const config = JSON.parse(configContent);

      if (config.routes && typeof config.routes === 'object') {
        for (const [path, endpoint] of Object.entries(config.routes)) {
          if (typeof endpoint === 'string') {
            this.routes.set(path, endpoint);
          }
        }
      }

      console.log(`Loaded ${this.routes.size} routes from configuration`);
    } catch (error) {
      console.error('Error loading routes from configuration:', error);
      throw new Error(`Failed to load routes from ${configPath}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Register an adapter with the gateway
   * @param name Name of the adapter
   * @param adapter Instance of the adapter
   * @param servicePrefix Optional prefix for the adapter's endpoints
   */
  public registerAdapter(name: string, adapter: Adapter, servicePrefix = ''): void {
    this.adapters.set(name, { instance: adapter, servicePrefix });
    console.log(`Registered adapter: ${name} with prefix: ${servicePrefix || '(none)'}`);
  }

  /**
   * Process an MCP request
   * @param request The MCP request to process
   * @returns The response from the adapter
   */
  public async processRequest(request: MCPRequest): Promise<MCPResponse> {
    try {
      const endpoint = this.routes.get(request.path);
      if (!endpoint) {
        return this.createErrorResponse(404, 'NOT_FOUND', `Endpoint ${request.path} not found`);
      }

      console.log(`Routing MCP request for path "${request.path}" to endpoint "${endpoint}"`);

      // Find the appropriate adapter
      let adapterName: string | null = null;
      for (const [name, adapter] of this.adapters.entries()) {
        if (endpoint.startsWith(adapter.servicePrefix)) {
          adapterName = name;
          break;
        }
      }

      if (!adapterName) {
        console.error(`MCP Service Unavailable: Adapter not found for endpoint "${endpoint}"`);
        return this.createErrorResponse(404, 'NOT_FOUND', `No adapter found for endpoint ${request.path}`);
      }

      const adapter = this.adapters.get(adapterName);
      if (!adapter) {
        console.error(`MCP Service Unavailable: Adapter not found for service "${adapterName}"`);
        return this.createErrorResponse(503, 'SERVICE_UNAVAILABLE', `The service '${adapterName}' is currently unavailable.`);
      }

      // Call the adapter's processRequest method
      const result = await adapter.instance.processRequest(request);

      return {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        body: result,
        error: null
      };
    } catch (error) {
      console.error('Error processing MCP request:', error);
      return this.createErrorResponse(
        500,
        'INTERNAL_ERROR',
        error instanceof Error ? error.message : String(error),
        error instanceof Error ? error.stack : undefined
      );
    }
  }

  /**
   * Create an error response
   * @param status HTTP status code
   * @param code Error code
   * @param message Error message
   * @param details Optional error details
   * @returns The error response
   */
  private createErrorResponse(status: number, code: string, message: string, details?: unknown): MCPResponse {
    return {
      status,
      headers: { 'Content-Type': 'application/json' },
      body: null,
      error: {
        code,
        message,
        details
      }
    };
  }
}

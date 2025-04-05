import { MCPRequest, MCPResponse, Adapter } from '../../types';
import { SupabaseClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import { RuleEngine } from '../rules/RuleEngine';

export class MCPGateway {
  private readonly routes = new Map<string, string>();
  private readonly adapters = new Map<string, { instance: Adapter; servicePrefix: string }>();
  private readonly supabase: SupabaseClient;
  private readonly ruleEngine: RuleEngine;

  constructor(config: { supabase: SupabaseClient; configPath: string; ruleEngine?: RuleEngine }) {
    this.supabase = config.supabase;
    this.ruleEngine = config.ruleEngine || new RuleEngine();
    this.loadRoutes(config.configPath);
  }

  private loadRoutes(configPath: string): void {
    try {
      const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

      // Validate routes structure
      if (!config.routes || typeof config.routes !== 'object') {
        throw new Error('Invalid MCP configuration: routes must be an object');
      }

      Object.entries(config.routes).forEach(([path, servicePath]) => {
        if (typeof path !== 'string' || typeof servicePath !== 'string') {
          console.warn(`Invalid route configuration: path must be string, got ${typeof path} and servicePath must be string, got ${typeof servicePath}`);
          return;
        }
        this.routes.set(path, servicePath);
      });

    } catch (error) {
      console.error('Error loading MCP routes:', error);
      throw new Error('Failed to load MCP routes configuration');
    }
  }

  public registerAdapter(name: string, instance: Adapter): void {
    const servicePrefix = this.getServicePrefix(name);
    this.adapters.set(name, { instance, servicePrefix });
  }

  private getServicePrefix(adapterName: string): string {
    return `${adapterName}.`;
  }

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

      // Apply rules before processing the request
      const ruleResult = await this.ruleEngine.applyRules(request, adapterName, endpoint);
      if (ruleResult) {
        console.log(`Rule violation for request to ${request.path}: ${ruleResult.error?.message}`);
        return ruleResult;
      }

      // Call the adapter's handleRequest method
      const result = await adapter.instance.handleRequest(request);

      return {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        body: result.body,
        error: null
      };

    } catch (error: unknown) { // Catch as unknown
      console.error('MCP Gateway Error:', error);

      // Default error values
      let errorMessage = 'Internal Server Error';
      let statusCode = 500;
      let errorCode = 'INTERNAL_ERROR';
      let errorDetails: unknown = error instanceof Error ? error.stack : String(error);

      // Type guard to check if the error looks like our MCPError structure
      const looksLikeMCPError = (e: unknown): e is { code: string; message: string; statusCode?: number; details?: unknown } => {
        return typeof e === 'object' && e !== null && 'code' in e && 'message' in e;
      };

      if (looksLikeMCPError(error)) {
        errorMessage = error.message;
        errorCode = error.code;
        if (typeof error.statusCode === 'number') {
          statusCode = error.statusCode;
        }
        if (error.details !== undefined) {
            errorDetails = error.details;
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      return this.createErrorResponse(statusCode, errorCode, errorMessage, errorDetails);
    }
  }

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

  /**
   * Get the rule engine instance
   * @returns The rule engine instance
   */
  public getRuleEngine(): RuleEngine {
    return this.ruleEngine;
  }
}
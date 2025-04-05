import { MCPRequest, MCPResponse, MCPError } from '../protocol/types';
import { Rule, RuleContext, RuleResult, RuleType, RulePriority } from './types';
import { MCPError as MCPErrorClass } from '../protocol/errors';

/**
 * Rule Engine for the MCP Gateway
 * 
 * Manages rule registration, execution, and integration with the MCP Gateway
 */
export class RuleEngine {
  private rules: Rule[] = [];

  /**
   * Register a rule with the engine
   * @param rule The rule to register
   */
  public registerRule(rule: Rule): void {
    // Check if rule with same ID already exists
    const existingRuleIndex = this.rules.findIndex(r => r.config.id === rule.config.id);
    if (existingRuleIndex !== -1) {
      // Replace existing rule
      this.rules[existingRuleIndex] = rule;
      console.log(`Rule with ID ${rule.config.id} replaced.`);
    } else {
      // Add new rule
      this.rules.push(rule);
      console.log(`Rule with ID ${rule.config.id} registered.`);
    }
    
    // Sort rules by priority
    this.sortRules();
  }

  /**
   * Unregister a rule from the engine
   * @param ruleId The ID of the rule to unregister
   * @returns Whether the rule was successfully unregistered
   */
  public unregisterRule(ruleId: string): boolean {
    const initialLength = this.rules.length;
    this.rules = this.rules.filter(rule => rule.config.id !== ruleId);
    return this.rules.length < initialLength;
  }

  /**
   * Get all registered rules
   * @returns Array of registered rules
   */
  public getRules(): Rule[] {
    return [...this.rules];
  }

  /**
   * Get rules of a specific type
   * @param type The type of rules to get
   * @returns Array of rules of the specified type
   */
  public getRulesByType(type: RuleType): Rule[] {
    return this.rules.filter(rule => rule.config.type === type);
  }

  /**
   * Enable a rule
   * @param ruleId The ID of the rule to enable
   * @returns Whether the rule was successfully enabled
   */
  public enableRule(ruleId: string): boolean {
    const rule = this.rules.find(r => r.config.id === ruleId);
    if (rule) {
      rule.config.enabled = true;
      return true;
    }
    return false;
  }

  /**
   * Disable a rule
   * @param ruleId The ID of the rule to disable
   * @returns Whether the rule was successfully disabled
   */
  public disableRule(ruleId: string): boolean {
    const rule = this.rules.find(r => r.config.id === ruleId);
    if (rule) {
      rule.config.enabled = false;
      return true;
    }
    return false;
  }

  /**
   * Sort rules by priority
   */
  private sortRules(): void {
    this.rules.sort((a, b) => a.config.priority - b.config.priority);
  }

  /**
   * Check if a rule applies to a given request
   * @param rule The rule to check
   * @param request The request to check against
   * @param adapterName The name of the adapter that will handle the request
   * @returns Whether the rule applies to the request
   */
  private ruleApplies(rule: Rule, request: MCPRequest, adapterName?: string): boolean {
    // Skip disabled rules
    if (!rule.config.enabled) {
      return false;
    }

    // Check paths
    if (rule.config.paths && rule.config.paths.length > 0) {
      const pathMatches = rule.config.paths.some(pattern => {
        // Simple exact match
        if (pattern === request.path) {
          return true;
        }
        
        // Simple wildcard match (e.g., /api/*)
        if (pattern.endsWith('*')) {
          const prefix = pattern.slice(0, -1);
          return request.path.startsWith(prefix);
        }
        
        // TODO: Add more sophisticated path matching if needed
        
        return false;
      });
      
      if (!pathMatches) {
        return false;
      }
    }

    // Check methods
    if (rule.config.methods && rule.config.methods.length > 0) {
      if (!rule.config.methods.includes(request.method.toUpperCase())) {
        return false;
      }
    }

    // Check adapters
    if (rule.config.adapters && rule.config.adapters.length > 0 && adapterName) {
      if (!rule.config.adapters.includes(adapterName)) {
        return false;
      }
    }

    return true;
  }

  /**
   * Execute all applicable rules for a request
   * @param request The MCP request
   * @param adapterName The name of the adapter that will handle the request
   * @param endpoint The endpoint that will handle the request
   * @returns Result of rule execution, or null if all rules passed
   */
  public async executeRules(
    request: MCPRequest, 
    adapterName?: string, 
    endpoint?: string
  ): Promise<MCPError | null> {
    const context: RuleContext = {
      request,
      adapterName,
      endpoint,
      data: {},
    };

    for (const rule of this.rules) {
      if (this.ruleApplies(rule, request, adapterName)) {
        try {
          const result = await Promise.resolve(rule.execute(context));
          
          if (!result.passed) {
            console.log(`Rule ${rule.config.id} failed: ${result.message}`);
            return {
              code: result.code || 'RULE_VIOLATION',
              message: result.message || `Rule violation: ${rule.config.name}`,
              details: result.details,
            };
          }
          
          // Update context with any data from the rule
          if (result.details && typeof result.details === 'object') {
            context.data = { ...context.data, ...result.details };
          }
        } catch (error) {
          console.error(`Error executing rule ${rule.config.id}:`, error);
          return {
            code: 'RULE_EXECUTION_ERROR',
            message: `Error executing rule: ${rule.config.name}`,
            details: error instanceof Error ? error.message : String(error),
          };
        }
      }
    }

    return null;
  }

  /**
   * Create an error response from a rule violation
   * @param error The error from rule execution
   * @returns MCP response with error details
   */
  public createErrorResponse(error: MCPError): MCPResponse {
    return {
      status: 400, // Default status code for rule violations
      headers: { 'Content-Type': 'application/json' },
      body: null,
      error,
    };
  }

  /**
   * Middleware function to integrate with MCP Gateway
   * @param request The MCP request
   * @param adapterName The name of the adapter that will handle the request
   * @param endpoint The endpoint that will handle the request
   * @returns Error response if rules fail, null if all rules pass
   */
  public async applyRules(
    request: MCPRequest, 
    adapterName?: string, 
    endpoint?: string
  ): Promise<MCPResponse | null> {
    const error = await this.executeRules(request, adapterName, endpoint);
    if (error) {
      return this.createErrorResponse(error);
    }
    return null;
  }
}

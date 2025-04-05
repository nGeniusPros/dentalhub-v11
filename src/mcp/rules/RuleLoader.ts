import * as fs from 'fs';
import { z } from 'zod';
import { RuleEngine } from './RuleEngine';
import { ValidationRule } from './ValidationRule';
import { AuthorizationRule } from './AuthorizationRule';
import { RateLimitRule } from './RateLimitRule';
import { AuditRule } from './AuditRule';
import { RuleType, RulePriority } from './types';
import { SupabaseClient } from '@supabase/supabase-js';

/**
 * Loads rules from a configuration file and registers them with the rule engine
 */
export class RuleLoader {
  private ruleEngine: RuleEngine;
  private supabase: SupabaseClient;

  constructor(ruleEngine: RuleEngine, supabase: SupabaseClient) {
    this.ruleEngine = ruleEngine;
    this.supabase = supabase;
  }

  /**
   * Load rules from a configuration file
   * @param configPath Path to the configuration file
   */
  public loadRules(configPath: string): void {
    try {
      const configContent = fs.readFileSync(configPath, 'utf-8');
      const config = JSON.parse(configContent);

      this.processConfig(config);

      console.log('Rules loaded successfully from configuration file');
    } catch (error) {
      console.error('Error loading rules from configuration file:', error);
      throw new Error('Failed to load rules from configuration file');
    }
  }

  /**
   * Process the configuration object and register rules
   * @param config Configuration object
   */
  private processConfig(config: any): void {
    // Process global rule settings
    const globalSettings = config.rules || {};

    // Process endpoint-specific rules
    const endpoints = config.endpoints || {};

    for (const [path, endpointConfig] of Object.entries(endpoints)) {
      this.processEndpointRules(path, endpointConfig as any, globalSettings, config);
    }
  }

  /**
   * Process rules for a specific endpoint
   * @param path Endpoint path
   * @param endpointConfig Endpoint configuration
   * @param globalSettings Global rule settings
   * @param fullConfig Full configuration object (for schemas and custom rules)
   */
  private processEndpointRules(
    path: string,
    endpointConfig: any,
    globalSettings: any,
    fullConfig: any
  ): void {
    // Process validation rules
    if (endpointConfig.validation && globalSettings.validation?.enabled !== false) {
      this.createValidationRules(path, endpointConfig.validation, globalSettings.validation, fullConfig);
    }

    // Process authorization rules
    if (endpointConfig.authorization && globalSettings.authorization?.enabled !== false) {
      this.createAuthorizationRules(path, endpointConfig.authorization, globalSettings.authorization, fullConfig);
    }

    // Process rate limit rules
    if (endpointConfig.rateLimit && globalSettings.rateLimit?.enabled !== false) {
      this.createRateLimitRules(path, endpointConfig.rateLimit, globalSettings.rateLimit, fullConfig);
    }

    // Process audit rules
    if (endpointConfig.audit && globalSettings.audit?.enabled !== false) {
      this.createAuditRules(path, endpointConfig.audit, globalSettings.audit, fullConfig);
    }
  }

  /**
   * Create validation rules for an endpoint
   * @param path Endpoint path
   * @param validationConfig Validation configuration
   * @param globalValidationSettings Global validation settings
   * @param fullConfig Full configuration object (for schemas)
   */
  private createValidationRules(
    path: string,
    validationConfig: any,
    globalValidationSettings: any,
    fullConfig: any
  ): void {
    const schemas = fullConfig.schemas || {};

    for (const [method, methodConfig] of Object.entries(validationConfig)) {
      const config = methodConfig as any;

      if (config.bodySchema) {
        const schemaName = config.bodySchema;
        const schemaConfig = schemas[schemaName];

        if (!schemaConfig) {
          console.warn(`Schema ${schemaName} not found for ${method} ${path}`);
          continue;
        }

        // Create a Zod schema from the configuration
        const bodySchema = this.createZodSchema(schemaConfig);

        // Create and register the validation rule
        const rule = new ValidationRule(
          {
            id: `validation-${path}-${method}`,
            name: `Validation for ${method} ${path}`,
            description: `Validates request body for ${method} ${path}`,
            priority: config.priority || globalValidationSettings?.defaultPriority || RulePriority.HIGHEST,
            enabled: config.enabled !== false,
            paths: [path],
            methods: [method],
          },
          {
            bodySchema,
          }
        );

        this.ruleEngine.registerRule(rule);
      }
    }
  }

  /**
   * Create authorization rules for an endpoint
   * @param path Endpoint path
   * @param authConfig Authorization configuration
   * @param globalAuthSettings Global authorization settings
   * @param fullConfig Full configuration object (for custom rules)
   */
  private createAuthorizationRules(
    path: string,
    authConfig: any,
    globalAuthSettings: any,
    fullConfig: any
  ): void {
    const customRules = fullConfig.customRules || {};

    for (const [method, methodConfig] of Object.entries(authConfig)) {
      const config = methodConfig as any;

      // Create and register the authorization rule
      const rule = new AuthorizationRule(
        {
          id: `auth-${path}-${method}`,
          name: `Authorization for ${method} ${path}`,
          description: `Authorizes requests for ${method} ${path}`,
          priority: config.priority || globalAuthSettings?.defaultPriority || RulePriority.HIGH,
          enabled: config.enabled !== false,
          paths: [path],
          methods: [method],
        },
        {
          requireAuth: true,
          requiredRoles: config.roles || [],
          customAuthorizer: config.customRule ? this.getCustomAuthorizer(config.customRule, customRules) : undefined,
        },
        this.supabase
      );

      this.ruleEngine.registerRule(rule);
    }
  }

  /**
   * Create rate limit rules for an endpoint
   * @param path Endpoint path
   * @param rateLimitConfig Rate limit configuration
   * @param globalRateLimitSettings Global rate limit settings
   * @param fullConfig Full configuration object
   */
  private createRateLimitRules(
    path: string,
    rateLimitConfig: any,
    globalRateLimitSettings: any,
    fullConfig: any
  ): void {
    for (const [method, methodConfig] of Object.entries(rateLimitConfig)) {
      const config = methodConfig as any;

      // Create and register the rate limit rule
      const rule = new RateLimitRule(
        {
          id: `rate-limit-${path}-${method}`,
          name: `Rate Limit for ${method} ${path}`,
          description: `Rate limits requests for ${method} ${path}`,
          priority: config.priority || globalRateLimitSettings?.defaultPriority || RulePriority.HIGH,
          enabled: config.enabled !== false,
          paths: [path],
          methods: [method],
        },
        {
          limit: config.limit || globalRateLimitSettings?.globalLimits?.perIp?.limit || 100,
          windowSeconds: config.windowSeconds || globalRateLimitSettings?.globalLimits?.perIp?.windowSeconds || 60,
          keyExtractor: (context) => {
            // Use IP address as the default key
            const headers = context.request.headers || {};
            return headers['x-forwarded-for'] ||
                   headers['x-real-ip'] ||
                   'unknown-ip';
          },
          includeMethod: true,
        }
      );

      this.ruleEngine.registerRule(rule);
    }
  }

  /**
   * Create audit rules for an endpoint
   * @param path Endpoint path
   * @param auditConfig Audit configuration
   * @param globalAuditSettings Global audit settings
   * @param fullConfig Full configuration object
   */
  private createAuditRules(
    path: string,
    auditConfig: any,
    globalAuditSettings: any,
    fullConfig: any
  ): void {
    for (const [method, methodConfig] of Object.entries(auditConfig)) {
      const config = methodConfig as any;

      // Create and register the audit rule
      const rule = new AuditRule(
        {
          id: `audit-${path}-${method}`,
          name: `Audit for ${method} ${path}`,
          description: `Audits requests for ${method} ${path}`,
          priority: config.priority || globalAuditSettings?.defaultPriority || RulePriority.LOW,
          enabled: config.enabled !== false,
          paths: [path],
          methods: [method],
        },
        {
          logBody: config.logBody !== undefined ? config.logBody : false,
          logQuery: config.logQuery !== undefined ? config.logQuery : false,
          logHeaders: config.logHeaders !== undefined ? config.logHeaders : false,
          logUser: config.logUser !== undefined ? config.logUser : true,
          logToConsole: globalAuditSettings?.logToConsole !== false,
          tableName: globalAuditSettings?.logToDatabase !== false ? (globalAuditSettings?.tableName || 'audit_logs') : undefined,
        },
        this.supabase
      );

      this.ruleEngine.registerRule(rule);
    }
  }

  /**
   * Create a Zod schema from a schema configuration
   * @param schemaConfig Schema configuration
   * @returns Zod schema
   */
  private createZodSchema(schemaConfig: any): z.ZodType<any> {
    if (schemaConfig.type === 'object') {
      const shape: Record<string, z.ZodType<any>> = {};

      for (const [propName, propConfig] of Object.entries(schemaConfig.properties || {})) {
        const config = propConfig as any;
        let propSchema: z.ZodType<any>;

        // Create property schema based on type
        switch (config.type) {
          case 'string':
            propSchema = z.string();

            // Apply string-specific validations
            if (config.minLength !== undefined) {
              propSchema = (propSchema as any).min(config.minLength, `${propName} must be at least ${config.minLength} characters`);
            }

            if (config.maxLength !== undefined) {
              propSchema = (propSchema as any).max(config.maxLength, `${propName} must be at most ${config.maxLength} characters`);
            }

            if (config.format === 'email') {
              propSchema = (propSchema as any).email(`${propName} must be a valid email`);
            }

            break;

          case 'number':
            propSchema = z.number();

            // Apply number-specific validations
            if (config.minimum !== undefined) {
              propSchema = (propSchema as any).min(config.minimum, `${propName} must be at least ${config.minimum}`);
            }

            if (config.maximum !== undefined) {
              propSchema = (propSchema as any).max(config.maximum, `${propName} must be at most ${config.maximum}`);
            }

            break;

          case 'boolean':
            propSchema = z.boolean();
            break;

          case 'array':
            // For simplicity, we'll assume array items are strings
            propSchema = z.array(z.string());
            break;

          default:
            propSchema = z.any();
        }

        // Make optional if specified
        if (config.optional) {
          propSchema = propSchema.optional();
        }

        shape[propName] = propSchema;
      }

      // Create object schema
      let objectSchema = z.object(shape);

      // Add required fields
      if (schemaConfig.required && Array.isArray(schemaConfig.required)) {
        // This is a bit of a hack since Zod doesn't have a direct way to set required fields after creation
        // In a real implementation, you might want to handle this differently
        const requiredShape: Record<string, z.ZodType<any>> = {};

        for (const requiredField of schemaConfig.required) {
          if (shape[requiredField]) {
            requiredShape[requiredField] = shape[requiredField];
          }
        }

        objectSchema = z.object(requiredShape).merge(objectSchema);
      }

      return objectSchema;
    }

    // Default to any schema if not an object
    return z.any();
  }

  /**
   * Get a custom authorizer function from the custom rules configuration
   * @param ruleName Name of the custom rule
   * @param customRules Custom rules configuration
   * @returns Custom authorizer function
   */
  private getCustomAuthorizer(ruleName: string, customRules: any): any {
    const customRule = customRules[ruleName];

    if (!customRule) {
      console.warn(`Custom rule ${ruleName} not found`);
      return undefined;
    }

    if (customRule.type !== 'authorization') {
      console.warn(`Custom rule ${ruleName} is not an authorization rule`);
      return undefined;
    }

    try {
      // This is potentially unsafe and should be handled more carefully in a production environment
      // Consider using a safer approach to define custom rules
      return eval(customRule.logic);
    } catch (error) {
      console.error(`Error creating custom authorizer for rule ${ruleName}:`, error);
      return undefined;
    }
  }
}

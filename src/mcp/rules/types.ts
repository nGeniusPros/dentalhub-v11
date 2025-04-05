import { MCPRequest, MCPResponse } from '../protocol/types';

/**
 * Result of a rule execution
 */
export interface RuleResult {
  /** Whether the rule passed or failed */
  passed: boolean;
  /** Error message if the rule failed */
  message?: string;
  /** Error code if the rule failed */
  code?: string;
  /** HTTP status code to return if the rule failed */
  statusCode?: number;
  /** Additional details about the rule execution */
  details?: unknown;
}

/**
 * Context available to rules during execution
 */
export interface RuleContext {
  /** The original MCP request */
  request: MCPRequest;
  /** The adapter name that will handle the request */
  adapterName?: string;
  /** The endpoint that will handle the request */
  endpoint?: string;
  /** Additional context data that might be useful for rules */
  data?: Record<string, unknown>;
}

/**
 * Rule types supported by the MCP Gateway
 */
export enum RuleType {
  /** Rules that validate request structure, parameters, etc. */
  VALIDATION = 'validation',
  /** Rules that check if the user is authorized to perform the action */
  AUTHORIZATION = 'authorization',
  /** Rules that transform request data */
  TRANSFORMATION = 'transformation',
  /** Rules that rate limit requests */
  RATE_LIMITING = 'rate_limiting',
  /** Rules that log or audit requests */
  AUDIT = 'audit',
  /** Custom rules that don't fit into the above categories */
  CUSTOM = 'custom',
}

/**
 * Priority levels for rule execution
 */
export enum RulePriority {
  /** Highest priority, executed first */
  HIGHEST = 0,
  /** High priority */
  HIGH = 1,
  /** Normal priority */
  NORMAL = 2,
  /** Low priority */
  LOW = 3,
  /** Lowest priority, executed last */
  LOWEST = 4,
}

/**
 * Configuration for a rule
 */
export interface RuleConfig {
  /** Unique identifier for the rule */
  id: string;
  /** Human-readable name for the rule */
  name: string;
  /** Description of what the rule does */
  description?: string;
  /** Type of rule */
  type: RuleType;
  /** Priority of the rule (determines execution order) */
  priority: RulePriority;
  /** Whether the rule is enabled */
  enabled: boolean;
  /** Paths that this rule applies to (supports glob patterns) */
  paths?: string[];
  /** HTTP methods that this rule applies to */
  methods?: string[];
  /** Adapters that this rule applies to */
  adapters?: string[];
  /** Additional configuration options specific to the rule */
  options?: Record<string, unknown>;
}

/**
 * Interface that all rules must implement
 */
export interface Rule {
  /** Configuration for the rule */
  config: RuleConfig;
  
  /**
   * Execute the rule against the given context
   * @param context The context for rule execution
   * @returns Result of the rule execution
   */
  execute(context: RuleContext): Promise<RuleResult> | RuleResult;
}

import { BaseRule } from './BaseRule';
import { RuleContext, RuleResult, RuleType, RulePriority, RuleConfig } from './types';
import { SupabaseClient } from '@supabase/supabase-js';

/**
 * Options for audit rules
 */
export interface AuditOptions {
  /** Whether to log the request body */
  logBody?: boolean;
  /** Whether to log the request query parameters */
  logQuery?: boolean;
  /** Whether to log the request headers */
  logHeaders?: boolean;
  /** Whether to log the user ID if available */
  logUser?: boolean;
  /** Function to extract additional data to log */
  extractData?: (context: RuleContext) => Record<string, unknown>;
  /** Table name to log to (if using Supabase) */
  tableName?: string;
  /** Whether to log to console */
  logToConsole?: boolean;
}

/**
 * Rule for auditing requests
 */
export class AuditRule extends BaseRule {
  private options: AuditOptions;
  private supabase?: SupabaseClient;

  constructor(
    config: Omit<RuleConfig, 'type'>,
    options: AuditOptions,
    supabase?: SupabaseClient
  ) {
    super({
      ...config,
      type: RuleType.AUDIT,
      priority: config.priority ?? RulePriority.LOW, // Audit should run late in the chain
    });
    this.options = {
      logBody: false,
      logQuery: false,
      logHeaders: false,
      logUser: true,
      logToConsole: true,
      ...options,
    };
    this.supabase = supabase;
  }

  async execute(context: RuleContext): Promise<RuleResult> {
    const { request } = context;

    // Build audit log entry
    const auditEntry: Record<string, unknown> = {
      timestamp: new Date().toISOString(),
      path: request.path,
      method: request.method,
      adapterName: context.adapterName,
      endpoint: context.endpoint,
    };

    // Add optional data
    if (this.options.logBody) {
      auditEntry.body = request.body;
    }

    if (this.options.logQuery) {
      auditEntry.query = request.query;
    }

    if (this.options.logHeaders) {
      auditEntry.headers = request.headers;
    }

    if (this.options.logUser && context.data?.user && typeof context.data.user === 'object') {
      auditEntry.userId = (context.data.user as any).id;
    }

    // Extract additional data if configured
    if (this.options.extractData) {
      const additionalData = this.options.extractData(context);
      Object.assign(auditEntry, additionalData);
    }

    // Log to console if configured
    if (this.options.logToConsole) {
      console.log('[AUDIT]', JSON.stringify(auditEntry, null, 2));
    }

    // Log to Supabase if configured
    if (this.supabase && this.options.tableName) {
      try {
        const { error } = await this.supabase
          .from(this.options.tableName)
          .insert([auditEntry]);

        if (error) {
          console.error('Error logging audit entry to Supabase:', error);
        }
      } catch (error) {
        console.error('Error logging audit entry to Supabase:', error);
      }
    }

    // Audit rules should never fail the request
    return this.success();
  }
}

import { BaseRule } from './BaseRule';
import { RuleContext, RuleResult, RuleType, RulePriority, RuleConfig } from './types';
import { SupabaseClient } from '@supabase/supabase-js';

/**
 * Options for authorization rules
 */
export interface AuthorizationRuleOptions {
  /** Required roles for this endpoint */
  requiredRoles?: string[];
  /** Required permissions for this endpoint */
  requiredPermissions?: string[];
  /** Whether to require authentication */
  requireAuth?: boolean;
  /** Custom authorization function */
  customAuthorizer?: (context: RuleContext, user?: any) => Promise<RuleResult> | RuleResult;
}

/**
 * Rule for authorizing requests based on user roles and permissions
 */
export class AuthorizationRule extends BaseRule {
  private options: AuthorizationRuleOptions;
  private supabase: SupabaseClient;

  constructor(
    config: Omit<RuleConfig, 'type'>,
    options: AuthorizationRuleOptions,
    supabase: SupabaseClient
  ) {
    super({
      ...config,
      type: RuleType.AUTHORIZATION,
      priority: config.priority ?? RulePriority.HIGH, // Auth should run after validation but before business logic
    });
    this.options = options;
    this.supabase = supabase;
  }

  async execute(context: RuleContext): Promise<RuleResult> {
    const { request } = context;

    // Skip authorization if not required
    if (!this.options.requireAuth &&
        !this.options.requiredRoles?.length &&
        !this.options.requiredPermissions?.length &&
        !this.options.customAuthorizer) {
      return this.success();
    }

    // Extract token from Authorization header
    const authHeader = request.headers ? request.headers['authorization'] : undefined;
    if (!authHeader && this.options.requireAuth) {
      return this.failure(
        'Authentication required',
        'UNAUTHORIZED',
        401
      );
    }

    let user = null;

    // If we have an auth header, verify the token and get the user
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');

      try {
        // Get user from session
        const { data, error } = await this.supabase.auth.getUser(token);

        if (error || !data.user) {
          return this.failure(
            'Invalid authentication token',
            'INVALID_TOKEN',
            401
          );
        }

        user = data.user;

        // Check roles if required
        if (this.options.requiredRoles?.length) {
          const { data: userData, error: userError } = await this.supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

          if (userError || !userData) {
            return this.failure(
              'User profile not found',
              'USER_NOT_FOUND',
              404
            );
          }

          if (!this.options.requiredRoles.includes(userData.role)) {
            return this.failure(
              'Insufficient permissions',
              'FORBIDDEN',
              403,
              { requiredRoles: this.options.requiredRoles, userRole: userData.role }
            );
          }
        }

        // Check permissions if required (would need a permissions table or similar)
        if (this.options.requiredPermissions?.length) {
          // This is a placeholder for permission checking logic
          // You would need to implement this based on your permission model
          console.log('Permission checking not implemented');
        }
      } catch (error) {
        return this.failure(
          'Error verifying authentication',
          'AUTH_ERROR',
          500,
          { error: error instanceof Error ? error.message : String(error) }
        );
      }
    }

    // Run custom authorizer if provided
    if (this.options.customAuthorizer) {
      const customResult = await Promise.resolve(this.options.customAuthorizer(context, user));
      if (!customResult.passed) {
        return customResult;
      }
    }

    // Add user to context data for downstream rules and handlers
    return this.success({ user });
  }
}

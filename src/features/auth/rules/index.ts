import { z } from 'zod';
import {
  ValidationRule,
  RateLimitRule,
  AuditRule,
  RuleEngine,
  RulePriority,
  RuleType
} from '../../../mcp/rules';
import { SupabaseClient } from '@supabase/supabase-js';

/**
 * Authentication feature rules module
 *
 * This module contains all rules related to the authentication feature.
 * Following vertical slice architecture, all rules for this feature
 * are contained within this module, regardless of rule type.
 */

// Schema definitions for authentication data
const authSchemas = {
  // Schema for login
  login: z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
  }),

  // Schema for password reset
  passwordReset: z.object({
    email: z.string().email('Invalid email format'),
  }),

  // Schema for password change
  passwordChange: z.object({
    currentPassword: z.string(),
    newPassword: z.string().min(6, 'New password must be at least 6 characters'),
    confirmPassword: z.string(),
  }).refine(data => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  }),
};

/**
 * Register all authentication feature rules with the rule engine
 *
 * This function encapsulates all rule registration for the authentication feature,
 * following vertical slice architecture by keeping all auth-related rules together.
 *
 * @param ruleEngine The rule engine to register rules with
 * @param supabase Supabase client for database access
 */
export function registerAuthFeatureRules(ruleEngine: RuleEngine, supabase: SupabaseClient): void {
  // --- VALIDATION RULES ---

  // Login validation
  ruleEngine.registerRule(new ValidationRule(
    {
      id: 'auth-login-validation',
      name: 'Login Validation',
      description: 'Validates login credentials',
      priority: RulePriority.HIGHEST,
      enabled: true,
      paths: ['/auth/login'],
      methods: ['POST'],
      adapters: ['auth'],
    },
    {
      bodySchema: authSchemas.login,
    }
  ));

  // Password reset validation
  ruleEngine.registerRule(new ValidationRule(
    {
      id: 'auth-password-reset-validation',
      name: 'Password Reset Validation',
      description: 'Validates password reset requests',
      priority: RulePriority.HIGHEST,
      enabled: true,
      paths: ['/auth/reset-password'],
      methods: ['POST'],
      adapters: ['auth'],
    },
    {
      bodySchema: authSchemas.passwordReset,
    }
  ));

  // Password change validation
  ruleEngine.registerRule(new ValidationRule(
    {
      id: 'auth-password-change-validation',
      name: 'Password Change Validation',
      description: 'Validates password change requests',
      priority: RulePriority.HIGHEST,
      enabled: true,
      paths: ['/auth/change-password'],
      methods: ['POST'],
      adapters: ['auth'],
    },
    {
      bodySchema: authSchemas.passwordChange,
    }
  ));

  // --- RATE LIMITING RULES ---

  // Rate limit login attempts
  ruleEngine.registerRule(new RateLimitRule(
    {
      id: 'auth-login-rate-limit',
      name: 'Login Rate Limit',
      description: 'Limits the rate of login attempts to prevent brute force attacks',
      priority: RulePriority.HIGH,
      enabled: true,
      paths: ['/auth/login'],
      methods: ['POST'],
      adapters: ['auth'],
    },
    {
      limit: 5, // 5 attempts
      windowSeconds: 60, // per minute
      keyExtractor: (context) => {
        // Use IP address as the rate limit key
        const ip = context.request.headers ?
                   (context.request.headers['x-forwarded-for'] ||
                   context.request.headers['x-real-ip']) :
                   'unknown-ip';

        // If we have an email in the request body, use that too for a more specific limit
        const email = typeof context.request.body === 'object' && context.request.body
          ? (context.request.body as any)?.email
          : null;

        return email ? `${ip}:${email}` : ip || 'unknown-ip';
      },
      includeMethod: true,
    }
  ));

  // Rate limit password reset requests
  ruleEngine.registerRule(new RateLimitRule(
    {
      id: 'auth-password-reset-rate-limit',
      name: 'Password Reset Rate Limit',
      description: 'Limits the rate of password reset requests',
      priority: RulePriority.HIGH,
      enabled: true,
      paths: ['/auth/reset-password'],
      methods: ['POST'],
      adapters: ['auth'],
    },
    {
      limit: 3, // 3 requests
      windowSeconds: 60 * 10, // per 10 minutes
      keyExtractor: (context) => {
        // Use IP address as the rate limit key
        const ip = context.request.headers ?
                   (context.request.headers['x-forwarded-for'] ||
                   context.request.headers['x-real-ip']) :
                   'unknown-ip';

        // If we have an email in the request body, use that too for a more specific limit
        const email = typeof context.request.body === 'object' && context.request.body
          ? (context.request.body as any)?.email
          : null;

        return email ? `${ip}:${email}` : ip || 'unknown-ip';
      },
      includeMethod: true,
    }
  ));

  // --- AUDIT RULES ---

  // Audit authentication events
  ruleEngine.registerRule(new AuditRule(
    {
      id: 'auth-events-audit',
      name: 'Authentication Events Audit',
      description: 'Audits all authentication events',
      priority: RulePriority.LOW,
      enabled: true,
      paths: ['/auth/login', '/auth/logout', '/auth/reset-password', '/auth/change-password'],
      adapters: ['auth'],
    },
    {
      logBody: false, // Don't log credentials
      logUser: true, // Log user ID if available
      tableName: 'auth_audit_logs', // Table to log to
      logToConsole: true, // Also log to console
      extractData: (context) => {
        // Extract email from body for login and password reset
        let email = null;
        if (typeof context.request.body === 'object' && context.request.body) {
          email = (context.request.body as any)?.email;
        }

        return {
          action: `${context.request.method} ${context.request.path}`,
          email: email ? email : undefined, // Only include if available
          ip: context.request.headers ?
             (context.request.headers['x-forwarded-for'] ||
             context.request.headers['x-real-ip']) :
             'unknown-ip',
        };
      },
    },
    supabase
  ));
}

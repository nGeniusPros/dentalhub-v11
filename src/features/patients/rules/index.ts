import { z } from 'zod';
import {
  ValidationRule,
  AuthorizationRule,
  RateLimitRule,
  AuditRule,
  RuleEngine,
  RulePriority,
  RuleType
} from '../../../mcp/rules';
import { SupabaseClient } from '@supabase/supabase-js';

/**
 * Patient feature rules module
 *
 * This module contains all rules related to the patient feature.
 * Following vertical slice architecture, all rules for this feature
 * are contained within this module, regardless of rule type.
 */

// Schema definitions for patient data
const patientSchemas = {
  // Schema for patient creation
  create: z.object({
    email: z.string().email('Invalid email format'),
    name: z.string().min(2, 'Name must be at least 2 characters'),
    phone: z.string().optional(),
    address: z.string().optional(),
    dateOfBirth: z.string().optional(),
  }),

  // Schema for patient update
  update: z.object({
    email: z.string().email('Invalid email format').optional(),
    name: z.string().min(2, 'Name must be at least 2 characters').optional(),
    phone: z.string().optional(),
    address: z.string().optional(),
    dateOfBirth: z.string().optional(),
  })
};

/**
 * Register all patient feature rules with the rule engine
 *
 * This function encapsulates all rule registration for the patient feature,
 * following vertical slice architecture by keeping all patient-related rules together.
 *
 * @param ruleEngine The rule engine to register rules with
 * @param supabase Supabase client for database access
 */
export function registerPatientFeatureRules(ruleEngine: RuleEngine, supabase: SupabaseClient): void {
  // --- VALIDATION RULES ---

  // Patient creation validation
  ruleEngine.registerRule(new ValidationRule(
    {
      id: 'patient-create-validation',
      name: 'Patient Creation Validation',
      description: 'Validates patient data during creation',
      priority: RulePriority.HIGHEST,
      enabled: true,
      paths: ['/api/patients'],
      methods: ['POST'],
      adapters: ['patient'],
    },
    {
      bodySchema: patientSchemas.create,
    }
  ));

  // Patient update validation
  ruleEngine.registerRule(new ValidationRule(
    {
      id: 'patient-update-validation',
      name: 'Patient Update Validation',
      description: 'Validates patient data during update',
      priority: RulePriority.HIGHEST,
      enabled: true,
      paths: ['/api/patients/*'],
      methods: ['PUT', 'PATCH'],
      adapters: ['patient'],
    },
    {
      bodySchema: patientSchemas.update,
    }
  ));

  // --- AUTHORIZATION RULES ---

  // Staff and admin access to patient data
  ruleEngine.registerRule(new AuthorizationRule(
    {
      id: 'patient-staff-admin-auth',
      name: 'Patient Staff/Admin Authorization',
      description: 'Only staff and admins can access patient data',
      priority: RulePriority.HIGH,
      enabled: true,
      paths: ['/api/patients', '/api/patients/*'],
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      adapters: ['patient'],
    },
    {
      requireAuth: true,
      requiredRoles: ['staff', 'admin'],
    },
    supabase
  ));

  // Patient self-access rule
  ruleEngine.registerRule(new AuthorizationRule(
    {
      id: 'patient-self-access-auth',
      name: 'Patient Self-Access Authorization',
      description: 'Patients can only access their own data',
      priority: RulePriority.HIGH,
      enabled: true,
      paths: ['/api/patients/*'],
      methods: ['GET'],
      adapters: ['patient'],
    },
    {
      requireAuth: true,
      requiredRoles: ['patient'],
      customAuthorizer: async (context, user) => {
        if (!user || !context.request.path) {
          return { passed: false, message: 'Unauthorized', code: 'UNAUTHORIZED', statusCode: 401 };
        }

        // Extract patient ID from path
        const pathParts = context.request.path.split('/');
        const patientId = pathParts[pathParts.length - 1];

        // Check if user is accessing their own data
        if (user.id !== patientId) {
          return {
            passed: false,
            message: 'You can only access your own patient data',
            code: 'FORBIDDEN',
            statusCode: 403,
          };
        }

        return { passed: true };
      },
    },
    supabase
  ));

  // --- RATE LIMITING RULES ---

  // Rate limit patient creation
  ruleEngine.registerRule(new RateLimitRule(
    {
      id: 'patient-create-rate-limit',
      name: 'Patient Creation Rate Limit',
      description: 'Limits the rate of patient creation requests',
      priority: RulePriority.HIGH,
      enabled: true,
      paths: ['/api/patients'],
      methods: ['POST'],
      adapters: ['patient'],
    },
    {
      limit: 10, // 10 requests
      windowSeconds: 60, // per minute
      keyExtractor: (context) => {
        // Use IP address or user ID as the rate limit key
        const ip = context.request.headers ?
                   (context.request.headers['x-forwarded-for'] ||
                   context.request.headers['x-real-ip']) :
                   'unknown-ip';

        // If we have a user ID in the context, use that too for a more specific limit
        const userId = context.data?.user && typeof context.data.user === 'object' ? (context.data.user as any).id : undefined;
        return userId ? `${ip}:${userId}` : ip || 'unknown-ip';
      },
      includeMethod: true,
    }
  ));

  // --- AUDIT RULES ---

  // Audit patient data modifications
  ruleEngine.registerRule(new AuditRule(
    {
      id: 'patient-modification-audit',
      name: 'Patient Modification Audit',
      description: 'Audits all modifications to patient data',
      priority: RulePriority.LOW,
      enabled: true,
      paths: ['/api/patients', '/api/patients/*'],
      methods: ['POST', 'PUT', 'DELETE'],
      adapters: ['patient'],
    },
    {
      logBody: true, // Log request body
      logUser: true, // Log user ID
      tableName: 'audit_logs', // Table to log to
      logToConsole: true, // Also log to console
      extractData: (context) => {
        // Extract patient ID from path for updates and deletes
        const pathParts = context.request.path.split('/');
        const patientId = pathParts.length > 2 ? pathParts[pathParts.length - 1] : null;

        return {
          action: context.request.method,
          patientId,
          userRole: context.data?.user && typeof context.data.user === 'object' ? (context.data.user as any).role : undefined,
        };
      },
    },
    supabase
  ));
}

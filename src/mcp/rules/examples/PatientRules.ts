import { z } from 'zod';
import { ValidationRule, AuthorizationRule, RateLimitRule, AuditRule } from '../index';
import { RulePriority } from '../types';
import { SupabaseClient } from '@supabase/supabase-js';

/**
 * Create validation rules for patient endpoints
 */
export function createPatientValidationRules(): ValidationRule[] {
  // Schema for patient creation
  const patientCreateSchema = z.object({
    email: z.string().email('Invalid email format'),
    name: z.string().min(2, 'Name must be at least 2 characters'),
    phone: z.string().optional(),
    address: z.string().optional(),
    dateOfBirth: z.string().optional(),
    // Add more fields as needed
  });

  // Schema for patient update
  const patientUpdateSchema = z.object({
    email: z.string().email('Invalid email format').optional(),
    name: z.string().min(2, 'Name must be at least 2 characters').optional(),
    phone: z.string().optional(),
    address: z.string().optional(),
    dateOfBirth: z.string().optional(),
    // Add more fields as needed
  });

  // Create validation rules
  return [
    // Validate patient creation
    new ValidationRule(
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
        bodySchema: patientCreateSchema,
      }
    ),

    // Validate patient update
    new ValidationRule(
      {
        id: 'patient-update-validation',
        name: 'Patient Update Validation',
        description: 'Validates patient data during update',
        priority: RulePriority.HIGHEST,
        enabled: true,
        paths: ['/api/patients/*'], // Wildcard for any patient ID
        methods: ['PUT', 'PATCH'],
        adapters: ['patient'],
      },
      {
        bodySchema: patientUpdateSchema,
      }
    ),
  ];
}

/**
 * Create authorization rules for patient endpoints
 */
export function createPatientAuthorizationRules(supabase: SupabaseClient): AuthorizationRule[] {
  return [
    // Staff and admin can access all patient endpoints
    new AuthorizationRule(
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
    ),

    // Patients can only access their own data
    new AuthorizationRule(
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
    ),
  ];
}

/**
 * Create rate limiting rules for patient endpoints
 */
export function createPatientRateLimitRules(): RateLimitRule[] {
  return [
    // Rate limit patient creation
    new RateLimitRule(
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
          const ip = context.request.headers['x-forwarded-for'] || 
                     context.request.headers['x-real-ip'] || 
                     'unknown-ip';
          
          // If we have a user ID in the context, use that too for a more specific limit
          const userId = context.data?.user?.id;
          return userId ? `${ip}:${userId}` : ip;
        },
        includeMethod: true,
      }
    ),

    // General rate limit for all patient endpoints
    new RateLimitRule(
      {
        id: 'patient-general-rate-limit',
        name: 'Patient API General Rate Limit',
        description: 'General rate limit for all patient endpoints',
        priority: RulePriority.NORMAL,
        enabled: true,
        paths: ['/api/patients', '/api/patients/*'],
        adapters: ['patient'],
      },
      {
        limit: 100, // 100 requests
        windowSeconds: 60, // per minute
        keyExtractor: (context) => {
          const ip = context.request.headers['x-forwarded-for'] || 
                     context.request.headers['x-real-ip'] || 
                     'unknown-ip';
          return ip;
        },
        includeEndpoint: false,
      }
    ),
  ];
}

/**
 * Create audit rules for patient endpoints
 */
export function createPatientAuditRules(supabase: SupabaseClient): AuditRule[] {
  return [
    // Audit all patient data modifications
    new AuditRule(
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
            userRole: context.data?.user?.role,
          };
        },
      },
      supabase
    ),
  ];
}

/**
 * Register all patient rules with the rule engine
 * @param ruleEngine The rule engine to register rules with
 * @param supabase Supabase client for database access
 */
export function registerPatientRules(ruleEngine: any, supabase: SupabaseClient): void {
  // Register validation rules
  createPatientValidationRules().forEach(rule => {
    ruleEngine.registerRule(rule);
  });

  // Register authorization rules
  createPatientAuthorizationRules(supabase).forEach(rule => {
    ruleEngine.registerRule(rule);
  });

  // Register rate limit rules
  createPatientRateLimitRules().forEach(rule => {
    ruleEngine.registerRule(rule);
  });

  // Register audit rules
  createPatientAuditRules(supabase).forEach(rule => {
    ruleEngine.registerRule(rule);
  });
}

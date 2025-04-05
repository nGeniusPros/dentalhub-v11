import { z } from 'zod';
import {
  ValidationRule,
  AuthorizationRule,
  RateLimitRule,
  AuditRule,
  RuleEngine,
  RulePriority
} from '../../../../mcp/rules';
import { SupabaseClient } from '@supabase/supabase-js';

/**
 * Voice Campaign feature rules module
 *
 * This module contains all rules related to the voice campaign feature.
 * Following vertical slice architecture, all rules for this feature
 * are contained within this module, regardless of rule type.
 */

// Schema definitions for voice campaign data
const voiceCampaignSchemas = {
  // Schema for campaign creation
  create: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    type: z.enum(['recall', 'reactivation', 'treatment', 'appointment', 'event', 'custom']),
    targetCount: z.number().min(1, 'Target count must be at least 1'),
    schedule: z.object({
      startDate: z.string(),
      startTime: z.string(),
      maxAttempts: z.number().min(1).max(5),
      timeBetweenAttempts: z.number().min(1)
    }).optional()
  }),

  // Schema for campaign update
  update: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').optional(),
    type: z.enum(['recall', 'reactivation', 'treatment', 'appointment', 'event', 'custom']).optional(),
    status: z.enum(['active', 'scheduled', 'completed', 'paused']).optional(),
    targetCount: z.number().min(1, 'Target count must be at least 1').optional(),
    schedule: z.object({
      startDate: z.string(),
      startTime: z.string(),
      maxAttempts: z.number().min(1).max(5),
      timeBetweenAttempts: z.number().min(1)
    }).optional()
  }),

  // Schema for AI agent settings
  agentSettings: z.object({
    enabled: z.boolean(),
    voiceId: z.string(),
    afterHours: z.boolean().optional(),
    lunchHours: z.boolean().optional(),
    holidays: z.boolean().optional(),
    customSchedule: z.boolean().optional(),
    schedule: z.record(z.object({
      start: z.string(),
      end: z.string()
    })).optional()
  })
};

/**
 * Register all voice campaign feature rules with the rule engine
 *
 * @param ruleEngine The rule engine to register rules with
 * @param supabase Supabase client for database access
 */
export function registerVoiceCampaignRules(ruleEngine: RuleEngine, supabase: SupabaseClient): void {
  // --- VALIDATION RULES ---

  // Campaign creation validation
  ruleEngine.registerRule(new ValidationRule(
    {
      id: 'voice-campaign-create-validation',
      name: 'Voice Campaign Creation Validation',
      description: 'Validates voice campaign data during creation',
      priority: RulePriority.HIGHEST,
      enabled: true,
      paths: ['/api/voice-campaigns'],
      methods: ['POST'],
    },
    {
      bodySchema: voiceCampaignSchemas.create,
    }
  ));

  // Campaign update validation
  ruleEngine.registerRule(new ValidationRule(
    {
      id: 'voice-campaign-update-validation',
      name: 'Voice Campaign Update Validation',
      description: 'Validates voice campaign data during update',
      priority: RulePriority.HIGHEST,
      enabled: true,
      paths: ['/api/voice-campaigns/*'],
      methods: ['PUT', 'PATCH'],
    },
    {
      bodySchema: voiceCampaignSchemas.update,
    }
  ));

  // AI agent settings validation
  ruleEngine.registerRule(new ValidationRule(
    {
      id: 'voice-agent-settings-validation',
      name: 'Voice Agent Settings Validation',
      description: 'Validates voice agent settings',
      priority: RulePriority.HIGHEST,
      enabled: true,
      paths: ['/api/voice-agent'],
      methods: ['PUT'],
    },
    {
      bodySchema: voiceCampaignSchemas.agentSettings,
    }
  ));

  // --- AUTHORIZATION RULES ---

  // Only staff and admin can access voice campaigns
  // TEMPORARILY DISABLED FOR TESTING
  /*
  ruleEngine.registerRule(new AuthorizationRule(
    {
      id: 'voice-campaign-auth',
      name: 'Voice Campaign Authorization',
      description: 'Only staff and admins can access voice campaigns',
      priority: RulePriority.HIGH,
      enabled: true,
      paths: ['/api/voice-campaigns', '/api/voice-campaigns/*', '/api/voice-agent', '/api/voice-analytics'],
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
    },
    {
      requireAuth: true,
      requiredRoles: ['staff', 'admin'],
    },
    supabase
  ));
  */

  // --- RATE LIMITING RULES ---

  // Rate limit campaign creation
  ruleEngine.registerRule(new RateLimitRule(
    {
      id: 'voice-campaign-create-rate-limit',
      name: 'Voice Campaign Creation Rate Limit',
      description: 'Limits the rate of voice campaign creation requests',
      priority: RulePriority.HIGH,
      enabled: true,
      paths: ['/api/voice-campaigns'],
      methods: ['POST'],
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

  // Audit voice campaign modifications
  ruleEngine.registerRule(new AuditRule(
    {
      id: 'voice-campaign-audit',
      name: 'Voice Campaign Audit',
      description: 'Audits all modifications to voice campaigns',
      priority: RulePriority.LOW,
      enabled: true,
      paths: ['/api/voice-campaigns', '/api/voice-campaigns/*', '/api/voice-agent'],
      methods: ['POST', 'PUT', 'DELETE'],
    },
    {
      logBody: true, // Log request body
      logUser: true, // Log user ID
      tableName: 'voice_audit_logs', // Table to log to
      logToConsole: true, // Also log to console
      extractData: (context) => {
        // Extract campaign ID from path for updates and deletes
        const pathParts = context.request.path.split('/');
        const campaignId = pathParts.length > 2 ? pathParts[pathParts.length - 1] : null;

        return {
          action: context.request.method,
          campaignId,
          userRole: context.data?.user && typeof context.data.user === 'object' ? (context.data.user as any).role : undefined,
        };
      },
    },
    supabase
  ));
}

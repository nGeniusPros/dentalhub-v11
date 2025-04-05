import { RuleEngine } from '../mcp/rules';
import { SupabaseClient } from '@supabase/supabase-js';
import { registerPatientFeatureRules } from './patients/rules';
import { registerAuthFeatureRules } from './auth/rules';
// Import the test version of the voice campaign rules
import { registerVoiceCampaignRules } from './communications/voice/rules/index.test';

/**
 * Feature Registry - TEST VERSION
 *
 * This module serves as a central registry for all features in the application.
 * It follows vertical slice architecture by organizing code by feature rather than technical concern.
 * 
 * This test version uses the test version of the voice campaign rules that disables authentication.
 */

/**
 * Register all feature rules with the rule engine - TEST VERSION
 *
 * @param ruleEngine The rule engine to register rules with
 * @param supabase Supabase client for database access
 */
export function registerAllFeatureRules(ruleEngine: RuleEngine, supabase: SupabaseClient): void {
  // Register patient feature rules
  registerPatientFeatureRules(ruleEngine, supabase);

  // Register authentication feature rules
  registerAuthFeatureRules(ruleEngine, supabase);

  // Register voice campaign feature rules (test version without authentication)
  registerVoiceCampaignRules(ruleEngine, supabase);

  // Register other feature rules as needed
  // registerAppointmentFeatureRules(ruleEngine, supabase);
  // registerBillingFeatureRules(ruleEngine, supabase);
  // etc.

  console.log('All feature rules registered successfully (TEST VERSION)');
}

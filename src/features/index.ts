import { RuleEngine } from '../mcp/rules';
import { SupabaseClient } from '@supabase/supabase-js';
import { registerPatientFeatureRules } from './patients/rules';
import { registerAuthFeatureRules } from './auth/rules';
import { registerVoiceCampaignRules } from './communications/voice/rules';

/**
 * Feature Registry
 *
 * This module serves as a central registry for all features in the application.
 * It follows vertical slice architecture by organizing code by feature rather than technical concern.
 */

/**
 * Register all feature rules with the rule engine
 *
 * @param ruleEngine The rule engine to register rules with
 * @param supabase Supabase client for database access
 */
export function registerAllFeatureRules(ruleEngine: RuleEngine, supabase: SupabaseClient): void {
  // Register patient feature rules
  registerPatientFeatureRules(ruleEngine, supabase);

  // Register authentication feature rules
  registerAuthFeatureRules(ruleEngine, supabase);

  // Register voice campaign feature rules
  registerVoiceCampaignRules(ruleEngine, supabase);

  // Register other feature rules as needed
  // registerAppointmentFeatureRules(ruleEngine, supabase);
  // registerBillingFeatureRules(ruleEngine, supabase);
  // etc.

  console.log('All feature rules registered successfully');
}

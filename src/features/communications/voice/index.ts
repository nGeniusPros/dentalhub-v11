import { RuleEngine } from '../../../mcp/rules';
import { SupabaseClient } from '@supabase/supabase-js';
import { registerVoiceCampaignRules } from './rules';

/**
 * Voice Campaign Feature Module
 * 
 * This module exports all components and functionality related to voice campaigns
 * following the vertical slice architecture pattern.
 */

// Re-export all components
export * from './components/AIAgentSettings';
export * from './components/CreateCampaignDialog';
export * from './components/EditCampaignDialog';
export * from './components/ScheduleDialog';
export * from './components/VoiceAnalytics';
export * from './components/VoiceCampaignList';
export * from './components/VoiceCampaignStats';

// Re-export the page component
export { default as VoiceCampaignsPage } from './VoiceCampaignsPage';

// Re-export the context
export * from './context/VoiceCampaignContext';

// Register all voice campaign rules with the rule engine
export function registerVoiceCampaignFeature(ruleEngine: RuleEngine, supabase: SupabaseClient): void {
  // Register rules
  registerVoiceCampaignRules(ruleEngine, supabase);
  
  console.log('Voice Campaign feature registered successfully');
}

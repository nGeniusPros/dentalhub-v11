export const USER_ROLES = {
  DENTIST: 'dentist',
  ADMIN: 'admin',
  STAFF: 'staff',
  PATIENT: 'patient'
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

export const AGENT_TYPES = {
  HEAD_ORCHESTRATOR: 'head-orchestrator',
  DATA_ANALYSIS: 'data-analysis',
  RECOMMENDATION: 'recommendation',
  LAB_CASE: 'lab-case',
  DEEP_SEEK: 'deep-seek'
} as const;

export type AgentType = typeof AGENT_TYPES[keyof typeof AGENT_TYPES];

export const FEEDBACK_CONTEXTS = {
  PRACTICE_INSIGHTS: 'practice-insights',
  PATIENT_CARE: 'patient-care',
  BUSINESS_DEVELOPMENT: 'business-development',
  LAB_MANAGEMENT: 'lab-management'
} as const;

export type FeedbackContext = typeof FEEDBACK_CONTEXTS[keyof typeof FEEDBACK_CONTEXTS];

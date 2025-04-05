export interface PracticeMetrics {
  monthlyRevenue: number;
  patientCount: number;
  appointmentFillRate: number;
  treatmentAcceptance: number;
}

export interface AIConsultantPrompt {
  metrics: PracticeMetrics;
  focusArea: 'revenue' | 'operations' | 'patient-care' | 'marketing' |
             'head-orchestrator' | 'data-retrieval' | 'data-analysis' |
             'lab-case-manager' | 'recommendation';
  question: string;
}

export interface AIInsight {
  id: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  category: 'revenue' | 'operations' | 'patient-care' | 'marketing';
  action: string;
  metric?: {
    label: string;
    value: string;
    trend: 'up' | 'down';
    percentage: number;
  };
}

export interface LLMProviderConfig {
  provider: string;
  apiKey?: string;
  baseUrl?: string;
  model?: string;
  [key: string]: string | number | boolean | undefined;
}

export interface LLMProvider {
  generateResponse(prompt: string, config: LLMProviderConfig): Promise<string>;
  generateEmbedding(text: string, config: LLMProviderConfig): Promise<number[]>;
  streamResponse(prompt: string, config: LLMProviderConfig): AsyncIterable<string>;
}

export interface AgentConfig {
  name: string;
  description: string;
  providerConfig: LLMProviderConfig;
  systemPrompt: string;
  [key: string]: string | number | boolean | LLMProviderConfig | undefined;
}

export interface Agent {
  config: AgentConfig;
  generateResponse(prompt: string): Promise<string>;
  streamResponse(prompt: string): AsyncIterable<string>;
  analyzeData(data: unknown): Promise<unknown>;
}

export interface Orchestrator {
  agents: Record<string, Agent>;
  processQuery(query: string): Promise<HeadBrainResponse>;
  streamQuery(query: string): AsyncIterable<string>;
}

export interface HeadBrainResponse {
  answer: string;
  sections: ResponseSection[];
  sources?: string[];
}

export type ResponseSection =
  | TextSection
  | KpiAnalysisSection
  | RecommendationsSection
  | LabCasesSection
  | DeepSeekContextSection;

export interface TextSection {
  type: 'text';
  title: string;
  content: string;
}

export interface KpiAnalysisSection {
  type: 'kpi-analysis';
  title: string;
  content: KPIAnalysis;
}

export interface RecommendationsSection {
  type: 'recommendations';
  title: string;
  content: Recommendation[];
}

export interface LabCasesSection {
  type: 'lab-cases';
  title: string;
  content: LabCaseAnalysis;
}

export interface DeepSeekContextSection {
  type: 'deep-seek-context';
  title: string;
  content: string;
}

export interface KPIAnalysis {
  summary: string;
  metrics: {
    [key: string]: {
      value: number;
      trend: 'up' | 'down' | 'stable';
      percentage?: number;
    };
  };
}

export interface Recommendation {
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  category: string;
  priority: number;
}

export interface LabCaseAnalysis {
  summary: string;
  cases: {
    id: string;
    status: string;
    priority: number;
    dueDate: string;
    [key: string]: unknown;
  }[];
}

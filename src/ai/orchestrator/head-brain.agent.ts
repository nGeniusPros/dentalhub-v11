import { AgentConfig, LLMProvider, Agent } from '../../types';
import { BaseAgent } from '../agents/base';
import { ProviderFactory } from '../providers/providerFactory';

interface QueryAnalysis {
  topic: string;
  relevance: {
    dataAnalysis: number;
    recommendation: number;
    labCase: number;
    deepSeek: number;
  };
}

interface KPIAnalysis {
  summary: string;
  metrics: {
    [key: string]: {
      value: number;
      trend: 'up' | 'down' | 'stable';
      percentage?: number;
    };
  };
}

interface Recommendation {
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  category: string;
  priority: number;
}

interface LabCaseAnalysis {
  summary: string;
  cases: {
    id: string;
    status: string;
    priority: number;
    dueDate: string;
    [key: string]: unknown;
  }[];
}

interface ResponseSection {
  type: string;
  title: string;
  content: any;
}

interface HeadBrainResponse {
  answer: string;
  sections: ResponseSection[];
}

class ConcreteAgent extends BaseAgent<AgentConfig> {
  constructor(config: AgentConfig) {
    super(config);
  }

  async analyzeData(data: unknown): Promise<unknown> {
    // Implement data analysis logic
    return data;
  }

  async generateAgentResponse(data: unknown): Promise<string> {
    // Implement agent response generation logic
    return `Response based on: ${JSON.stringify(data)}`;
  }

  async* streamAgentResponse(data: unknown): AsyncIterable<string> {
    // Implement streaming response logic
    yield `Streaming response based on: ${JSON.stringify(data)}`;
  }

  async generateResponse(query: string): Promise<string> {
    const data = await this.analyzeData(query);
    return this.generateAgentResponse(data);
  }

  async* streamResponse(query: string): AsyncIterable<string> {
    const data = await this.analyzeData(query);
    yield* this.streamAgentResponse(data);
  }
}

export class HeadBrainConsultant {
  private agents: Record<string, Agent<AgentConfig>>;
  private provider: LLMProvider;

  constructor(agentsConfig: Record<string, AgentConfig>) {
    this.agents = {};
    this.provider = ProviderFactory.getInstance().createProvider(agentsConfig.headOrchestrator.providerConfig);

    // Initialize agents
    Object.entries(agentsConfig).forEach(([name, config]) => {
      this.agents[name] = new ConcreteAgent(config);
    });
  }

  async processQuery(query: string): Promise<HeadBrainResponse> {
    const sections: ResponseSection[] = [];

    // Analyze query and determine which agents to use
    const analysis = await this.analyzeQuery(query);
    const relevantAgents = this.determineRelevantAgents(analysis);

    // Process query with each relevant agent
    for (const agentName of relevantAgents) {
      const agent = this.agents[agentName];
      const response = await agent.generateResponse(query);
      
      // Parse and format agent response
      const section = this.formatAgentResponse(agentName, response);
      if (section) {
        sections.push(section);
      }
    }

    // Generate final response
    const answer = this.generateFinalResponse(sections);
    return { answer, sections };
  }

  async* streamQuery(query: string): AsyncIterable<string> {
    const sections: ResponseSection[] = [];

    // Analyze query and determine which agents to use
    const analysis = await this.analyzeQuery(query);
    const relevantAgents = this.determineRelevantAgents(analysis);

    // Process query with each relevant agent
    for (const agentName of relevantAgents) {
      const agent = this.agents[agentName];
      const responseStream = agent.streamResponse(query);
      
      // Format and yield agent response
      for await (const chunk of responseStream) {
        const section = this.formatAgentResponse(agentName, chunk);
        if (section) {
          sections.push(section);
          yield this.generatePartialResponse(sections);
        }
      }
    }

    // Generate final response
    const answer = this.generateFinalResponse(sections);
    yield answer;
  }

  private async analyzeQuery(query: string): Promise<QueryAnalysis> {
    const prompt = `
      Analyze this query and determine which AI agents are relevant:
      \n\n${query}\n\n
      Return a JSON object with the following structure:
      {
        "topic": "",
        "relevance": {
          "dataAnalysis": number (0-1),
          "recommendation": number (0-1),
          "labCase": number (0-1),
          "deepSeek": number (0-1)
        }
      }
    `;

    const response = await this.provider.generateResponse(prompt, {});
    return this.parseAnalysisResponse(response);
  }

  private determineRelevantAgents(analysis: QueryAnalysis): string[] {
    const relevanceThreshold = 0.5;
    const relevantAgents: string[] = [];

    if (analysis.relevance.dataAnalysis >= relevanceThreshold) {
      relevantAgents.push('dataAnalysis');
    }
    if (analysis.relevance.recommendation >= relevanceThreshold) {
      relevantAgents.push('recommendation');
    }
    if (analysis.relevance.labCase >= relevanceThreshold) {
      relevantAgents.push('labCase');
    }
    if (analysis.relevance.deepSeek >= relevanceThreshold) {
      relevantAgents.push('deepSeek');
    }

    return relevantAgents;
  }

  private formatAgentResponse(agentName: string, response: string): ResponseSection | null {
    try {
      const data = JSON.parse(response);
      switch (agentName) {
        case 'dataAnalysis':
          return {
            type: 'kpi-analysis',
            title: 'Data Analysis',
            content: data
          };
        case 'recommendation':
          return {
            type: 'recommendations',
            title: 'Recommendations',
            content: data
          };
        case 'labCase':
          return {
            type: 'lab-cases',
            title: 'Lab Cases',
            content: data
          };
        case 'deepSeek':
          return {
            type: 'deep-seek-context',
            title: 'Context',
            content: data
          };
        default:
          return null;
      }
    } catch (error) {
      console.warn(`Failed to parse response from ${agentName}:`, error);
      return null;
    }
  }

  private generatePartialResponse(sections: ResponseSection[]): string {
    let response = 'Processing query...\n\n';
    
    sections.forEach(section => {
      response += `${section.title}:\n${JSON.stringify(section.content)}\n\n`;
    });

    return response;
  }

  private generateFinalResponse(sections: ResponseSection[]): string {
    let response = 'Here\'s what I found:\n\n';
    
    sections.forEach(section => {
      switch (section.type) {
        case 'kpi-analysis':
          const kpiAnalysis: KPIAnalysis = section.content as KPIAnalysis;
          response += `${kpiAnalysis.summary}\n\n`;
          break;
        case 'recommendations':
          const recommendations: Recommendation[] = section.content as Recommendation[];
          response += `Based on the analysis, here are ${recommendations.length} key recommendations:\n`;
          recommendations.slice(0, 3).forEach((rec, index) => {
            response += `${index + 1}. ${rec.title}: ${rec.description}\n`;
          });
          response += '\n';
          break;
        case 'lab-cases':
          const cases: LabCaseAnalysis = section.content as LabCaseAnalysis;
          response += `Active Lab Cases:\n`;
          cases.cases.slice(0, 3).forEach((caseItem, index) => {
            response += `${index + 1}. ${caseItem.status}: Due ${caseItem.dueDate}\n`;
          });
          response += '\n';
          break;
        case 'deep-seek-context':
          response += 'Additional context:\n' + JSON.stringify(section.content) + '\n\n';
          break;
      }
    });

    return response;
  }

  private parseAnalysisResponse(response: string): QueryAnalysis {
    try {
      return JSON.parse(response);
    } catch (error) {
      console.warn('Failed to parse analysis response:', error);
      return {
        topic: '',
        relevance: {
          dataAnalysis: 0,
          recommendation: 0,
          labCase: 0,
          deepSeek: 0
        }
      };
    }
  }
}

import { Agent, AgentConfig, LLMProvider } from '../../types';
import { ProviderFactory } from '../providers/providerFactory';

export abstract class BaseAgent implements Agent {
  protected config: AgentConfig;
  protected provider: LLMProvider;

  constructor(config: AgentConfig) {
    this.config = config;
    this.provider = ProviderFactory.getInstance().createProvider(config.providerConfig);
  }

  abstract generateResponse(prompt: string): Promise<string>;
  abstract streamResponse(prompt: string): AsyncIterable<string>;
  abstract analyzeData(data: any): Promise<any>;

  protected async generateAgentResponse(
    prompt: string,
    systemPrompt?: string
  ): Promise<string> {
    const fullPrompt = systemPrompt ? `${systemPrompt}\n\n${prompt}` : prompt;
    return this.provider.generateResponse(fullPrompt, this.config.providerConfig);
  }

  protected async* streamAgentResponse(
    prompt: string,
    systemPrompt?: string
  ): AsyncIterable<string> {
    const fullPrompt = systemPrompt ? `${systemPrompt}\n\n${prompt}` : prompt;
    yield* this.provider.streamResponse(fullPrompt, this.config.providerConfig);
  }

  protected async analyzeWithPrompt(
    data: any,
    analysisPrompt: string
  ): Promise<any> {
    const prompt = this.formatAnalysisPrompt(data, analysisPrompt);
    const response = await this.generateAgentResponse(prompt, this.config.systemPrompt);
    return this.parseAnalysisResponse(response);
  }

  protected formatAnalysisPrompt(data: any, analysisPrompt: string): string {
    return `Analyze the following data:\n\n${JSON.stringify(data, null, 2)}\n\n${analysisPrompt}`;
  }

  protected parseAnalysisResponse(response: string): any {
    try {
      return JSON.parse(response);
    } catch (error) {
      console.warn('Failed to parse JSON response:', error);
      return response;
    }
  }

  protected async generateEmbedding(text: string): Promise<number[]> {
    return this.provider.generateEmbedding(text, this.config.providerConfig);
  }
}

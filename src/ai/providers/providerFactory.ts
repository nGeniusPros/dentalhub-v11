import { LLMProvider, LLMProviderConfig } from '../types';
import { BaseLLMProvider } from './base';

export class ProviderFactory {
  private static instance: ProviderFactory;
  private providers: Record<string, typeof BaseLLMProvider> = {};

  private constructor() {}

  public static getInstance(): ProviderFactory {
    if (!ProviderFactory.instance) {
      ProviderFactory.instance = new ProviderFactory();
    }
    return ProviderFactory.instance;
  }

  public registerProvider(providerName: string, providerClass: typeof BaseLLMProvider): void {
    this.providers[providerName] = providerClass;
  }

  public createProvider(config: LLMProviderConfig): LLMProvider {
    const providerClass = this.providers[config.provider];
    if (!providerClass) {
      throw new Error(`Provider ${config.provider} not registered`);
    }
    return new providerClass(config);
  }

  public getAvailableProviders(): string[] {
    return Object.keys(this.providers);
  }
}

// Example providers (to be implemented)
export class OpenAIProvider extends BaseLLMProvider {}
export class AnthropicProvider extends BaseLLMProvider {}
export class GoogleProvider extends BaseLLMProvider {}
export class LocalProvider extends BaseLLMProvider {}

// Register example providers
ProviderFactory.getInstance().registerProvider('openai', OpenAIProvider);
ProviderFactory.getInstance().registerProvider('anthropic', AnthropicProvider);
ProviderFactory.getInstance().registerProvider('google', GoogleProvider);
ProviderFactory.getInstance().registerProvider('local', LocalProvider);

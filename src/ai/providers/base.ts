import { LLMProvider, LLMProviderConfig } from '../types';

export abstract class BaseLLMProvider implements LLMProvider {
  protected config: LLMProviderConfig;

  constructor(config: LLMProviderConfig) {
    this.config = config;
  }

  abstract generateResponse(prompt: string, config: LLMProviderConfig): Promise<string>;
  abstract generateEmbedding(text: string, config: LLMProviderConfig): Promise<number[]>;
  abstract streamResponse(prompt: string, config: LLMProviderConfig): AsyncIterable<string>;

  protected async fetchWithRetry(
    url: string,
    options: RequestInit,
    maxRetries: number = 3,
    retryDelay: number = 1000
  ): Promise<Response> {
    let lastError: Error | null = null;
    
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const response = await fetch(url, options);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response;
      } catch (error) {
        lastError = error as Error;
        if (attempt === maxRetries - 1) {
          throw lastError;
        }
        await new Promise(resolve => setTimeout(resolve, retryDelay));
      }
    }
    throw lastError || new Error('Failed to fetch with retry');
  }

  protected async streamWithRetry(
    url: string,
    options: RequestInit,
    maxRetries: number = 3,
    retryDelay: number = 1000
  ): Promise<ReadableStream> {
    let lastError: Error | null = null;
    
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const response = await fetch(url, options);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.body!;
      } catch (error) {
        lastError = error as Error;
        if (attempt === maxRetries - 1) {
          throw lastError;
        }
        await new Promise(resolve => setTimeout(resolve, retryDelay));
      }
    }
    throw lastError || new Error('Failed to stream with retry');
  }
}

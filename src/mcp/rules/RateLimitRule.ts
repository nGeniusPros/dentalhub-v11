import { BaseRule } from './BaseRule';
import { RuleContext, RuleResult, RuleType, RulePriority, RuleConfig } from './types';
import NodeCache from 'node-cache';

/**
 * Options for rate limiting rules
 */
export interface RateLimitOptions {
  /** Maximum number of requests allowed in the time window */
  limit: number;
  /** Time window in seconds */
  windowSeconds: number;
  /** Function to extract the key to rate limit on (e.g., IP, user ID) */
  keyExtractor: (context: RuleContext) => string;
  /** Whether to include the endpoint in the rate limit key */
  includeEndpoint?: boolean;
  /** Whether to include the HTTP method in the rate limit key */
  includeMethod?: boolean;
}

/**
 * Rule for rate limiting requests
 */
export class RateLimitRule extends BaseRule {
  private options: RateLimitOptions;
  private cache: NodeCache;

  constructor(config: Omit<RuleConfig, 'type'>, options: RateLimitOptions) {
    super({
      ...config,
      type: RuleType.RATE_LIMITING,
      priority: config.priority ?? RulePriority.HIGH,
    });
    this.options = options;
    
    // Initialize cache with TTL slightly longer than the window
    this.cache = new NodeCache({
      stdTTL: options.windowSeconds + 10,
      checkperiod: Math.max(options.windowSeconds / 10, 1),
    });
  }

  execute(context: RuleContext): RuleResult {
    const { request } = context;
    
    // Extract the base key using the provided function
    const baseKey = this.options.keyExtractor(context);
    
    // Build the full key including optional components
    let key = baseKey;
    if (this.options.includeEndpoint && context.endpoint) {
      key += `:${context.endpoint}`;
    }
    if (this.options.includeMethod) {
      key += `:${request.method.toUpperCase()}`;
    }
    
    // Get current count from cache
    const currentData = this.cache.get<{ count: number, firstRequest: number }>(key);
    const now = Date.now();
    
    if (!currentData) {
      // First request in this window
      this.cache.set(key, { count: 1, firstRequest: now });
      
      // Set headers for rate limit info
      return this.success({
        rateLimit: {
          limit: this.options.limit,
          remaining: this.options.limit - 1,
          reset: now + (this.options.windowSeconds * 1000),
        }
      });
    }
    
    // Check if window has expired
    const windowMs = this.options.windowSeconds * 1000;
    if (now - currentData.firstRequest > windowMs) {
      // Window expired, reset counter
      this.cache.set(key, { count: 1, firstRequest: now });
      
      return this.success({
        rateLimit: {
          limit: this.options.limit,
          remaining: this.options.limit - 1,
          reset: now + windowMs,
        }
      });
    }
    
    // Increment counter
    const newCount = currentData.count + 1;
    this.cache.set(key, { count: newCount, firstRequest: currentData.firstRequest });
    
    // Check if limit exceeded
    if (newCount > this.options.limit) {
      const resetTime = currentData.firstRequest + windowMs;
      const retryAfter = Math.ceil((resetTime - now) / 1000);
      
      return this.failure(
        `Rate limit exceeded. Try again in ${retryAfter} seconds.`,
        'RATE_LIMIT_EXCEEDED',
        429,
        {
          rateLimit: {
            limit: this.options.limit,
            remaining: 0,
            reset: resetTime,
            retryAfter,
          }
        }
      );
    }
    
    // Return success with rate limit info
    return this.success({
      rateLimit: {
        limit: this.options.limit,
        remaining: this.options.limit - newCount,
        reset: currentData.firstRequest + windowMs,
      }
    });
  }
}

import { BaseRule } from './BaseRule';
import { RuleContext, RuleResult, RuleType, RulePriority, RuleConfig } from './types';

/**
 * Options for transformation rules
 */
export interface TransformationOptions {
  /** Function to transform the request body */
  transformBody?: (body: unknown, context: RuleContext) => unknown;
  /** Function to transform the request query parameters */
  transformQuery?: (query: Record<string, string>, context: RuleContext) => Record<string, string>;
  /** Function to transform the request headers */
  transformHeaders?: (headers: Record<string, string>, context: RuleContext) => Record<string, string>;
  /** Function to transform the entire request */
  transformRequest?: (request: RuleContext['request'], context: RuleContext) => RuleContext['request'];
}

/**
 * Rule for transforming request data
 */
export class TransformationRule extends BaseRule {
  private options: TransformationOptions;

  constructor(config: Omit<RuleConfig, 'type'>, options: TransformationOptions) {
    super({
      ...config,
      type: RuleType.TRANSFORMATION,
      priority: config.priority ?? RulePriority.NORMAL,
    });
    this.options = options;
  }

  execute(context: RuleContext): RuleResult {
    const { request } = context;
    let modified = false;
    
    // Apply transformations
    if (this.options.transformBody && request.body) {
      try {
        request.body = this.options.transformBody(request.body, context);
        modified = true;
      } catch (error) {
        return this.failure(
          'Error transforming request body',
          'TRANSFORMATION_ERROR',
          400,
          { error: error instanceof Error ? error.message : String(error) }
        );
      }
    }
    
    if (this.options.transformQuery && request.query) {
      try {
        request.query = this.options.transformQuery(request.query, context);
        modified = true;
      } catch (error) {
        return this.failure(
          'Error transforming query parameters',
          'TRANSFORMATION_ERROR',
          400,
          { error: error instanceof Error ? error.message : String(error) }
        );
      }
    }
    
    if (this.options.transformHeaders && request.headers) {
      try {
        request.headers = this.options.transformHeaders(request.headers, context);
        modified = true;
      } catch (error) {
        return this.failure(
          'Error transforming request headers',
          'TRANSFORMATION_ERROR',
          400,
          { error: error instanceof Error ? error.message : String(error) }
        );
      }
    }
    
    if (this.options.transformRequest) {
      try {
        const transformedRequest = this.options.transformRequest(request, context);
        
        // Update the request in the context
        context.request = transformedRequest;
        
        modified = true;
      } catch (error) {
        return this.failure(
          'Error transforming request',
          'TRANSFORMATION_ERROR',
          400,
          { error: error instanceof Error ? error.message : String(error) }
        );
      }
    }
    
    return this.success({ modified });
  }
}

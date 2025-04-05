import { BaseRule } from './BaseRule';
import { RuleContext, RuleResult, RuleType, RulePriority, RuleConfig } from './types';
import { z } from 'zod';

/**
 * Options for validation rules
 */
export interface ValidationRuleOptions {
  /** Zod schema for request body validation */
  bodySchema?: z.ZodType<any>;
  /** Zod schema for query parameters validation */
  querySchema?: z.ZodType<any>;
  /** Zod schema for headers validation */
  headersSchema?: z.ZodType<any>;
  /** Custom validation function */
  customValidator?: (context: RuleContext) => Promise<RuleResult> | RuleResult;
}

/**
 * Rule for validating request data using Zod schemas
 */
export class ValidationRule extends BaseRule {
  private options: ValidationRuleOptions;

  constructor(config: Omit<RuleConfig, 'type'>, options: ValidationRuleOptions) {
    super({
      ...config,
      type: RuleType.VALIDATION,
      priority: config.priority ?? RulePriority.HIGHEST, // Validation should run early
    });
    this.options = options;
  }

  async execute(context: RuleContext): Promise<RuleResult> {
    const { request } = context;
    const errors: Array<{ path: string; message: string }> = [];

    // Validate body if schema is provided
    if (this.options.bodySchema && request.body) {
      const bodyResult = this.options.bodySchema.safeParse(request.body);
      if (!bodyResult.success) {
        const formattedErrors = bodyResult.error.format();
        this.addZodErrors(errors, 'body', formattedErrors);
      }
    }

    // Validate query if schema is provided
    if (this.options.querySchema && request.query) {
      const queryResult = this.options.querySchema.safeParse(request.query);
      if (!queryResult.success) {
        const formattedErrors = queryResult.error.format();
        this.addZodErrors(errors, 'query', formattedErrors);
      }
    }

    // Validate headers if schema is provided
    if (this.options.headersSchema && request.headers) {
      const headersResult = this.options.headersSchema.safeParse(request.headers);
      if (!headersResult.success) {
        const formattedErrors = headersResult.error.format();
        this.addZodErrors(errors, 'headers', formattedErrors);
      }
    }

    // Run custom validator if provided
    if (this.options.customValidator) {
      const customResult = await Promise.resolve(this.options.customValidator(context));
      if (!customResult.passed) {
        return customResult;
      }
    }

    // Return result
    if (errors.length > 0) {
      return this.failure(
        'Validation failed',
        'VALIDATION_ERROR',
        400,
        { errors }
      );
    }

    return this.success();
  }

  /**
   * Add Zod errors to the errors array
   * @param errors Array to add errors to
   * @param prefix Prefix for error paths
   * @param formattedErrors Formatted Zod errors
   */
  private addZodErrors(
    errors: Array<{ path: string; message: string }>,
    prefix: string,
    formattedErrors: z.ZodFormattedError<any, string>,
    currentPath: string = ''
  ): void {
    // Add _errors if they exist
    if (formattedErrors._errors && formattedErrors._errors.length > 0) {
      const path = currentPath ? `${prefix}.${currentPath}` : prefix;
      errors.push({
        path,
        message: formattedErrors._errors.join(', '),
      });
    }

    // Recursively process nested errors
    for (const [key, value] of Object.entries(formattedErrors)) {
      if (key !== '_errors' && typeof value === 'object') {
        const newPath = currentPath ? `${currentPath}.${key}` : key;
        this.addZodErrors(errors, prefix, value as unknown as z.ZodFormattedError<any, string>, newPath);
      }
    }
  }
}

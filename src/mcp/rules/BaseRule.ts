import { Rule, RuleConfig, RuleContext, RuleResult } from './types';

/**
 * Base class for all rules
 * 
 * Provides common functionality and simplifies rule implementation
 */
export abstract class BaseRule implements Rule {
  constructor(public readonly config: RuleConfig) {}

  /**
   * Execute the rule against the given context
   * @param context The context for rule execution
   * @returns Result of the rule execution
   */
  abstract execute(context: RuleContext): Promise<RuleResult> | RuleResult;

  /**
   * Create a successful rule result
   * @param details Optional details to include in the result
   * @returns A successful rule result
   */
  protected success(details?: unknown): RuleResult {
    return {
      passed: true,
      details,
    };
  }

  /**
   * Create a failed rule result
   * @param message Error message
   * @param code Error code
   * @param statusCode HTTP status code
   * @param details Additional details
   * @returns A failed rule result
   */
  protected failure(
    message: string,
    code: string = 'RULE_VIOLATION',
    statusCode: number = 400,
    details?: unknown
  ): RuleResult {
    return {
      passed: false,
      message,
      code,
      statusCode,
      details,
    };
  }
}

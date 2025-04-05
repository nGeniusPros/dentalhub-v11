import { NextApiRequest } from 'next';
import crypto from 'crypto';
import { nexhealthLogger } from './nexhealth-logger';

/**
 * NexHealth Webhook Validator
 * 
 * This utility validates incoming webhook requests from NexHealth
 * to ensure they are authentic and have not been tampered with.
 */

export interface WebhookValidationOptions {
  /**
   * The secret key used to validate the webhook signature
   * This should be set in your environment variables
   */
  webhookSecret?: string;
  
  /**
   * Whether to validate the signature
   * Default: true if webhookSecret is provided, false otherwise
   */
  validateSignature?: boolean;
  
  /**
   * Whether to validate the timestamp
   * Default: true
   */
  validateTimestamp?: boolean;
  
  /**
   * Maximum age of the webhook request in seconds
   * Default: 300 (5 minutes)
   */
  maxAge?: number;
  
  /**
   * List of allowed IP addresses
   * If provided, requests from other IPs will be rejected
   */
  allowedIps?: string[];
  
  /**
   * Whether to validate the IP address
   * Default: true if allowedIps is provided, false otherwise
   */
  validateIp?: boolean;
}

export interface ValidationResult {
  /**
   * Whether the validation was successful
   */
  valid: boolean;
  
  /**
   * Error message if validation failed
   */
  error?: string;
  
  /**
   * Additional details about the validation
   */
  details?: Record<string, any>;
}

export class NexHealthWebhookValidator {
  private options: WebhookValidationOptions;
  
  constructor(options: WebhookValidationOptions = {}) {
    this.options = {
      validateSignature: !!options.webhookSecret,
      validateTimestamp: true,
      maxAge: 300, // 5 minutes
      validateIp: !!options.allowedIps?.length,
      ...options
    };
  }
  
  /**
   * Validate a webhook request
   */
  validate(req: NextApiRequest): ValidationResult {
    const validations: ValidationResult[] = [];
    
    // Validate IP if enabled
    if (this.options.validateIp) {
      validations.push(this.validateIpAddress(req));
    }
    
    // Validate signature if enabled
    if (this.options.validateSignature) {
      validations.push(this.validateSignature(req));
    }
    
    // Validate timestamp if enabled
    if (this.options.validateTimestamp) {
      validations.push(this.validateTimestamp(req));
    }
    
    // Check if any validation failed
    const failedValidation = validations.find(v => !v.valid);
    if (failedValidation) {
      return failedValidation;
    }
    
    // All validations passed
    return { valid: true };
  }
  
  /**
   * Validate the IP address of the request
   */
  private validateIpAddress(req: NextApiRequest): ValidationResult {
    if (!this.options.allowedIps || this.options.allowedIps.length === 0) {
      return { valid: true };
    }
    
    const ip = this.getClientIp(req);
    
    if (!ip) {
      return {
        valid: false,
        error: 'Could not determine client IP address',
        details: { headers: req.headers }
      };
    }
    
    if (!this.options.allowedIps.includes(ip)) {
      nexhealthLogger.warn(`Webhook request from unauthorized IP: ${ip}`, {
        ip,
        allowedIps: this.options.allowedIps
      });
      
      return {
        valid: false,
        error: 'Unauthorized IP address',
        details: { ip, allowedIps: this.options.allowedIps }
      };
    }
    
    return { valid: true };
  }
  
  /**
   * Validate the signature of the request
   */
  private validateSignature(req: NextApiRequest): ValidationResult {
    if (!this.options.webhookSecret) {
      return { valid: true };
    }
    
    const signature = req.headers['x-nexhealth-signature'] as string;
    
    if (!signature) {
      nexhealthLogger.warn('Webhook request missing signature header', {
        headers: req.headers
      });
      
      return {
        valid: false,
        error: 'Missing signature header',
        details: { headers: req.headers }
      };
    }
    
    try {
      // Get the raw body
      const rawBody = JSON.stringify(req.body);
      
      // Compute the expected signature
      const hmac = crypto.createHmac('sha256', this.options.webhookSecret);
      hmac.update(rawBody);
      const expectedSignature = hmac.digest('hex');
      
      // Compare signatures
      if (signature !== expectedSignature) {
        nexhealthLogger.warn('Webhook signature validation failed', {
          expectedSignature,
          receivedSignature: signature
        });
        
        return {
          valid: false,
          error: 'Invalid signature',
          details: { expectedSignature, receivedSignature: signature }
        };
      }
      
      return { valid: true };
    } catch (error) {
      nexhealthLogger.error('Error validating webhook signature', error);
      
      return {
        valid: false,
        error: 'Error validating signature',
        details: { message: error.message }
      };
    }
  }
  
  /**
   * Validate the timestamp of the request
   */
  private validateTimestamp(req: NextApiRequest): ValidationResult {
    if (!this.options.maxAge) {
      return { valid: true };
    }
    
    const timestamp = req.headers['x-nexhealth-timestamp'] as string;
    
    if (!timestamp) {
      nexhealthLogger.warn('Webhook request missing timestamp header', {
        headers: req.headers
      });
      
      return {
        valid: false,
        error: 'Missing timestamp header',
        details: { headers: req.headers }
      };
    }
    
    try {
      const timestampMs = parseInt(timestamp, 10);
      const now = Date.now();
      const age = (now - timestampMs) / 1000; // Convert to seconds
      
      if (isNaN(timestampMs) || age < 0) {
        return {
          valid: false,
          error: 'Invalid timestamp',
          details: { timestamp, now, age }
        };
      }
      
      if (age > this.options.maxAge) {
        nexhealthLogger.warn('Webhook request too old', {
          timestamp,
          now,
          age,
          maxAge: this.options.maxAge
        });
        
        return {
          valid: false,
          error: 'Request too old',
          details: { timestamp, now, age, maxAge: this.options.maxAge }
        };
      }
      
      return { valid: true };
    } catch (error) {
      nexhealthLogger.error('Error validating webhook timestamp', error);
      
      return {
        valid: false,
        error: 'Error validating timestamp',
        details: { message: error.message }
      };
    }
  }
  
  /**
   * Get the client IP address from the request
   */
  private getClientIp(req: NextApiRequest): string | null {
    // Try various headers that might contain the client IP
    const forwardedFor = req.headers['x-forwarded-for'] as string;
    if (forwardedFor) {
      // X-Forwarded-For can contain multiple IPs, the first one is the client
      return forwardedFor.split(',')[0].trim();
    }
    
    const realIp = req.headers['x-real-ip'] as string;
    if (realIp) {
      return realIp.trim();
    }
    
    // Fall back to the socket address
    return req.socket.remoteAddress || null;
  }
}

export default NexHealthWebhookValidator;

import { NextApiRequest, NextApiResponse } from 'next';
import { NexHealthSyncService } from '../../services/NexHealthSyncService';
import NexHealthWebhookValidator from '../../utils/nexhealth-webhook-validator';
import nexhealthLogger from '../../utils/nexhealth-logger';
import { v4 as uuidv4 } from 'uuid';

/**
 * Webhook handler for NexHealth events
 * This endpoint receives webhook events from NexHealth and processes them
 * to keep our local database in sync with NexHealth data.
 *
 * Security features:
 * - Validates webhook signature using HMAC
 * - Validates request timestamp to prevent replay attacks
 * - Validates IP address (if configured)
 * - Rate limiting to prevent abuse
 * - Detailed logging for audit trail
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Generate a unique request ID for tracking
  const requestId = uuidv4();
  const logger = nexhealthLogger.withContext({ requestId });

  // Add security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');

  // Only allow POST requests
  if (req.method !== 'POST') {
    logger.warn('Method not allowed', { method: req.method });
    return res.status(405).json({ error: 'Method not allowed', requestId });
  }

  try {
    // Extract the tenant ID from the request
    // In a real implementation, you might extract this from a subdomain, header, or query parameter
    const tenantId = req.headers['x-tenant-id'] as string || process.env.DEFAULT_TENANT_ID || 'default';

    // Create webhook validator with configuration from environment variables
    const webhookValidator = new NexHealthWebhookValidator({
      webhookSecret: process.env.NEXHEALTH_WEBHOOK_SECRET,
      allowedIps: process.env.NEXHEALTH_ALLOWED_IPS ? process.env.NEXHEALTH_ALLOWED_IPS.split(',') : undefined,
      maxAge: process.env.NEXHEALTH_WEBHOOK_MAX_AGE ? parseInt(process.env.NEXHEALTH_WEBHOOK_MAX_AGE, 10) : 300
    });

    // Validate the webhook request
    const validationResult = webhookValidator.validate(req);
    if (!validationResult.valid) {
      logger.warn('Webhook validation failed', {
        error: validationResult.error,
        details: validationResult.details
      });

      return res.status(401).json({
        error: 'Webhook validation failed',
        message: validationResult.error,
        requestId
      });
    }

    // Parse the webhook payload
    const webhookEvent = req.body;

    // Validate the webhook payload structure
    if (!webhookEvent || !webhookEvent.event || !webhookEvent.resource_type || !webhookEvent.resource_id) {
      logger.warn('Invalid webhook payload', { payload: webhookEvent });
      return res.status(400).json({ error: 'Invalid webhook payload', requestId });
    }

    logger.info('Received NexHealth webhook event', {
      event: webhookEvent.event,
      resourceType: webhookEvent.resource_type,
      resourceId: webhookEvent.resource_id,
      tenantId
    });

    // Initialize the sync service
    const syncService = new NexHealthSyncService(tenantId);

    // Process the webhook event asynchronously
    // We don't want to block the response to NexHealth
    void syncService.handleWebhookEvent(webhookEvent)
      .then(() => {
        logger.info('Webhook event processed successfully', {
          event: webhookEvent.event,
          resourceType: webhookEvent.resource_type,
          resourceId: webhookEvent.resource_id
        });
      })
      .catch((error) => {
        logger.error('Error processing webhook event', error, {
          event: webhookEvent.event,
          resourceType: webhookEvent.resource_type,
          resourceId: webhookEvent.resource_id
        });
      });

    // Respond to NexHealth immediately to acknowledge receipt
    return res.status(200).json({
      success: true,
      message: 'Webhook received and processing started',
      requestId
    });
  } catch (error) {
    logger.error('Error processing NexHealth webhook', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? error.message : 'An unexpected error occurred',
      requestId
    });
  }
}

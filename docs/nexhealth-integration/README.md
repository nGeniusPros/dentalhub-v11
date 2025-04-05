# NexHealth Integration

This directory contains documentation for the NexHealth integration in the DentalHub application.

## Overview

NexHealth is a patient experience platform that provides APIs for accessing patient data, appointments, documents, and more. The DentalHub application integrates with NexHealth to provide a seamless experience for dental practices.

## Documentation

- [Enhanced NexHealth Integration](./EnhancedNexHealthIntegration.md): Overview of the enhanced NexHealth integration features.

## Environment Variables

The following environment variables are required for the NexHealth integration:

```
# NexHealth API credentials
NEXHEALTH_API_KEY=your_api_key
NEXHEALTH_SUBDOMAIN=your_subdomain
NEXHEALTH_LOCATION_ID=your_location_id
NEXHEALTH_BASE_URL=https://nexhealth.info

# Webhook configuration
NEXHEALTH_WEBHOOK_SECRET=your_webhook_secret
NEXHEALTH_ALLOWED_IPS=ip1,ip2,ip3
NEXHEALTH_WEBHOOK_MAX_AGE=300
NEXHEALTH_WEBHOOK_URL=https://your-app.com/api/nexhealth-webhook
```

## Testing

To test the NexHealth integration, run the following command:

```bash
# Run all tests
npm run test:nexhealth

# Test authentication only
npm run test:nexhealth -- --auth

# Test patient data retrieval
npm run test:nexhealth -- --patients

# Test webhook setup
npm run test:nexhealth -- --webhook
```

## Troubleshooting

If you encounter issues with the NexHealth integration, check the following:

1. Verify that the environment variables are correctly set.
2. Check the logs for error messages.
3. Verify that the NexHealth API is accessible.
4. Check the webhook configuration in the NexHealth dashboard.
5. Verify that the webhook URL is publicly accessible.

## Support

For support with the NexHealth integration, contact the DentalHub support team at support@dentalhub.com.

# MCP Adapters

This directory contains adapters for the MCP Gateway. Each adapter is responsible for handling requests to a specific external service or API.

## Available Adapters

- `AuthAdapter`: Handles authentication requests
- `PatientAdapter`: Handles patient-related requests
- `VoiceCampaignAdapter`: Handles voice campaign-related requests
- `NexHealthAdapter`: Handles NexHealth API integration

## NexHealthAdapter

The `NexHealthAdapter` provides integration with the NexHealth API, allowing DentalHub to interact with the NexHealth platform to manage patients, appointments, providers, and other dental practice resources.

### Configuration

The NexHealthAdapter requires the following environment variables:

- `NEXHEALTH_API_KEY`: Your NexHealth API key
- `NEXHEALTH_SUBDOMAIN`: Your NexHealth subdomain
- `NEXHEALTH_LOCATION_ID`: Your NexHealth location ID
- `NEXHEALTH_PRACTICE_NAME`: Your practice name
- `NEXHEALTH_SYNC_ID`: Your sync ID

### Supported Endpoints

The NexHealthAdapter supports all NexHealth API endpoints, including:

- Authentication
- Patient Management
- Provider and Location Management
- Operatory Management
- Appointment Management
- Availability Management
- Document Management
- Insurance Management
- Webhook Integration

For more details on the NexHealth API integration, see the [NexHealth Integration Documentation](../../docs/NexHealthIntegration.md).

## Creating a New Adapter

To create a new adapter, follow these steps:

1. Create a new file in the `adapters` directory with the name of your adapter (e.g., `MyAdapter.ts`).
2. Implement the `Adapter` interface from `../types.ts`.
3. Register your adapter in the MCP Gateway initialization code in `local-mcp-server.cjs` and `netlify/functions/mcp.js`.
4. Add routes for your adapter in `mcp-config.json`.

### Example Adapter

```typescript
import { Adapter } from '../types';
import { MCPRequest, MCPResponse } from '../protocol/types';

export class MyAdapter implements Adapter {
  constructor() {
    // Initialize your adapter
  }

  async handleRequest(request: MCPRequest): Promise<MCPResponse> {
    try {
      // Handle the request
      return {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        body: { message: 'Success' },
        error: null
      };
    } catch (err) {
      console.error('MyAdapter Error:', err);
      return {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
        body: null,
        error: {
          code: 'MY_ADAPTER_ERROR',
          message: err instanceof Error ? err.message : String(err),
          details: err instanceof Error ? err.stack : String(err)
        }
      };
    }
  }
}
```

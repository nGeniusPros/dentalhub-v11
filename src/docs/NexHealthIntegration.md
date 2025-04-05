# NexHealth API Integration

This document provides an overview of the NexHealth API integration in the DentalHub application.

## Overview

The NexHealth API integration allows DentalHub to interact with the NexHealth platform to manage patients, appointments, providers, and other dental practice resources. The integration is implemented using the MCP Gateway framework, which provides a unified interface for interacting with external APIs.

## Configuration

The NexHealth integration requires the following environment variables:

- `NEXHEALTH_API_KEY`: Your NexHealth API key
- `NEXHEALTH_SUBDOMAIN`: Your NexHealth subdomain
- `NEXHEALTH_LOCATION_ID`: Your NexHealth location ID
- `NEXHEALTH_PRACTICE_NAME`: Your practice name
- `NEXHEALTH_SYNC_ID`: Your sync ID

These variables should be set in your `.env` file or in your deployment environment.

## Authentication

NexHealth uses API key authentication to obtain a bearer token, which is then used for subsequent requests. The token is valid for 1 hour in production environments. The `NexHealthAdapter` handles token management automatically, including caching and refreshing the token when needed.

## Available Endpoints

### Authentication

- `POST /api/nexhealth/authenticates`: Obtain a bearer token for API access

### Patient Management

- `GET /api/nexhealth/patients`: Search for existing patients
- `POST /api/nexhealth/patients`: Create new patients
- `PATCH /api/nexhealth/patients/{id}`: Update patient information
- `GET /api/nexhealth/patients/{id}`: Get specific patient details

### Provider and Location Management

- `GET /api/nexhealth/providers`: Retrieve providers available at a location
- `GET /api/nexhealth/locations`: Get all locations under a practice
- `GET /api/nexhealth/locations/{id}`: Get details about a specific location

### Operatory Management

- `GET /api/nexhealth/operatories`: Retrieve operatories (chairs/rooms) at a location

### Appointment Management

- `GET /api/nexhealth/appointment_slots`: Find available appointment times
- `GET /api/nexhealth/appointment_types`: Retrieve appointment types
- `POST /api/nexhealth/appointment_types`: Create new appointment types
- `GET /api/nexhealth/appointments`: List appointments
- `POST /api/nexhealth/appointments`: Create a new appointment
- `PATCH /api/nexhealth/appointments/{id}`: Update appointment status (confirm/cancel)

### Availability Management

- `GET /api/nexhealth/availabilities`: Retrieve provider availabilities
- `POST /api/nexhealth/availabilities`: Create provider availabilities

### Document Management

- `POST /api/nexhealth/patients/{id}/documents`: Upload PDF documents to patient records
- `GET /api/nexhealth/patients/{id}/documents`: Get patient documents

### Insurance Management

- `GET /api/nexhealth/insurance_plans`: Get insurance plans accepted at a practice
- `GET /api/nexhealth/insurance_coverages`: Get patient insurance coverage details

### Webhook Integration

- `POST /api/nexhealth/webhook_endpoints`: Register a webhook endpoint
- `POST /api/nexhealth/webhook_endpoints/{id}/webhook_subscriptions`: Subscribe to specific events
- `GET /api/nexhealth/webhook_endpoints`: List registered webhook endpoints

## React Hooks

The NexHealth integration includes a set of React hooks that make it easy to interact with the NexHealth API from your components. These hooks are available in `src/hooks/useNexHealth.ts`.

### Example Usage

```tsx
import { useNexHealthPatients } from '../hooks/useNexHealth';

const PatientList = () => {
  const { patients, loading, error, fetchPatients } = useNexHealthPatients();

  useEffect(() => {
    fetchPatients({ page: 1, per_page: 10 });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>Patients</h1>
      <ul>
        {patients.map(patient => (
          <li key={patient.id}>
            {patient.first_name} {patient.last_name}
          </li>
        ))}
      </ul>
    </div>
  );
};
```

## Error Handling

The NexHealth integration includes comprehensive error handling at both the adapter level and in the React hooks. Errors from the NexHealth API are properly formatted and passed back to the client.

## Pagination

Most NexHealth API endpoints support pagination. The React hooks include support for pagination parameters and return pagination metadata when available.

## File Uploads

The NexHealth integration supports file uploads for document management. The `NexHealthAdapter` includes special handling for file uploads to ensure they are properly formatted and sent to the NexHealth API.

## Webhook Integration

The NexHealth integration includes support for webhook integration, allowing you to receive notifications when operations complete. This is particularly useful for asynchronous operations like appointment creation.

## Best Practices

1. **Token Management**: The NexHealth adapter handles token management automatically, but be aware that tokens expire after 1 hour in production.

2. **Pagination**: When fetching large datasets, use pagination to improve performance and reduce memory usage.

3. **Error Handling**: Always handle errors from the NexHealth API in your components.

4. **Asynchronous Operations**: Some operations, like appointment creation, are asynchronous. Use webhooks to receive notifications when these operations complete.

5. **Rate Limiting**: Be mindful of rate limits when making requests to the NexHealth API.

## Troubleshooting

If you encounter issues with the NexHealth integration, check the following:

1. Ensure your environment variables are correctly set.
2. Check the server logs for error messages.
3. Verify that your NexHealth API key is valid and has the necessary permissions.
4. Check that your subdomain and location ID are correct.
5. Ensure that the NexHealthAdapter is properly registered with the MCP Gateway.

## References

- [NexHealth API Documentation](https://docs.nexhealth.com/reference/introduction)
- [MCP Gateway Documentation](src/mcp/README.md)

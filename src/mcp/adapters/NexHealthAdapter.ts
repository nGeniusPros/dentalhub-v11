import { Adapter } from '../types';
import { MCPRequest, MCPResponse } from '../protocol/types';
import axios, { AxiosRequestConfig } from 'axios';
import FormData from 'form-data';

export class NexHealthAdapter implements Adapter {
  private readonly apiKey: string;
  private readonly subdomain: string;
  private readonly locationId: string;
  private readonly practiceName: string;
  private readonly syncId: string;
  private readonly baseUrl = 'https://nexhealth.info';

  // Token cache
  private token: string | null = null;
  private tokenExpiresAt: number | null = null;

  constructor() {
    // Get environment variables
    this.apiKey = process.env.NEXHEALTH_API_KEY || '';
    this.subdomain = process.env.NEXHEALTH_SUBDOMAIN || '';
    this.locationId = process.env.NEXHEALTH_LOCATION_ID || '';
    this.practiceName = process.env.NEXHEALTH_PRACTICE_NAME || '';
    this.syncId = process.env.NEXHEALTH_SYNC_ID || '';

    // Validate required environment variables
    if (!this.apiKey) {
      throw new Error('NEXHEALTH_API_KEY environment variable is required');
    }
    if (!this.subdomain) {
      throw new Error('NEXHEALTH_SUBDOMAIN environment variable is required');
    }
    if (!this.locationId) {
      throw new Error('NEXHEALTH_LOCATION_ID environment variable is required');
    }
  }

  async handleRequest(request: MCPRequest): Promise<MCPResponse> {
    try {
      console.log(`NexHealthAdapter processing request for path: ${request.path}`);

      const pathParts = request.path.split('/');
      const resource = pathParts[2]; // e.g., 'nexhealth'

      if (resource !== 'nexhealth') {
        throw new Error(`NexHealthAdapter: Unsupported resource type "${resource}"`);
      }

      // Special case for authentication endpoint
      if (pathParts[3] === 'authenticates') {
        return await this.handleAuthentication();
      }

      // Extract the actual NexHealth endpoint from the path
      const endpoint = pathParts.slice(3).join('/'); // e.g., 'patients'

      // Get bearer token
      const token = await this.getBearerToken();

      // Construct the target URL
      const targetUrl = new URL(`${this.baseUrl}/${endpoint}`);

      // Add required query parameters
      targetUrl.searchParams.set('subdomain', this.subdomain);

      // Add location_id for endpoints that require it
      const requiresLocationId = [
        'patients', 'providers', 'operatories', 'appointments',
        'appointment_slots', 'appointment_types', 'availabilities',
        'documents', 'insurance_plans', 'insurance_coverages'
      ].includes(pathParts[3]);

      if (requiresLocationId) {
        targetUrl.searchParams.set('location_id', this.locationId);
      }

      // Add query parameters from the original request
      if (request.query) {
        Object.entries(request.query).forEach(([key, value]) => {
          if (value && key !== 'subdomain' && key !== 'location_id') {
            targetUrl.searchParams.set(key, value);
          }
        });
      }

      console.log(`NexHealthAdapter: Proxying request to ${request.method} ${targetUrl.toString()}`);

      // Handle file uploads for document endpoints
      if (endpoint.includes('documents') && request.method === 'POST' && request.body && request.body.file) {
        return await this.handleFileUpload(targetUrl.toString(), token, request.body);
      }

      // Make the request to NexHealth
      const axiosConfig: AxiosRequestConfig = {
        method: request.method,
        url: targetUrl.toString(),
        headers: {
          'Accept': 'application/vnd.Nexhealth+json;version=2',
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        data: request.body,
        validateStatus: () => true // Handle all status codes manually
      };

      const response = await axios(axiosConfig);

      // Log response status for debugging
      console.log(`NexHealthAdapter: Received response with status ${response.status}`);

      // Handle error responses from NexHealth
      if (response.status >= 400) {
        console.error('NexHealth API Error:', response.data);
        return {
          status: response.status,
          headers: { 'Content-Type': 'application/json' },
          body: null,
          error: {
            code: `NEXHEALTH_${response.status}`,
            message: response.data?.error || 'NexHealth API error',
            details: response.data
          }
        };
      }

      return {
        status: response.status,
        headers: { 'Content-Type': 'application/json' },
        body: response.data,
        error: null
      };
    } catch (err) {
      console.error('NexHealthAdapter Error:', err);
      return {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
        body: null,
        error: {
          code: 'NEXHEALTH_ERROR',
          message: err instanceof Error ? err.message : String(err),
          details: err instanceof Error ? err.stack : String(err)
        }
      };
    }
  }

  /**
   * Handle authentication with NexHealth API
   */
  private async handleAuthentication(): Promise<MCPResponse> {
    try {
      const token = await this.getBearerToken();
      return {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        body: { token },
        error: null
      };
    } catch (err) {
      console.error('NexHealthAdapter Authentication Error:', err);
      return {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
        body: null,
        error: {
          code: 'AUTHENTICATION_ERROR',
          message: err instanceof Error ? err.message : String(err),
          details: err instanceof Error ? err.stack : String(err)
        }
      };
    }
  }

  /**
   * Handle file uploads to NexHealth
   */
  private async handleFileUpload(url: string, token: string, body: any): Promise<MCPResponse> {
    try {
      const formData = new FormData();

      // Add file to form data
      formData.append('file', body.file, body.filename || 'document.pdf');

      // Add any additional fields
      if (body.metadata) {
        formData.append('metadata', JSON.stringify(body.metadata));
      }

      const response = await axios.post(url, formData, {
        headers: {
          'Accept': 'application/vnd.Nexhealth+json;version=2',
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
          ...formData.getHeaders()
        },
        validateStatus: () => true
      });

      if (response.status >= 400) {
        console.error('NexHealth File Upload Error:', response.data);
        return {
          status: response.status,
          headers: { 'Content-Type': 'application/json' },
          body: null,
          error: {
            code: `NEXHEALTH_UPLOAD_ERROR_${response.status}`,
            message: response.data?.error || 'File upload failed',
            details: response.data
          }
        };
      }

      return {
        status: response.status,
        headers: { 'Content-Type': 'application/json' },
        body: response.data,
        error: null
      };
    } catch (err) {
      console.error('NexHealth File Upload Error:', err);
      return {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
        body: null,
        error: {
          code: 'FILE_UPLOAD_ERROR',
          message: err instanceof Error ? err.message : String(err),
          details: err instanceof Error ? err.stack : String(err)
        }
      };
    }
  }

  private async getBearerToken(): Promise<string> {
    const now = Date.now();

    // Check cache first
    if (this.token && this.tokenExpiresAt && this.tokenExpiresAt > now) {
      console.log('Using cached NexHealth token.');
      return this.token;
    }

    console.log('Fetching new NexHealth token...');

    try {
      const authUrl = `${this.baseUrl}/authenticates`;
      const response = await axios.post(authUrl, {}, {
        headers: {
          'Accept': 'application/vnd.Nexhealth+json;version=2',
          'Authorization': this.apiKey
        }
      });

      // Extract token
      const token = response.data?.data?.token;
      if (!token) {
        console.error('Failed to extract token from NexHealth response:', response.data);
        throw new Error('Authentication failed: Could not retrieve bearer token from NexHealth.');
      }

      // Cache the token (expires in 1 hour, cache for 55 mins to be safe)
      this.token = token;
      this.tokenExpiresAt = now + 55 * 60 * 1000; // 55 minutes in milliseconds
      console.log('Successfully fetched and cached new NexHealth token.');
      return token;
    } catch (error: any) {
      console.error('Error fetching NexHealth token:', error.response?.data || error.message);
      throw new Error(`Failed to authenticate with NexHealth: ${error.message}`);
    }
  }
}

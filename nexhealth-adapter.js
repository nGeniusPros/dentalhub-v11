import axios from 'axios';

export class NexHealthAdapter {
  constructor() {
    // Get environment variables
    this.apiKey = process.env.NEXHEALTH_API_KEY || '';
    this.subdomain = process.env.NEXHEALTH_SUBDOMAIN || '';
    this.locationId = process.env.NEXHEALTH_LOCATION_ID || '';
    this.practiceName = process.env.NEXHEALTH_PRACTICE_NAME || '';
    this.syncId = process.env.NEXHEALTH_SYNC_ID || '';
    this.baseUrl = 'https://nexhealth.info';
    
    // Token cache
    this.token = null;
    this.tokenExpiresAt = null;
    
    console.log('NexHealthAdapter initialized with:');
    console.log(`- API Key: ${this.apiKey ? '****' + this.apiKey.substring(this.apiKey.length - 4) : 'Not set'}`);
    console.log(`- Subdomain: ${this.subdomain || 'Not set'}`);
    console.log(`- Location ID: ${this.locationId || 'Not set'}`);
  }

  async handleRequest(request) {
    try {
      console.log(`NexHealthAdapter processing request for path: ${request.path}`);
      
      const pathParts = request.path.split('/');
      const resource = pathParts[2]; // e.g., 'nexhealth'
      
      if (resource !== 'nexhealth') {
        throw new Error(`NexHealthAdapter: Unsupported resource type "${resource}"`);
      }
      
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
      ].includes(endpoint);
      
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
      
      // Make the request to NexHealth
      const response = await axios({
        method: request.method,
        url: targetUrl.toString(),
        headers: {
          'Accept': 'application/vnd.Nexhealth+json;version=2',
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        data: request.body,
        validateStatus: () => true // Handle all status codes manually
      });
      
      console.log(`NexHealthAdapter: Received response with status ${response.status}`);
      
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
  
  async getBearerToken() {
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
    } catch (error) {
      console.error('Error fetching NexHealth token:', error.response?.data || error.message);
      throw new Error(`Failed to authenticate with NexHealth: ${error.message}`);
    }
  }
}

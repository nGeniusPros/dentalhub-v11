const axios = require('axios');

// Token cache (in-memory, will reset on function cold starts)
let token = null;
let tokenExpiresAt = null;

exports.handler = async (event, context) => {
  try {
    // Parse request
    const { path, method, body } = JSON.parse(event.body || '{}');
    
    // Get environment variables
    const apiKey = process.env.NEXHEALTH_API_KEY;
    const subdomain = process.env.NEXHEALTH_SUBDOMAIN;
    const locationId = process.env.NEXHEALTH_LOCATION_ID;
    
    if (!apiKey) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'NEXHEALTH_API_KEY environment variable is not set' })
      };
    }
    
    if (!subdomain) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'NEXHEALTH_SUBDOMAIN environment variable is not set' })
      };
    }
    
    if (!locationId) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'NEXHEALTH_LOCATION_ID environment variable is not set' })
      };
    }
    
    // Extract endpoint from path
    const pathParts = path.split('/');
    const resource = pathParts[2]; // e.g., 'nexhealth'
    
    if (resource !== 'nexhealth') {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: `Unsupported resource type "${resource}"` })
      };
    }
    
    const endpoint = pathParts.slice(3).join('/'); // e.g., 'patients'
    
    // Get bearer token
    const bearerToken = await getBearerToken(apiKey);
    
    // Construct the target URL
    const baseUrl = 'https://nexhealth.info';
    const targetUrl = new URL(`${baseUrl}/${endpoint}`);
    
    // Add required query parameters
    targetUrl.searchParams.set('subdomain', subdomain);
    
    // Add location_id for endpoints that require it
    const requiresLocationId = [
      'patients', 'providers', 'operatories', 'appointments',
      'appointment_slots', 'appointment_types', 'availabilities',
      'documents', 'insurance_plans', 'insurance_coverages'
    ].includes(endpoint);
    
    if (requiresLocationId) {
      targetUrl.searchParams.set('location_id', locationId);
    }
    
    console.log(`NexHealth Proxy: Proxying ${method} request to ${targetUrl.toString()}`);
    
    // Make the request to NexHealth
    const response = await axios({
      method: method || 'GET',
      url: targetUrl.toString(),
      headers: {
        'Accept': 'application/vnd.Nexhealth+json;version=2',
        'Authorization': `Bearer ${bearerToken}`,
        'Content-Type': 'application/json'
      },
      data: body,
      validateStatus: () => true // Handle all status codes manually
    });
    
    console.log(`NexHealth Proxy: Received response with status ${response.status}`);
    
    return {
      statusCode: response.status,
      body: JSON.stringify(response.data)
    };
  } catch (error) {
    console.error('NexHealth Proxy Error:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error.message,
        details: error.stack
      })
    };
  }
};

async function getBearerToken(apiKey) {
  const now = Date.now();
  
  // Check cache first
  if (token && tokenExpiresAt && tokenExpiresAt > now) {
    console.log('Using cached NexHealth token.');
    return token;
  }
  
  console.log('Fetching new NexHealth token...');
  
  try {
    const authUrl = 'https://nexhealth.info/authenticates';
    const response = await axios.post(authUrl, {}, {
      headers: {
        'Accept': 'application/vnd.Nexhealth+json;version=2',
        'Authorization': apiKey
      }
    });
    
    // Extract token
    const newToken = response.data?.data?.token;
    if (!newToken) {
      console.error('Failed to extract token from NexHealth response:', response.data);
      throw new Error('Authentication failed: Could not retrieve bearer token from NexHealth.');
    }
    
    // Cache the token (expires in 1 hour, cache for 55 mins to be safe)
    token = newToken;
    tokenExpiresAt = now + 55 * 60 * 1000; // 55 minutes in milliseconds
    console.log('Successfully fetched and cached new NexHealth token.');
    return token;
  } catch (error) {
    console.error('Error fetching NexHealth token:', error.response?.data || error.message);
    throw new Error(`Failed to authenticate with NexHealth: ${error.message}`);
  }
}

const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = 3001;

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// Get environment variables
const apiKey = process.env.NEXHEALTH_API_KEY;
const subdomain = process.env.NEXHEALTH_SUBDOMAIN;
const locationId = process.env.NEXHEALTH_LOCATION_ID;

// Token cache (in-memory, will reset on server restart)
let token = null;
let tokenExpiresAt = null;

// Middleware to log requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// NexHealth proxy endpoint
app.get('/api/nexhealth/patients', async (req, res) => {
  try {
    // Get bearer token
    const bearerToken = await getBearerToken();
    
    // Construct the target URL
    const patientsUrl = new URL('https://nexhealth.info/patients');
    patientsUrl.searchParams.set('subdomain', subdomain);
    patientsUrl.searchParams.set('location_id', locationId);
    patientsUrl.searchParams.set('per_page', req.query.per_page || '50');
    patientsUrl.searchParams.set('page', req.query.page || '1');
    
    console.log(`Proxying request to: ${patientsUrl.toString()}`);
    
    // Make the request to NexHealth
    const response = await axios.get(patientsUrl.toString(), {
      headers: {
        'Accept': 'application/vnd.Nexhealth+json;version=2',
        'Authorization': `Bearer ${bearerToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log(`NexHealth response status: ${response.status}`);
    
    // Return the response
    res.json(response.data);
  } catch (error) {
    console.error('Error proxying request to NexHealth:', error.response?.data || error.message);
    res.status(500).json({
      error: 'Error proxying request to NexHealth',
      details: error.message
    });
  }
});

// Function to get bearer token
async function getBearerToken() {
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

// Start the server
app.listen(PORT, () => {
  console.log(`NexHealth proxy server running on http://localhost:${PORT}`);
});

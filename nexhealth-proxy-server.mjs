import express from 'express';
import axios from 'axios';
import cors from 'cors';
import { config } from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Initialize dotenv
config();

// Get directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

// Patient data cache
const CACHE_DIR = path.join(__dirname, 'cache');
const PATIENTS_CACHE_FILE = path.join(CACHE_DIR, 'patients-cache.json');
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

// Ensure cache directory exists
if (!fs.existsSync(CACHE_DIR)) {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
}

// Cache structure
let patientsCache = {
  timestamp: 0,
  data: {},
  pages: {}
};

// Load cache from disk if it exists
try {
  if (fs.existsSync(PATIENTS_CACHE_FILE)) {
    const cacheData = fs.readFileSync(PATIENTS_CACHE_FILE, 'utf8');
    patientsCache = JSON.parse(cacheData);
    console.log('Loaded patients cache from disk');
  }
} catch (error) {
  console.error('Error loading cache from disk:', error);
  // Continue with empty cache
}

// Function to save cache to disk
function saveCache() {
  try {
    fs.writeFileSync(PATIENTS_CACHE_FILE, JSON.stringify(patientsCache), 'utf8');
    console.log('Saved patients cache to disk');
  } catch (error) {
    console.error('Error saving cache to disk:', error);
  }
}

// Function to check if cache is valid
function isCacheValid() {
  const now = Date.now();
  return patientsCache.timestamp > 0 && (now - patientsCache.timestamp) < CACHE_TTL;
}

// Function to get cached page
function getCachedPage(page, perPage) {
  const cacheKey = `${page}-${perPage}`;
  return patientsCache.pages[cacheKey];
}

// Function to set cached page
function setCachedPage(page, perPage, data) {
  const cacheKey = `${page}-${perPage}`;
  patientsCache.pages[cacheKey] = data;
  patientsCache.timestamp = Date.now();

  // Also cache individual patients by ID for quick lookup
  if (data?.data?.patients) {
    data.data.patients.forEach(patient => {
      if (patient.id) {
        patientsCache.data[patient.id] = patient;
      }
    });
  }

  // Save cache to disk (debounced)
  clearTimeout(saveCacheTimeout);
  saveCacheTimeout = setTimeout(saveCache, 5000);
}

let saveCacheTimeout;

// Middleware to log requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Add request timing middleware
app.use((req, res, next) => {
  const start = Date.now();

  // Override end method to log response time
  const originalEnd = res.end;
  res.end = function(...args) {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.url} completed in ${duration}ms with status ${res.statusCode}`);
    return originalEnd.apply(this, args);
  };

  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  const tokenStatus = token && tokenExpiresAt && tokenExpiresAt > Date.now()
    ? 'valid'
    : 'not available';

  const tokenExpiry = tokenExpiresAt
    ? new Date(tokenExpiresAt).toISOString()
    : 'N/A';

  res.json({
    status: 'ok',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    token: {
      status: tokenStatus,
      expiresAt: tokenExpiry
    },
    config: {
      hasApiKey: !!apiKey,
      hasSubdomain: !!subdomain,
      hasLocationId: !!locationId
    },
    cache: {
      valid: isCacheValid(),
      timestamp: patientsCache.timestamp ? new Date(patientsCache.timestamp).toISOString() : null,
      patientCount: Object.keys(patientsCache.data).length,
      pageCount: Object.keys(patientsCache.pages).length
    }
  });
});

// NexHealth proxy endpoint with caching
app.get('/api/nexhealth/patients', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const perPage = parseInt(req.query.per_page) || 50;
  const forceRefresh = req.query.refresh === 'true';

  // Check cache first if not forcing refresh
  if (!forceRefresh && isCacheValid()) {
    const cachedData = getCachedPage(page, perPage);
    if (cachedData) {
      console.log(`Serving cached data for page ${page} (${perPage} per page)`);
      return res.json({
        ...cachedData,
        _cache: {
          status: 'hit',
          timestamp: new Date(patientsCache.timestamp).toISOString()
        }
      });
    }
  }

  try {
    // Get bearer token with retry mechanism
    let bearerToken;
    try {
      bearerToken = await getBearerTokenWithRetry();
    } catch (authError) {
      console.error('Authentication error:', authError);

      // If cache exists but is expired, return it as fallback
      if (patientsCache.timestamp > 0) {
        const cachedData = getCachedPage(page, perPage);
        if (cachedData) {
          console.log(`Serving expired cached data for page ${page} due to auth error`);
          return res.json({
            ...cachedData,
            _cache: {
              status: 'expired',
              timestamp: new Date(patientsCache.timestamp).toISOString(),
              error: authError.message
            }
          });
        }
      }

      return res.status(401).json({
        error: 'Authentication failed',
        details: authError.message,
        code: 'AUTH_ERROR'
      });
    }

    // Construct the target URL
    const patientsUrl = new URL('https://nexhealth.info/patients');
    patientsUrl.searchParams.set('subdomain', subdomain);
    patientsUrl.searchParams.set('location_id', locationId);
    patientsUrl.searchParams.set('per_page', perPage.toString());
    patientsUrl.searchParams.set('page', page.toString());

    console.log(`Proxying request to: ${patientsUrl.toString()}`);

    // Make the request to NexHealth with timeout
    try {
      const response = await axios.get(patientsUrl.toString(), {
        headers: {
          'Accept': 'application/vnd.Nexhealth+json;version=2',
          'Authorization': `Bearer ${bearerToken}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000 // 30 second timeout
      });

      console.log(`NexHealth response status: ${response.status}`);

      // Cache the response
      setCachedPage(page, perPage, response.data);

      // Return the response
      res.json({
        ...response.data,
        _cache: {
          status: 'miss',
          timestamp: new Date().toISOString()
        }
      });
    } catch (apiError) {
      // Handle different types of API errors
      if (apiError.code === 'ECONNABORTED') {
        console.error('Request timeout:', apiError);

        // Try to serve from cache if available
        if (patientsCache.timestamp > 0) {
          const cachedData = getCachedPage(page, perPage);
          if (cachedData) {
            console.log(`Serving expired cached data for page ${page} due to timeout`);
            return res.json({
              ...cachedData,
              _cache: {
                status: 'expired',
                timestamp: new Date(patientsCache.timestamp).toISOString(),
                error: 'Request timeout'
              }
            });
          }
        }

        return res.status(504).json({
          error: 'Request timeout',
          details: 'The request to NexHealth API timed out',
          code: 'TIMEOUT_ERROR'
        });
      }

      if (apiError.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        const status = apiError.response.status;
        const errorData = apiError.response.data;

        console.error(`API error (${status}):`, errorData);

        if (status === 401 || status === 403) {
          // Token might be invalid, clear it
          token = null;
          tokenExpiresAt = null;
        }

        // Try to serve from cache if available
        if (patientsCache.timestamp > 0) {
          const cachedData = getCachedPage(page, perPage);
          if (cachedData) {
            console.log(`Serving expired cached data for page ${page} due to API error`);
            return res.json({
              ...cachedData,
              _cache: {
                status: 'expired',
                timestamp: new Date(patientsCache.timestamp).toISOString(),
                error: `API error: ${status}`
              }
            });
          }
        }

        return res.status(status).json({
          error: 'NexHealth API error',
          details: errorData,
          code: 'API_ERROR',
          status
        });
      } else if (apiError.request) {
        // The request was made but no response was received
        console.error('No response from API:', apiError);

        // Try to serve from cache if available
        if (patientsCache.timestamp > 0) {
          const cachedData = getCachedPage(page, perPage);
          if (cachedData) {
            console.log(`Serving expired cached data for page ${page} due to network error`);
            return res.json({
              ...cachedData,
              _cache: {
                status: 'expired',
                timestamp: new Date(patientsCache.timestamp).toISOString(),
                error: 'Network error'
              }
            });
          }
        }

        return res.status(502).json({
          error: 'No response from NexHealth API',
          details: 'The request was made but no response was received',
          code: 'NETWORK_ERROR'
        });
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Request setup error:', apiError);

        // Try to serve from cache if available
        if (patientsCache.timestamp > 0) {
          const cachedData = getCachedPage(page, perPage);
          if (cachedData) {
            console.log(`Serving expired cached data for page ${page} due to request error`);
            return res.json({
              ...cachedData,
              _cache: {
                status: 'expired',
                timestamp: new Date(patientsCache.timestamp).toISOString(),
                error: apiError.message
              }
            });
          }
        }

        return res.status(500).json({
          error: 'Request setup error',
          details: apiError.message,
          code: 'REQUEST_ERROR'
        });
      }
    }
  } catch (error) {
    console.error('Unexpected error:', error);

    // Try to serve from cache if available
    if (patientsCache.timestamp > 0) {
      const cachedData = getCachedPage(page, perPage);
      if (cachedData) {
        console.log(`Serving expired cached data for page ${page} due to unexpected error`);
        return res.json({
          ...cachedData,
          _cache: {
            status: 'expired',
            timestamp: new Date(patientsCache.timestamp).toISOString(),
            error: error.message
          }
        });
      }
    }

    res.status(500).json({
      error: 'Internal server error',
      details: error.message,
      code: 'INTERNAL_ERROR'
    });
  }
});

// Add endpoint to get a specific patient by ID (with caching)
app.get('/api/nexhealth/patients/:id', async (req, res) => {
  const patientId = req.params.id;
  const forceRefresh = req.query.refresh === 'true';

  // Check cache first if not forcing refresh
  if (!forceRefresh && isCacheValid() && patientsCache.data[patientId]) {
    console.log(`Serving cached data for patient ${patientId}`);
    return res.json({
      data: patientsCache.data[patientId],
      _cache: {
        status: 'hit',
        timestamp: new Date(patientsCache.timestamp).toISOString()
      }
    });
  }

  try {
    // Get bearer token with retry mechanism
    let bearerToken;
    try {
      bearerToken = await getBearerTokenWithRetry();
    } catch (authError) {
      console.error('Authentication error:', authError);

      // If cache exists but is expired, return it as fallback
      if (patientsCache.timestamp > 0 && patientsCache.data[patientId]) {
        console.log(`Serving expired cached data for patient ${patientId} due to auth error`);
        return res.json({
          data: patientsCache.data[patientId],
          _cache: {
            status: 'expired',
            timestamp: new Date(patientsCache.timestamp).toISOString(),
            error: authError.message
          }
        });
      }

      return res.status(401).json({
        error: 'Authentication failed',
        details: authError.message,
        code: 'AUTH_ERROR'
      });
    }

    // Construct the target URL
    const patientUrl = new URL(`https://nexhealth.info/patients/${patientId}`);
    patientUrl.searchParams.set('subdomain', subdomain);
    patientUrl.searchParams.set('location_id', locationId);

    console.log(`Proxying request to: ${patientUrl.toString()}`);

    // Make the request to NexHealth
    const response = await axios.get(patientUrl.toString(), {
      headers: {
        'Accept': 'application/vnd.Nexhealth+json;version=2',
        'Authorization': `Bearer ${bearerToken}`,
        'Content-Type': 'application/json'
      },
      timeout: 30000 // 30 second timeout
    });

    console.log(`NexHealth response status: ${response.status}`);

    // Cache the patient data
    if (response.data?.data) {
      patientsCache.data[patientId] = response.data.data;
      patientsCache.timestamp = Date.now();
      saveCache();
    }

    // Return the response
    res.json({
      ...response.data,
      _cache: {
        status: 'miss',
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error(`Error fetching patient ${patientId}:`, error.response?.data || error.message);

    // If cache exists but is expired, return it as fallback
    if (patientsCache.timestamp > 0 && patientsCache.data[patientId]) {
      console.log(`Serving expired cached data for patient ${patientId} due to error`);
      return res.json({
        data: patientsCache.data[patientId],
        _cache: {
          status: 'expired',
          timestamp: new Date(patientsCache.timestamp).toISOString(),
          error: error.message
        }
      });
    }

    res.status(500).json({
      error: `Error fetching patient ${patientId}`,
      details: error.message
    });
  }
});

// Add endpoint to clear cache
app.post('/api/nexhealth/cache/clear', (req, res) => {
  patientsCache = {
    timestamp: 0,
    data: {},
    pages: {}
  };
  saveCache();
  res.json({ status: 'ok', message: 'Cache cleared successfully' });
});

// Add endpoint to get cache status
app.get('/api/nexhealth/cache/status', (req, res) => {
  const patientCount = Object.keys(patientsCache.data).length;
  const pageCount = Object.keys(patientsCache.pages).length;
  const isValid = isCacheValid();
  const age = patientsCache.timestamp > 0 ? Date.now() - patientsCache.timestamp : null;

  res.json({
    status: isValid ? 'valid' : 'expired',
    timestamp: patientsCache.timestamp > 0 ? new Date(patientsCache.timestamp).toISOString() : null,
    age: age !== null ? `${Math.round(age / 1000 / 60)} minutes` : null,
    ttl: `${CACHE_TTL / 1000 / 60 / 60} hours`,
    patients: patientCount,
    pages: pageCount,
    size: JSON.stringify(patientsCache).length
  });
});

// Add retry mechanism for token acquisition
async function getBearerTokenWithRetry(retries = 3, delay = 1000) {
  let lastError;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await getBearerToken();
    } catch (error) {
      console.error(`Token acquisition attempt ${attempt} failed:`, error.message);
      lastError = error;

      if (attempt < retries) {
        console.log(`Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        // Exponential backoff
        delay *= 2;
      }
    }
  }

  throw new Error(`Failed to acquire token after ${retries} attempts: ${lastError.message}`);
}

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

// Add error logging middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    details: err.message,
    code: 'UNHANDLED_ERROR'
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`NexHealth proxy server running on http://localhost:${PORT}`);
});

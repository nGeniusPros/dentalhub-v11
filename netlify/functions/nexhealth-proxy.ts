import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import axios, { AxiosRequestConfig, Method } from 'axios';

// Simple in-memory cache for the bearer token
interface TokenCache {
    token: string | null;
    expiresAt: number | null;
}

const tokenCache: TokenCache = {
    token: null,
    expiresAt: null,
};

const NEXHEALTH_API_BASE_URL = 'https://nexhealth.info';

// Function to get a valid bearer token (from cache or fetch new)
async function getBearerToken(): Promise<string> {
    const now = Date.now();

    // Check cache first
    if (tokenCache.token && tokenCache.expiresAt && tokenCache.expiresAt > now) {
        console.log("Using cached NexHealth token.");
        return tokenCache.token;
    }

    console.log("Fetching new NexHealth token...");
    const apiKey = process.env.NEXHEALTH_API_KEY;
    if (!apiKey) {
        throw new Error("NEXHEALTH_API_KEY environment variable is not set.");
    }

    try {
        const authUrl = `${NEXHEALTH_API_BASE_URL}/authenticates`;
        const response = await axios.post(authUrl, {}, {
            headers: {
                'Accept': 'application/vnd.Nexhealth+json;version=2',
                'Authorization': apiKey, // Use API Key directly for authentication endpoint
            }
        });

        // Correctly extract token based on v10 fix
        const token = response.data?.data?.token;
        if (!token) {
            console.error("Failed to extract token from NexHealth response:", response.data);
            throw new Error("Authentication failed: Could not retrieve bearer token from NexHealth.");
        }

        // Cache the token (expires in 1 hour, cache for 55 mins to be safe)
        tokenCache.token = token;
        tokenCache.expiresAt = now + 55 * 60 * 1000; // 55 minutes in milliseconds
        console.log("Successfully fetched and cached new NexHealth token.");
        return token;

    } catch (error: any) {
        console.error("Error fetching NexHealth token:", error.response?.data || error.message);
        throw new Error(`Failed to authenticate with NexHealth: ${error.message}`);
    }
}

const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
    const { NEXHEALTH_SUBDOMAIN, NEXHEALTH_LOCATION_ID } = process.env;

    if (!NEXHEALTH_SUBDOMAIN || !NEXHEALTH_LOCATION_ID) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "NexHealth subdomain or location ID environment variables are missing." }),
        };
    }

    try {
        const bearerToken = await getBearerToken();

        // Extract the target path from the Netlify function path
        // e.g., /.netlify/functions/nexhealth-proxy/patients -> /patients
        const functionPath = '/.netlify/functions/nexhealth-proxy';
        let targetPath = event.path.startsWith(functionPath)
            ? event.path.substring(functionPath.length)
            : event.path; // Fallback if path structure differs

        if (!targetPath.startsWith('/')) {
            targetPath = `/${targetPath}`;
        }

        // Construct the target URL
        const targetUrl = new URL(`${NEXHEALTH_API_BASE_URL}${targetPath}`);

        // Add required query parameters
        targetUrl.searchParams.set('subdomain', NEXHEALTH_SUBDOMAIN);
        // Add location_id only if it's not already present (some endpoints might not need it directly)
        // And avoid adding it to the /authenticates endpoint
        if (targetPath !== '/authenticates' && !targetUrl.searchParams.has('location_id')) {
             // Check if the endpoint requires location_id based on documentation patterns
             // (e.g., /patients, /providers, /appointments, etc.)
             // This is a basic check; refine if needed for specific endpoints
             const requiresLocationId = [
                 '/patients', '/providers', '/operatories', '/appointments',
                 '/appointment_slots', '/appointment_types', '/availabilities',
                 '/documents', '/insurance_plans', '/insurance_coverages'
             ].some(p => targetPath.startsWith(p));

             if (requiresLocationId) {
                targetUrl.searchParams.set('location_id', NEXHEALTH_LOCATION_ID);
             }
        }


        // Append query parameters from the original request
        if (event.queryStringParameters) {
            Object.entries(event.queryStringParameters).forEach(([key, value]) => {
                if (value && key !== 'subdomain' && key !== 'location_id') { // Avoid overriding required params
                    targetUrl.searchParams.set(key, value);
                }
            });
        }

        console.log(`Proxying request to: ${event.httpMethod} ${targetUrl.toString()}`);

        // Prepare the request config for Axios
        const config: AxiosRequestConfig = {
            method: event.httpMethod as Method,
            url: targetUrl.toString(),
            headers: {
                'Accept': 'application/vnd.Nexhealth+json;version=2',
                'Authorization': `Bearer ${bearerToken}`,
                // Forward relevant headers, excluding host and security-related ones
                ...(event.headers && {
                    'Content-Type': event.headers['content-type'],
                    'User-Agent': event.headers['user-agent'],
                    // Add other headers you might want to forward
                }),
            },
            data: event.body ? JSON.parse(event.body) : undefined, // Parse body if present
            responseType: 'json', // Expect JSON response
            validateStatus: () => true // Handle all status codes manually
        };

        // Make the proxied request
        const response = await axios(config);

        // Return the response from NexHealth
        return {
            statusCode: response.status,
            headers: {
                'Content-Type': response.headers['content-type'] || 'application/json',
                // Include other relevant headers from NexHealth response if needed
            },
            body: JSON.stringify(response.data),
        };

    } catch (error: any) {
        console.error("Error in NexHealth proxy function:", error.message);
        return {
            statusCode: error.response?.status || 500,
            body: JSON.stringify({
                error: "Failed to proxy request to NexHealth.",
                details: error.response?.data || error.message
            }),
        };
    }
};

export { handler };
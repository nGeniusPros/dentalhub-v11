// Environment-aware API URL configuration

// Base URL for NexHealth API
export const NEXHEALTH_API_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://api.yourdomain.com'  // Replace with your actual production domain
  : 'http://localhost:3001';

// Function to get the NexHealth API URL
export function getNexHealthApiUrl(endpoint: string, params?: Record<string, string | number>): string {
  const url = new URL(`${NEXHEALTH_API_BASE_URL}${endpoint}`);
  
  // Add query parameters if provided
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, String(value));
      }
    });
  }
  
  return url.toString();
}

// Function to handle NexHealth API requests
export async function fetchFromNexHealth<T>(
  endpoint: string, 
  options?: RequestInit,
  params?: Record<string, string | number>
): Promise<T> {
  const url = getNexHealthApiUrl(endpoint, params);
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });
    
    if (!response.ok) {
      throw new Error(`NexHealth API returned status ${response.status}`);
    }
    
    return await response.json() as T;
  } catch (error) {
    console.error(`Error fetching from NexHealth API (${endpoint}):`, error);
    throw error;
  }
}

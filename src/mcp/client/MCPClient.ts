import { useState } from 'react';
// Import protocol types - Not directly used here, but good for reference
// import { MCPRequest, MCPResponse } from '../protocol/types';

// Define the structure of the request body sent to the central MCP endpoint
interface MCPClientRequestBody {
  path: string; // The logical path the frontend wants to access (e.g., '/api/patients')
  method: string; // HTTP method
  headers?: Record<string, string>; // Optional headers
  body?: unknown; // Request body payload
  query?: Record<string, string>; // Query parameters
}

// Define the expected structure of the response from the central MCP endpoint
// This assumes the Netlify function wraps the gateway's MCPResponse
interface MCPClientResponseWrapper {
  status: number;
  headers: Record<string, string>;
  body: string | null; // The raw string body from MCPResponse
  error: { // The raw error object from MCPResponse
    code: string;
    message: string;
    details?: unknown;
  } | null;
}

// Define the hook's return type for better type safety
interface UseMCPRequestReturn<T> {
  data: T | null;
  loading: boolean;
  error: Error | null; // Represents client-side fetch errors or parsed MCP errors
  execute: (payload?: unknown, query?: Record<string, string>, headers?: Record<string, string>) => Promise<T | null>; // Make payload optional
}

/**
 * Custom hook to interact with the MCP Gateway endpoint.
 * @param path The logical API path (e.g., '/api/patients', '/api/appointments/123')
 * @param method The HTTP method (e.g., 'GET', 'POST')
 * @param initialData Optional initial state for the data
 * @returns {UseMCPRequestReturn<T>} Object containing data, loading state, error state, and execute function.
 */
export const useMCPRequest = <T = unknown>(
  path: string,
  method: string,
  initialData: T | null = null
): UseMCPRequestReturn<T> => {
  const [data, setData] = useState<T | null>(initialData);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  // The actual function to call the MCP Gateway endpoint
  const execute = async (
    payload?: unknown, // Body payload for POST, PUT, etc.
    query?: Record<string, string>, // Query params
    headers?: Record<string, string> // Custom request headers
  ): Promise<T | null> => {
    setLoading(true);
    setError(null); // Reset error on new execution

    const requestBody: MCPClientRequestBody = {
      path,
      method: method.toUpperCase(),
      headers: headers || {},
      body: payload,
      query: query || {},
    };

    try {
      // Assume the Netlify function endpoint is '/.netlify/functions/mcp' or similar
      // For local dev, might proxy via vite.config.ts or use a full URL
      const response = await fetch('/.netlify/functions/mcp', { // Use relative path for Netlify function
        method: 'POST', // The function itself is always POSTed to
        headers: {
          'Content-Type': 'application/json',
          ...requestBody.headers, // Include custom headers
        },
        body: JSON.stringify(requestBody), // Send the MCPRequest structure
      });

      if (!response.ok) {
        // Handle HTTP errors from the function itself (e.g., 500 from function crash)
        throw new Error(`MCP endpoint HTTP error! Status: ${response.status}`);
      }

      const result: MCPClientResponseWrapper = await response.json();

      // Check for MCP-level errors returned from the gateway
      if (result.error) {
        console.error('MCP Error:', result.error);
        throw new Error(`MCP Error [${result.error.code}]: ${result.error.message}`);
      }

      // Parse the body if it exists
      const responseData = result.body ? (JSON.parse(result.body) as T) : null;
      setData(responseData);
      return responseData;

    } catch (err) {
      console.error('useMCPRequest Error:', err);
      setError(err instanceof Error ? err : new Error(String(err)));
      // Don't re-throw here, let the caller check the error state
      return null; // Indicate failure
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, execute };
};
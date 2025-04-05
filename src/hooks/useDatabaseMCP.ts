import { useState } from 'react';

// Define the structure of the request body sent to the MCP endpoint
interface DatabaseMCPRequestBody {
  path: string;
  method: string;
  body?: unknown;
  query?: Record<string, string>;
}

// Define the expected structure of the response from the MCP endpoint
interface DatabaseMCPResponse<T> {
  status: number;
  headers: Record<string, string>;
  body: T | null;
  error: {
    code: string;
    message: string;
    details?: unknown;
  } | null;
}

// Define the hook's return type
interface UseDatabaseMCPReturn<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  execute: (
    tableName: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    options?: {
      id?: string;
      body?: unknown;
      query?: Record<string, string>;
    }
  ) => Promise<T | null>;
}

/**
 * Hook for interacting with the database MCP server
 * @returns Object with data, loading state, error, and execute function
 */
export function useDatabaseMCP<T = unknown>(): UseDatabaseMCPReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Execute a request to the database MCP server
   * @param tableName The table to interact with
   * @param method The HTTP method to use
   * @param options Optional parameters (id, body, query)
   * @returns The response data or null if an error occurred
   */
  const execute = async (
    tableName: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    options: {
      id?: string;
      body?: unknown;
      query?: Record<string, string>;
    } = {}
  ): Promise<T | null> => {
    setLoading(true);
    setError(null);

    try {
      // Construct the path based on whether an ID is provided
      const path = options.id
        ? `/api/database/${tableName}/${options.id}`
        : `/api/database/${tableName}`;

      // Prepare the request body
      const requestBody: DatabaseMCPRequestBody = {
        path,
        method,
        body: options.body,
        query: options.query,
      };

      // Make the request to the MCP endpoint
      const response = await fetch('/.netlify/functions/mcp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Parse the response
      const result: DatabaseMCPResponse<T> = await response.json();

      // Check for MCP error
      if (result.error) {
        throw new Error(
          `Database MCP error: ${result.error.code} - ${result.error.message}`
        );
      }

      // Set the data
      setData(result.body as T);
      return result.body as T;
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error(String(err));
      setError(errorObj);
      console.error('Database MCP error:', errorObj);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, execute };
}

// Export a simplified version for direct API calls without React state
export async function callDatabaseMCP<T = unknown>(
  tableName: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  options: {
    id?: string;
    body?: unknown;
    query?: Record<string, string>;
  } = {}
): Promise<T | null> {
  try {
    // Construct the path based on whether an ID is provided
    const path = options.id
      ? `/api/database/${tableName}/${options.id}`
      : `/api/database/${tableName}`;

    // Prepare the request body
    const requestBody: DatabaseMCPRequestBody = {
      path,
      method,
      body: options.body,
      query: options.query,
    };

    // Make the request to the MCP endpoint
    const response = await fetch('/.netlify/functions/mcp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // Parse the response
    const result: DatabaseMCPResponse<T> = await response.json();

    // Check for MCP error
    if (result.error) {
      throw new Error(
        `Database MCP error: ${result.error.code} - ${result.error.message}`
      );
    }

    return result.body as T;
  } catch (err) {
    console.error('Database MCP error:', err);
    return null;
  }
}

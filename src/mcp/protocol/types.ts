export interface MCPRequest {
  path: string;
  method: string;
  headers?: Record<string, string>;
  body?: unknown;
  query?: Record<string, string>;
}

export interface MCPError {
  code: string; // e.g., 'ROUTE_NOT_FOUND', 'SERVICE_UNAVAILABLE', 'INTERNAL_ERROR', 'ADAPTER_ERROR'
  message: string; // User-friendly message
  details?: unknown; // Optional additional details (e.g., validation errors, stack trace in dev)
}

export interface MCPResponse {
  status: number;
  headers: Record<string, string>;
  body: unknown; // Body can be any type of data
  error: MCPError | null; // Structured error information
}
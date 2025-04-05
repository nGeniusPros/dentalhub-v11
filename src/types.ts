export interface User {
  id: string;
  email?: string;
  role?: string;
  // Add other relevant user properties
}

export interface Session {
  token: string;
  // Add other session properties
}

export interface LoginResponse {
  user: User;
  session: Session;
}

export interface SessionResponse {
  user: User | null;
  session: Session | null;
}

export interface MCPRequest {
  path: string;
  method: string;
  headers?: Record<string, string>;
  body?: unknown;
  query?: Record<string, string>;
}

// Sidebar Menu Item Type
export interface MenuItemType {
  id: string;
  label: string;
  icon: string; // Assuming Icon component takes name as string
  path: string;
  group?: string; // Optional group for categorization
}

// Alias for MenuItemType for easier readability
export type MenuItem = MenuItemType;

export interface MCPResponse {
  status: number;
  headers: Record<string, string>;
  body: unknown;
  error: {
    code: string;
    message: string;
    details?: unknown;
  } | null;
}

export interface Adapter {
  handleRequest(request: MCPRequest): Promise<MCPResponse>;
}

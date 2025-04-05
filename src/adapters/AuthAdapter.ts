import { MCPRequest, MCPResponse } from '../protocol/types';
import { SupabaseClient } from '@supabase/supabase-js';
import { User } from '../types';

export class AuthAdapter {
  constructor(private supabase: SupabaseClient) {}

  async processRequest(request: MCPRequest): Promise<MCPResponse> {
    return this.handleRequest(request);
  }

  private async handleRequest(request: MCPRequest): Promise<MCPResponse> {
    try {
      switch (request.path) {
        case '/auth/login':
          return await this.handleLogin(request);
        case '/auth/logout':
          return await this.handleLogout(request);
        case '/auth/session':
          return await this.handleSession(request);
        default:
          return {
            status: 404,
            headers: {},
            body: null,
            error: {
              code: 'NOT_FOUND',
              message: `Endpoint ${request.path} not found in AuthAdapter`,
              details: null
            }
          };
      }
    } catch (error) {
      console.error('AuthAdapter error:', error);
      return {
        status: 500,
        headers: {},
        body: null,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An internal error occurred',
          details: error instanceof Error ? error.message : String(error)
        }
      };
    }
  }

  private async handleLogin(request: MCPRequest): Promise<MCPResponse> {
    const { email, password, role } = request.body as { email: string; password: string; role?: string };

    // Mock user for bypassing authentication
    const user: User = {
      id: 'mock-user-id',
      email: email || 'mock@example.com',
      role: role || 'user'
    };

    return {
      status: 200,
      headers: {},
      body: {
        user,
        session: { token: 'mock-token' }
      },
      error: null
    };
  }

  private async handleLogout(request: MCPRequest): Promise<MCPResponse> {
    // Supabase logout
    const { error } = await this.supabase.auth.signOut();
    if (error) {
      console.error('Supabase logout error:', error);
      // Still return success status as logout attempt was made
    }
    return {
      status: 200,
      headers: {},
      body: null,
      error: null,
    };
  }

  private async handleSession(request: MCPRequest): Promise<MCPResponse> {
    // Supabase session check
    const { data: { session }, error } = await this.supabase.auth.getSession();

    if (error) {
      console.error('Supabase session error:', error);
      return {
        status: 500,
        headers: {},
        body: null,
        error: {
          code: 'SESSION_ERROR',
          message: 'Error checking session',
          details: error.message,
        },
      };
    }

    if (!session) {
      return {
        status: 200, // Still 200 OK, but no session found
        headers: {},
        body: { user: null, session: null },
        error: null,
      };
    }

    // Fetch user details if needed, or use session.user if sufficient
    const user = session.user;
    const mappedUser: User = {
        id: user?.id || 'unknown',
        email: user?.email || 'no-email',
        role: user?.app_metadata?.role || 'user' // Adjust based on where roles are stored
    }


    return {
      status: 200,
      headers: {},
      body: {
        user: mappedUser,
        session: { token: session.access_token },
      },
      error: null,
    };
  }
}

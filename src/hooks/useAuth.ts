import { useState, useCallback, useEffect } from 'react';
import { useMCPRequest } from '@/mcp/client/MCPClient'; // Import the MCP hook

// Define the expected User structure based on your actual user data/session
// This should align with what your backend /auth/session endpoint returns
interface User {
  id: string;
  email?: string; // Email might be part of the session
  role?: string; // Role should definitely be part of the session/user data
  // Add other relevant user properties returned by your auth system
  // e.g., name, avatar_url, app_metadata, user_metadata
}

// Define the expected response structure for the /auth/login endpoint
interface LoginResponse {
  user: User;
  session: unknown; // Or a more specific session type if needed
}

// Define the expected response structure for the /auth/session endpoint
interface SessionResponse {
  user: User | null;
  session: unknown | null; // Or a more specific session type
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<unknown | null>(null); // Store session info if needed
  const [isInitialLoading, setIsInitialLoading] = useState(true); // For initial session check

  // MCP request hooks
  const { execute: mcpLogin, loading: loginLoading, error: loginError } = useMCPRequest<LoginResponse>('/auth/login', 'POST');
  const { execute: mcpLogout, loading: logoutLoading, error: logoutError } = useMCPRequest('/auth/logout', 'POST');
  const { execute: getSession, error: sessionError } = useMCPRequest<SessionResponse>('/auth/session', 'GET');

  // Function to check the current session state via MCP
  const checkSession = useCallback(async () => {
    setIsInitialLoading(true);
    try {
      const response = await getSession(); // Call the /auth/session endpoint
      if (response?.user) {
        setUser(response.user);
        setSession(response.session);
      } else {
        setUser(null);
        setSession(null);
        // Optionally handle sessionError here if needed
      }
    } catch (err) {
      // Should be caught by the hook's error state, but log just in case
      console.error("Error checking session:", err);
      setUser(null);
      setSession(null);
    } finally {
      setIsInitialLoading(false);
    }
  }, [getSession]);

  // Check session on initial mount
  useEffect(() => {
    checkSession();
  }, [checkSession]);

  // Login function using MCP
  const login = useCallback(async (email: string, password: string, role?: string) => {
    // Role might be determined by the backend based on email/password,
    // or you might pass it if your login endpoint requires it.
    const payload: Record<string, unknown> = { email, password };
    if (role) {
        payload.role = role;
    }
    const response = await mcpLogin(payload);

    if (response?.user) {
      setUser(response.user);
      setSession(response.session);
      return response.user; // Return user on successful login
    } else {
      // Error is handled by loginError state from the hook
      setUser(null);
      setSession(null);
      return null; // Indicate login failure
    }
  }, [mcpLogin]);

  // Logout function using MCP
  const logout = useCallback(async () => {
    await mcpLogout(); // Call the /auth/logout endpoint
    setUser(null);
    setSession(null);
    // The backend adapter for /auth/logout should handle clearing the Supabase session/cookie.
  }, [mcpLogout]);

  // Consolidate error states if desired, or keep separate
  const error = loginError || logoutError || sessionError;
  // Consolidate loading states if needed, or differentiate
  const loading = loginLoading || logoutLoading; // isInitialLoading handles initial check

  return {
    user,
    session, // Expose session if needed by components
    loading, // Loading state for login/logout actions
    error, // Combined error state
    login,
    logout,
    isLoading: isInitialLoading, // Loading state for the initial auth check
    checkSession, // Expose function to manually re-check session if needed
  };
};
import { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
// It's recommended to store these in environment variables
const supabaseUrl = process.env.SUPABASE_URL || 'YOUR_SUPABASE_URL';
const supabaseKey = process.env.SUPABASE_KEY || 'YOUR_SUPABASE_ANON_KEY';
const supabase = createClient(supabaseUrl, supabaseKey);

const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  const path = event.path.replace('/.netlify/functions/authAdapter', ''); // Normalize path

  // Ensure SUPABASE_URL and SUPABASE_KEY are set
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Supabase URL or Key not configured in environment variables.' }),
    };
  }


  try {
    // Login Endpoint
    if (path === '/login' && event.httpMethod === 'POST') {
      const { email, password } = JSON.parse(event.body || '{}');
      if (!email || !password) {
        return { statusCode: 400, body: JSON.stringify({ error: 'Email and password are required.' }) };
      }

      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        console.error('Login error:', error);
        return { statusCode: 401, body: JSON.stringify({ error: error.message }) };
      }
      if (!data.session) {
        return { statusCode: 401, body: JSON.stringify({ error: 'Login failed, no session returned.'}) };
      }

      // Return user and session info, potentially setting a cookie
      // Note: Netlify functions might require specific handling for setting cookies
      return {
        statusCode: 200,
        body: JSON.stringify({ user: data.user, session: data.session }),
        // Add cookie headers if needed, e.g., using 'multiValueHeaders'
        // 'multiValueHeaders': { 'Set-Cookie': ['your_cookie_here'] }
      };
    }

    // Logout Endpoint
    else if (path === '/logout' && event.httpMethod === 'POST') {
        // Extract token from Authorization header (Bearer token)
        const token = event.headers.authorization?.split(' ')[1];
        if (!token) {
            return { statusCode: 401, body: JSON.stringify({ error: 'Authorization token is required.' }) };
        }

        // Use the token to create a temporary Supabase client instance for the specific user
        const userSupabase = createClient(supabaseUrl, supabaseKey, {
            global: { headers: { Authorization: `Bearer ${token}` } },
        });

        const { error } = await userSupabase.auth.signOut();

        if (error) {
            console.error('Logout error:', error);
            // Even if Supabase returns an error, we might still want to proceed
            // with clearing the client-side state, so maybe return 200?
            // Or return the error if strict logout is required.
            return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
        }

      // Logout successful
      // Client-side should clear its stored token/session
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Logout successful.' }),
        // Add headers to clear cookies if applicable
      };
    }

    // Session Check Endpoint
    else if (path === '/session' && event.httpMethod === 'GET') {
       // Extract token from Authorization header (Bearer token)
        const token = event.headers.authorization?.split(' ')[1];
        if (!token) {
            // No token means no active session from the client's perspective
            return { statusCode: 200, body: JSON.stringify({ user: null, session: null }) };
        }

        try {
            // Use the token to get the user session
             const { data: { user }, error } = await supabase.auth.getUser(token);

            if (error) {
                 // This likely means the token is invalid or expired
                console.warn('Session check error:', error.message);
                 return { statusCode: 200, body: JSON.stringify({ user: null, session: null }) }; // Treat as logged out
            }

            if (user) {
                 // If user is found, fetch the full session (optional, getUser might be enough)
                 // For consistency, let's get the session too
                 const { data: { session }, error: sessionError } = await supabase.auth.getSession(); // This uses the main client, relying on cookie/storage? Needs check.
                 // A safer way might be just returning the user data if getUser succeeded.
                 // Let's adjust based on getUser success.

                 if (sessionError) {
                    console.error("Error fetching session:", sessionError.message);
                     // Handle appropriately, maybe return just the user?
                 }

                 // Let's return the user object obtained from getUser if successful
                return {
                    statusCode: 200,
                    body: JSON.stringify({ user: user, session: null }), // Adjust if you need full session details and can fetch them reliably
                };
            } else {
                // No user found for the token
                 return { statusCode: 200, body: JSON.stringify({ user: null, session: null }) };
            }
        } catch (catchError: any) {
             console.error('Unexpected error during session check:', catchError);
             return { statusCode: 500, body: JSON.stringify({ error: 'Internal server error during session check.' }) };
        }
    }

    // Default fallback for unhandled paths/methods
    else {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: `Not Found: ${event.httpMethod} ${path}` }),
      };
    }
  } catch (error: any) {
    console.error('Unhandled Function Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error', details: error.message }),
    };
  }
};

export { handler };

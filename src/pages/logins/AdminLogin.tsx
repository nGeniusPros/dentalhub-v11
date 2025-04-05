import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Icons } from '@/components/ui/Icons'; // Assuming Icons are imported correctly
import LoginNavigation from '@/components/logins/LoginNavigation'; // Assuming component path is correct
import { useAuth } from '@/hooks/useAuth'; // Assuming hook path is correct
// Removed direct Supabase import
import { useMCPRequest } from '@/mcp/client/MCPClient'; // Corrected path based on context

const AdminLogin = () => {
  const { isLoading: authLoading } = useAuth(); // Keep for initial auth state check
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [formError, setFormError] = useState<string | null>(null); // Renamed to avoid conflict

  // Use the MCP hook for the login request
  const {
    execute: login,
    loading: apiLoading,
    error: apiError } = useMCPRequest('/auth/login', 'POST'); // Provide path and method

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
    // Clear form error on change
    if (formError) setFormError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setFormError("Email and password are required.");
      return;
    }
    setFormError(null); // Clear previous form errors

    // Call execute with the request body
    const result = await login({
      email: formData.email,
      password: formData.password,
      role: 'admin' // Specify role if needed by the backend adapter
    });

    // After await, check the error state from the hook (apiError)
    // The hook sets the error state internally if the request fails
    // If result is null, it usually indicates an error occurred within the hook's execute function
    if (result === null) {
        // Error is handled by the hook's error state (apiError)
        // The error message will be displayed via the {apiError && ...} block in the JSX.
        return;
    }

    // If result is not null, the request was successful (and apiError is null)
    window.location.href = '/admin-dashboard';

    // No need for a try/catch here anymore, as the hook handles it internally
    // and exposes the error via the apiError state.
    // Note: The hook's 'loading' state (apiLoading) handles the loading indicator
  };

  // Display loading indicator based on initial auth check
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-navy" />
      </div>
    );
  }

  // Display loading indicator based on API request in progress
  if (apiLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-navy" />
        <p className="mt-4 text-gray-darker">Signing in...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-navy/5 via-white to-gray-lighter">
      <motion.div
        className="flex w-full max-w-4xl bg-white rounded-xl shadow-glow overflow-hidden mt-20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Illustration Section */}
        <div className="hidden md:flex md:w-1/2 bg-navy/10 items-center justify-center p-8">
          <img
            src="/illustrations/auth/v2-login-light-border.png"
            alt="Admin Login"
            className="max-w-full max-h-80 object-contain"
          />
        </div>

        {/* Form Section */}
        <div className="w-full md:w-1/2 p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-navy mb-2">Admin Login</h1>
            <p className="text-gray-darker">Welcome back! Please sign in to continue.</p>
          </div>

          {/* Display form validation errors or API errors */}
          {(formError || apiError) && (
            <div className="mb-4 p-3 bg-red-100 border border-red-200 text-red-500 rounded-lg">
              {formError || (apiError instanceof Error ? apiError.message : String(apiError)) || 'An error occurred'}
            </div>
          )}

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-darker mb-1">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Icons.Mail className="w-4.5 h-4.5 text-gray-dark" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full pl-10 p-3 border border-gray-light rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent"
                  disabled={apiLoading} // Disable input while loading
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-darker mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Icons.Lock className="w-4.5 h-4.5 text-gray-dark" />
                </div>
                <input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full pl-10 p-3 border border-gray-light rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent"
                  disabled={apiLoading} // Disable input while loading
                />
              </div>
            </div>

            <motion.button
              type="submit"
              className="w-full bg-navy text-white shadow hover:bg-navy-light p-3 rounded-lg flex justify-center items-center transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={apiLoading} // Disable button while loading
            >
              {apiLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
              ) : (
                'Sign In'
              )}
            </motion.button>
          </form>

          <LoginNavigation currentPage="admin" showForgotPassword={true} />
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
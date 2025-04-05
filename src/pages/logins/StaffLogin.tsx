import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Icons } from '@/components/ui/Icons'; // Assuming Icons are imported correctly
import LoginNavigation from '@/components/logins/LoginNavigation'; // Assuming component path is correct
import { useAuth } from '@/hooks/useAuth'; // Assuming hook path is correct
// Removed direct Supabase import
import { useMCPRequest } from '@/mcp/client/MCPClient'; // Import the hook

const StaffLogin = () => {
  const { loading: authLoading } = useAuth(); // Keep for initial auth state check
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [formError, setFormError] = useState<string | null>(null); // Renamed error state

  // Use the MCP hook for the staff login request
  const {
    execute: login,
    loading: apiLoading,
    error: apiError
  } = useMCPRequest('/auth/login', 'POST'); // Assuming MCP path and method for login

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
    if (formError) setFormError(null); // Clear error on change
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null); // Clear previous errors

    // Call execute with the login credentials and role
    const result = await login({
      email: formData.email,
      password: formData.password,
      role: 'staff' // Specify role for the backend adapter
    });

    // Check hook's error state after execution
    // If result is null, it indicates an error occurred within the hook
    if (result === null) {
      // Error message will be displayed via the {apiError && ...} block in the JSX.
      return;
    }

    // On successful login via MCP, navigation might be handled by AuthProvider
    // or ProtectedRoute as mentioned in the original PatientLogin comments.
    // If manual redirect is needed: window.location.href = '/staff-dashboard';
  };

  // Display loading indicator based on initial auth check
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple" />
      </div>
    );
  }

   // Display loading indicator based on API request in progress
   if (apiLoading) {
     return (
       <div className="min-h-screen flex items-center justify-center">
         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple" />
         <p className="mt-4 text-gray-darker">Signing in...</p>
       </div>
     );
   }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-purple/5 via-white to-gray-lighter">
      <motion.div
        className="flex w-full max-w-4xl bg-white rounded-xl shadow-glow overflow-hidden mt-20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Illustration Section */}
        <div className="hidden md:flex md:w-1/2 bg-purple/10 items-center justify-center p-8">
          <img
            src="/illustrations/auth/v2-login-light-border.png" // Consider updating illustration
            alt="Staff Login"
            className="max-w-full max-h-80 object-contain"
          />
        </div>

        {/* Form Section */}
        <div className="w-full md:w-1/2 p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-navy mb-2">Staff Login</h1>
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
                  className="w-full pl-10 p-3 border border-gray-light rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
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
                  className="w-full pl-10 p-3 border border-gray-light rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
                  disabled={apiLoading} // Disable input while loading
                />
              </div>
            </div>

            <motion.button
              type="submit"
              className="w-full bg-purple text-white shadow hover:bg-purple-light p-3 rounded-lg flex justify-center items-center transition-colors"
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

          <LoginNavigation currentPage="staff" showForgotPassword={true} />
        </div>
      </motion.div>
    </div>
  );
};

export default StaffLogin;
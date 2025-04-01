import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Icons } from '@/components/ui/Icons'; // Assuming Icons are imported correctly
import LoginNavigation from '@/components/logins/LoginNavigation'; // Assuming component path is correct
// Removed direct Supabase import
import { useMCPRequest } from '@/mcp/client/MCPClient'; // Import the hook

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' | null }>({
    text: '',
    type: null
  });

  // Use the MCP hook for the password reset request
  const {
    execute: requestPasswordReset,
    loading: apiLoading,
    error: apiError
  } = useMCPRequest('/auth/reset-password', 'POST'); // Assuming MCP path and method

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    // Clear message on change
    if (message.text) setMessage({ text: '', type: null });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setMessage({ text: "Email is required.", type: 'error' });
      return;
    }

    setMessage({ text: '', type: null }); // Clear previous messages

    // Call execute with the email in the body
    const result = await requestPasswordReset({
      email: email,
      // The redirectTo logic might need to be handled by the backend adapter now,
      // or passed in the body if the adapter supports it.
      // For simplicity, assuming the backend knows the redirect URL or it's configured there.
      // redirectTo: window.location.origin + '/reset-password', // This might be passed if needed
    });

    // Check hook's error state after execution
    if (apiError) {
      setMessage({
        text: apiError instanceof Error ? apiError.message : 'An error occurred sending reset instructions',
        type: 'error'
      });
    } else if (result !== null) { // Check if execute succeeded (result is not null)
      setMessage({
        text: "Password reset instructions sent to your email.",
        type: 'success'
      });
      setEmail(''); // Clear email field on success
    } else {
       // Handle cases where result is null but apiError wasn't set (should be rare)
       setMessage({
        text: 'An unexpected issue occurred.',
        type: 'error'
      });
    }
    // Loading state is handled by apiLoading from the hook
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-gold/5 via-white to-gray-lighter">
      <motion.div
        className="flex w-full max-w-4xl bg-white rounded-xl shadow-glow overflow-hidden mt-20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Illustration Section */}
        <div className="hidden md:flex md:w-1/2 bg-gold/10 items-center justify-center p-8">
          <img
            src="/illustrations/auth/v2-login-light-border.png" // Consider updating illustration if needed
            alt="Forgot Password"
            className="max-w-full max-h-80 object-contain"
          />
        </div>

        {/* Form Section */}
        <div className="w-full md:w-1/2 p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-navy mb-2">Forgot Password</h1>
            <p className="text-gray-darker">Enter your email to receive password reset instructions</p>
          </div>

          {/* Display API errors or success messages */}
          {message.text && (
            <div className={`mb-4 p-3 rounded-lg ${
              message.type === 'error'
                ? 'bg-red-100 border border-red-200 text-red-500'
                : 'bg-green-100 border border-green-200 text-green-600'
            }`}>
              {message.text}
            </div>
          )}

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-darker mb-1">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Icons.Mail size={18} className="text-gray-dark" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full pl-10 p-3 border border-gray-light rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                  disabled={apiLoading} // Disable input while loading
                />
              </div>
            </div>

            <motion.button
              type="submit"
              className="w-full bg-gold text-navy shadow hover:bg-gold-light p-3 rounded-lg flex justify-center items-center transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={apiLoading} // Disable button while loading
            >
              {apiLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-navy" />
              ) : (
                'Send Reset Instructions'
              )}
            </motion.button>
          </form>

          <LoginNavigation currentPage="forgot-password" showForgotPassword={false} />
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
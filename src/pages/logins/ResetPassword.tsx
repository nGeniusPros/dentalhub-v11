import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Assuming react-router-dom is installed
import { motion } from 'framer-motion';
import { Icons } from '@/components/ui/Icons'; // Assuming Icons are imported correctly
// Removed direct Supabase import
import { useMCPRequest } from '@/mcp/client/MCPClient'; // Import the hook

const ResetPassword = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' | null }>({
    text: '',
    type: null
  });

  // Use the MCP hook for the password update request
  const {
    execute: updatePassword,
    loading: apiLoading,
    error: apiError
  } = useMCPRequest('/auth/update-password', 'POST'); // Assuming MCP path and method

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
    // Clear message on change
    if (message.text) setMessage({ text: '', type: null });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setMessage({ text: "Passwords do not match.", type: 'error' });
      return;
    }

    if (formData.password.length < 6) {
      setMessage({ text: "Password must be at least 6 characters long.", type: 'error' });
      return;
    }

    setMessage({ text: '', type: null }); // Clear previous messages

    // Call execute with the new password
    // The backend adapter needs to handle associating this request with the logged-in user
    // (likely via the auth token automatically handled by Supabase/MCP setup)
    const result = await updatePassword({
      password: formData.password,
    });

    // Check hook's error state after execution
    if (apiError) {
      setMessage({
        text: apiError instanceof Error ? apiError.message : 'An error occurred resetting the password',
        type: 'error'
      });
    } else if (result !== null) { // Check if execute succeeded
      setMessage({
        text: "Password has been reset successfully!",
        type: 'success'
      });

      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login'); // Or '/logins' if that's the main login route
      }, 2000);
    } else {
       // Handle cases where result is null but apiError wasn't set
       setMessage({
        text: 'An unexpected issue occurred while resetting the password.',
        type: 'error'
      });
    }
    // Loading state is handled by apiLoading
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-green/5 via-white to-gray-lighter">
      <motion.div
        className="flex w-full max-w-4xl bg-white rounded-xl shadow-glow overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Illustration Section */}
        <div className="hidden md:flex md:w-1/2 bg-green/10 items-center justify-center p-8">
          <img
            src="/illustrations/auth/v2-reset-password-light-border.png" // Illustration seems appropriate
            alt="Reset Password"
            className="max-w-full max-h-80 object-contain"
          />
        </div>

        {/* Form Section */}
        <div className="w-full md:w-1/2 p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-navy mb-2">Reset Password</h1>
            <p className="text-gray-darker">Enter your new password</p>
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
              <label htmlFor="password" className="block text-sm font-medium text-gray-darker mb-1">
                New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Icons.Lock size={18} className="text-gray-dark" />
                </div>
                <input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter new password"
                  className="w-full pl-10 p-3 border border-gray-light rounded-lg focus:ring-2 focus:ring-green focus:border-transparent"
                  disabled={apiLoading}
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-darker mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Icons.ShieldCheck size={18} className="text-gray-dark" />
                </div>
                <input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm new password"
                  className="w-full pl-10 p-3 border border-gray-light rounded-lg focus:ring-2 focus:ring-green focus:border-transparent"
                  disabled={apiLoading}
                />
              </div>
            </div>

            <motion.button
              type="submit"
              className="w-full bg-green text-white shadow hover:bg-green-light p-3 rounded-lg flex justify-center items-center transition-colors mt-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={apiLoading}
            >
              {apiLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
              ) : (
                'Reset Password'
              )}
            </motion.button>

            <div className="mt-4 text-center">
              <Link to="/login" className="text-green hover:text-green-light flex items-center justify-center gap-1">
                <Icons.ArrowLeft size={16} />
                <span>Back to Login</span>
              </Link>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
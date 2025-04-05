import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Assuming react-router-dom is installed
import { motion } from 'framer-motion';
// import { v4 as uuidv4 } from 'uuid'; // Removed as ID generation is handled by backend
import { Icons } from '@/components/ui/Icons'; // Assuming Icons are imported correctly
import LoginNavigation from '@/components/logins/LoginNavigation'; // Assuming component path is correct
// Removed direct locationApi import
import { useMCPRequest } from '@/mcp/client/MCPClient'; // Import the hook

const NewLocation: React.FC = () => {
  const navigate = useNavigate();
  const [formError, setFormError] = useState(''); // Renamed error state

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    contactPhone: '',
    contact_email: '' // Keep original casing if backend expects it
  });

  // Use the MCP hook for creating a location
  const {
    execute: createLocation,
    loading: apiLoading,
    error: apiError
  } = useMCPRequest('/locations', 'POST'); // Assuming MCP path and method for locations

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formError) setFormError(''); // Clear error on change
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(''); // Clear previous errors

    // Format the data to match the expected MCP payload
    // Assuming the backend adapter for /locations expects this structure
    const locationData = {
      // id: uuidv4(), // The backend adapter should handle ID generation
      name: formData.name,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      postal_code: formData.postalCode, // Ensure casing matches backend expectation
      contact_phone: formData.contactPhone, // Ensure casing matches backend expectation
      contact_email: formData.contact_email // Ensure casing matches backend expectation
    };

    // Call execute with the location data
    const result = await createLocation(locationData);

    // Check hook's error state after execution
    if (apiError) {
      console.error('Error creating location via MCP:', apiError);
      setFormError(apiError instanceof Error ? apiError.message : 'Failed to create location. Please try again.');
    } else if (result !== null) { // Check if execute succeeded
      // Navigate to admin login after successful creation
      navigate('/login/admin'); // Or '/logins/admin' if that's the correct route
    } else {
      // Handle cases where result is null but apiError wasn't set
      setFormError('An unexpected issue occurred while creating the location.');
    }
    // Loading state is handled by apiLoading
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-green/5 via-white to-gray-lighter">
      <motion.div
        className="flex w-full max-w-4xl bg-white rounded-xl shadow-glow overflow-hidden mt-20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Illustration Section */}
        <div className="hidden md:flex md:w-1/2 bg-green/10 items-center justify-center p-8">
          <img
            src="/illustrations/auth/v2-login-light-border.png" // Consider updating illustration
            alt="New Location Setup"
            className="max-w-full max-h-80 object-contain"
          />
        </div>

        {/* Form Section */}
        <div className="w-full md:w-1/2 p-8">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Create New Location</h1>
            <p className="text-gray-darker">Add your practice location details below</p>
          </div>

          {/* Display API errors */}
          {(formError || apiError) && (
            <div className="mb-4 p-3 bg-red-100 border border-red-200 text-red-500 rounded-lg">
              {formError || (apiError instanceof Error ? apiError.message : String(apiError))}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Practice Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Practice Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Icons.Building className="w-4.5 h-4.5 text-gray-dark" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="pl-10 block w-full border border-gray-light rounded-lg focus:ring-2 focus:ring-green focus:border-transparent p-3"
                  placeholder="Smile Dental Care"
                  disabled={apiLoading}
                />
              </div>
            </div>

            {/* Street Address */}
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                Street Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Icons.MapPin className="w-4.5 h-4.5 text-gray-dark" />
                </div>
                <input
                  id="address"
                  name="address"
                  type="text"
                  required
                  value={formData.address}
                  onChange={handleChange}
                  className="pl-10 block w-full border border-gray-light rounded-lg focus:ring-2 focus:ring-green focus:border-transparent p-3"
                  placeholder="123 Main Street"
                  disabled={apiLoading}
                />
              </div>
            </div>

            {/* City & State */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Icons.Home className="w-4.5 h-4.5 text-gray-dark" />
                  </div>
                  <input
                    id="city"
                    name="city"
                    type="text"
                    required
                    value={formData.city}
                    onChange={handleChange}
                    className="pl-10 block w-full border border-gray-light rounded-lg focus:ring-2 focus:ring-green focus:border-transparent p-3"
                    placeholder="San Francisco"
                    disabled={apiLoading}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                  State
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Icons.Map className="w-4.5 h-4.5 text-gray-dark" />
                  </div>
                  <input
                    id="state"
                    name="state"
                    type="text"
                    required
                    value={formData.state}
                    onChange={handleChange}
                    className="pl-10 block w-full border border-gray-light rounded-lg focus:ring-2 focus:ring-green focus:border-transparent p-3"
                    placeholder="CA"
                    disabled={apiLoading}
                  />
                </div>
              </div>
            </div>

            {/* Postal Code */}
            <div>
              <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">
                Postal Code
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Icons.MapPin className="w-4.5 h-4.5 text-gray-dark" />
                </div>
                <input
                  id="postalCode"
                  name="postalCode"
                  type="text"
                  required
                  value={formData.postalCode}
                  onChange={handleChange}
                  className="pl-10 block w-full border border-gray-light rounded-lg focus:ring-2 focus:ring-green focus:border-transparent p-3"
                  placeholder="94103"
                  disabled={apiLoading}
                />
              </div>
            </div>

            {/* Contact Phone */}
            <div>
              <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700 mb-1">
                Contact Phone
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Icons.Phone className="w-4.5 h-4.5 text-gray-dark" />
                </div>
                <input
                  id="contactPhone"
                  name="contactPhone"
                  type="tel"
                  required
                  value={formData.contactPhone}
                  onChange={handleChange}
                  className="pl-10 block w-full border border-gray-light rounded-lg focus:ring-2 focus:ring-green focus:border-transparent p-3"
                  placeholder="555-123-4567"
                  disabled={apiLoading}
                />
              </div>
            </div>

            {/* Contact Email */}
            <div>
              <label htmlFor="contact_email" className="block text-sm font-medium text-gray-700 mb-1">
                Contact Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Icons.Mail className="w-4.5 h-4.5 text-gray-dark" />
                </div>
                <input
                  id="contact_email"
                  name="contact_email"
                  type="email"
                  value={formData.contact_email}
                  onChange={handleChange}
                  className="pl-10 block w-full border border-gray-light rounded-lg focus:ring-2 focus:ring-green focus:border-transparent p-3"
                  placeholder="admin@yourpractice.com"
                  disabled={apiLoading}
                />
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              className="w-full bg-green text-white shadow hover:bg-green-dark p-3 rounded-lg flex justify-center items-center transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={apiLoading}
            >
              {apiLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
              ) : (
                'Create Location'
              )}
            </motion.button>
          </form>

          <LoginNavigation currentPage="new-location" showForgotPassword={false} />
        </div>
      </motion.div>
    </div>
  );
};

export default NewLocation;
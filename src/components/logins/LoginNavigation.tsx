import React from 'react';
import { Link } from 'react-router-dom'; // Assuming react-router-dom is installed
import { Icons } from '@/components/ui/Icons'; // Import the Icons component

interface LoginNavigationProps {
  showForgotPassword?: boolean;
  currentPage?: 'admin' | 'staff' | 'patient' | 'new-location' | 'forgot-password';
}

const LoginNavigation: React.FC<LoginNavigationProps> = ({
  showForgotPassword = false,
  currentPage = 'admin'
}) => {
  return (
    <div className="mt-6">
      {/* Header for all login pages - Removed as it's likely handled by a layout component */}
      {/* <div className="fixed top-0 left-0 right-0 px-6 py-4 flex justify-between items-center bg-white/80 backdrop-blur-sm z-10">
        <div className="text-lg font-bold text-navy">nGenius Pros</div>
        <Link to="/" className="p-2 rounded-full hover:bg-gray-100">
          <Icons.ArrowLeft className="w-5 h-5 text-gray-700" />
        </Link>
      </div> */}

      {showForgotPassword && (
        <div className="flex justify-end mb-2">
          <Link to="/login/forgot-password" className="text-sm text-gold hover:text-gold-light">
            Forgot password?
          </Link>
        </div>
      )}

      {/* Divider line */}
      <div className="relative mt-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">
            Or go back to
          </span>
        </div>
      </div>

      {/* Login navigation pills */}
      <div className="mt-4 flex justify-center">
        <div className="inline-flex bg-gray-50 rounded-lg p-1">
          <Link
            to="/login/admin" // Assuming route is /login/admin, adjust if needed
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
              currentPage === 'admin'
                ? 'bg-white text-navy shadow-sm'
                : 'text-navy hover:bg-white hover:shadow-sm'
            }`}
          >
            Admin Login
          </Link>
          <Link
            to="/login/staff" // Assuming route is /login/staff, adjust if needed
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
              currentPage === 'staff'
                ? 'bg-white text-purple shadow-sm'
                : 'text-purple hover:bg-white hover:shadow-sm'
            }`}
          >
            Staff Login
          </Link>
          <Link
            to="/login/patient" // Assuming route is /login/patient, adjust if needed
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
              currentPage === 'patient'
                ? 'bg-white text-turquoise shadow-sm'
                : 'text-turquoise hover:bg-white hover:shadow-sm'
            }`}
          >
            Patient Login
          </Link>
        </div>
      </div>

      {/* New location link */}
      {currentPage !== 'new-location' && (
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-darker mb-2">Need to set up a new location?</p>
          <Link
            to="/login/new-location" // Assuming route is /login/new-location, adjust if needed
            className="text-sm font-medium text-green hover:text-green-dark inline-flex items-center border border-green rounded-lg px-3 py-1"
          >
            {/* Assuming PlusCircle icon exists in Icons */}
            <Icons.Building className="mr-1 w-4 h-4" /> Add New Location
          </Link>
        </div>
      )}
    </div>
  );
};

export default LoginNavigation;
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { Icons } from '../ui/Icons';

const Header: React.FC = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Mock user data - in a real app, this would come from a context or hook
  const user = {
    name: 'John Doe',
    avatar: null, // URL to avatar image if available
    role: 'staff'
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      // Focus the search input when opened
      setTimeout(() => {
        const searchInput = document.getElementById('search-input');
        if (searchInput) searchInput.focus();
      }, 100);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search functionality
    console.log('Searching for:', searchQuery);
    // Reset search
    setSearchQuery('');
    setIsSearchOpen(false);
  };

  return (
    <header className="h-20 border-b border-gray-200 bg-white shadow-sm">
      <div className="flex h-full items-center justify-between px-6">
        {/* Left section - Title/Breadcrumbs */}
        <div className="flex items-center">
          <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>
          {/* Breadcrumbs can be added here */}
        </div>

        {/* Right section - Search, Notifications, Settings */}
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative">
            {isSearchOpen ? (
              <motion.form
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 250, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                className="relative"
                onSubmit={handleSearchSubmit}
              >
                <input
                  id="search-input"
                  type="text"
                  placeholder="Search..."
                  className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
                <button
                  type="submit"
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  <Icons.Search className="h-5 w-5" />
                </button>
              </motion.form>
            ) : (
              <button
                onClick={toggleSearch}
                className="rounded-full p-2 text-gray-500 hover:bg-gray-100"
                aria-label="Search"
              >
                <Icons.Search className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* Notifications */}
          <button
            className="relative rounded-full p-2 text-gray-500 hover:bg-gray-100"
            aria-label="Notifications"
          >
            <Icons.Bell className="h-5 w-5" />
            {/* Notification badge */}
            <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
              3
            </span>
          </button>

          {/* Settings */}
          <button
            className="rounded-full p-2 text-gray-500 hover:bg-gray-100"
            aria-label="Settings"
          >
            <Icons.Settings className="h-5 w-5" />
          </button>

          {/* User Profile */}
          <div className="flex items-center space-x-3">
            <div className="hidden text-right md:block">
              <p className="text-sm font-medium text-gray-700">{user.name}</p>
              <p className="text-xs text-gray-500 capitalize">{user.role}</p>
            </div>
            <div className="h-10 w-10 overflow-hidden rounded-full bg-gray-200">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-blue-500 text-white">
                  {user.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

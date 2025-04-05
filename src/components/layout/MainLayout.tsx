import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Sidebar from './Sidebar';
import AdminSidebar from './AdminSidebar';
import Header from './Header';
import { EmailProvider } from '../../contexts/EmailContext';
import { SettingsProvider } from '../../contexts/SettingsContext';

interface MainLayoutProps {
  children: React.ReactNode;
  role?: "admin" | "staff" | "patient";
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, role = "staff" }) => {
  // Track sidebar collapsed state
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Function to handle sidebar collapse state changes
  const handleSidebarCollapse = (collapsed: boolean) => {
    setIsSidebarCollapsed(collapsed);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {role === "admin" ?
        <AdminSidebar onCollapsedChange={handleSidebarCollapse} /> :
        <Sidebar role={role} onCollapsedChange={handleSidebarCollapse} />
      }

      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${isSidebarCollapsed ? 'ml-20' : 'ml-64'}`}
      >
        <Header />
        <SettingsProvider>
          <EmailProvider>
            <main className="flex-1 overflow-auto p-8 bg-white">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {children}
              </motion.div>
            </main>
          </EmailProvider>
        </SettingsProvider>
      </div>
    </div>
  );
};

export default MainLayout;
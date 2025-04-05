import React from 'react';
import AdminSidebar from '../../components/layout/AdminSidebar';

const SidebarTest = () => {
  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <div className="flex-1 p-8 ml-64">
        <h1 className="text-2xl font-bold mb-4">Sidebar Test Page</h1>
        <p className="text-gray-600">
          This page is used to test the AdminSidebar component directly.
        </p>
      </div>
    </div>
  );
};

export default SidebarTest;

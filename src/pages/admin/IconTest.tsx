import React from 'react';
import { Icon } from '../../components/ui/icon-strategy';

const IconTest = () => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Icon Test Page</h1>
      <div className="grid grid-cols-4 gap-4">
        <div className="flex flex-col items-center p-4 border rounded">
          <Icon name="LayoutDashboard" className="w-8 h-8 text-blue-500" />
          <span className="mt-2">LayoutDashboard</span>
        </div>
        <div className="flex flex-col items-center p-4 border rounded">
          <Icon name="Calendar" className="w-8 h-8 text-green-500" />
          <span className="mt-2">Calendar</span>
        </div>
        <div className="flex flex-col items-center p-4 border rounded">
          <Icon name="Users" className="w-8 h-8 text-purple-500" />
          <span className="mt-2">Users</span>
        </div>
        <div className="flex flex-col items-center p-4 border rounded">
          <Icon name="Settings" className="w-8 h-8 text-gray-500" />
          <span className="mt-2">Settings</span>
        </div>
        <div className="flex flex-col items-center p-4 border rounded">
          <Icon name="Atom" className="w-8 h-8 text-red-500 animate-spin-slow" />
          <span className="mt-2">Atom</span>
        </div>
      </div>
    </div>
  );
};

export default IconTest;

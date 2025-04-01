import React from 'react';

const Sidebar: React.FC = () => {
  return (
    <div className="bg-gray-200 w-64 h-full">
      <nav>
        <ul>
          <li>
            <a href="/dashboard">Dashboard</a>
          </li>
          <li>
            <a href="/patients">Patients</a>
          </li>
          <li>
            <a href="/appointments">Appointments</a>
          </li>
          <li>
            <a href="/billing">Billing</a>
          </li>
          <li>
            <a href="/settings">Settings</a>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
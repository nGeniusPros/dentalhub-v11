import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { Icon } from '../ui/icon-strategy';
import { cn } from '../../lib/utils';

// Define menu items based on the new screenshot
const quickAccessItems = [
  { id: '1', label: 'Practice Revenue', icon: 'DollarSign', path: '/dashboard/revenue-dashboard' },
  { id: '2', label: 'Monthly Revenue Report', icon: 'BarChart2', path: '/dashboard/monthly-report' },
  { id: '3', label: 'Active Patients', icon: 'Users', path: '/dashboard/active-patients' },
  { id: '4', label: 'Treatment Plan Success', icon: 'CheckCircle', path: '/dashboard/treatment-success' },
  { id: '5', label: 'Patient Satisfaction', icon: 'Star', path: '/dashboard/patient-satisfaction' },
  { id: '6', label: 'Daily Huddle KPI\'s', icon: 'Calendar', path: '/dashboard/daily-huddle' },
];

const practiceAcceleratorsItems = [
  { id: '7', label: 'Dashboard', icon: 'LayoutDashboard', path: '/dashboard' },
  { id: '8', label: 'AI Consultant', icon: 'Brain', path: '/ai-agents' },
  { id: '9', label: 'Patients', icon: 'Users', path: '/patients' },
  { id: '10', label: 'Appointments', icon: 'Calendar', path: '/appointments' },
  { id: '11', label: 'Staff', icon: 'UserCog', path: '/staff' },
  { id: '12', label: 'HR', icon: 'Building2', path: '/hr' },
  { id: '13', label: 'Membership Plans', icon: 'CreditCard', path: '/memberships' },
];

const marketingItems = [
  { id: '14', label: 'All Pipeline', icon: 'PieChart', path: '/communications/pipeline' },
  { id: '15', label: 'All Conversations', icon: 'MessageSquare', path: '/communications/conversations' },
  { id: '16', label: 'All Prospects', icon: 'UserPlus', path: '/communications/prospects' },
  { id: '17', label: 'All Campaigns', icon: 'Megaphone', path: '/communications/campaigns' },
  { id: '18', label: 'SMS Campaigns', icon: 'MessageSquare', path: '/communications/sms-campaigns' },
  { id: '19', label: 'Email Dashboard', icon: 'Mail', path: '/communications/email-dashboard' },
  { id: '20', label: 'Voice Campaigns', icon: 'Phone', path: '/communications/voice-campaigns' },
  { id: '21', label: 'Social Media', icon: 'Globe', path: '/communications/social-media' },
];

const resourcesItems = [
  { id: '22', label: 'Contact Manager', icon: 'ContactIcon', path: '/settings/contact-manager' },
  { id: '23', label: 'Knowledge Base', icon: 'BookOpen', path: '/resources/knowledge-base' },
  { id: '24', label: 'Learning', icon: 'GraduationCap', path: '/learning' },
  { id: '25', label: 'Marketplace', icon: 'ShoppingBag', path: '/resources/marketplace' },
  { id: '26', label: 'Claims', icon: 'FileCheck', path: '/settings/claims' },
];

const systemItems = [
  { id: '27', label: 'AI Feedback', icon: 'MessageCircle', path: '/settings/ai-feedback' },
  { id: '28', label: 'AI Analytics', icon: 'BarChart2', path: '/settings/ai-analytics' },
  { id: '29', label: 'Settings', icon: 'Settings', path: '/settings' },
];

interface AdminSidebarProps {
  onCollapsedChange?: (collapsed: boolean) => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ onCollapsedChange }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Function to render a menu section
  const renderMenuSection = (title: string, items: any[]) => (
    <div className="mb-6">
      <h3 className="uppercase text-xs font-semibold text-gray-500 mb-2 px-4 tracking-wider">{title}</h3>
      <ul className="space-y-1">
        {items.map((item) => (
          <li key={item.id}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-4 py-2 text-sm",
                  isActive
                    ? "bg-blue-50 text-blue-700 font-medium"
                    : "text-gray-700 hover:text-blue-600 hover:bg-gray-100"
                )
              }
            >
              <Icon name={item.icon} className="w-5 h-5" />
              <span>{item.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div
      className={cn(
        "fixed left-0 top-0 h-screen",
        "bg-white", // White background to match screenshot
        "border-r border-gray-200",
        "flex flex-col",
        "shadow-md",
        "transition-all duration-300 ease-in-out z-50",
        isCollapsed ? "w-20" : "w-64 max-w-[16rem]"
      )}
    >
      {/* Logo */}
      <div className="flex items-center h-16 px-4 border-b border-gray-200">
        <div className="text-gray-800 font-bold text-xl">nGenius Dental Hub</div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        {renderMenuSection('QUICK ACCESS', quickAccessItems)}
        {renderMenuSection('PRACTICE ACCELERATORS', practiceAcceleratorsItems)}
        {renderMenuSection('MARKETING', marketingItems)}
        {renderMenuSection('RESOURCES', resourcesItems)}
        {renderMenuSection('SYSTEM', systemItems)}
      </nav>

      {/* Collapse button */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={() => {
            const newCollapsedState = !isCollapsed;
            setIsCollapsed(newCollapsedState);
            if (onCollapsedChange) {
              onCollapsedChange(newCollapsedState);
            }
          }}
          className="w-full flex items-center justify-center gap-2 p-2 text-gray-500 hover:text-blue-600 rounded-md hover:bg-gray-100"
        >
          <Icon name={isCollapsed ? "ChevronRight" : "ChevronLeft"} className="w-5 h-5" />
          {!isCollapsed && <span className="text-sm">Collapse</span>}
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;

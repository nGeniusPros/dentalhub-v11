import { MenuItemType } from '../types'; // Assuming types.ts is in src/

// Define a structure that includes the group directly with the item
export interface NavItemWithGroup extends MenuItemType {
  group: string;
}

// Main navigation items based on the requested structure

// Staff Items (default role)
const staffMenuItems: NavItemWithGroup[] = [
  // Quick Access
  { id: 'quick-1', label: 'Dashboard', icon: 'LayoutDashboard', path: '/dashboard', group: 'Quick Access' },
  { id: 'quick-2', label: 'Revenue Dashboard', icon: 'LineChart', path: '/dashboard/revenue-dashboard', group: 'Quick Access' },
  { id: 'quick-3', label: 'Monthly Report', icon: 'CalendarDays', path: '/dashboard/monthly-report', group: 'Quick Access' },
  { id: 'quick-4', label: 'Active Patients', icon: 'Users', path: '/dashboard/active-patients', group: 'Quick Access' },
  { id: 'quick-5', label: 'Treatment Success', icon: 'CheckCircle', path: '/dashboard/treatment-success', group: 'Quick Access' },
  { id: 'quick-6', label: 'Patient Satisfaction', icon: 'ThumbsUp', path: '/dashboard/patient-satisfaction', group: 'Quick Access' },
  { id: 'quick-7', label: 'Daily Huddle', icon: 'Users2', path: '/dashboard/daily-huddle', group: 'Quick Access' },

  // Practice Accelerators
  { id: 'accel-1', label: 'Dashboard', icon: 'LayoutDashboard', path: '/dashboard', group: 'Practice Accelerators' },
  { id: 'accel-2', label: 'AI Consultant', icon: 'Brain', path: '/ai-agents', group: 'Practice Accelerators' },
  { id: 'accel-3', label: 'Patients', icon: 'Users', path: '/patients', group: 'Practice Accelerators' },
  { id: 'accel-4', label: 'Appointments', icon: 'Calendar', path: '/appointments', group: 'Practice Accelerators' },
  { id: 'accel-5', label: 'Staff', icon: 'UserCog', path: '/staff', group: 'Practice Accelerators' },
  { id: 'accel-6', label: 'HR', icon: 'Building2', path: '/hr', group: 'Practice Accelerators' },
  { id: 'accel-7', label: 'Membership Plans', icon: 'Crown', path: '/memberships', group: 'Practice Accelerators' },

  // Marketing
  { id: 'comm-1', label: 'All Pipeline', icon: 'PipelineIcon', path: '/communications/pipeline', group: 'Marketing' },
  { id: 'comm-2', label: 'All Conversations', icon: 'MessageCircle', path: '/communications/conversations', group: 'Marketing' },
  { id: 'comm-3', label: 'All Prospects', icon: 'UserPlus', path: '/communications/prospects', group: 'Marketing' },
  { id: 'comm-4', label: 'All Campaigns', icon: 'Megaphone', path: '/communications/campaigns', group: 'Marketing' },
  { id: 'comm-5', label: 'SMS Campaigns', icon: 'MessageSquare', path: '/communications/sms-campaigns', group: 'Marketing' },
  { id: 'comm-6', label: 'Email Dashboard', icon: 'Mail', path: '/communications/email-dashboard', group: 'Marketing' },
  { id: 'comm-7', label: 'Voice Campaigns', icon: 'Phone', path: '/communications/voice-campaigns', group: 'Marketing' },
  { id: 'comm-8', label: 'Social Media', icon: 'Share2', path: '/communications/social-media', group: 'Marketing' },

  // Resources
  { id: 'res-1', label: 'Resources', icon: 'BookOpen', path: '/resources', group: 'Resources' },
  { id: 'res-2', label: 'Knowledge Base', icon: 'BookMarked', path: '/resources/knowledge-base', group: 'Resources' },
  { id: 'res-3', label: 'Learning', icon: 'GraduationCap', path: '/learning', group: 'Resources' },
  { id: 'res-4', label: 'Marketplace', icon: 'Store', path: '/resources/marketplace', group: 'Resources' },

  // System
  { id: 'sys-1', label: 'AI Feedback', icon: 'BrainCircuit', path: '/settings/ai-feedback', group: 'System' },
  { id: 'sys-2', label: 'AI Analytics', icon: 'BarChart2', path: '/settings/ai-analytics', group: 'System' },
  { id: 'sys-3', label: 'Contact Manager', icon: 'AddressBook', path: '/settings/contact-manager', group: 'System' },
  { id: 'sys-4', label: 'Claims', icon: 'FileCheck', path: '/settings/claims', group: 'System' },
  { id: 'sys-5', label: 'Settings', icon: 'Settings', path: '/settings', group: 'System' },
];

// Admin Items (similar to staff but with admin paths)
const adminMenuItems: NavItemWithGroup[] = staffMenuItems.map(item => ({
  ...item,
  id: item.id.replace('staff', 'admin'),
  // Keep the same paths as staff for now
}));

// Patient Items (simplified version)
const patientMenuItems: NavItemWithGroup[] = [
  { id: 'patient-1', label: 'Dashboard', icon: 'LayoutDashboard', path: '/patient-dashboard', group: 'Main' },
  { id: 'patient-2', label: 'Appointments', icon: 'CalendarCheck', path: '/patient-dashboard/appointments', group: 'Main' },
  { id: 'patient-3', label: 'Membership', icon: 'Crown', path: '/patient-dashboard/membership', group: 'Main' },
  { id: 'patient-4', label: 'Documents', icon: 'FileText', path: '/patient-dashboard/documents', group: 'Records' },
  { id: 'patient-5', label: 'Billing', icon: 'CreditCard', path: '/patient-dashboard/billing', group: 'Records' },
  { id: 'patient-6', label: 'Messages', icon: 'MessageSquare', path: '/patient-dashboard/messages', group: 'Communication' },
  { id: 'patient-7', label: 'Settings', icon: 'Settings', path: '/patient-dashboard/settings', group: 'Communication' },
];

// Function to get menu items based on role
export const getMenuItemsByRole = (role: "admin" | "staff" | "patient"): NavItemWithGroup[] => {
  switch (role) {
    case "admin":
      return adminMenuItems;
    case "staff":
      return staffMenuItems;
    case "patient":
      return patientMenuItems;
    default:
      return staffMenuItems; // Default to staff if role is unknown or not provided
  }
};
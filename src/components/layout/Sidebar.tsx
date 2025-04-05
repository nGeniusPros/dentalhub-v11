import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils'; // Assuming cn utility exists
import { Icons } from '../ui/Icons'; // Corrected import path
import MenuGroup from './MenuGroup'; // Import the MenuGroup component
import { getMenuItemsByRole, NavItemWithGroup } from '../../lib/navigation-items'; // Import navigation items and function
import { MenuItemType } from '../../types'; // Import the base type

// Define props for the Sidebar component, including the role
interface SidebarProps {
  role?: "admin" | "staff" | "patient";
  onCollapsedChange?: (collapsed: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ role = "staff", onCollapsedChange }) => { // Default to 'staff' if no role provided
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Get the appropriate menu items based on the role
  const menuItems = getMenuItemsByRole(role);

  // Group menu items by their 'group' property
  const groupedMenuItems = menuItems.reduce((acc, item) => {
    const group = item.group || 'Other'; // Use 'Other' if group is not defined
    if (!acc[group]) {
      acc[group] = [];
    }
    acc[group].push(item);
    return acc;
  }, {} as Record<string, MenuItemType[]>); // Use MenuItemType here

  return (
    <motion.div
      initial={false}
      animate={{ width: isCollapsed ? '5rem' : '16rem' }} // 80px or 256px
      className={cn(
        "fixed left-0 top-0 h-screen", // Use fixed positioning
        "bg-gradient-to-br from-[#1B2B85] via-[#2B3A9F] to-[#3B4AB9]", // Apply gradient background
        "border-r border-white/10", // Add border
        "flex flex-col", // Use flex column layout
        "shadow-xl", // Add shadow
        "transition-all duration-300 ease-in-out z-50" // Add transitions and z-index
      )}
    >
      {/* Header/Logo Section */}
      <div className="flex items-center justify-center h-20 border-b border-white/10 shrink-0"> {/* Adjusted height */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="relative w-10 h-10" // Adjusted size
        >
          {/* Use a relevant icon, e.g., Atom or a dental icon */}
          {/* Use Icons.logo or another appropriate icon from Icons.tsx */}
          <Icons.logo className="w-full h-full text-white" />
        </motion.div>
        {!isCollapsed && (
           <motion.span
             initial={{ opacity: 0, x: -10 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ delay: 0.2 }}
             className="ml-2 text-lg font-semibold text-white"
           >
             DentalHub
           </motion.span>
        )}
      </div>

      {/* Navigation Section */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-4"> {/* Adjusted padding and spacing */}
        {(Object.entries(groupedMenuItems) as [string, NavItemWithGroup[]][]).map(([group, items]) => (
          <MenuGroup
            key={group}
            title={group}
            items={items}
            isCollapsed={isCollapsed}
          />
        ))}
      </nav>

      {/* Collapse Button Section */}
      <div className="p-3 border-t border-white/10 shrink-0">
        <button
          onClick={() => {
            const newCollapsedState = !isCollapsed;
            setIsCollapsed(newCollapsedState);
            if (onCollapsedChange) {
              onCollapsedChange(newCollapsedState);
            }
          }}
          className={cn(
            "w-full flex items-center justify-center gap-2 p-2 rounded-lg",
            "text-white/80 hover:text-white",
            "hover:bg-white/10 backdrop-blur-sm transition-colors"
          )}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {/* Use an existing icon like ArrowLeft and rotate it */}
          <Icons.ArrowLeft className={cn(
            "w-5 h-5 transition-transform duration-300",
            isCollapsed && "rotate-180" // Rotate when collapsed
          )} />
          {!isCollapsed && (
            <span className="text-sm font-medium">Collapse</span>
          )}
        </button>
      </div>
    </motion.div>
  );
};

export default Sidebar;
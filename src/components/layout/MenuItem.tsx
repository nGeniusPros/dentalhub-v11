import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils'; // Assuming cn utility exists
import { Icons } from '../ui/Icons'; // Import the Icons object
import { MenuItemType } from '../../types';

interface MenuItemProps {
  item: MenuItemType;
  isCollapsed: boolean;
}

export const MenuItem: React.FC<MenuItemProps> = ({ item, isCollapsed }) => {
  // Dynamically select the correct icon component from the Icons object
  // Fallback to a default icon (e.g., 'Home') or handle missing icons gracefully
  const IconComponent = Icons[item.icon as keyof typeof Icons] || Icons['Home']; // Added fallback

  return (
    <motion.li
      whileHover={{ x: isCollapsed ? 0 : 4 }} // Only apply hover effect when not collapsed
      transition={{ duration: 0.2 }}
      className="relative" // Added relative positioning for tooltip
    >
      <NavLink
        to={item.path}
        className={({ isActive }) =>
          cn(
            'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 w-full',
            'hover:bg-white/10 group', // Adjusted hover style
            isActive
              ? 'bg-white/15 text-white font-medium shadow-sm' // Adjusted active style
              : 'text-white/70 hover:text-white'
          )
        }
      >
        <IconComponent className="w-5 h-5 flex-shrink-0" />
        {!isCollapsed && (
          <span className="text-sm font-medium truncate">{item.label}</span>
        )}
      </NavLink>
      {/* Tooltip for collapsed state */}
      {isCollapsed && (
        <div className={cn(
          "absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1",
          "bg-gray-900 text-white text-xs rounded-md",
          "opacity-0 group-hover:opacity-100 pointer-events-none",
          "transition-opacity whitespace-nowrap shadow-lg z-50" // Ensure tooltip is above other elements
        )}>
          {item.label}
        </div>
      )}
    </motion.li>
  );
};

export default MenuItem;
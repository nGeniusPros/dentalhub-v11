import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Icon } from '../../ui/icon-strategy';
import { cn } from '../../../lib/utils';
import type { MenuItem as MenuItemType } from '../../../types';

interface MenuItemProps {
  item: MenuItemType;
  isCollapsed: boolean;
}

export const MenuItem: React.FC<MenuItemProps> = ({ item, isCollapsed }) => {
  return (
    <motion.li
      whileHover={{ x: 4 }}
      transition={{ duration: 0.2 }}
    >
      <NavLink
        to={item.path}
        className={({ isActive }) =>
          cn(
            'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
            'hover:bg-sidebar-hover group relative',
            isActive
              ? 'bg-sidebar-active text-white font-medium shadow-glow'
              : 'text-white/70 hover:text-white'
          )
        }
      >
        <Icon name={item.icon} className="w-5 h-5 flex-shrink-0" />
        {!isCollapsed && (
          <span className="text-sm font-medium truncate">{item.label}</span>
        )}
        {isCollapsed && (
          <div className="absolute left-14 px-2 py-1 bg-sidebar-bg text-white text-sm rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap shadow-lg">
            {item.label}
          </div>
        )}
      </NavLink>
    </motion.li>
  );
};

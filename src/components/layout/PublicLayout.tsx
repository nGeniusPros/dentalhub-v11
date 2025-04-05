import React from 'react';
import { cn } from '@/lib/utils';

interface PublicLayoutProps {
  children: React.ReactNode;
}

const PublicLayout: React.FC<PublicLayoutProps> = ({ children }) => {
  return (
    <div className={cn(
      "min-h-screen",
      "bg-gray-smoke",
      "flex",
      "flex-col"
    )}>
      {children}
    </div>
  );
};

export default PublicLayout;

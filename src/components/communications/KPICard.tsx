import React from 'react';
import { Icons } from '../ui/Icons';
import { cn } from '@/lib/utils';

interface KPICardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  bgColor: string;
  trend?: number;
}

const KPICard: React.FC<KPICardProps> = ({ title, value, icon, bgColor, trend }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <h3 className="text-2xl font-bold">{value}</h3>
        </div>
        <div className={cn("w-10 h-10 rounded-full flex items-center justify-center text-white", bgColor)}>
          {icon}
        </div>
      </div>
      {trend !== undefined && (
        <div className={cn("mt-2 text-xs flex items-center", trend >= 0 ? "text-green-600" : "text-red-600")}>
          {trend >= 0 ? (
            <Icons.TrendingUp className="h-3 w-3 mr-1" />
          ) : (
            <Icons.TrendingDown className="h-3 w-3 mr-1" />
          )}
          <span>{trend >= 0 ? '+' : ''}{trend}% from last month</span>
        </div>
      )}
    </div>
  );
};

export default KPICard;

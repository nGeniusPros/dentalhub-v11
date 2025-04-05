import React from 'react';
import { motion } from 'framer-motion';
import { Icons } from '../ui/Icons';

interface StatsCardProps {
  title: string;
  value: string;
  change: number;
  icon: keyof typeof Icons;
  variant: 'gold' | 'corporate' | 'ocean' | 'nature';
  isGlowing?: boolean;
}

const StatsCard: React.FC<StatsCardProps> = ({ 
  title, 
  value, 
  change, 
  icon, 
  variant, 
  isGlowing = false 
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'gold':
        return {
          bgColor: 'bg-amber-500',
          lightBgColor: 'bg-amber-100',
          textColor: 'text-amber-500'
        };
      case 'corporate':
        return {
          bgColor: 'bg-purple-600',
          lightBgColor: 'bg-purple-100',
          textColor: 'text-purple-600'
        };
      case 'ocean':
        return {
          bgColor: 'bg-blue-600',
          lightBgColor: 'bg-blue-100',
          textColor: 'text-blue-600'
        };
      case 'nature':
        return {
          bgColor: 'bg-teal-500',
          lightBgColor: 'bg-teal-100',
          textColor: 'text-teal-500'
        };
      default:
        return {
          bgColor: 'bg-gray-500',
          lightBgColor: 'bg-gray-100',
          textColor: 'text-gray-500'
        };
    }
  };

  const styles = getVariantStyles();
  const IconComponent = Icons[icon];

  return (
    <div className={`bg-white rounded-lg shadow p-4 ${isGlowing ? 'ring-2 ring-amber-300 ring-opacity-50' : ''}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <h3 className="text-2xl font-bold">{value}</h3>
        </div>
        <div className={`w-10 h-10 rounded-full ${styles.lightBgColor} flex items-center justify-center`}>
          <div className={`w-8 h-8 rounded-full ${styles.bgColor} flex items-center justify-center text-white`}>
            <IconComponent className="h-4 w-4" />
          </div>
        </div>
      </div>
      <div className={`mt-2 text-xs ${change >= 0 ? 'text-green-600' : 'text-red-600'} flex items-center`}>
        {change >= 0 ? (
          <Icons.TrendingUp className="h-3 w-3 mr-1" />
        ) : (
          <Icons.TrendingDown className="h-3 w-3 mr-1" />
        )}
        <span>{change >= 0 ? '+' : ''}{change}% from last month</span>
      </div>
    </div>
  );
};

export const VoiceCampaignStats = () => {
  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <StatsCard
        title="Active Campaigns"
        value="5"
        change={2}
        icon="Phone"
        variant="gold"
        isGlowing={true}
      />
      <StatsCard
        title="Total Calls"
        value="1,234"
        change={8}
        icon="PhoneCall"
        variant="corporate"
      />
      <StatsCard
        title="Connection Rate"
        value="68%"
        change={5}
        icon="CheckCircle"
        variant="ocean"
      />
      <StatsCard
        title="Response Rate"
        value="45%"
        change={3}
        icon="MessageCircle"
        variant="nature"
      />
    </motion.div>
  );
};

export default VoiceCampaignStats;

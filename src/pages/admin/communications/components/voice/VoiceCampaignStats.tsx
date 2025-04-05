import React from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string;
  change: number;
  icon: keyof typeof Icons;
  variant: 'gold' | 'corporate' | 'ocean' | 'nature';
  isGlowing?: boolean;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, change, icon, variant, isGlowing }) => {
  const IconComponent = Icons[icon];

  const getVariantClasses = () => {
    switch (variant) {
      case 'gold':
        return 'bg-gradient-gold';
      case 'corporate':
        return 'bg-gradient-corporate';
      case 'ocean':
        return 'bg-gradient-ocean';
      case 'nature':
        return 'bg-gradient-nature';
      default:
        return 'bg-gradient-to-br from-gray-400 to-gray-600';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative rounded-xl p-6 text-white overflow-hidden ${
        getVariantClasses()
      } ${isGlowing ? 'shadow-glow' : ''}`}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M0,0 L100,0 L100,100 L0,100 Z" fill="url(#pattern)" />
          <defs>
            <pattern id="pattern" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
              <circle cx="5" cy="5" r="2" fill="currentColor" />
            </pattern>
          </defs>
        </svg>
      </div>

      <div className="flex justify-between items-start relative z-10">
        <div>
          <h3 className="text-sm font-medium opacity-80 mb-1">{title}</h3>
          <p className="text-3xl font-bold">{value}</p>
        </div>
        <div className={`p-3 rounded-lg bg-white/20 backdrop-blur-sm`}>
          <IconComponent className="w-6 h-6" />
        </div>
      </div>

      <div className="mt-4 flex items-center text-sm relative z-10">
        <span className={`flex items-center ${change >= 0 ? 'text-green-100' : 'text-red-100'}`}>
          {change >= 0 ? (
            <Icons.TrendingUp className="w-4 h-4 mr-1" />
          ) : (
            <Icons.TrendingDown className="w-4 h-4 mr-1" />
          )}
          {change >= 0 ? '+' : ''}{change}% from last month
        </span>
      </div>
    </motion.div>
  );
};

export const VoiceCampaignStats = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
        icon="PhoneOutgoing"
        variant="ocean"
      />
      <StatsCard
        title="Response Rate"
        value="45%"
        change={3}
        icon="MessageSquare"
        variant="nature"
      />
    </div>
  );
};

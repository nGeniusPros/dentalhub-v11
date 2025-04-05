import React from 'react';
import { motion } from 'framer-motion';
import { Icons } from '../../../../components/ui/Icons';
import { cn } from '../../../../lib/utils';
import { useVoiceCampaign } from '../context/VoiceCampaignContext';

interface StatsCardProps {
  title: string;
  value: string;
  change: number;
  icon: keyof typeof Icons;
  variant: 'gold' | 'corporate' | 'ocean' | 'nature' | 'royal' | 'tropical';
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
  const IconComponent = Icons[icon] || Icons.Activity;
  
  return (
    <div 
      className={cn(
        "p-6 rounded-xl border border-gray-200",
        "bg-white",
        isGlowing && "shadow-glow"
      )}
    >
      <div className="flex justify-between items-start mb-4">
        <div 
          className={cn(
            "p-3 rounded-lg",
            variant === 'gold' && "bg-gold/10 text-gold",
            variant === 'corporate' && "bg-navy/10 text-navy",
            variant === 'ocean' && "bg-blue/10 text-blue",
            variant === 'nature' && "bg-green/10 text-green",
            variant === 'royal' && "bg-purple/10 text-purple",
            variant === 'tropical' && "bg-turquoise/10 text-turquoise"
          )}
        >
          <IconComponent className="w-5 h-5" />
        </div>
        <div 
          className={cn(
            "text-xs font-medium px-2 py-1 rounded-full",
            change >= 0 ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
          )}
        >
          {change >= 0 ? '+' : ''}{change}%
        </div>
      </div>
      <h3 className="text-sm text-gray-500 mb-1">{title}</h3>
      <div className="flex items-baseline">
        <span className="text-2xl font-bold text-gray-900">{value}</span>
        <span className="ml-2 text-sm text-gray-500">
          {change >= 0 ? '+' : ''}{change}% from last month
        </span>
      </div>
    </div>
  );
};

export const VoiceCampaignStats: React.FC = () => {
  const { campaigns } = useVoiceCampaign();
  
  // Calculate stats from campaigns
  const activeCampaigns = campaigns.filter(c => c.status === 'active').length;
  const totalCalls = campaigns.reduce((sum, c) => sum + c.completedCalls, 0);
  
  // Calculate connection rate
  const targetCalls = campaigns.reduce((sum, c) => sum + c.targetCount, 0);
  const completedCalls = campaigns.reduce((sum, c) => sum + c.completedCalls, 0);
  const connectionRate = targetCalls > 0 ? Math.round((completedCalls / targetCalls) * 100) : 0;
  
  // Calculate response rate (using success rate as a proxy)
  const responseRate = campaigns.length > 0 
    ? Math.round(campaigns.reduce((sum, c) => sum + c.successRate, 0) / campaigns.length) 
    : 0;
  
  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <StatsCard
        title="Active Campaigns"
        value={activeCampaigns.toString()}
        change={2}
        icon="Phone"
        variant="gold"
        isGlowing={true}
      />
      <StatsCard
        title="Total Calls"
        value={totalCalls.toLocaleString()}
        change={8}
        icon="PhoneCall"
        variant="corporate"
      />
      <StatsCard
        title="Connection Rate"
        value={`${connectionRate}%`}
        change={5}
        icon="CheckCircle"
        variant="ocean"
      />
      <StatsCard
        title="Response Rate"
        value={`${responseRate}%`}
        change={3}
        icon="MessageCircle"
        variant="nature"
      />
    </motion.div>
  );
};

export default VoiceCampaignStats;

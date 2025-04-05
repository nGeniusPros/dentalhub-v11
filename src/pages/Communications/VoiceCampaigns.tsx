import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui/Icons';
import VoiceCampaignStats from '@/components/communications/VoiceCampaignStats';
import VoiceAnalytics from '@/components/communications/VoiceAnalytics';
import VoiceCampaignList from '@/components/communications/VoiceCampaignList';
import CreateCampaignDialog from '@/components/communications/CreateCampaignDialog';
import AIAgentSettings from '@/components/communications/AIAgentSettings';

const VoiceCampaigns: React.FC = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAISettingsOpen, setIsAISettingsOpen] = useState(false);

  return (
    <div className="p-6 max-w-[1200px] mx-auto">
      {/* Page Header */}
      <motion.div
        className="flex justify-between items-center mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Voice Campaigns</h1>
          <p className="text-sm text-gray-500">Manage outbound calls and AI voice agent workflows</p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => setIsAISettingsOpen(true)}
          >
            <Icons.Settings className="h-4 w-4" />
            <span>AI Agent Settings</span>
          </Button>
          <Button
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <Icons.Plus className="h-4 w-4" />
            <span>Create Campaign</span>
          </Button>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <div className="mb-6">
        <VoiceCampaignStats />
      </div>

      {/* Campaign List */}
      <div className="mb-6">
        <VoiceCampaignList />
      </div>

      {/* Analytics Charts */}
      <div className="mt-8">
        <VoiceAnalytics />
      </div>

      {/* Create Campaign Modal */}
      <CreateCampaignDialog
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      {/* AI Agent Settings Modal */}
      <AIAgentSettings
        open={isAISettingsOpen}
        onClose={() => setIsAISettingsOpen(false)}
      />
    </div>
  );
};

export default VoiceCampaigns;

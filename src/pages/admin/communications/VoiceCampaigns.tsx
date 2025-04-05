import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { VoiceCampaignList } from './components/voice/VoiceCampaignList';
import { CreateCampaignDialog } from './components/voice/CreateCampaignDialog';
import { AIAgentSettings } from './components/voice/AIAgentSettings';
import { VoiceAnalytics } from './components/voice/VoiceAnalytics';
import { useSettings } from '../../../contexts/SettingsContext';
import { VoiceCampaignStats } from './components/voice/VoiceCampaignStats';
import { CommunicationProvider } from '../../../contexts/CommunicationContext';

const VoiceCampaigns = () => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showAgentSettings, setShowAgentSettings] = useState(false);
  const { settings } = useSettings();

  return (
    <CommunicationProvider>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-gold text-transparent bg-clip-text">Voice Campaigns</h1>
            <p className="text-gray-500">Manage outbound calls and AI voice agent settings</p>
          </div>
          <div className="flex gap-3">
            <Button 
              variant="outline"
              onClick={() => setShowAgentSettings(true)}
            >
              <Icons.Settings className="w-4 h-4 mr-2" />
              AI Agent Settings
            </Button>
            <Button variant="gradient-gold" onClick={() => setShowCreateDialog(true)}>
              <Icons.Plus className="w-4 h-4 mr-2" />
              Create Campaign
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="space-y-6">
          <VoiceCampaignStats />
          
          {/* Analytics Dashboard */}
          <VoiceAnalytics />
        </div>

        {/* Campaign List */}
        <VoiceCampaignList />

        {/* Create Campaign Dialog */}
        <CreateCampaignDialog
          open={showCreateDialog}
          onClose={() => setShowCreateDialog(false)}
        />

        {/* AI Agent Settings Dialog */}
        <AIAgentSettings
          open={showAgentSettings}
          onClose={() => setShowAgentSettings(false)}
        />
      </div>
    </CommunicationProvider>
  );
};

export default VoiceCampaigns;

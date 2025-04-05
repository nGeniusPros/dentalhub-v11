import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Icons } from '../../../components/ui/Icons';
import { Button } from '../../../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { VoiceCampaignProvider } from './context/VoiceCampaignContext';
import VoiceCampaignStats from './components/VoiceCampaignStats';
import VoiceCampaignList from './components/VoiceCampaignList';
import VoiceAnalytics from './components/VoiceAnalytics';
import AIAgentSettings from './components/AIAgentSettings';
import CreateCampaignDialog from './components/CreateCampaignDialog';

const VoiceCampaignsPage: React.FC = () => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  return (
    <VoiceCampaignProvider>
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Voice Campaigns</h1>
              <p className="text-gray-500 mt-1">
                Manage and monitor your automated voice campaigns.
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <Button onClick={() => setShowCreateDialog(true)}>
                <Icons.Plus className="w-4 h-4 mr-2" />
                New Campaign
              </Button>
            </div>
          </div>

          <VoiceCampaignStats />
        </motion.div>

        <Tabs defaultValue="campaigns" className="mb-8">
          <TabsList className="mb-6">
            <TabsTrigger value="campaigns">
              <Icons.Phone className="w-4 h-4 mr-2" />
              Campaigns
            </TabsTrigger>
            <TabsTrigger value="analytics">
              <Icons.BarChart className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Icons.Settings className="w-4 h-4 mr-2" />
              AI Agent Settings
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="campaigns">
            <VoiceCampaignList />
          </TabsContent>
          
          <TabsContent value="analytics">
            <VoiceAnalytics />
          </TabsContent>
          
          <TabsContent value="settings">
            <AIAgentSettings />
          </TabsContent>
        </Tabs>

        <CreateCampaignDialog
          open={showCreateDialog}
          onClose={() => setShowCreateDialog(false)}
        />
      </div>
    </VoiceCampaignProvider>
  );
};

export default VoiceCampaignsPage;

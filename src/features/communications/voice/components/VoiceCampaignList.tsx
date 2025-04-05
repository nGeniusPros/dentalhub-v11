import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Icons } from '../../../../components/ui/Icons';
import { Button } from '../../../../components/ui/button';
import { cn } from '../../../../lib/utils';
import { useVoiceCampaign } from '../context/VoiceCampaignContext';
import { Campaign } from '../context/VoiceCampaignContext';
import ScheduleDialog from './ScheduleDialog';
import EditCampaignDialog from './EditCampaignDialog';

export const VoiceCampaignList: React.FC = () => {
  const { campaigns, updateCampaign, deleteCampaign } = useVoiceCampaign();
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleStatusChange = (campaignId: string, status: Campaign['status']) => {
    updateCampaign(campaignId, { status });
  };

  const handleEditCampaign = (campaign: Campaign) => {
    setEditingCampaign(campaign);
  };

  const handleScheduleCampaign = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setShowScheduleDialog(true);
  };

  const handleDeleteCampaign = (campaignId: string) => {
    if (window.confirm('Are you sure you want to delete this campaign?')) {
      deleteCampaign(campaignId);
    }
  };

  // Filter campaigns based on search term
  const filteredCampaigns = campaigns.filter(campaign => 
    campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    campaign.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex gap-4">
          <div className="flex-1">
            <div className="relative">
              <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search campaigns..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </div>
          <Button variant="outline">
            <Icons.Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-6 py-3 text-left">Campaign</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">Progress</th>
              <th className="px-6 py-3 text-left">Success Rate</th>
              <th className="px-6 py-3 text-left">Schedule</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredCampaigns.map((campaign) => (
              <motion.tr 
                key={campaign.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="hover:bg-gray-50"
              >
                <td className="px-6 py-4">
                  <div>
                    <div className="font-medium text-gray-900">{campaign.name}</div>
                    <div className="text-sm text-gray-500">{campaign.type} Campaign</div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={cn(
                    "px-2 py-1 text-xs font-medium rounded-full",
                    campaign.status === 'active' && "bg-green-100 text-green-800",
                    campaign.status === 'paused' && "bg-yellow-100 text-yellow-800",
                    campaign.status === 'scheduled' && "bg-blue-100 text-blue-800",
                    campaign.status === 'completed' && "bg-gray-100 text-gray-800"
                  )}>
                    {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                      <div 
                        className="bg-blue-600 h-2.5 rounded-full" 
                        style={{ width: `${(campaign.completedCalls / campaign.targetCount) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-500">
                      {campaign.completedCalls}/{campaign.targetCount}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <span className="text-sm font-medium">{campaign.successRate}%</span>
                    {campaign.successRate > 0 && (
                      <Icons.TrendingUp className="w-4 h-4 ml-2 text-green-500" />
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  {campaign.scheduledDate ? (
                    <div className="text-sm">
                      <Icons.Calendar className="w-4 h-4 inline mr-1 text-gray-400" />
                      {campaign.scheduledDate}
                    </div>
                  ) : (
                    <div className="text-sm">
                      <Icons.Clock className="w-4 h-4 inline mr-1 text-gray-400" />
                      Last run: {campaign.lastRun}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    {campaign.status === 'active' ? (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleStatusChange(campaign.id, 'paused')}
                        title="Pause Campaign"
                      >
                        <Icons.Pause className="w-4 h-4 text-yellow-500" />
                      </Button>
                    ) : campaign.status === 'paused' ? (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleStatusChange(campaign.id, 'active')}
                        title="Resume Campaign"
                      >
                        <Icons.Play className="w-4 h-4 text-green-500" />
                      </Button>
                    ) : null}
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleEditCampaign(campaign)}
                      title="Edit Campaign"
                    >
                      <Icons.Edit className="w-4 h-4 text-blue-500" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleScheduleCampaign(campaign)}
                      title="Schedule Campaign"
                    >
                      <Icons.Calendar className="w-4 h-4 text-purple-500" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleDeleteCampaign(campaign.id)}
                      title="Delete Campaign"
                      className="text-red-500 hover:text-red-700"
                    >
                      <Icons.Trash className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredCampaigns.length === 0 && (
        <div className="p-8 text-center">
          <Icons.Search className="w-12 h-12 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">No campaigns found</h3>
          <p className="text-gray-500">Try adjusting your search or create a new campaign.</p>
        </div>
      )}

      {/* Schedule Dialog */}
      {selectedCampaign && (
        <ScheduleDialog
          open={showScheduleDialog}
          campaign={selectedCampaign}
          onClose={() => {
            setShowScheduleDialog(false);
            setSelectedCampaign(null);
          }}
          onSchedule={(schedule) => {
            if (selectedCampaign) {
              updateCampaign(selectedCampaign.id, { 
                schedule, 
                status: 'scheduled',
                scheduledDate: schedule.startDate
              });
            }
            setShowScheduleDialog(false);
            setSelectedCampaign(null);
          }}
        />
      )}

      {/* Edit Campaign Dialog */}
      {editingCampaign && (
        <EditCampaignDialog
          open={!!editingCampaign}
          campaign={editingCampaign}
          onClose={() => setEditingCampaign(null)}
          onSave={(updatedCampaign) => {
            updateCampaign(updatedCampaign.id, updatedCampaign);
            setEditingCampaign(null);
          }}
        />
      )}
    </div>
  );
};

export default VoiceCampaignList;

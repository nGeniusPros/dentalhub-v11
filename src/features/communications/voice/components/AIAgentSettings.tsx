import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Icons } from '../../../../components/ui/Icons';
import { Button } from '../../../../components/ui/button';
import { Switch } from '../../../../components/ui/switch';
import { useVoiceCampaign } from '../context/VoiceCampaignContext';

export const AIAgentSettings: React.FC = () => {
  const { agentStatus, updateAgentSettings, agentLoading, agentError } = useVoiceCampaign();
  const [showSchedule, setShowSchedule] = useState(false);

  if (!agentStatus) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <div className="flex justify-center items-center h-40">
          <div className="text-center">
            <Icons.Loader className="w-8 h-8 text-gray-400 animate-spin mx-auto mb-4" />
            <p className="text-gray-500">Loading AI agent settings...</p>
          </div>
        </div>
      </div>
    );
  }

  const handleToggleAgent = () => {
    updateAgentSettings({ enabled: !agentStatus.enabled });
  };

  const handleVoiceChange = (voiceId: string) => {
    updateAgentSettings({ voiceId });
  };

  const handleToggleSetting = (setting: keyof typeof agentStatus) => {
    if (typeof agentStatus[setting] === 'boolean') {
      updateAgentSettings({ [setting]: !agentStatus[setting] });
    }
  };

  const handleScheduleChange = (day: string, field: 'start' | 'end', value: string) => {
    if (agentStatus.schedule) {
      const newSchedule = { ...agentStatus.schedule };
      newSchedule[day as keyof typeof newSchedule][field] = value;
      updateAgentSettings({ schedule: newSchedule });
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">AI Voice Agent Settings</h2>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">
              {agentStatus.enabled ? 'Enabled' : 'Disabled'}
            </span>
            <Switch
              checked={agentStatus.enabled}
              onCheckedChange={handleToggleAgent}
              disabled={agentLoading}
            />
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          Configure when and how your AI voice agent makes calls.
        </p>
      </div>

      <div className="p-6 space-y-6">
        {agentError && (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-4">
            <div className="flex">
              <Icons.AlertCircle className="w-5 h-5 mr-2" />
              <span>{agentError}</span>
            </div>
          </div>
        )}

        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">Voice Selection</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { id: 'alloy', name: 'Alloy', description: 'Neutral, versatile voice' },
              { id: 'shimmer', name: 'Shimmer', description: 'Warm, friendly voice' },
              { id: 'nova', name: 'Nova', description: 'Professional, clear voice' },
              { id: 'echo', name: 'Echo', description: 'Calm, soothing voice' }
            ].map((voice) => (
              <div
                key={voice.id}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  agentStatus.voiceId === voice.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/50'
                }`}
                onClick={() => handleVoiceChange(voice.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{voice.name}</span>
                  {agentStatus.voiceId === voice.id && (
                    <Icons.Check className="w-4 h-4 text-blue-500" />
                  )}
                </div>
                <p className="text-xs text-gray-500">{voice.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">Call Settings</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <span className="font-medium">After Hours Calls</span>
                <p className="text-xs text-gray-500">Allow AI to make calls after business hours</p>
              </div>
              <Switch
                checked={agentStatus.afterHours}
                onCheckedChange={() => handleToggleSetting('afterHours')}
                disabled={agentLoading}
              />
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <span className="font-medium">Lunch Hour Calls</span>
                <p className="text-xs text-gray-500">Allow AI to make calls during lunch hours</p>
              </div>
              <Switch
                checked={agentStatus.lunchHours}
                onCheckedChange={() => handleToggleSetting('lunchHours')}
                disabled={agentLoading}
              />
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <span className="font-medium">Holiday Calls</span>
                <p className="text-xs text-gray-500">Allow AI to make calls on holidays</p>
              </div>
              <Switch
                checked={agentStatus.holidays}
                onCheckedChange={() => handleToggleSetting('holidays')}
                disabled={agentLoading}
              />
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <span className="font-medium">Custom Schedule</span>
                <p className="text-xs text-gray-500">Set specific hours for AI calls</p>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={agentStatus.customSchedule}
                  onCheckedChange={() => handleToggleSetting('customSchedule')}
                  disabled={agentLoading}
                />
                {agentStatus.customSchedule && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowSchedule(!showSchedule)}
                  >
                    {showSchedule ? 'Hide' : 'Show'}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {agentStatus.customSchedule && showSchedule && agentStatus.schedule && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border border-gray-200 rounded-lg overflow-hidden"
          >
            <table className="w-full">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-4 py-2 text-left">Day</th>
                  <th className="px-4 py-2 text-left">Start Time</th>
                  <th className="px-4 py-2 text-left">End Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {Object.entries(agentStatus.schedule).map(([day, times]) => (
                  <tr key={day} className="hover:bg-gray-50">
                    <td className="px-4 py-2 capitalize">{day}</td>
                    <td className="px-4 py-2">
                      <input
                        type="time"
                        value={times.start}
                        onChange={(e) => handleScheduleChange(day, 'start', e.target.value)}
                        className="px-2 py-1 border border-gray-300 rounded-md text-sm"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="time"
                        value={times.end}
                        onChange={(e) => handleScheduleChange(day, 'end', e.target.value)}
                        className="px-2 py-1 border border-gray-300 rounded-md text-sm"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}

        <div className="flex justify-end">
          <Button
            onClick={() => updateAgentSettings(agentStatus)}
            disabled={agentLoading}
          >
            {agentLoading ? (
              <>
                <Icons.Loader className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Settings'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AIAgentSettings;

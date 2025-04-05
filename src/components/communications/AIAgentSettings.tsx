import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Icons } from '../ui/Icons';
import { Button } from '../ui/button';

interface AIAgentSettingsProps {
  open: boolean;
  onClose: () => void;
}

export const AIAgentSettings: React.FC<AIAgentSettingsProps> = ({
  open,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState('voice');
  const [voiceSettings, setVoiceSettings] = useState({
    voice: 'female',
    speed: 'normal',
    language: 'english',
    accent: 'neutral'
  });
  const [scriptSettings, setScriptSettings] = useState({
    greeting: true,
    introduction: true,
    purpose: true,
    confirmation: true,
    farewell: true
  });
  const [complianceSettings, setComplianceSettings] = useState({
    recordCalls: true,
    disclosureAtStart: true,
    optOutOption: true,
    complianceTraining: true
  });

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-3xl"
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">AI Voice Agent Settings</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <Icons.X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="p-6">
          <div className="flex border-b border-gray-200 mb-6">
            <button
              className={`px-4 py-2 font-medium text-sm ${
                activeTab === 'voice'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('voice')}
            >
              Voice Settings
            </button>
            <button
              className={`px-4 py-2 font-medium text-sm ${
                activeTab === 'script'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('script')}
            >
              Script Settings
            </button>
            <button
              className={`px-4 py-2 font-medium text-sm ${
                activeTab === 'compliance'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('compliance')}
            >
              Compliance
            </button>
          </div>

          {activeTab === 'voice' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Voice Type
                </label>
                <select
                  value={voiceSettings.voice}
                  onChange={(e) => setVoiceSettings({ ...voiceSettings, voice: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                >
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                  <option value="neutral">Neutral</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Speaking Speed
                </label>
                <select
                  value={voiceSettings.speed}
                  onChange={(e) => setVoiceSettings({ ...voiceSettings, speed: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                >
                  <option value="slow">Slow</option>
                  <option value="normal">Normal</option>
                  <option value="fast">Fast</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Language
                </label>
                <select
                  value={voiceSettings.language}
                  onChange={(e) => setVoiceSettings({ ...voiceSettings, language: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                >
                  <option value="english">English</option>
                  <option value="spanish">Spanish</option>
                  <option value="french">French</option>
                  <option value="german">German</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Accent
                </label>
                <select
                  value={voiceSettings.accent}
                  onChange={(e) => setVoiceSettings({ ...voiceSettings, accent: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                >
                  <option value="neutral">Neutral</option>
                  <option value="american">American</option>
                  <option value="british">British</option>
                  <option value="australian">Australian</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Voice Preview
                </label>
                <div className="p-4 bg-gray-50 rounded-lg flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    "Hello, this is your dental office calling to remind you about your upcoming appointment."
                  </span>
                  <Button variant="outline" size="sm">
                    <Icons.Phone className="w-4 h-4 mr-2" />
                    Play
                  </Button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'script' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Script Components
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={scriptSettings.greeting}
                      onChange={(e) => setScriptSettings({ ...scriptSettings, greeting: e.target.checked })}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm">Greeting</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={scriptSettings.introduction}
                      onChange={(e) => setScriptSettings({ ...scriptSettings, introduction: e.target.checked })}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm">Practice Introduction</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={scriptSettings.purpose}
                      onChange={(e) => setScriptSettings({ ...scriptSettings, purpose: e.target.checked })}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm">Call Purpose</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={scriptSettings.confirmation}
                      onChange={(e) => setScriptSettings({ ...scriptSettings, confirmation: e.target.checked })}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm">Confirmation Request</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={scriptSettings.farewell}
                      onChange={(e) => setScriptSettings({ ...scriptSettings, farewell: e.target.checked })}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm">Farewell</span>
                  </label>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Custom Script
                </label>
                <textarea
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg h-32"
                  placeholder="Enter your custom script here..."
                ></textarea>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Available Variables
                </label>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-sm text-gray-600">{'{patient_name}'}</div>
                    <div className="text-sm text-gray-500">Patient's full name</div>
                    <div className="text-sm text-gray-600">{'{appointment_date}'}</div>
                    <div className="text-sm text-gray-500">Appointment date</div>
                    <div className="text-sm text-gray-600">{'{appointment_time}'}</div>
                    <div className="text-sm text-gray-500">Appointment time</div>
                    <div className="text-sm text-gray-600">{'{practice_name}'}</div>
                    <div className="text-sm text-gray-500">Practice name</div>
                    <div className="text-sm text-gray-600">{'{doctor_name}'}</div>
                    <div className="text-sm text-gray-500">Doctor's name</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'compliance' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Compliance Settings
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={complianceSettings.recordCalls}
                      onChange={(e) => setComplianceSettings({ ...complianceSettings, recordCalls: e.target.checked })}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm">Record all calls</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={complianceSettings.disclosureAtStart}
                      onChange={(e) => setComplianceSettings({ ...complianceSettings, disclosureAtStart: e.target.checked })}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm">Include disclosure at start of call</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={complianceSettings.optOutOption}
                      onChange={(e) => setComplianceSettings({ ...complianceSettings, optOutOption: e.target.checked })}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm">Provide opt-out option</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={complianceSettings.complianceTraining}
                      onChange={(e) => setComplianceSettings({ ...complianceSettings, complianceTraining: e.target.checked })}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm">AI agent compliance training</span>
                  </label>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Call Time Restrictions
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">Earliest Call Time</label>
                    <input
                      type="time"
                      defaultValue="09:00"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">Latest Call Time</label>
                    <input
                      type="time"
                      defaultValue="20:00"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Compliance Disclosure Text
                </label>
                <textarea
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg h-32"
                  defaultValue="This call is being recorded for quality and training purposes. This is an automated call from [Practice Name]. If you wish to opt out of future calls, please press 9 at any time."
                ></textarea>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-between">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button onClick={onClose}>
            Save Settings
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default AIAgentSettings;

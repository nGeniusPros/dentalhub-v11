import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Icons } from '../../../../components/ui/Icons';
import { Button } from '../../../../components/ui/button';
import { Campaign } from '../context/VoiceCampaignContext';

interface ScheduleDialogProps {
  open: boolean;
  campaign: Campaign;
  onClose: () => void;
  onSchedule: (schedule: Campaign['schedule']) => void;
}

interface ScheduleState {
  startDate: string;
  startTime: string;
  maxAttempts: number;
  timeBetweenAttempts: number;
}

const ScheduleDialog: React.FC<ScheduleDialogProps> = ({
  open,
  campaign,
  onClose,
  onSchedule
}) => {
  // Initialize with existing schedule or defaults
  const [schedule, setSchedule] = useState<ScheduleState>(
    campaign.schedule || {
      startDate: new Date().toISOString().split('T')[0], // Today's date
      startTime: '09:00',
      maxAttempts: 3,
      timeBetweenAttempts: 4 // hours
    }
  );

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSchedule(schedule);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-md"
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Schedule Campaign</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <Icons.X className="w-5 h-5" />
            </Button>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Schedule when this campaign should start and configure call settings.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  id="startDate"
                  value={schedule.startDate}
                  onChange={(e) => setSchedule({ ...schedule, startDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1">
                  Start Time
                </label>
                <input
                  type="time"
                  id="startTime"
                  value={schedule.startTime}
                  onChange={(e) => setSchedule({ ...schedule, startTime: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Call Settings
                </label>
                
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">Maximum Attempts</p>
                  <div className="flex space-x-2">
                    {[1, 2, 3].map((attempts) => (
                      <button
                        key={attempts}
                        type="button"
                        onClick={() => setSchedule({ ...schedule, maxAttempts: attempts })}
                        className={`flex-1 py-2 px-3 text-sm rounded-md ${
                          schedule.maxAttempts === attempts
                            ? 'bg-blue-100 text-blue-700 border border-blue-300'
                            : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                        }`}
                      >
                        {attempts} {attempts === 1 ? 'attempt' : 'attempts'}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-2">Time Between Attempts</p>
                  <div className="flex space-x-2">
                    {[1, 2, 4, 24].map((hours) => (
                      <button
                        key={hours}
                        type="button"
                        onClick={() => setSchedule({ ...schedule, timeBetweenAttempts: hours })}
                        className={`flex-1 py-2 px-3 text-sm rounded-md ${
                          schedule.timeBetweenAttempts === hours
                            ? 'bg-blue-100 text-blue-700 border border-blue-300'
                            : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                        }`}
                      >
                        {hours === 24 ? '1 day' : `${hours} hour${hours > 1 ? 's' : ''}`}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Schedule Campaign
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default ScheduleDialog;

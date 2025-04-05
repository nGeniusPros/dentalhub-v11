import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Icons } from '../../../../components/ui/Icons';
import { Button } from '../../../../components/ui/button';
import { Campaign } from '../context/VoiceCampaignContext';

interface EditCampaignDialogProps {
  open: boolean;
  campaign: Campaign;
  onClose: () => void;
  onSave: (campaign: Campaign) => void;
}

const EditCampaignDialog: React.FC<EditCampaignDialogProps> = ({
  open,
  campaign,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState<Campaign>({ ...campaign });

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'targetCount' ? parseInt(value) : value
    }));
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
            <h2 className="text-xl font-bold text-gray-900">Edit Campaign</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <Icons.X className="w-5 h-5" />
            </Button>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Update the details of your voice campaign.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Campaign Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                  Campaign Type
                </label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="recall">Recall</option>
                  <option value="reactivation">Reactivation</option>
                  <option value="treatment">Treatment</option>
                  <option value="appointment">Appointment</option>
                  <option value="event">Event</option>
                  <option value="custom">Custom</option>
                </select>
              </div>

              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div>
                <label htmlFor="targetCount" className="block text-sm font-medium text-gray-700 mb-1">
                  Target Count
                </label>
                <input
                  type="number"
                  id="targetCount"
                  name="targetCount"
                  value={formData.targetCount}
                  onChange={handleChange}
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
          </div>

          <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Save Changes
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default EditCampaignDialog;

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Icons } from '../../../../components/ui/Icons';
import { Button } from '../../../../components/ui/button';
import { useVoiceCampaign } from '../context/VoiceCampaignContext';

interface CreateCampaignDialogProps {
  open: boolean;
  onClose: () => void;
}

interface CampaignFormData {
  name: string;
  type: 'recall' | 'reactivation' | 'treatment' | 'appointment' | 'event' | 'custom';
  targetCount: number;
  startNow: boolean;
  schedule?: {
    startDate: string;
    startTime: string;
    maxAttempts: number;
    timeBetweenAttempts: number;
  };
}

const CreateCampaignDialog: React.FC<CreateCampaignDialogProps> = ({
  open,
  onClose
}) => {
  const { addCampaign } = useVoiceCampaign();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<CampaignFormData>({
    name: '',
    type: 'recall',
    targetCount: 50,
    startNow: true,
    schedule: {
      startDate: new Date().toISOString().split('T')[0], // Today's date
      startTime: '09:00',
      maxAttempts: 3,
      timeBetweenAttempts: 4 // hours
    }
  });

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await addCampaign({
        name: formData.name,
        type: formData.type,
        status: formData.startNow ? 'active' : 'scheduled',
        targetCount: formData.targetCount,
        completedCalls: 0,
        successRate: 0,
        scheduledDate: !formData.startNow ? formData.schedule?.startDate : undefined,
        schedule: !formData.startNow ? formData.schedule : undefined
      });
      
      onClose();
    } catch (error) {
      console.error('Error creating campaign:', error);
      // Handle error (could add error state and display to user)
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) : value
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleScheduleChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      schedule: {
        ...prev.schedule!,
        [field]: value
      }
    }));
  };

  const nextStep = () => setCurrentStep(prev => prev + 1);
  const prevStep = () => setCurrentStep(prev => prev - 1);

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
            <h2 className="text-xl font-bold text-gray-900">Create Voice Campaign</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <Icons.X className="w-5 h-5" />
            </Button>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Set up a new voice campaign to reach your patients.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
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
                  <p className="text-xs text-gray-500 mt-1">
                    Number of patients to target with this campaign
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Schedule */}
          {currentStep === 2 && (
            <div className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="startNow"
                    name="startNow"
                    checked={formData.startNow}
                    onChange={handleCheckboxChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="startNow" className="ml-2 block text-sm text-gray-700">
                    Start campaign immediately
                  </label>
                </div>

                {!formData.startNow && (
                  <div className="space-y-4 mt-4">
                    <div>
                      <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                        Start Date
                      </label>
                      <input
                        type="date"
                        id="startDate"
                        value={formData.schedule?.startDate}
                        onChange={(e) => handleScheduleChange('startDate', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required={!formData.startNow}
                      />
                    </div>

                    <div>
                      <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1">
                        Start Time
                      </label>
                      <input
                        type="time"
                        id="startTime"
                        value={formData.schedule?.startTime}
                        onChange={(e) => handleScheduleChange('startTime', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required={!formData.startNow}
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
                              onClick={() => handleScheduleChange('maxAttempts', attempts)}
                              className={`flex-1 py-2 px-3 text-sm rounded-md ${
                                formData.schedule?.maxAttempts === attempts
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
                              onClick={() => handleScheduleChange('timeBetweenAttempts', hours)}
                              className={`flex-1 py-2 px-3 text-sm rounded-md ${
                                formData.schedule?.timeBetweenAttempts === hours
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
                )}
              </div>
            </div>
          )}

          <div className="p-6 border-t border-gray-200 flex justify-between">
            {currentStep > 1 ? (
              <Button variant="outline" type="button" onClick={prevStep}>
                <Icons.ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            ) : (
              <Button variant="outline" type="button" onClick={onClose}>
                Cancel
              </Button>
            )}
            
            {currentStep < 2 ? (
              <Button type="button" onClick={nextStep}>
                Next
                <Icons.ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button type="submit">
                Create Campaign
              </Button>
            )}
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default CreateCampaignDialog;

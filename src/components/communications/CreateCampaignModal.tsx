import React, { useState } from 'react';
import { Icons } from '../ui/Icons';
import { Button } from '../ui/button';

interface CreateCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateCampaignModal: React.FC<CreateCampaignModalProps> = ({ isOpen, onClose }) => {
  const [selectedCampaignType, setSelectedCampaignType] = useState<string | null>(null);
  
  if (!isOpen) return null;

  // Campaign types
  const campaignTypes = [
    { id: 'recall', title: 'Recall', description: 'Contact patients due for regular checkups', icon: 'Calendar' },
    { id: 'reactivation', title: 'Reactivation', description: 'Re-engage inactive patients', icon: 'RefreshCw' },
    { id: 'treatment', title: 'Treatment', description: 'Follow up on pending treatment plans', icon: 'Activity' },
    { id: 'appointment', title: 'Appointment', description: 'Confirm upcoming appointments', icon: 'Calendar' },
    { id: 'event', title: 'Event', description: 'Promote a special event or service', icon: 'Calendar' },
    { id: 'custom', title: 'Custom', description: 'Create a custom campaign', icon: 'Settings' }
  ];

  // Handle campaign type selection
  const handleCampaignTypeSelect = (typeId: string) => {
    setSelectedCampaignType(typeId);
  };

  // Handle next step
  const handleNextStep = () => {
    // In a real app, this would navigate to the next step
    console.log('Creating campaign of type:', selectedCampaignType);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold">Create Voice Campaign</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <Icons.X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-6">
          <div className="flex items-center mb-4">
            <div className="w-full">
              <div className="flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                  <span>1</span>
                </div>
                <div className="h-1 w-full bg-gray-200 mx-2"></div>
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                  <span>2</span>
                </div>
                <div className="h-1 w-full bg-gray-200 mx-2"></div>
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                  <span>3</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {campaignTypes.map((type) => (
              <div 
                key={type.id}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${selectedCampaignType === type.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}
                onClick={() => handleCampaignTypeSelect(type.id)}
              >
                <div className="flex items-start">
                  <div className="mr-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      {type.icon === 'Calendar' && <Icons.Calendar className="h-4 w-4 text-blue-600" />}
                      {type.icon === 'RefreshCw' && <Icons.RefreshCw className="h-4 w-4 text-blue-600" />}
                      {type.icon === 'Activity' && <Icons.Activity className="h-4 w-4 text-blue-600" />}
                      {type.icon === 'Settings' && <Icons.Settings className="h-4 w-4 text-blue-600" />}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium">{type.title}</h3>
                    <p className="text-sm text-gray-500">{type.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="p-4 border-t border-gray-200 flex justify-between">
          <Button 
            variant="outline" 
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button 
            disabled={!selectedCampaignType}
            onClick={handleNextStep}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateCampaignModal;

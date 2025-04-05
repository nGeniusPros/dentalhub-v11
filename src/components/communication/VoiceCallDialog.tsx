import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Icons } from '../ui/Icons';
import { Button } from '../ui/button';

interface VoiceCallDialogProps {
  isOpen: boolean;
  onClose: () => void;
  patientPhone: string;
  patientName?: string;
}

const VoiceCallDialog: React.FC<VoiceCallDialogProps> = ({
  isOpen,
  onClose,
  patientPhone,
  patientName
}) => {
  const [callStatus, setCallStatus] = useState<'idle' | 'calling' | 'connected' | 'ended'>('idle');
  const [callDuration, setCallDuration] = useState(0);
  const [callNotes, setCallNotes] = useState('');

  if (!isOpen) return null;

  const handleStartCall = () => {
    setCallStatus('calling');
    // In a real implementation, this would initiate a call via Twilio or similar service
    setTimeout(() => {
      setCallStatus('connected');
      // Start a timer for call duration
      const timer = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
      
      // Auto-end call after 30 seconds for demo purposes
      setTimeout(() => {
        clearInterval(timer);
        setCallStatus('ended');
      }, 30000);
    }, 2000);
  };

  const handleEndCall = () => {
    setCallStatus('ended');
  };

  const handleSaveAndClose = () => {
    // In a real implementation, this would save the call notes to the patient record
    console.log('Call notes saved:', callNotes);
    // Reset state
    setCallStatus('idle');
    setCallDuration(0);
    setCallNotes('');
    onClose();
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-md"
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Call Patient</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <Icons.X className="w-5 h-5" />
            </Button>
          </div>
        </div>
        
        <div className="p-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <Icons.User className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-medium">{patientName || 'Patient'}</h3>
            <p className="text-gray-500">{patientPhone}</p>
            
            {callStatus === 'connected' && (
              <p className="mt-2 text-green-600">
                Connected • {formatDuration(callDuration)}
              </p>
            )}
            
            {callStatus === 'calling' && (
              <p className="mt-2 text-blue-600 animate-pulse">
                Calling...
              </p>
            )}
            
            {callStatus === 'ended' && (
              <p className="mt-2 text-gray-600">
                Call ended • {formatDuration(callDuration)}
              </p>
            )}
          </div>
          
          {callStatus === 'ended' && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Call Notes
              </label>
              <textarea
                value={callNotes}
                onChange={(e) => setCallNotes(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                rows={4}
                placeholder="Enter notes about this call..."
              />
            </div>
          )}
          
          <div className="flex justify-center space-x-4">
            {callStatus === 'idle' && (
              <Button 
                onClick={handleStartCall}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Icons.PhoneCall className="w-4 h-4 mr-2" />
                Start Call
              </Button>
            )}
            
            {callStatus === 'calling' || callStatus === 'connected' ? (
              <Button 
                onClick={handleEndCall}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                <Icons.PhoneOff className="w-4 h-4 mr-2" />
                End Call
              </Button>
            ) : null}
            
            {callStatus === 'ended' && (
              <Button onClick={handleSaveAndClose}>
                Save & Close
              </Button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default VoiceCallDialog;

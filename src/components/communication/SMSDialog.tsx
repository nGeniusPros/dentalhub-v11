import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Icons } from '../ui/Icons';
import { Button } from '../ui/button';

interface SMSDialogProps {
  isOpen: boolean;
  onClose: () => void;
  patientPhone: string;
  patientName?: string;
}

const SMSDialog: React.FC<SMSDialogProps> = ({
  isOpen,
  onClose,
  patientPhone,
  patientName
}) => {
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSendSMS = () => {
    if (!message.trim()) {
      setError('Please enter a message');
      return;
    }

    setSending(true);
    setError(null);

    // Simulate sending SMS
    setTimeout(() => {
      setSending(false);
      setSent(true);
      console.log(`SMS sent to ${patientName} (${patientPhone}): ${message}`);
    }, 1500);
  };

  const handleClose = () => {
    // Reset state
    setMessage('');
    setSending(false);
    setSent(false);
    setError(null);
    onClose();
  };

  // Template messages
  const templates = [
    'Your appointment is confirmed for tomorrow at 2:00 PM. Please arrive 15 minutes early.',
    'This is a reminder about your upcoming dental cleaning appointment.',
    'Please call our office to schedule your next appointment.',
    'Your lab results are ready. Please call our office to discuss them.'
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-md"
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Send SMS</h2>
            <Button variant="ghost" size="sm" onClick={handleClose}>
              <Icons.X className="w-5 h-5" />
            </Button>
          </div>
        </div>
        
        <div className="p-6">
          <div className="mb-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                <Icons.User className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">{patientName || 'Patient'}</h3>
                <p className="text-sm text-gray-500">{patientPhone}</p>
              </div>
            </div>
            
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
              rows={4}
              placeholder="Type your message here..."
              disabled={sending || sent}
            />
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
            
            {!sent && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Quick Templates</p>
                <div className="space-y-2">
                  {templates.map((template, index) => (
                    <button
                      key={index}
                      onClick={() => setMessage(template)}
                      className="block w-full text-left p-2 text-sm border border-gray-200 rounded hover:bg-gray-50 transition-colors"
                      disabled={sending || sent}
                    >
                      {template}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="flex justify-end space-x-3">
            {!sent ? (
              <>
                <Button variant="outline" onClick={handleClose} disabled={sending}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleSendSMS} 
                  disabled={sending || !message.trim()}
                  className="bg-primary hover:bg-primary/90"
                >
                  {sending ? (
                    <>
                      <Icons.Loader className="w-4 h-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Icons.Send className="w-4 h-4 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
              </>
            ) : (
              <Button onClick={handleClose}>
                <Icons.Check className="w-4 h-4 mr-2" />
                Message Sent
              </Button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SMSDialog;

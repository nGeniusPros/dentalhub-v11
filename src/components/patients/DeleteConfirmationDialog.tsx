import React from 'react';
import { motion } from 'framer-motion';
import { Icons } from '../ui/Icons';
import { Button } from '../ui/button';

interface DeleteConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  itemName?: string;
}

const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  itemName
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-md"
      >
        <div className="p-6">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mr-4">
              <Icons.AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          </div>
          
          <p className="text-gray-600 mb-2">{message}</p>
          
          {itemName && (
            <p className="font-medium text-gray-800 mb-4">"{itemName}"</p>
          )}
          
          <div className="mt-6 flex justify-end space-x-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={onConfirm}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DeleteConfirmationDialog;

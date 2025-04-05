import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Icons } from '../ui/Icons';
import { Button } from '../ui/button';

// Define Patient type (should match the one in Patients.tsx)
interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  dob?: string | null;
  nextAppointment?: string;
  status?: string;
  balance?: number;
  lastVisit?: string;
  address?: string;
  insurance?: string;
  preferredContact?: 'email' | 'phone' | 'sms';
}

interface EditPatientDialogProps {
  isOpen: boolean;
  onClose: () => void;
  patient: Patient | null;
  onSave: (patient: Patient) => void;
}

const EditPatientDialog: React.FC<EditPatientDialogProps> = ({
  isOpen,
  onClose,
  patient,
  onSave
}) => {
  const [formData, setFormData] = useState<Patient>({
    id: '',
    name: '',
    email: '',
    phone: '',
    dob: '',
    nextAppointment: '',
    status: 'active',
    balance: 0,
    lastVisit: '',
    address: '',
    insurance: '',
    preferredContact: 'email'
  });

  // Update form data when patient changes
  useEffect(() => {
    if (patient) {
      setFormData({
        ...patient,
        // Ensure all fields have at least default values
        status: patient.status || 'active',
        balance: patient.balance || 0,
        address: patient.address || '',
        insurance: patient.insurance || '',
        preferredContact: patient.preferredContact || 'email'
      });
    }
  }, [patient]);

  if (!isOpen || !patient) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'balance' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col"
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Edit Patient</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <Icons.X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="(555) 123-4567"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Next Appointment</label>
                <input
                  type="date"
                  name="nextAppointment"
                  value={formData.nextAppointment || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Visit</label>
                <input
                  type="date"
                  name="lastVisit"
                  value={formData.lastVisit || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-transparent"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Balance ($)</label>
                <input
                  type="number"
                  name="balance"
                  value={formData.balance}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Contact Method</label>
                <select
                  name="preferredContact"
                  value={formData.preferredContact}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-transparent"
                >
                  <option value="email">Email</option>
                  <option value="phone">Phone</option>
                  <option value="sms">SMS</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Insurance</label>
                <input
                  type="text"
                  name="insurance"
                  value={formData.insurance}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-transparent"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={2}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-transparent"
              />
            </div>
          </form>
        </div>

        <div className="p-4 border-t border-gray-200 flex justify-end space-x-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            Save Changes
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default EditPatientDialog;

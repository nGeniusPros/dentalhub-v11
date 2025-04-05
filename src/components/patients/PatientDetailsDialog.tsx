import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Icons } from '../ui/Icons';
import { Button } from '../ui/button';
import { Tooth, DentalCalendar } from '../../lib/dental-icons';
import { formatPhoneNumber } from '../../lib/utils';

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
  notes?: PatientNote[];
  address?: string;
  insurance?: string;
  preferredContact?: 'email' | 'phone' | 'sms';
  // NexHealth specific fields
  source?: 'internal' | 'nexhealth' | string;
  nexhealthData?: any; // Original data from NexHealth
  lastSyncedAt?: string;
}

interface PatientNote {
  id: string;
  content: string;
  createdAt: string;
  createdBy: string;
}

interface PatientDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  patient: Patient | null;
  onEdit: (patient: Patient) => void;
  onDelete: (patientId: string) => void;
  onAddNote: (patientId: string, note: string) => void;
}

const PatientDetailsDialog: React.FC<PatientDetailsDialogProps> = ({
  isOpen,
  onClose,
  patient,
  onEdit,
  onDelete,
  onAddNote
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'appointments' | 'notes' | 'billing' | 'nexhealth'>('overview');
  const [newNote, setNewNote] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);

  if (!isOpen || !patient) return null;

  const handleAddNote = () => {
    if (newNote.trim()) {
      onAddNote(patient.id, newNote);
      setNewNote('');
      setIsAddingNote(false);
    }
  };

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col"
      >
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <div className="flex items-center">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
              <Icons.User className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold">{patient.name}</h2>
              <p className="text-gray-500">Patient ID: {patient.id}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <Icons.X className="w-5 h-5" />
          </Button>
        </div>

        <div className="border-b border-gray-200">
          <div className="flex">
            <button
              className={`px-6 py-3 font-medium text-sm ${activeTab === 'overview' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button
              className={`px-6 py-3 font-medium text-sm ${activeTab === 'appointments' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('appointments')}
            >
              Appointments
            </button>
            <button
              className={`px-6 py-3 font-medium text-sm ${activeTab === 'notes' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('notes')}
            >
              Notes
            </button>
            <button
              className={`px-6 py-3 font-medium text-sm ${activeTab === 'billing' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('billing')}
            >
              Billing
            </button>
            {patient.source === 'nexhealth' && (
              <button
                className={`px-6 py-3 font-medium text-sm ${activeTab === 'nexhealth' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab('nexhealth')}
              >
                NexHealth Data
              </button>
            )}
          </div>
        </div>

        <div className="p-6 overflow-y-auto flex-grow">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Contact Information</h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div className="flex items-start">
                      <Icons.Mail className="w-5 h-5 text-gray-400 mt-0.5 mr-3" />
                      <div>
                        <p className="text-sm font-medium">Email</p>
                        <p className="text-sm text-gray-600">{patient.email || 'Not provided'}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Icons.Phone className="w-5 h-5 text-gray-400 mt-0.5 mr-3" />
                      <div>
                        <p className="text-sm font-medium">Phone</p>
                        <p className="text-sm text-gray-600">{patient.phone ? formatPhoneNumber(patient.phone) : 'Not provided'}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Icons.MapPin className="w-5 h-5 text-gray-400 mt-0.5 mr-3" />
                      <div>
                        <p className="text-sm font-medium">Address</p>
                        <p className="text-sm text-gray-600">{patient.address || 'Not provided'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Personal Information</h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div className="flex items-start">
                      <Icons.Calendar className="w-5 h-5 text-gray-400 mt-0.5 mr-3" />
                      <div>
                        <p className="text-sm font-medium">Date of Birth</p>
                        <p className="text-sm text-gray-600">{formatDate(patient.dob)}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Icons.Activity className="w-5 h-5 text-gray-400 mt-0.5 mr-3" />
                      <div>
                        <p className="text-sm font-medium">Status</p>
                        <p className="text-sm">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            patient.status === 'active' ? 'bg-green-100 text-green-800' :
                            patient.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {patient.status || 'active'}
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Icons.CreditCard className="w-5 h-5 text-gray-400 mt-0.5 mr-3" />
                      <div>
                        <p className="text-sm font-medium">Insurance</p>
                        <p className="text-sm text-gray-600">{patient.insurance || 'Not provided'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Appointment Information</h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div className="flex items-start">
                      <DentalCalendar className="w-5 h-5 text-gray-400 mt-0.5 mr-3" />
                      <div>
                        <p className="text-sm font-medium">Next Appointment</p>
                        <p className="text-sm text-gray-600">{formatDate(patient.nextAppointment)}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Icons.Clock className="w-5 h-5 text-gray-400 mt-0.5 mr-3" />
                      <div>
                        <p className="text-sm font-medium">Last Visit</p>
                        <p className="text-sm text-gray-600">{formatDate(patient.lastVisit)}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Billing Information</h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div className="flex items-start">
                      <Icons.DollarSign className="w-5 h-5 text-gray-400 mt-0.5 mr-3" />
                      <div>
                        <p className="text-sm font-medium">Current Balance</p>
                        <p className="text-sm text-gray-600">${(patient.balance || 0).toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3 mt-6">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => onEdit(patient)}
                  >
                    <Icons.Edit className="w-4 h-4 mr-2" />
                    Edit Patient
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                    onClick={() => onDelete(patient.id)}
                  >
                    <Icons.Trash className="w-4 h-4 mr-2" />
                    Delete Patient
                  </Button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'appointments' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Appointments</h3>
                <Button variant="outline" size="sm">
                  <Icons.Plus className="w-4 h-4 mr-2" />
                  Schedule Appointment
                </Button>
              </div>

              {/* Sample appointments - in a real app, these would come from the patient data */}
              <div className="space-y-4">
                {patient.nextAppointment ? (
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center">
                          <DentalCalendar className="w-5 h-5 text-primary mr-2" />
                          <h4 className="font-medium">Upcoming Appointment</h4>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{formatDate(patient.nextAppointment)}</p>
                        <p className="text-sm text-gray-600">Regular Checkup</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Icons.Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                          <Icons.X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <DentalCalendar className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                    <h4 className="text-lg font-medium text-gray-700">No Appointments</h4>
                    <p className="text-gray-500 mb-4">This patient doesn't have any scheduled appointments.</p>
                    <Button variant="outline">
                      <Icons.Plus className="w-4 h-4 mr-2" />
                      Schedule Appointment
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'notes' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Patient Notes</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAddingNote(true)}
                >
                  <Icons.Plus className="w-4 h-4 mr-2" />
                  Add Note
                </Button>
              </div>

              {isAddingNote && (
                <div className="mb-4 bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <textarea
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Enter note about this patient..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 mb-3"
                    rows={3}
                  />
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setIsAddingNote(false);
                        setNewNote('');
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleAddNote}
                      disabled={!newNote.trim()}
                    >
                      Save Note
                    </Button>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {patient.notes && patient.notes.length > 0 ? (
                  patient.notes.map(note => (
                    <div key={note.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="text-sm text-gray-600 whitespace-pre-wrap">{note.content}</p>
                          <div className="mt-2 text-xs text-gray-500">
                            Added by {note.createdBy} on {formatDate(note.createdAt)}
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-500">
                          <Icons.MoreVertical className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Icons.FileText className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                    <h4 className="text-lg font-medium text-gray-700">No Notes</h4>
                    <p className="text-gray-500 mb-4">There are no notes for this patient yet.</p>
                    <Button
                      variant="outline"
                      onClick={() => setIsAddingNote(true)}
                    >
                      <Icons.Plus className="w-4 h-4 mr-2" />
                      Add First Note
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'billing' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Billing Information</h3>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Icons.FileText className="w-4 h-4 mr-2" />
                    View Invoices
                  </Button>
                  <Button variant="outline" size="sm">
                    <Icons.DollarSign className="w-4 h-4 mr-2" />
                    Record Payment
                  </Button>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 mb-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">Current Balance</h4>
                    <p className={`text-2xl font-bold ${(patient.balance || 0) > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      ${(patient.balance || 0).toFixed(2)}
                    </p>
                  </div>
                  <Button variant="outline">
                    <Icons.CreditCard className="w-4 h-4 mr-2" />
                    Make Payment
                  </Button>
                </div>
              </div>

              <h4 className="font-medium mb-3">Recent Transactions</h4>
              <div className="border rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {/* Sample transaction data - in a real app, these would come from an API */}
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(new Date().toISOString())}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        Dental Cleaning
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        $120.00
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Paid
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        X-Ray
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        $85.00
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          Pending
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'nexhealth' && patient.source === 'nexhealth' && (
            <div className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <div className="flex items-center mb-2">
                  <Icons.Info className="w-5 h-5 text-blue-600 mr-2" />
                  <h3 className="text-blue-800 font-medium">NexHealth Integration</h3>
                </div>
                <p className="text-sm text-blue-700">
                  This patient record is synced with NexHealth. Last synced: {formatDate(patient.lastSyncedAt)}
                </p>
              </div>

              {/* NexHealth Patient Details */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">NexHealth Patient Details</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium">NexHealth ID</p>
                      <p className="text-sm text-gray-600">{patient.nexhealthData?.id || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Created At</p>
                      <p className="text-sm text-gray-600">{formatDate(patient.nexhealthData?.created_at)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Updated At</p>
                      <p className="text-sm text-gray-600">{formatDate(patient.nexhealthData?.updated_at)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Status</p>
                      <p className="text-sm">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${patient.nexhealthData?.inactive ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                          {patient.nexhealthData?.inactive ? 'Inactive' : 'Active'}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* NexHealth Bio Information */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Bio Information</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium">Gender</p>
                      <p className="text-sm text-gray-600">{patient.nexhealthData?.bio?.gender || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">New Patient</p>
                      <p className="text-sm text-gray-600">{patient.nexhealthData?.bio?.new_patient ? 'Yes' : 'No'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Non-Patient</p>
                      <p className="text-sm text-gray-600">{patient.nexhealthData?.bio?.non_patient ? 'Yes' : 'No'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Chart ID</p>
                      <p className="text-sm text-gray-600">{patient.nexhealthData?.chart_id || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Preferred Language</p>
                      <p className="text-sm text-gray-600">{patient.nexhealthData?.preferred_language || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Unsubscribe SMS</p>
                      <p className="text-sm text-gray-600">{patient.nexhealthData?.unsubscribe_sms ? 'Yes' : 'No'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* NexHealth Contact Information */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Contact Information</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium">Phone Number</p>
                      <p className="text-sm text-gray-600">{patient.nexhealthData?.bio?.phone_number || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Cell Phone</p>
                      <p className="text-sm text-gray-600">{patient.nexhealthData?.bio?.cell_phone_number || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Home Phone</p>
                      <p className="text-sm text-gray-600">{patient.nexhealthData?.bio?.home_phone_number || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Work Phone</p>
                      <p className="text-sm text-gray-600">{patient.nexhealthData?.bio?.work_phone_number || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* NexHealth Address Information */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Address Information</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium">Address Line 1</p>
                      <p className="text-sm text-gray-600">{patient.nexhealthData?.bio?.address_line_1 || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Address Line 2</p>
                      <p className="text-sm text-gray-600">{patient.nexhealthData?.bio?.address_line_2 || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">City</p>
                      <p className="text-sm text-gray-600">{patient.nexhealthData?.bio?.city || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">State</p>
                      <p className="text-sm text-gray-600">{patient.nexhealthData?.bio?.state || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Zip Code</p>
                      <p className="text-sm text-gray-600">{patient.nexhealthData?.bio?.zip_code || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* NexHealth Financial Information */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Financial Information</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium">Balance</p>
                      <p className="text-sm text-gray-600">
                        {patient.nexhealthData?.balance ?
                          `${patient.nexhealthData.balance.currency || '$'}${patient.nexhealthData.balance.amount}` :
                          'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Billing Type</p>
                      <p className="text-sm text-gray-600">{patient.nexhealthData?.billing_type || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Raw Data Viewer (for developers) */}
              <div className="mt-6">
                <details className="text-sm">
                  <summary className="cursor-pointer text-blue-600 hover:text-blue-800 font-medium">View Raw NexHealth Data (for developers)</summary>
                  <div className="mt-2 p-4 bg-gray-900 text-gray-100 rounded-lg overflow-auto max-h-96">
                    <pre>{JSON.stringify(patient.nexhealthData, null, 2)}</pre>
                  </div>
                </details>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-200 flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default PatientDetailsDialog;

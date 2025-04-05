import React, { useEffect, useState, useRef } from 'react';
import { useMCPRequest } from '../../mcp/client/MCPClient';
import { Icons } from '../../components/ui/Icons';
import { Button } from '../../components/ui/button';
import VoiceCallDialog from '../../components/communication/VoiceCallDialog';
import SMSDialog from '../../components/communication/SMSDialog';
import AddPatientDialog from '../../components/patients/AddPatientDialog';
import PatientDetailsDialog from '../../components/patients/PatientDetailsDialog';
import EditPatientDialog from '../../components/patients/EditPatientDialog';
import DeleteConfirmationDialog from '../../components/patients/DeleteConfirmationDialog';
import FilterDialog from '../../components/patients/FilterDialog';
import Pagination from '../../components/patients/Pagination';
import DentalIcons, { Tooth, DentistChair, DentalCalendar } from '../../lib/dental-icons';
import { fetchFromNexHealth } from '../../config/api';
import { NexHealthSyncService } from '../../services/NexHealthSyncService';
import { supabase } from '../../mcp/config/database';
import {
  Patient,
  PatientNote,
  formatPhoneNumber,
  formatDate,
  formatCurrency,
  exportPatientsToCSV,
  applyFilters,
  formatPhoneForTwilio
} from '../../lib/utils';

// Define the structure for data coming directly from NexHealth API
interface NexHealthPatientBio {
  city: string | null;
  state: string | null;
  gender: string | null;
  zip_code: string | null;
  new_patient: boolean;
  non_patient: boolean;
  phone_number: string | null;
  date_of_birth: string | null; // Format: YYYY-MM-DD
  address_line_1: string | null;
  address_line_2: string | null;
  street_address: string | null;
  cell_phone_number: string | null;
  home_phone_number: string | null;
  work_phone_number: string | null;
  previous_foreign_id: string | null;
}

interface NexHealthPatient {
  id: number; // NexHealth uses number IDs
  email: string | null;
  first_name: string | null;
  middle_name: string | null;
  last_name: string | null;
  name: string; // Combined name provided by NexHealth
  created_at: string;
  updated_at: string;
  institution_id: number;
  foreign_id: string | null;
  foreign_id_type: string | null;
  bio: NexHealthPatientBio;
  inactive: boolean;
  last_sync_time: string | null;
  guarantor_id: number | null;
  unsubscribe_sms: boolean;
  balance: {
    amount: string;
    currency: string;
  } | null;
  billing_type: string | null;
  chart_id: string | null;
  preferred_language: string | null;
  location_ids: number[];
}

const Patients: React.FC = () => {
  // File input reference for importing patients
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Dialog state
  const [isCallDialogOpen, setIsCallDialogOpen] = useState(false);
  const [isSMSDialogOpen, setIsSMSDialogOpen] = useState(false);
  const [isAddPatientDialogOpen, setIsAddPatientDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  // State for internal patient list
  const [loadingInternal, setLoadingInternal] = useState(false);
  const [errorInternal, setErrorInternal] = useState<Error | null>(null);

  // State for NexHealth sync process
  const [syncLoading, setSyncLoading] = useState(false);
  const [syncError, setSyncError] = useState<Error | null>(null);
  const [syncSuccessMessage, setSyncSuccessMessage] = useState<string | null>(null);

  // Add pagination state for NexHealth sync
  const [nexhealthPage, setNexhealthPage] = useState(1);
  const [nexhealthHasMore, setNexhealthHasMore] = useState(true);
  const [nexhealthTotalPatients, setNexhealthTotalPatients] = useState(0);
  const [nexhealthSyncInProgress, setNexhealthSyncInProgress] = useState(false);

  // Local state for patients (combines API data with local additions)
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  // Filter state
  const [filters, setFilters] = useState({
    status: [] as string[],
    balanceRange: { min: null as number | null, max: null as number | null },
    appointmentRange: { start: null as string | null, end: null as string | null },
    lastVisitRange: { start: null as string | null, end: null as string | null }
  });

  // Patient notes state
  const [patientNotes, setPatientNotes] = useState<Record<string, PatientNote[]>>({});

  // Function to fetch internal patients
  const fetchInternalPatients = async () => {
    setLoadingInternal(true);
    setErrorInternal(null);

    try {
      // For now, we'll just use sample data since the MCP server is not running
      const samplePatients: Patient[] = [
        {
          id: 'sample-1',
          name: 'John Doe',
          email: 'john.doe@example.com',
          phone: '(555) 123-4567',
          dob: '1980-01-15',
          status: 'active',
          balance: 150.00,
          nextAppointment: '2023-06-15',
          lastVisit: '2023-01-10'
        },
        {
          id: 'sample-2',
          name: 'Jane Smith',
          email: 'jane.smith@example.com',
          phone: '(555) 987-6543',
          dob: '1975-05-20',
          status: 'active',
          balance: 0,
          nextAppointment: '2023-07-05',
          lastVisit: '2023-02-22'
        },
        {
          id: 'sample-3',
          name: 'Robert Johnson',
          email: 'robert.johnson@example.com',
          phone: '(555) 456-7890',
          dob: '1990-11-08',
          status: 'inactive',
          balance: 75.50,
          nextAppointment: '',
          lastVisit: '2022-12-15'
        }
      ];

      setPatients(samplePatients);
    } catch (error) {
      console.error('Error fetching internal patients:', error);
      setErrorInternal(error instanceof Error ? error : new Error('An unknown error occurred'));
    } finally {
      setLoadingInternal(false);
    }
  };

  // Fetch internal data when the component mounts
  useEffect(() => {
    fetchInternalPatients();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Function to handle the sync button click using the enhanced NexHealthSyncService
  const handleSync = async (fullSync = false) => {
    if (nexhealthSyncInProgress) return;

    setNexhealthSyncInProgress(true);
    setSyncLoading(true);
    setSyncError(null);
    setSyncSuccessMessage(null);

    try {
      // Create a new instance of the NexHealthSyncService
      // In a real implementation, you would get the tenant ID from context or environment
      const tenantId = process.env.DEFAULT_TENANT_ID || 'default';
      const syncService = new NexHealthSyncService(tenantId);

      // Start the sync process with a progress callback
      const syncLog = await syncService.startFullSync((processed, total) => {
        // Update progress message
        const progressPercent = total > 0 ? Math.round((processed / total) * 100) : 0;
        setSyncSuccessMessage(`Syncing patients: ${processed} of ${total} (${progressPercent}%)`);

        // Update state for progress tracking
        setNexhealthTotalPatients(total);
      });

      // After sync is complete, fetch the synced patients from our database
      const { data: syncedPatients, error: fetchError } = await supabase
        .from('nexhealth_patients')
        .select('*')
        .eq('tenant_id', tenantId)
        .order('last_sync_time', { ascending: false });

      if (fetchError) {
        throw new Error(`Error fetching synced patients: ${fetchError.message}`);
      }

      // Transform the database records to our Patient format for display
      if (syncedPatients && syncedPatients.length > 0) {
        const newPatients = syncedPatients.map((nhPatient: any) => ({
          id: `nh-${nhPatient.nexhealth_id}`,
          name: `${nhPatient.first_name || ''} ${nhPatient.last_name || ''}`.trim(),
          email: nhPatient.email || '',
          phone: nhPatient.bio?.phone_number || nhPatient.bio?.cell_phone_number || '',
          dob: nhPatient.bio?.date_of_birth,
          status: nhPatient.inactive ? 'inactive' : 'active',
          balance: nhPatient.balance_amount ? parseFloat(nhPatient.balance_amount) : 0,
          nextAppointment: '',  // We'll populate this from appointments data later
          lastVisit: '',        // We'll populate this from appointments data later
          address: nhPatient.bio?.address_line_1 ?
            `${nhPatient.bio.address_line_1}${nhPatient.bio.address_line_2 ? ', ' + nhPatient.bio.address_line_2 : ''}, ${nhPatient.bio.city || ''}, ${nhPatient.bio.state || ''} ${nhPatient.bio.zip_code || ''}`.trim() :
            '',
          source: 'nexhealth',
          nexhealthData: nhPatient.raw_data, // Store original data for reference
          lastSyncedAt: nhPatient.last_sync_time
        }));

        // Replace existing NexHealth patients with the newly synced ones
        // Keep any local patients that aren't from NexHealth
        const localPatients = patients.filter(p => !p.id.startsWith('nh-'));
        setPatients([...localPatients, ...newPatients]);

        // Set success message
        setSyncSuccessMessage(`Successfully synced ${syncedPatients.length} patients from NexHealth. Created: ${syncLog.records_created}, Updated: ${syncLog.records_updated}, Failed: ${syncLog.records_failed}`);
      } else {
        setSyncSuccessMessage('No patients found in NexHealth.');
      }
    } catch (err: unknown) {
      console.error('Error during NexHealth sync:', err);
      setSyncError(err instanceof Error ? err : new Error('An unknown error occurred during sync'));
    } finally {
      setNexhealthSyncInProgress(false);
      setSyncLoading(false);
    }
  };

  // Function to set up continuous sync with NexHealth
  const setupContinuousSync = async () => {
    try {
      setSyncLoading(true);
      setSyncError(null);
      setSyncSuccessMessage(null);

      // Create a new instance of the NexHealthSyncService
      const tenantId = process.env.DEFAULT_TENANT_ID || 'default';
      const syncService = new NexHealthSyncService(tenantId);

      // Get the base URL for the webhook
      const baseUrl = window.location.origin;
      const webhookUrl = `${baseUrl}/api/nexhealth-webhook`;

      // Set up the webhook for continuous sync
      await syncService.setupContinuousSync(webhookUrl);

      setSyncSuccessMessage('Continuous sync with NexHealth has been set up successfully. New and updated patients will be automatically synced.');
    } catch (err: unknown) {
      console.error('Error setting up continuous sync:', err);
      setSyncError(err instanceof Error ? err : new Error('An unknown error occurred while setting up continuous sync'));
    } finally {
      setSyncLoading(false);
    }
  };



  // Handle adding a new patient
  const handleAddPatient = (patientData: Omit<Patient, 'id'>) => {
    const newPatient: Patient = {
      ...patientData,
      id: `local-${Date.now()}` // Simple ID generation for demo
    };

    setPatients(prev => [...prev, newPatient]);
  };

  // Handle editing a patient
  const handleEditPatient = (updatedPatient: Patient) => {
    setPatients(prev =>
      prev.map(patient =>
        patient.id === updatedPatient.id ? updatedPatient : patient
      )
    );
    setIsEditDialogOpen(false);
  };

  // Handle deleting a patient
  const handleDeletePatient = (patientId: string) => {
    setPatients(prev => prev.filter(patient => patient.id !== patientId));
    setIsDeleteDialogOpen(false);
    setSelectedPatient(null);
  };

  // Handle adding a note to a patient
  const handleAddNote = (patientId: string, noteContent: string) => {
    const newNote: PatientNote = {
      id: `note-${Date.now()}`,
      content: noteContent,
      createdAt: new Date().toISOString(),
      createdBy: 'Current User' // In a real app, this would come from auth context
    };

    setPatientNotes(prev => ({
      ...prev,
      [patientId]: [...(prev[patientId] || []), newNote]
    }));

    // Also update the selected patient if it's the one we're adding a note to
    if (selectedPatient && selectedPatient.id === patientId) {
      setSelectedPatient({
        ...selectedPatient,
        notes: [...(selectedPatient.notes || []), newNote]
      });
    }
  };

  // Handle applying filters
  const handleApplyFilters = (newFilters: typeof filters) => {
    setFilters(newFilters);
    setCurrentPage(0); // Reset to first page when filters change
  };

  // Handle exporting patients
  const handleExportPatients = () => {
    exportPatientsToCSV(filteredAndSortedPatients, `patients_export_${new Date().toISOString().split('T')[0]}.csv`);
  };

  // Handle importing patients from CSV
  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const csvText = event.target?.result as string;
      if (csvText) {
        // Simple CSV parsing (for demo purposes)
        const lines = csvText.split('\n');
        const headers = lines[0].split(',');

        const newPatients: Patient[] = [];

        // Start from 1 to skip header
        for (let i = 1; i < lines.length; i++) {
          if (!lines[i].trim()) continue;

          const values = lines[i].split(',');
          const patient: Partial<Patient> = { id: `import-${Date.now()}-${i}` };

          headers.forEach((header, index) => {
            const key = header.trim().toLowerCase();
            const value = values[index]?.trim();

            if (key === 'name') patient.name = value;
            if (key === 'email') patient.email = value;
            if (key === 'phone') patient.phone = value;
            if (key === 'nextappointment') patient.nextAppointment = value;
            if (key === 'status') patient.status = value || 'active';
            if (key === 'balance') patient.balance = parseFloat(value) || 0;
            if (key === 'lastvisit') patient.lastVisit = value;
            if (key === 'dob') patient.dob = value;
            if (key === 'address') patient.address = value;
            if (key === 'insurance') patient.insurance = value;
          });

          newPatients.push(patient as Patient);
        }

        setPatients(prev => [...prev, ...newPatients]);
      }
    };

    reader.readAsText(file);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Apply search and filters to patients
  const filteredPatients = patients.filter(patient => {
    // Apply search term filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        patient.name?.toLowerCase().includes(searchLower) ||
        patient.email?.toLowerCase().includes(searchLower) ||
        patient.phone?.includes(searchTerm);

      if (!matchesSearch) return false;
    }

    return true;
  });

  // Apply advanced filters
  const filteredAndSortedPatients = applyFilters(filteredPatients, filters);

  // Apply pagination
  const paginatedPatients = filteredAndSortedPatients.slice(
    currentPage * pageSize,
    (currentPage + 1) * pageSize
  );

  // Calculate total pages
  const totalPages = Math.ceil(filteredAndSortedPatients.length / pageSize);

  // Check if any filters are active
  const hasActiveFilters =
    filters.status.length > 0 ||
    filters.balanceRange.min !== null ||
    filters.balanceRange.max !== null ||
    filters.appointmentRange.start !== null ||
    filters.appointmentRange.end !== null ||
    filters.lastVisitRange.start !== null ||
    filters.lastVisitRange.end !== null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Patient Management</h1>
          <p className="text-gray-500">View and manage patient records</p>
        </div>
        <div className="flex gap-3">
          {/* Hidden file input for importing */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".csv"
            className="hidden"
          />
          <Button variant="outline" onClick={handleExportPatients}>
            <Icons.Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" onClick={handleImportClick}>
            <Icons.Upload className="w-4 h-4 mr-2" />
            Import
          </Button>
          <Button
            variant="gradient-ocean"
            onClick={() => setIsAddPatientDialogOpen(true)}
          >
            <Tooth className="w-5 h-5 mr-2" />
            Add Patient
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search patients..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setIsFilterDialogOpen(true)}
                className={hasActiveFilters ? 'border-primary text-primary' : ''}
              >
                <Icons.Filter className="w-4 h-4 mr-2" />
                {hasActiveFilters ? 'Filters Active' : 'Filters'}
                {hasActiveFilters && (
                  <span className="ml-2 bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    {filters.status.length +
                     (filters.balanceRange.min !== null || filters.balanceRange.max !== null ? 1 : 0) +
                     (filters.appointmentRange.start !== null || filters.appointmentRange.end !== null ? 1 : 0) +
                     (filters.lastVisitRange.start !== null || filters.lastVisitRange.end !== null ? 1 : 0)}
                  </span>
                )}
              </Button>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => handleSync(false)}
                  disabled={syncLoading || nexhealthSyncInProgress}
                >
                  {(syncLoading || nexhealthSyncInProgress) ? (
                    <>
                      <Icons.Loader className="w-4 h-4 mr-2 animate-spin" />
                      Syncing...
                    </>
                  ) : (
                    <>
                      <Icons.RefreshCw className="w-4 h-4 mr-2" />
                      Sync with NexHealth
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={setupContinuousSync}
                  disabled={syncLoading || nexhealthSyncInProgress}
                  title="Set up continuous sync with NexHealth"
                >
                  <Icons.Repeat className="w-4 h-4 mr-2" />
                  Set Up Auto-Sync
                </Button>
              </div>
            </div>
          </div>
          {syncError && (
            <div className="mt-2 p-2 bg-red-50 text-red-600 text-sm rounded-md">
              <div className="flex items-center">
                <Icons.AlertCircle className="w-4 h-4 mr-2" />
                Sync Error: {syncError.message}
              </div>
            </div>
          )}
          {syncSuccessMessage && (
            <div className="mt-2 p-2 bg-green-50 text-green-600 text-sm rounded-md">
              <div className="flex items-center">
                <Icons.Check className="w-4 h-4 mr-2" />
                {syncSuccessMessage}
              </div>
            </div>
          )}

          {/* Detailed NexHealth Sync Controls */}
          {(syncLoading || nexhealthSyncInProgress || syncSuccessMessage || syncError) && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium">NexHealth Sync Details</h3>
                {!syncLoading && !nexhealthSyncInProgress && (
                  <Button
                    onClick={() => handleSync(true)}
                    disabled={syncLoading || nexhealthSyncInProgress}
                    size="sm"
                    className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white text-xs"
                  >
                    Full Sync with All Data
                  </Button>
                )}
              </div>

              {(syncLoading || nexhealthSyncInProgress) && (
                <div className="flex items-center space-x-2 text-xs text-blue-700 mb-2">
                  <Icons.Loader className="h-3 w-3 animate-spin" />
                  <span>
                    {nexhealthTotalPatients > 0
                      ? `Syncing patients... (${Math.min(nexhealthPage * 50, nexhealthTotalPatients)} of ${nexhealthTotalPatients} patients)`
                      : 'Syncing patients...'}
                  </span>
                </div>
              )}

              {nexhealthTotalPatients > 0 && (
                <div className="text-xs text-gray-600 mb-2">
                  Total patients available: {nexhealthTotalPatients}
                </div>
              )}

              <div className="mt-2 text-xs text-gray-600">
                <p className="mb-1">A full sync will:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Pull all patient data from NexHealth</li>
                  <li>Sync appointments, documents, and insurance information</li>
                  <li>Store complete patient records in the database</li>
                </ul>
              </div>

              <div className="mt-2 text-xs text-gray-600">
                <p className="mb-1">Setting up auto-sync will:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Register a webhook with NexHealth</li>
                  <li>Automatically sync new and updated patients</li>
                  <li>Keep your data in sync without manual intervention</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {loadingInternal && (
          <div className="p-8 text-center">
            <Icons.Loader className="w-8 h-8 mx-auto text-primary animate-spin" />
            <p className="mt-2 text-gray-500">Loading patients...</p>
          </div>
        )}

        {errorInternal && (
          <div className="p-8 text-center">
            <Icons.AlertCircle className="w-8 h-8 mx-auto text-red-500" />
            <p className="mt-2 text-red-600">Error loading patients: {errorInternal.message}</p>
          </div>
        )}

        {!loadingInternal && !errorInternal && (
          <div className="overflow-x-auto">
            {filteredAndSortedPatients.length > 0 ? (
              <>
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <div className="flex items-center">
                          <Tooth className="w-4 h-4 mr-1 text-navy" />
                          Patient
                        </div>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <div className="flex items-center">
                          <DentalCalendar className="w-4 h-4 mr-1 text-navy" />
                          Next Appointment
                        </div>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Balance
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedPatients.map((patient) => (
                      <tr
                        key={patient.id}
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={() => {
                          // Add patient notes if available
                          const patientWithNotes = {
                            ...patient,
                            notes: patientNotes[patient.id] || []
                          };
                          setSelectedPatient(patientWithNotes);
                          setIsDetailsDialogOpen(true);
                        }}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <Icons.User className="w-5 h-5 text-primary" />
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{patient.name}</div>
                              <div className="text-sm text-gray-500">Last visit: {patient.lastVisit || 'N/A'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{patient.email}</div>
                          <div className="text-sm text-gray-500">{formatPhoneNumber(patient.phone)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{patient.nextAppointment ? formatDate(patient.nextAppointment) : 'None scheduled'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${patient.status === 'active' ? 'bg-green-100 text-green-800' : patient.status === 'inactive' ? 'bg-gray-100 text-gray-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {patient.status || 'active'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(patient.balance)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedPatient(patient);
                                setIsCallDialogOpen(true);
                              }}
                              title="Call patient"
                            >
                              <Icons.Phone className="w-4 h-4 text-green-600" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedPatient(patient);
                                setIsSMSDialogOpen(true);
                              }}
                              title="Text patient"
                            >
                              <Icons.MessageSquare className="w-4 h-4 text-blue-600" />
                            </Button>
                            <div className="relative">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // Add dropdown menu here in a real implementation
                                }}
                              >
                                <Icons.MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Pagination */}
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  pageSize={pageSize}
                  totalItems={filteredAndSortedPatients.length}
                  onPageChange={setCurrentPage}
                  onPageSizeChange={setPageSize}
                />
              </>
            ) : (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Tooth className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">No patients found</h3>
                <p className="text-gray-500 mb-4">
                  {searchTerm || hasActiveFilters ? 'Try adjusting your search or filters' : 'Get started by adding your first patient'}
                </p>
                {hasActiveFilters && (
                  <Button
                    variant="outline"
                    onClick={() => setFilters({
                      status: [],
                      balanceRange: { min: null, max: null },
                      appointmentRange: { start: null, end: null },
                      lastVisitRange: { start: null, end: null }
                    })}
                    className="mr-2"
                  >
                    <Icons.X className="w-4 h-4 mr-2" />
                    Clear Filters
                  </Button>
                )}
                {!searchTerm && !hasActiveFilters && (
                  <Button
                    variant="gradient-ocean"
                    onClick={() => setIsAddPatientDialogOpen(true)}
                  >
                    <Icons.Plus className="w-4 h-4 mr-2" />
                    Add Patient
                  </Button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Communication Dialogs */}
      <VoiceCallDialog
        isOpen={isCallDialogOpen}
        onClose={() => setIsCallDialogOpen(false)}
        patientPhone={formatPhoneForTwilio(selectedPatient?.phone)}
        patientName={selectedPatient?.name}
      />

      <SMSDialog
        isOpen={isSMSDialogOpen}
        onClose={() => setIsSMSDialogOpen(false)}
        patientPhone={formatPhoneForTwilio(selectedPatient?.phone)}
        patientName={selectedPatient?.name}
      />

      {/* Patient Management Dialogs */}
      <AddPatientDialog
        isOpen={isAddPatientDialogOpen}
        onClose={() => setIsAddPatientDialogOpen(false)}
        onAddPatient={handleAddPatient}
      />

      <PatientDetailsDialog
        isOpen={isDetailsDialogOpen}
        onClose={() => setIsDetailsDialogOpen(false)}
        patient={selectedPatient}
        onEdit={(patient) => {
          setIsDetailsDialogOpen(false);
          setSelectedPatient(patient);
          setIsEditDialogOpen(true);
        }}
        onDelete={(patientId) => {
          setIsDetailsDialogOpen(false);
          setIsDeleteDialogOpen(true);
        }}
        onAddNote={handleAddNote}
      />

      <EditPatientDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        patient={selectedPatient}
        onSave={handleEditPatient}
      />

      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={() => selectedPatient && handleDeletePatient(selectedPatient.id)}
        title="Delete Patient"
        message="Are you sure you want to delete this patient? This action cannot be undone."
        itemName={selectedPatient?.name}
      />

      <FilterDialog
        isOpen={isFilterDialogOpen}
        onClose={() => setIsFilterDialogOpen(false)}
        onApplyFilters={handleApplyFilters}
        currentFilters={filters}
      />
    </div>
  );
};

export default Patients;
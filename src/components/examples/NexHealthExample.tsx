import React, { useEffect, useState } from 'react';
import { 
  useNexHealthPatients, 
  useNexHealthProviders,
  useNexHealthAppointments,
  useCreateNexHealthPatient,
  useCreateNexHealthAppointment
} from '../../hooks/useNexHealth';

const NexHealthExample: React.FC = () => {
  // State for pagination
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  
  // State for new patient form
  const [newPatient, setNewPatient] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    bio: {
      date_of_birth: ''
    }
  });
  
  // State for new appointment form
  const [newAppointment, setNewAppointment] = useState({
    patient_id: '',
    provider_id: '',
    start_time: '',
    appointment_type_id: ''
  });
  
  // Hooks for fetching data
  const { 
    patients, 
    loading: patientsLoading, 
    error: patientsError, 
    fetchPatients 
  } = useNexHealthPatients();
  
  const { 
    providers, 
    loading: providersLoading, 
    error: providersError, 
    fetchProviders 
  } = useNexHealthProviders();
  
  const { 
    appointments, 
    loading: appointmentsLoading, 
    error: appointmentsError, 
    fetchAppointments 
  } = useNexHealthAppointments();
  
  // Hooks for creating data
  const { 
    createdPatient, 
    loading: createPatientLoading, 
    error: createPatientError, 
    createPatient 
  } = useCreateNexHealthPatient();
  
  const { 
    createdAppointment, 
    loading: createAppointmentLoading, 
    error: createAppointmentError, 
    createAppointment 
  } = useCreateNexHealthAppointment();
  
  // Fetch data on component mount
  useEffect(() => {
    fetchPatients({ page, per_page: perPage });
    fetchProviders();
    fetchAppointments({ start_date: new Date().toISOString().split('T')[0] });
  }, [page, perPage]);
  
  // Handle patient form input changes
  const handlePatientInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'date_of_birth') {
      setNewPatient({
        ...newPatient,
        bio: {
          ...newPatient.bio,
          date_of_birth: value
        }
      });
    } else {
      setNewPatient({
        ...newPatient,
        [name]: value
      });
    }
  };
  
  // Handle appointment form input changes
  const handleAppointmentInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewAppointment({
      ...newAppointment,
      [name]: value
    });
  };
  
  // Handle patient form submission
  const handlePatientSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createPatient(newPatient);
      // Reset form on success
      setNewPatient({
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        bio: {
          date_of_birth: ''
        }
      });
      // Refresh patient list
      fetchPatients({ page, per_page: perPage });
    } catch (error) {
      console.error('Error creating patient:', error);
    }
  };
  
  // Handle appointment form submission
  const handleAppointmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createAppointment(newAppointment);
      // Reset form on success
      setNewAppointment({
        patient_id: '',
        provider_id: '',
        start_time: '',
        appointment_type_id: ''
      });
      // Refresh appointment list
      fetchAppointments({ start_date: new Date().toISOString().split('T')[0] });
    } catch (error) {
      console.error('Error creating appointment:', error);
    }
  };
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">NexHealth Integration Example</h1>
      
      {/* Patients Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Patients</h2>
        
        {/* Patient List */}
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Patient List</h3>
          {patientsLoading ? (
            <p>Loading patients...</p>
          ) : patientsError ? (
            <p className="text-red-500">Error: {patientsError.message}</p>
          ) : (
            <>
              <table className="min-w-full bg-white border border-gray-200">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b">Name</th>
                    <th className="py-2 px-4 border-b">Email</th>
                    <th className="py-2 px-4 border-b">Phone</th>
                    <th className="py-2 px-4 border-b">Date of Birth</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.map(patient => (
                    <tr key={patient.id}>
                      <td className="py-2 px-4 border-b">{patient.first_name} {patient.last_name}</td>
                      <td className="py-2 px-4 border-b">{patient.email || 'N/A'}</td>
                      <td className="py-2 px-4 border-b">{patient.phone_number || 'N/A'}</td>
                      <td className="py-2 px-4 border-b">{patient.bio?.date_of_birth || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {/* Pagination Controls */}
              <div className="flex items-center justify-between mt-4">
                <button
                  className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                  onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                  disabled={page === 1}
                >
                  Previous
                </button>
                <span>Page {page}</span>
                <button
                  className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                  onClick={() => setPage(prev => prev + 1)}
                  disabled={patients.length < perPage}
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
        
        {/* Create Patient Form */}
        <div>
          <h3 className="text-lg font-medium mb-2">Create New Patient</h3>
          <form onSubmit={handlePatientSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">First Name</label>
                <input
                  type="text"
                  name="first_name"
                  value={newPatient.first_name}
                  onChange={handlePatientInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Last Name</label>
                <input
                  type="text"
                  name="last_name"
                  value={newPatient.last_name}
                  onChange={handlePatientInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={newPatient.email}
                  onChange={handlePatientInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone Number</label>
                <input
                  type="tel"
                  name="phone_number"
                  value={newPatient.phone_number}
                  onChange={handlePatientInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Date of Birth</label>
                <input
                  type="date"
                  name="date_of_birth"
                  value={newPatient.bio.date_of_birth}
                  onChange={handlePatientInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
              disabled={createPatientLoading}
            >
              {createPatientLoading ? 'Creating...' : 'Create Patient'}
            </button>
            {createPatientError && (
              <p className="text-red-500 mt-2">Error: {createPatientError.message}</p>
            )}
            {createdPatient && (
              <p className="text-green-500 mt-2">
                Successfully created patient: {createdPatient.first_name} {createdPatient.last_name}
              </p>
            )}
          </form>
        </div>
      </div>
      
      {/* Providers Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Providers</h2>
        {providersLoading ? (
          <p>Loading providers...</p>
        ) : providersError ? (
          <p className="text-red-500">Error: {providersError.message}</p>
        ) : (
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Name</th>
                <th className="py-2 px-4 border-b">Email</th>
                <th className="py-2 px-4 border-b">Phone</th>
                <th className="py-2 px-4 border-b">Requestable</th>
              </tr>
            </thead>
            <tbody>
              {providers.map(provider => (
                <tr key={provider.id}>
                  <td className="py-2 px-4 border-b">{provider.first_name} {provider.last_name}</td>
                  <td className="py-2 px-4 border-b">{provider.email || 'N/A'}</td>
                  <td className="py-2 px-4 border-b">{provider.phone_number || 'N/A'}</td>
                  <td className="py-2 px-4 border-b">{provider.requestable ? 'Yes' : 'No'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      
      {/* Appointments Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Appointments</h2>
        
        {/* Appointment List */}
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Today's Appointments</h3>
          {appointmentsLoading ? (
            <p>Loading appointments...</p>
          ) : appointmentsError ? (
            <p className="text-red-500">Error: {appointmentsError.message}</p>
          ) : (
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">Patient</th>
                  <th className="py-2 px-4 border-b">Provider</th>
                  <th className="py-2 px-4 border-b">Start Time</th>
                  <th className="py-2 px-4 border-b">End Time</th>
                  <th className="py-2 px-4 border-b">Status</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map(appointment => (
                  <tr key={appointment.id}>
                    <td className="py-2 px-4 border-b">{appointment.patient_id}</td>
                    <td className="py-2 px-4 border-b">{appointment.provider_id}</td>
                    <td className="py-2 px-4 border-b">{new Date(appointment.start_time).toLocaleString()}</td>
                    <td className="py-2 px-4 border-b">{new Date(appointment.end_time).toLocaleString()}</td>
                    <td className="py-2 px-4 border-b">{appointment.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        
        {/* Create Appointment Form */}
        <div>
          <h3 className="text-lg font-medium mb-2">Create New Appointment</h3>
          <form onSubmit={handleAppointmentSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Patient</label>
                <select
                  name="patient_id"
                  value={newAppointment.patient_id}
                  onChange={handleAppointmentInputChange}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="">Select Patient</option>
                  {patients.map(patient => (
                    <option key={patient.id} value={patient.id}>
                      {patient.first_name} {patient.last_name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Provider</label>
                <select
                  name="provider_id"
                  value={newAppointment.provider_id}
                  onChange={handleAppointmentInputChange}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="">Select Provider</option>
                  {providers.map(provider => (
                    <option key={provider.id} value={provider.id}>
                      {provider.first_name} {provider.last_name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Start Time</label>
                <input
                  type="datetime-local"
                  name="start_time"
                  value={newAppointment.start_time}
                  onChange={handleAppointmentInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Appointment Type</label>
                <input
                  type="text"
                  name="appointment_type_id"
                  value={newAppointment.appointment_type_id}
                  onChange={handleAppointmentInputChange}
                  className="w-full p-2 border rounded"
                  required
                  placeholder="Enter appointment type ID"
                />
              </div>
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
              disabled={createAppointmentLoading}
            >
              {createAppointmentLoading ? 'Creating...' : 'Create Appointment'}
            </button>
            {createAppointmentError && (
              <p className="text-red-500 mt-2">Error: {createAppointmentError.message}</p>
            )}
            {createdAppointment && (
              <p className="text-green-500 mt-2">
                Successfully created appointment on {new Date(createdAppointment.start_time).toLocaleString()}
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default NexHealthExample;

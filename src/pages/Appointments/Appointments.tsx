import React, { useCallback } from 'react';
import { useRealtime } from '../../hooks/useRealtime';
import { supabase } from '../../mcp/config/database';

interface Appointment {
  id: string;
  patient_id: string;
  dentist_id: string;
  scheduled_time: string;
  status: string;
  notes?: string;
}

const Appointments: React.FC = () => {
  const fetchAppointments = useCallback(async () => {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .order('scheduled_time', { ascending: true });
    
    if (error) throw error;
    return data as Appointment[];
  }, []);

  const {
    data: appointments,
    loading,
    error
  } = useRealtime<Appointment>('appointments', fetchAppointments);

  return (
    <div className="p-6">
      {loading && <div className="text-gray-600">Loading appointments...</div>}
      {error && <div className="text-red-600">Error: {error.message}</div>}
      
      <div className="mt-4">
        <h1 className="text-2xl font-bold mb-4">Appointments</h1>
        <div className="space-y-4">
          {appointments?.map(appointment => (
            <div key={appointment.id} className="p-4 bg-white rounded-lg shadow">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">Patient: {appointment.patient_id}</p>
                  <p className="text-gray-600">Dentist: {appointment.dentist_id}</p>
                  <p className="text-gray-600">Time: {new Date(appointment.scheduled_time).toLocaleString()}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-sm ${
                  appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                  appointment.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {appointment.status}
                </span>
              </div>
              {appointment.notes && (
                <p className="mt-2 text-gray-600">Notes: {appointment.notes}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Appointments;
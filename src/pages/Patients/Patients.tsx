import React, { useEffect } from 'react';
import { useMCPRequest } from '../../mcp/client/MCPClient'; // Adjust path as needed

// Define the expected structure for a single patient
interface Patient {
  id: string;
  name: string;
  dob: string;
  phone: string;
}

const Patients: React.FC = () => {
  // Use the hook to fetch a list of patients
  const { data: patients, loading, error, execute: fetchPatients } = useMCPRequest<Patient[]>('/api/patients', 'GET');

  // Fetch data when the component mounts
  useEffect(() => {
    fetchPatients();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    // fetchPatients is stable and doesn't need to be in dependency array for this simple case
  }, []);

  return (
    <div>
      <h1>Patients</h1>
      
      {loading && <p>Loading patients...</p>}
      
      {error && <p style={{ color: 'red' }}>Error loading patients: {error.message}</p>}
      
      {patients && patients.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Date of Birth</th>
              <th>Phone</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient) => (
              <tr key={patient.id}>
                <td>{patient.id}</td>
                <td>{patient.name}</td>
                <td>{patient.dob}</td>
                <td>{patient.phone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {patients && patients.length === 0 && !loading && (
         <p>No patients found.</p>
      )}
    </div>
  );
};

export default Patients;
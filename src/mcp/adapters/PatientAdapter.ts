import { Adapter } from '../types';
import { MCPRequest, MCPResponse } from '../protocol/types'; // Import MCPResponse
import { SupabaseClient } from '@supabase/supabase-js';

export class PatientAdapter implements Adapter {
  private supabase: SupabaseClient;

  constructor(supabase: SupabaseClient) {
    if (!supabase) {
      throw new Error("PatientAdapter: Supabase client is required.");
    }
    this.supabase = supabase;
  }

  async processRequest(request: MCPRequest): Promise<unknown> { // Rename to match Adapter interface
    const client = this.supabase;
    console.log(`PatientAdapter processing request for path: ${request.path} with method: ${request.method}`);

    const pathParts = request.path.split('/');
    const resource = pathParts[2]; 
    const resourceId = pathParts[3]; 

    if (resource !== 'patients') {
       throw new Error(`PatientAdapter: Unsupported resource type "${resource}"`);
    }

    try {
      switch (request.method.toUpperCase()) {
        case 'GET':
          if (resourceId) {
            console.log(`PatientAdapter: Fetching patient by ID: ${resourceId}`);
            const { data, error } = await client
              .from('profiles') 
              .select('*')
              .eq('id', resourceId)
              .eq('role', 'patient') 
              .single(); 

            if (error) {
              console.error('Supabase GET single error:', error);
              if (error.code === 'PGRST116') { 
                 console.warn(`Patient profile not found or multiple found for ID: ${resourceId}`);
                 return null; 
              }
              throw new Error(`Database error fetching patient: ${error.message}`);
            }
            console.log(`PatientAdapter: Found patient data for ID ${resourceId}:`, data);
            return {
              status: 200,
              headers: { 'Content-Type': 'application/json' },
              body: data,
              error: null
            };

          } else {
            console.log('PatientAdapter: Fetching all patients');
            const { data, error } = await client
              .from('profiles') 
              .select('*') 
              .eq('role', 'patient'); 

            if (error) {
              console.error('Supabase GET all error:', error);
              throw new Error(`Database error fetching patients: ${error.message}`);
            }
            console.log(`PatientAdapter: Found ${data?.length || 0} patients`);
            return {
              status: 200,
              headers: { 'Content-Type': 'application/json' },
              body: data || [],
              error: null
            };
          }

        case 'POST':
          if (!resourceId) {
             console.log('PatientAdapter: Creating new patient with body:', request.body);
             if (!request.body || typeof request.body !== 'object') {
                throw new Error('Invalid request body for creating patient.');
             }
             const newPatientData = { ...request.body, role: 'patient' }; 
             const { data, error } = await client
               .from('profiles') 
               .insert([newPatientData]) 
               .select() 
               .single(); 

             if (error) {
               console.error('Supabase POST error:', error);
               if (error.code === '23505') { 
                  throw new Error('Patient profile creation failed: Duplicate data (e.g., email).' + error.message);
               }
               throw new Error(`Database error creating patient: ${error.message}`);
             }
             console.log('PatientAdapter: Successfully created patient:', data);
             return {
               status: 201, // Created
               headers: { 'Content-Type': 'application/json' },
               body: data,
               error: null
             };
          } else {
             throw new Error('POST requests to specific patient IDs are not supported.');
          }
        
        case 'PUT':
           if (resourceId) {
              console.log(`PatientAdapter: Updating patient ${resourceId} with body:`, request.body);
              if (!request.body || typeof request.body !== 'object') {
                 throw new Error('Invalid request body for updating patient.');
              }
              const { role: _role, ...updateData } = request.body as Record<string, unknown>;
              const { data, error } = await client
                .from('profiles') 
                .update(updateData) 
                .eq('id', resourceId)
                .eq('role', 'patient') 
                .select() 
                .single(); 

              if (error) {
                console.error('Supabase PUT error:', error);
                 if (error.code === 'PGRST116') { 
                   console.warn(`Patient profile not found for update with ID: ${resourceId}`);
                   return null; 
                 }
                throw new Error(`Database error updating patient: ${error.message}`);
              }
              console.log(`PatientAdapter: Successfully updated patient ${resourceId}:`, data);
              return {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
                body: data,
                error: null
              };
           } else {
              throw new Error('PUT requests require a patient ID.');
           }

        case 'DELETE':
           if (resourceId) {
              console.log(`PatientAdapter: Deleting patient ${resourceId}`);
              const { data, error } = await client
                .from('profiles') 
                .delete()
                .eq('id', resourceId)
                .eq('role', 'patient'); 

              if (error) {
                console.error('Supabase DELETE error:', error);
                throw new Error(`Database error deleting patient: ${error.message}`);
              }
              console.log(`PatientAdapter: Delete operation completed for patient ID ${resourceId}. Result:`, data);
              return {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
                body: { success: true, id: resourceId },
                error: null
              };
            } else {
              throw new Error('DELETE requests require a patient ID.');
            }

        default:
          console.warn(`PatientAdapter: Unsupported HTTP method: ${request.method}`);
          throw new Error(`Unsupported HTTP method: ${request.method}`);
      }
    } catch (err) {
        console.error(`PatientAdapter Error: Path=${request.path}, Method=${request.method}, Error:`, err);
        return {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
          body: null,
          error: {
            code: 'ADAPTER_ERROR',
            message: err instanceof Error ? err.message : String(err),
            details: err instanceof Error ? err.stack : String(err)
          }
        };
    }
  }
}
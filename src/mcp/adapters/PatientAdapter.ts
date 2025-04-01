import { Adapter } from '../types';
import { MCPRequest } from '../protocol/types';
import { SupabaseClient } from '@supabase/supabase-js';

// Import the initialized Supabase client from the central config file
// IMPORTANT: This relies on the build process compiling src/mcp/config/database.ts 
// to a location accessible via this relative path (e.g., ../config/database.js or .cjs)
// Adjust the path and extension based on your build output.
import supabase from '../config/database'; 

export class PatientAdapter implements Adapter {

  private getSupabaseClient(): SupabaseClient {
    // Check if the imported client is valid
    if (!supabase) {
      // This error indicates a problem with the central database configuration/initialization
      console.error("PatientAdapter: Imported Supabase client is not valid!");
      throw new Error("Database client is not available due to configuration error.");
    }
    return supabase;
  }

  async processRequest(request: MCPRequest): Promise<unknown> {
    const client = this.getSupabaseClient(); // Get the centrally initialized client
    console.log(`PatientAdapter processing request for path: ${request.path} with method: ${request.method}`);

    const pathParts = request.path.split('/');
    // Expecting path like /api/patients or /api/patients/:id
    const resource = pathParts[2]; 
    const resourceId = pathParts[3]; 

    if (resource !== 'patients') {
       throw new Error(`PatientAdapter: Unsupported resource type "${resource}"`);
    }

    try {
      switch (request.method.toUpperCase()) {
        case 'GET':
          if (resourceId) {
            // Fetch single patient by ID
            console.log(`PatientAdapter: Fetching patient by ID: ${resourceId}`);
            const { data, error } = await client
              .from('profiles') // Use 'profiles' table
              .select('*')
              .eq('id', resourceId)
              .eq('role', 'patient') // Ensure it's a patient profile
              .single(); // Expecting one or zero results

            if (error) {
              console.error('Supabase GET single error:', error);
              if (error.code === 'PGRST116') { // Code for "JSON object requested, multiple (or no) rows returned"
                 throw new Error(`Patient with ID ${resourceId} not found`);
              }
              throw new Error(`Supabase error: ${error.message}`);
            }
            if (!data) {
               throw new Error(`Patient with ID ${resourceId} not found`);
            }
            console.log(`PatientAdapter: Found patient:`, data);
            return data;

          } else {
            // Fetch all patients
            console.log('PatientAdapter: Fetching all patients');
            // Add query parameter handling if needed (e.g., for pagination, filtering)
            const { data, error } = await client
              .from('profiles') // Use 'profiles' table
              .select('*') // Add ordering, limits etc. as needed
              .eq('role', 'patient'); // Filter for patients

            if (error) {
              console.error('Supabase GET all error:', error);
              throw new Error(`Supabase error: ${error.message}`);
            }
            console.log(`PatientAdapter: Found ${data?.length || 0} patients`);
            return data || []; // Return empty array if data is null
          }

        case 'POST':
          if (!resourceId) {
             // Create new patient
             console.log('PatientAdapter: Creating new patient with body:', request.body);
             if (!request.body || typeof request.body !== 'object') {
                throw new Error('Invalid request body for creating patient.');
             }
             // Add validation for request.body fields here
             // Ensure the role is set correctly for a new patient profile
             const patientData = { ...request.body, role: 'patient' }; 
             const { data, error } = await client
               .from('profiles') // Use 'profiles' table
               .insert([patientData]) 
               .select() // Return the created record
               .single(); // Expecting one record back

             if (error) {
               console.error('Supabase POST error:', error);
               throw new Error(`Supabase error: ${error.message}`);
             }
             console.log('PatientAdapter: Created patient:', data);
             return data;
          } else {
             throw new Error('POST requests to specific patient IDs are not supported.');
          }
        
        // Add PUT (update), DELETE cases here
        case 'PUT':
           if (resourceId) {
              console.log(`PatientAdapter: Updating patient ${resourceId} with body:`, request.body);
              if (!request.body || typeof request.body !== 'object') {
                 throw new Error('Invalid request body for updating patient.');
              }
              // Add validation
              // Explicitly ignore the 'role' field from the update payload
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              const { role: _role, ...updateData } = request.body as Record<string, unknown>;
              const { data, error } = await client
                .from('profiles') // Use 'profiles' table
                .update(updateData) // Use data without role
                .eq('id', resourceId)
                .eq('role', 'patient') // Ensure we only update patients
                .select()
                .single();

              if (error) {
                console.error('Supabase PUT error:', error);
                throw new Error(`Supabase error: ${error.message}`);
              }
              if (!data) {
                 throw new Error(`Patient with ID ${resourceId} not found for update.`);
              }
              console.log('PatientAdapter: Updated patient:', data);
              return data;
           } else {
              throw new Error('PUT requests require a patient ID.');
           }

        case 'DELETE':
           if (resourceId) {
              console.log(`PatientAdapter: Deleting patient ${resourceId}`);
              const { error } = await client
                .from('profiles') // Use 'profiles' table
                .delete()
                .eq('id', resourceId)
                .eq('role', 'patient'); // Ensure we only delete patients

              if (error) {
                console.error('Supabase DELETE error:', error);
                throw new Error(`Supabase error: ${error.message}`);
              }
              console.log(`PatientAdapter: Deleted patient ${resourceId}`);
              // Return success indication, maybe { success: true } or just null/undefined
              return { success: true, id: resourceId }; 
           } else {
              throw new Error('DELETE requests require a patient ID.');
           }

        default:
          console.warn(`PatientAdapter: Unsupported method ${request.method}`);
          throw new Error(`Unsupported operation: ${request.method} on ${request.path}`);
      }
    } catch (error) {
       // Log the error within the adapter before re-throwing
       console.error(`PatientAdapter Error: Path=${request.path}, Method=${request.method}, Error=${error instanceof Error ? error.message : String(error)}`);
       // Re-throw the error so the gateway can catch it and format an MCPError response
       throw error; 
    }
  }
}
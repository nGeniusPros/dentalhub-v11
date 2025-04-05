import { supabase } from '../mcp/config/database';
import { fetchFromNexHealth } from '../config/api';
import nexhealthLogger from '../utils/nexhealth-logger';
import NexHealthBatchProcessor from '../utils/nexhealth-batch-processor';
import { v4 as uuidv4 } from 'uuid';

// Types for NexHealth data
interface NexHealthPatientBio {
  city: string | null;
  state: string | null;
  gender: string | null;
  zip_code: string | null;
  new_patient: boolean;
  non_patient: boolean;
  phone_number: string | null;
  date_of_birth: string | null;
  address_line_1: string | null;
  address_line_2: string | null;
  street_address: string | null;
  cell_phone_number: string | null;
  home_phone_number: string | null;
  work_phone_number: string | null;
  previous_foreign_id: string | null;
}

interface NexHealthPatient {
  id: number;
  email: string | null;
  first_name: string | null;
  middle_name: string | null;
  last_name: string | null;
  name: string;
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

interface NexHealthAppointment {
  id: number;
  patient_id: number;
  provider_id: number;
  location_id: number;
  operatory_id?: number;
  appointment_type_id: number;
  start_time: string;
  end_time: string;
  status: 'confirmed' | 'cancelled' | 'pending';
  created_at: string;
  updated_at: string;
}

interface NexHealthDocument {
  id: number;
  patient_id: number;
  filename: string;
  content_type: string;
  size: number;
  url: string;
  created_at: string;
  updated_at: string;
}

interface NexHealthInsuranceCoverage {
  id: number;
  patient_id: number;
  insurance_plan_id: number;
  subscriber_id: string;
  group_number?: string;
  is_primary: boolean;
  created_at: string;
  updated_at: string;
}

// Response structure
interface NexHealthResponse<T> {
  data: T;
  meta?: {
    pagination?: {
      total: number;
      count: number;
      per_page: number;
      current_page: number;
      total_pages: number;
    };
  };
  count?: number;
}

// Sync log entry
interface SyncLogEntry {
  id?: string;
  sync_type: string;
  start_time?: string;
  end_time?: string | null;
  status: string;
  records_processed?: number;
  records_created?: number;
  records_updated?: number;
  records_failed?: number;
  error_message?: string | null;
  details?: any;
  tenant_id: string;
}

export class NexHealthSyncService {
  private tenantId: string;

  constructor(tenantId: string) {
    this.tenantId = tenantId;
  }

  /**
   * Start a full sync of all patient data from NexHealth
   *
   * This method uses batch processing to efficiently sync large datasets
   * and includes comprehensive error handling and logging.
   *
   * @param onProgress Optional callback for progress updates
   * @param options Optional configuration for the sync process
   */
  async startFullSync(
    onProgress?: (progress: number, total: number) => void,
    options: {
      batchSize?: number;
      maxConcurrent?: number;
      testMode?: boolean;
    } = {}
  ): Promise<SyncLogEntry> {
    const syncId = uuidv4();
    const logger = nexhealthLogger.withContext({ syncId, syncType: 'full_patient_sync' });

    // Default options
    const {
      batchSize = 50,
      maxConcurrent = 1,
      testMode = false
    } = options;

    // Create a sync log entry
    const syncLog: SyncLogEntry = {
      sync_type: 'full_patient_sync',
      start_time: new Date().toISOString(),
      status: 'in_progress',
      records_processed: 0,
      records_created: 0,
      records_updated: 0,
      records_failed: 0,
      tenant_id: this.tenantId,
      details: {
        syncId,
        options: { batchSize, maxConcurrent, testMode }
      }
    };

    logger.info('Starting full patient sync', {
      tenantId: this.tenantId,
      batchSize,
      maxConcurrent,
      testMode
    });

    // Insert the sync log entry
    const { data: logEntry, error: logError } = await supabase
      .from('nexhealth_sync_logs')
      .insert([syncLog])
      .select()
      .single();

    if (logError) {
      logger.error('Error creating sync log entry', logError);
      throw new Error(`Failed to create sync log: ${logError.message}`);
    }

    try {
      // First request to get total count
      logger.info('Fetching initial patient count');
      const initialResponse = await this.fetchPatientsPage(1, 1);
      const totalPatients = initialResponse.meta?.pagination?.total || 0;
      const totalPages = initialResponse.meta?.pagination?.total_pages || 0;

      logger.info('Patient count retrieved', { totalPatients, totalPages });

      if (totalPatients === 0) {
        logger.warn('No patients found to sync');
        const finalLog = await this.updateSyncLog(logEntry.id, {
          status: 'completed',
          end_time: new Date().toISOString(),
          records_processed: 0,
          details: { ...syncLog.details, message: 'No patients found to sync' }
        });
        return finalLog;
      }

      // Collect all patients first (with pagination)
      logger.info('Collecting all patients for sync');
      const allPatients: NexHealthPatient[] = [];
      let page = 1;
      let hasMore = true;

      while (hasMore) {
        try {
          logger.debug(`Fetching patients page ${page}`);
          const patientsResponse = await this.fetchPatientsPage(page, batchSize);
          const patients = patientsResponse.data?.patients || [];

          allPatients.push(...patients);
          logger.debug(`Retrieved ${patients.length} patients from page ${page}`);

          // Check if we have more pages
          hasMore = patients.length === batchSize &&
                   (patientsResponse.meta?.pagination?.current_page || 0) <
                   (patientsResponse.meta?.pagination?.total_pages || 0);
          page++;

          // Add a small delay to avoid overwhelming the server
          if (hasMore) {
            await new Promise(resolve => setTimeout(resolve, 500));
          }
        } catch (error) {
          logger.error(`Error fetching patients page ${page}`, error);
          // Continue to next page even if this one fails
          page++;
          if (page > totalPages) {
            hasMore = false;
          }
        }
      }

      logger.info(`Collected ${allPatients.length} patients for processing`);

      // Update the sync log with the total count
      await this.updateSyncLog(logEntry.id, {
        details: { ...syncLog.details, totalPatients: allPatients.length }
      });

      // Process all patients using batch processor
      const batchProcessor = new NexHealthBatchProcessor<NexHealthPatient>({
        name: `NexHealth Patient Sync (${syncId})`,
        batchSize,
        maxConcurrent,
        continueOnError: true,
        maxRetries: 3,
        retryDelayMs: 5000,
        processItem: async (patient, index, batchIndex) => {
          if (testMode) {
            // In test mode, just log the patient without saving
            logger.debug(`Test mode: Processing patient ${patient.id}`, {
              patientId: patient.id,
              name: `${patient.first_name} ${patient.last_name}`,
              index,
              batchIndex
            });
            await new Promise(resolve => setTimeout(resolve, 50)); // Simulate processing time
          } else {
            // Actually sync the patient data
            await this.syncPatientData(patient);
          }
        },
        onProgress: (processed, total, batchIndex) => {
          logger.debug(`Sync progress: ${processed}/${total}`, { batchIndex });
          if (onProgress) {
            onProgress(processed, total);
          }

          // Update the sync log periodically (every 10% or every batch)
          if (processed % Math.max(Math.floor(total / 10), batchSize) === 0 || processed === total) {
            void this.updateSyncLog(logEntry.id, {
              records_processed: processed,
              records_created: syncLog.records_created,
              records_updated: syncLog.records_updated,
              records_failed: syncLog.records_failed
            });
          }
        },
        onBatchComplete: (batchIndex, batchSize, timeMs) => {
          logger.info(`Completed batch ${batchIndex}`, { batchSize, timeMs });
        },
        onBatchError: (error, batchIndex, items) => {
          logger.error(`Error processing batch ${batchIndex}`, error, {
            batchSize: items.length,
            firstPatientId: items[0]?.id
          });

          // Update failed count
          syncLog.records_failed = (syncLog.records_failed || 0) + items.length;
        }
      });

      // Start the batch processing
      const batchResult = await batchProcessor.process(allPatients);

      logger.info('Batch processing completed', batchResult);

      // Update the sync log with completion status
      const finalLog = await this.updateSyncLog(logEntry.id, {
        status: batchResult.success ? 'completed' : 'completed_with_errors',
        end_time: new Date().toISOString(),
        records_processed: batchResult.processed,
        records_failed: batchResult.failed,
        details: {
          ...syncLog.details,
          batchResult,
          errors: batchResult.errors.map(e => e.message || String(e)).slice(0, 10) // Include first 10 errors
        }
      });

      return finalLog;
    } catch (error) {
      logger.error('Error during full sync', error);

      // Update the sync log with error status
      const errorLog = await this.updateSyncLog(logEntry.id, {
        status: 'failed',
        end_time: new Date().toISOString(),
        error_message: error instanceof Error ? error.message : 'Unknown error during sync',
        details: {
          ...syncLog.details,
          error: error instanceof Error ? {
            message: error.message,
            stack: error.stack,
            name: error.name
          } : String(error)
        }
      });

      return errorLog;
    }
  }

  /**
   * Sync a single patient's data from NexHealth
   *
   * @param patient The patient data from NexHealth
   * @param options Optional configuration for the sync process
   */
  async syncPatientData(
    patient: NexHealthPatient,
    options: {
      skipRelatedData?: boolean;
      syncId?: string;
    } = {}
  ): Promise<void> {
    const syncId = options.skipRelatedData || uuidv4();
    const logger = nexhealthLogger.withContext({
      syncId,
      patientId: patient.id.toString(),
      patientName: `${patient.first_name || ''} ${patient.last_name || ''}`.trim()
    });

    logger.debug('Syncing patient data', {
      patientId: patient.id,
      email: patient.email ? `${patient.email.substring(0, 2)}***@${patient.email.split('@')[1]}` : null,
      skipRelatedData: options.skipRelatedData
    });

    try {
      // First, check if this patient already exists in our database
      const { data: existingPatient, error: queryError } = await supabase
        .from('nexhealth_patients')
        .select('*')
        .eq('nexhealth_id', patient.id.toString())
        .single();

      if (queryError && queryError.code !== 'PGRST116') { // PGRST116 is "no rows returned" which is expected for new patients
        logger.error('Error checking for existing patient', queryError);
        throw new Error(`Error checking for existing patient: ${queryError.message}`);
      }

      // Prepare patient data for database
      const patientData = {
        nexhealth_id: patient.id.toString(),
        first_name: patient.first_name || '',
        middle_name: patient.middle_name,
        last_name: patient.last_name || '',
        email: patient.email,
        created_at: patient.created_at,
        updated_at: patient.updated_at,
        institution_id: patient.institution_id.toString(),
        foreign_id: patient.foreign_id,
        foreign_id_type: patient.foreign_id_type,
        inactive: patient.inactive,
        last_sync_time: new Date().toISOString(),
        guarantor_id: patient.guarantor_id?.toString() || null,
        unsubscribe_sms: patient.unsubscribe_sms,
        balance_amount: patient.balance?.amount || null,
        balance_currency: patient.balance?.currency || null,
        billing_type: patient.billing_type,
        chart_id: patient.chart_id,
        preferred_language: patient.preferred_language,
        location_ids: patient.location_ids.map(id => id.toString()),
        bio: patient.bio,
        raw_data: patient,
        sync_status: 'synced',
        tenant_id: this.tenantId,
        last_sync_id: syncId
      };

      // Insert or update the patient record
      if (!existingPatient) {
        // Insert new patient
        logger.info('Inserting new patient record', { patientId: patient.id });
        const { error: insertError } = await supabase
          .from('nexhealth_patients')
          .insert([patientData]);

        if (insertError) {
          logger.error('Error inserting patient', insertError, { patientId: patient.id });
          throw new Error(`Error inserting patient: ${insertError.message}`);
        }
      } else {
        // Update existing patient
        logger.debug('Updating existing patient record', {
          patientId: patient.id,
          existingRecordId: existingPatient.id
        });

        const { error: updateError } = await supabase
          .from('nexhealth_patients')
          .update(patientData)
          .eq('nexhealth_id', patient.id.toString());

        if (updateError) {
          logger.error('Error updating patient', updateError, { patientId: patient.id });
          throw new Error(`Error updating patient: ${updateError.message}`);
        }
      }

      // Sync related data for this patient (unless skipped)
      if (!options.skipRelatedData) {
        logger.debug('Syncing related data for patient', { patientId: patient.id });

        try {
          await Promise.all([
            this.syncPatientAppointments(patient.id.toString(), { syncId }),
            this.syncPatientDocuments(patient.id.toString(), { syncId }),
            this.syncPatientInsurance(patient.id.toString(), { syncId })
          ]);

          logger.debug('Successfully synced related data for patient', { patientId: patient.id });
        } catch (relatedError) {
          // Log but don't fail the entire sync if related data sync fails
          logger.warn('Error syncing related data for patient', {
            patientId: patient.id,
            error: relatedError instanceof Error ? relatedError.message : String(relatedError)
          });
        }
      }

      logger.info('Successfully synced patient data', {
        patientId: patient.id,
        isNew: !existingPatient
      });
    } catch (error) {
      logger.error(`Error syncing patient ${patient.id}`, error);
      throw error;
    }
  }

  /**
   * Sync appointments for a specific patient
   *
   * @param patientId The patient ID to sync appointments for
   * @param options Optional configuration for the sync process
   */
  async syncPatientAppointments(
    patientId: string,
    options: {
      syncId?: string;
    } = {}
  ): Promise<void> {
    const syncId = options.syncId || uuidv4();
    const logger = nexhealthLogger.withContext({
      syncId,
      patientId,
      dataType: 'appointments'
    });

    logger.debug('Syncing appointments for patient', { patientId });

    try {
      // Fetch appointments for this patient
      logger.debug('Fetching appointments from NexHealth API', { patientId });
      const response = await fetchFromNexHealth<NexHealthResponse<{ appointments: NexHealthAppointment[] }>>(
        '/api/nexhealth/appointments',
        { method: 'GET' },
        { patient_id: patientId, per_page: 100 }
      );

      const appointments = response.data?.appointments || [];
      logger.debug(`Retrieved ${appointments.length} appointments for patient`, { patientId });

      for (const appointment of appointments) {
        try {
          // Check if appointment already exists
          const { data: existingAppointment, error: queryError } = await supabase
            .from('nexhealth_appointments')
            .select('*')
            .eq('nexhealth_id', appointment.id.toString())
            .single();

          if (queryError && queryError.code !== 'PGRST116') {
            logger.warn(`Error checking for existing appointment`, {
              appointmentId: appointment.id,
              error: queryError.message
            });
            continue;
          }

          // Prepare appointment data
          const appointmentData = {
            nexhealth_id: appointment.id.toString(),
            patient_id: appointment.patient_id.toString(),
            provider_id: appointment.provider_id.toString(),
            location_id: appointment.location_id.toString(),
            operatory_id: appointment.operatory_id?.toString() || null,
            appointment_type_id: appointment.appointment_type_id.toString(),
            start_time: appointment.start_time,
            end_time: appointment.end_time,
            status: appointment.status,
            created_at: appointment.created_at,
            updated_at: appointment.updated_at,
            raw_data: appointment,
            sync_status: 'synced',
            tenant_id: this.tenantId,
            last_sync_id: syncId,
            last_sync_time: new Date().toISOString()
          };

          // Insert or update
          if (!existingAppointment) {
            logger.debug('Inserting new appointment', { appointmentId: appointment.id });
            const { error: insertError } = await supabase.from('nexhealth_appointments').insert([appointmentData]);

            if (insertError) {
              logger.error('Error inserting appointment', insertError, { appointmentId: appointment.id });
              continue;
            }
          } else {
            logger.debug('Updating existing appointment', {
              appointmentId: appointment.id,
              existingRecordId: existingAppointment.id
            });

            const { error: updateError } = await supabase
              .from('nexhealth_appointments')
              .update(appointmentData)
              .eq('nexhealth_id', appointment.id.toString());

            if (updateError) {
              logger.error('Error updating appointment', updateError, { appointmentId: appointment.id });
              continue;
            }
          }
        } catch (appointmentError) {
          logger.error('Error processing appointment', appointmentError, { appointmentId: appointment.id });
          // Continue with next appointment
          continue;
        }
      }

      logger.info(`Successfully synced ${appointments.length} appointments for patient`, { patientId });
    } catch (error) {
      logger.error(`Error syncing appointments for patient ${patientId}`, error);
      throw error; // Propagate error to caller
    }
  }

  /**
   * Sync documents for a specific patient
   *
   * @param patientId The patient ID to sync documents for
   * @param options Optional configuration for the sync process
   */
  async syncPatientDocuments(
    patientId: string,
    options: {
      syncId?: string;
    } = {}
  ): Promise<void> {
    const syncId = options.syncId || uuidv4();
    const logger = nexhealthLogger.withContext({
      syncId,
      patientId,
      dataType: 'documents'
    });

    logger.debug('Syncing documents for patient', { patientId });

    try {
      // Fetch documents for this patient
      logger.debug('Fetching documents from NexHealth API', { patientId });
      const response = await fetchFromNexHealth<NexHealthResponse<{ documents: NexHealthDocument[] }>>(
        `/api/nexhealth/patients/${patientId}/documents`,
        { method: 'GET' },
        { per_page: 100 }
      );

      const documents = response.data?.documents || [];
      logger.debug(`Retrieved ${documents.length} documents for patient`, { patientId });

      for (const document of documents) {
        try {
          // Check if document already exists
          const { data: existingDocument, error: queryError } = await supabase
            .from('nexhealth_documents')
            .select('*')
            .eq('nexhealth_id', document.id.toString())
            .single();

          if (queryError && queryError.code !== 'PGRST116') {
            logger.warn(`Error checking for existing document`, {
              documentId: document.id,
              error: queryError.message
            });
            continue;
          }

          // Prepare document data
          const documentData = {
            nexhealth_id: document.id.toString(),
            patient_id: document.patient_id.toString(),
            filename: document.filename,
            content_type: document.content_type,
            size: document.size,
            url: document.url,
            created_at: document.created_at,
            updated_at: document.updated_at,
            raw_data: document,
            sync_status: 'synced',
            tenant_id: this.tenantId,
            last_sync_id: syncId,
            last_sync_time: new Date().toISOString()
          };

          // Insert or update
          if (!existingDocument) {
            logger.debug('Inserting new document', { documentId: document.id });
            const { error: insertError } = await supabase.from('nexhealth_documents').insert([documentData]);

            if (insertError) {
              logger.error('Error inserting document', insertError, { documentId: document.id });
              continue;
            }
          } else {
            logger.debug('Updating existing document', {
              documentId: document.id,
              existingRecordId: existingDocument.id
            });

            const { error: updateError } = await supabase
              .from('nexhealth_documents')
              .update(documentData)
              .eq('nexhealth_id', document.id.toString());

            if (updateError) {
              logger.error('Error updating document', updateError, { documentId: document.id });
              continue;
            }
          }
        } catch (documentError) {
          logger.error('Error processing document', documentError, { documentId: document.id });
          // Continue with next document
          continue;
        }
      }

      logger.info(`Successfully synced ${documents.length} documents for patient`, { patientId });
    } catch (error) {
      logger.error(`Error syncing documents for patient ${patientId}`, error);
      throw error; // Propagate error to caller
    }
  }

  /**
   * Sync insurance coverage for a specific patient
   *
   * @param patientId The patient ID to sync insurance for
   * @param options Optional configuration for the sync process
   */
  async syncPatientInsurance(
    patientId: string,
    options: {
      syncId?: string;
    } = {}
  ): Promise<void> {
    const syncId = options.syncId || uuidv4();
    const logger = nexhealthLogger.withContext({
      syncId,
      patientId,
      dataType: 'insurance'
    });

    logger.debug('Syncing insurance for patient', { patientId });

    try {
      // Fetch insurance coverages for this patient
      logger.debug('Fetching insurance from NexHealth API', { patientId });
      const response = await fetchFromNexHealth<NexHealthResponse<{ insurance_coverages: NexHealthInsuranceCoverage[] }>>(
        '/api/nexhealth/insurance_coverages',
        { method: 'GET' },
        { patient_id: patientId, per_page: 100 }
      );

      const coverages = response.data?.insurance_coverages || [];
      logger.debug(`Retrieved ${coverages.length} insurance coverages for patient`, { patientId });

      for (const coverage of coverages) {
        try {
          // Check if coverage already exists
          const { data: existingCoverage, error: queryError } = await supabase
            .from('nexhealth_insurance_coverages')
            .select('*')
            .eq('nexhealth_id', coverage.id.toString())
            .single();

          if (queryError && queryError.code !== 'PGRST116') {
            logger.warn(`Error checking for existing insurance coverage`, {
              coverageId: coverage.id,
              error: queryError.message
            });
            continue;
          }

          // Prepare coverage data
          const coverageData = {
            nexhealth_id: coverage.id.toString(),
            patient_id: coverage.patient_id.toString(),
            insurance_plan_id: coverage.insurance_plan_id.toString(),
            subscriber_id: coverage.subscriber_id,
            group_number: coverage.group_number || null,
            is_primary: coverage.is_primary,
            created_at: coverage.created_at,
            updated_at: coverage.updated_at,
            raw_data: coverage,
            sync_status: 'synced',
            tenant_id: this.tenantId,
            last_sync_id: syncId,
            last_sync_time: new Date().toISOString()
          };

          // Insert or update
          if (!existingCoverage) {
            logger.debug('Inserting new insurance coverage', { coverageId: coverage.id });
            const { error: insertError } = await supabase.from('nexhealth_insurance_coverages').insert([coverageData]);

            if (insertError) {
              logger.error('Error inserting insurance coverage', insertError, { coverageId: coverage.id });
              continue;
            }
          } else {
            logger.debug('Updating existing insurance coverage', {
              coverageId: coverage.id,
              existingRecordId: existingCoverage.id
            });

            const { error: updateError } = await supabase
              .from('nexhealth_insurance_coverages')
              .update(coverageData)
              .eq('nexhealth_id', coverage.id.toString());

            if (updateError) {
              logger.error('Error updating insurance coverage', updateError, { coverageId: coverage.id });
              continue;
            }
          }
        } catch (coverageError) {
          logger.error('Error processing insurance coverage', coverageError, { coverageId: coverage.id });
          // Continue with next coverage
          continue;
        }
      }

      logger.info(`Successfully synced ${coverages.length} insurance coverages for patient`, { patientId });
    } catch (error) {
      logger.error(`Error syncing insurance for patient ${patientId}`, error);
      throw error; // Propagate error to caller
    }
  }

  /**
   * Set up continuous sync using webhooks
   */
  async setupContinuousSync(webhookUrl: string): Promise<void> {
    try {
      // Register webhook endpoint
      const endpointResponse = await fetchFromNexHealth<NexHealthResponse<{ webhook_endpoint: { id: number, target_url: string } }>>(
        '/api/nexhealth/webhook_endpoints',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ target_url: webhookUrl })
        }
      );

      const endpointId = endpointResponse.data?.webhook_endpoint?.id;

      if (!endpointId) {
        throw new Error('Failed to create webhook endpoint');
      }

      // Subscribe to patient events
      await fetchFromNexHealth(
        `/api/nexhealth/webhook_endpoints/${endpointId}/webhook_subscriptions`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ resource_type: 'patient', event: 'created' })
        }
      );

      await fetchFromNexHealth(
        `/api/nexhealth/webhook_endpoints/${endpointId}/webhook_subscriptions`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ resource_type: 'patient', event: 'updated' })
        }
      );

      // Subscribe to appointment events
      await fetchFromNexHealth(
        `/api/nexhealth/webhook_endpoints/${endpointId}/webhook_subscriptions`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ resource_type: 'appointment', event: 'created' })
        }
      );

      await fetchFromNexHealth(
        `/api/nexhealth/webhook_endpoints/${endpointId}/webhook_subscriptions`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ resource_type: 'appointment', event: 'updated' })
        }
      );

      // Store webhook configuration in database
      await supabase.from('nexhealth_webhooks').insert([
        {
          nexhealth_id: endpointId.toString(),
          target_url: webhookUrl,
          resource_type: 'patient',
          event: 'created,updated',
          status: 'active',
          tenant_id: this.tenantId
        }
      ]);

    } catch (error) {
      console.error('Error setting up continuous sync:', error);
      throw error;
    }
  }

  /**
   * Handle webhook events for continuous sync
   *
   * @param event The webhook event from NexHealth
   * @returns A promise that resolves when the event has been processed
   */
  async handleWebhookEvent(event: any): Promise<void> {
    const eventId = uuidv4();
    const eventType = event.event;
    const resourceType = event.resource_type;
    const resourceId = event.resource_id;

    const logger = nexhealthLogger.withContext({
      eventId,
      eventType,
      resourceType,
      resourceId
    });

    logger.info(`Processing webhook event`, { event });

    try {
      // Record the webhook event in the database for audit purposes
      try {
        await supabase.from('nexhealth_webhook_events').insert([{
          event_id: eventId,
          event_type: eventType,
          resource_type: resourceType,
          resource_id: resourceId,
          raw_data: event,
          status: 'processing',
          tenant_id: this.tenantId,
          received_at: new Date().toISOString()
        }]);
      } catch (logError) {
        // Don't fail the whole process if we can't log the event
        logger.warn('Failed to record webhook event in database', { error: logError });
      }

      if (resourceType === 'patient') {
        logger.debug('Processing patient webhook event');

        try {
          // Fetch the patient data
          logger.debug('Fetching patient data from NexHealth API');
          const response = await fetchFromNexHealth<NexHealthResponse<{ patient: NexHealthPatient }>>(
            `/api/nexhealth/patients/${resourceId}`,
            { method: 'GET' }
          );

          const patient = response.data?.patient;

          if (patient) {
            logger.debug('Syncing patient data', { patientId: patient.id });
            await this.syncPatientData(patient, { syncId: eventId });
            logger.info('Successfully processed patient webhook event', { patientId: patient.id });

            // Update the webhook event status
            await supabase.from('nexhealth_webhook_events')
              .update({ status: 'completed', completed_at: new Date().toISOString() })
              .eq('event_id', eventId);
          } else {
            logger.warn('Patient not found in NexHealth API', { resourceId });

            // Update the webhook event status
            await supabase.from('nexhealth_webhook_events')
              .update({
                status: 'failed',
                error_message: 'Patient not found in NexHealth API',
                completed_at: new Date().toISOString()
              })
              .eq('event_id', eventId);
          }
        } catch (patientError) {
          logger.error('Error processing patient webhook event', patientError);

          // Update the webhook event status
          await supabase.from('nexhealth_webhook_events')
            .update({
              status: 'failed',
              error_message: patientError instanceof Error ? patientError.message : String(patientError),
              completed_at: new Date().toISOString()
            })
            .eq('event_id', eventId);

          throw patientError; // Re-throw to be caught by the outer try/catch
        }
      } else if (resourceType === 'appointment') {
        logger.debug('Processing appointment webhook event');

        try {
          // Fetch the appointment data
          logger.debug('Fetching appointment data from NexHealth API');
          const response = await fetchFromNexHealth<NexHealthResponse<{ appointment: NexHealthAppointment }>>(
            `/api/nexhealth/appointments/${resourceId}`,
            { method: 'GET' }
          );

          const appointment = response.data?.appointment;

          if (appointment) {
            logger.debug('Processing appointment data', { appointmentId: appointment.id });

            // Check if appointment already exists
            const { data: existingAppointment, error: queryError } = await supabase
              .from('nexhealth_appointments')
              .select('*')
              .eq('nexhealth_id', appointment.id.toString())
              .single();

            if (queryError && queryError.code !== 'PGRST116') {
              logger.error('Error checking for existing appointment', queryError);
              throw new Error(`Error checking for existing appointment: ${queryError.message}`);
            }

            // Prepare appointment data
            const appointmentData = {
              nexhealth_id: appointment.id.toString(),
              patient_id: appointment.patient_id.toString(),
              provider_id: appointment.provider_id.toString(),
              location_id: appointment.location_id.toString(),
              operatory_id: appointment.operatory_id?.toString() || null,
              appointment_type_id: appointment.appointment_type_id.toString(),
              start_time: appointment.start_time,
              end_time: appointment.end_time,
              status: appointment.status,
              created_at: appointment.created_at,
              updated_at: appointment.updated_at,
              raw_data: appointment,
              sync_status: 'synced',
              tenant_id: this.tenantId,
              last_sync_id: eventId,
              last_sync_time: new Date().toISOString()
            };

            // Insert or update
            if (!existingAppointment) {
              logger.debug('Inserting new appointment', { appointmentId: appointment.id });
              const { error: insertError } = await supabase.from('nexhealth_appointments').insert([appointmentData]);

              if (insertError) {
                logger.error('Error inserting appointment', insertError);
                throw new Error(`Error inserting appointment: ${insertError.message}`);
              }
            } else {
              logger.debug('Updating existing appointment', {
                appointmentId: appointment.id,
                existingRecordId: existingAppointment.id
              });

              const { error: updateError } = await supabase
                .from('nexhealth_appointments')
                .update(appointmentData)
                .eq('nexhealth_id', appointment.id.toString());

              if (updateError) {
                logger.error('Error updating appointment', updateError);
                throw new Error(`Error updating appointment: ${updateError.message}`);
              }
            }

            logger.info('Successfully processed appointment webhook event', { appointmentId: appointment.id });

            // Update the webhook event status
            await supabase.from('nexhealth_webhook_events')
              .update({ status: 'completed', completed_at: new Date().toISOString() })
              .eq('event_id', eventId);
          } else {
            logger.warn('Appointment not found in NexHealth API', { resourceId });

            // Update the webhook event status
            await supabase.from('nexhealth_webhook_events')
              .update({
                status: 'failed',
                error_message: 'Appointment not found in NexHealth API',
                completed_at: new Date().toISOString()
              })
              .eq('event_id', eventId);
          }
        } catch (appointmentError) {
          logger.error('Error processing appointment webhook event', appointmentError);

          // Update the webhook event status
          await supabase.from('nexhealth_webhook_events')
            .update({
              status: 'failed',
              error_message: appointmentError instanceof Error ? appointmentError.message : String(appointmentError),
              completed_at: new Date().toISOString()
            })
            .eq('event_id', eventId);

          throw appointmentError; // Re-throw to be caught by the outer try/catch
        }
      } else {
        logger.warn('Unsupported resource type in webhook event', { resourceType });

        // Update the webhook event status
        await supabase.from('nexhealth_webhook_events')
          .update({
            status: 'skipped',
            error_message: `Unsupported resource type: ${resourceType}`,
            completed_at: new Date().toISOString()
          })
          .eq('event_id', eventId);
      }
    } catch (error) {
      logger.error('Error handling webhook event', error);

      // Make sure the webhook event is marked as failed
      try {
        await supabase.from('nexhealth_webhook_events')
          .update({
            status: 'failed',
            error_message: error instanceof Error ? error.message : String(error),
            completed_at: new Date().toISOString()
          })
          .eq('event_id', eventId);
      } catch (updateError) {
        logger.error('Failed to update webhook event status', updateError);
      }

      // Re-throw the error so it can be handled by the caller
      throw error;
    }
  }

  /**
   * Fetch a page of patients from NexHealth
   */
  private async fetchPatientsPage(page: number, perPage: number): Promise<NexHealthResponse<{ patients: NexHealthPatient[] }>> {
    return await fetchFromNexHealth<NexHealthResponse<{ patients: NexHealthPatient[] }>>(
      '/api/nexhealth/patients',
      { method: 'GET' },
      { page, per_page: perPage }
    );
  }

  /**
   * Update a sync log entry
   */
  private async updateSyncLog(logId: string, updates: Partial<SyncLogEntry>): Promise<SyncLogEntry> {
    const { data, error } = await supabase
      .from('nexhealth_sync_logs')
      .update(updates)
      .eq('id', logId)
      .select()
      .single();

    if (error) {
      console.error('Error updating sync log:', error);
      throw new Error(`Failed to update sync log: ${error.message}`);
    }

    return data;
  }
}

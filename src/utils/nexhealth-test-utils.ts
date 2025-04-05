import axios from 'axios';
import { NexHealthPatient, NexHealthAppointment, NexHealthDocument, NexHealthInsuranceCoverage } from '../hooks/useNexHealth';

/**
 * NexHealth Test Utilities
 * 
 * This module provides utilities for testing the NexHealth integration.
 * It includes functions for testing authentication, data retrieval, and webhooks.
 */

interface TestResult {
  success: boolean;
  message: string;
  data?: any;
  error?: any;
}

interface TestConfig {
  apiKey: string;
  subdomain: string;
  locationId: string;
  baseUrl: string;
  webhookUrl?: string;
}

export class NexHealthTester {
  private config: TestConfig;
  private token: string | null = null;
  private tokenExpiresAt: number = 0;

  constructor(config: TestConfig) {
    this.config = config;
  }

  /**
   * Run all tests
   */
  async runAllTests(): Promise<Record<string, TestResult>> {
    const results: Record<string, TestResult> = {};

    // Authentication test
    results.authentication = await this.testAuthentication();
    if (!results.authentication.success) {
      return results; // Stop if authentication fails
    }

    // Data retrieval tests
    results.patientsRetrieval = await this.testPatientsRetrieval();
    results.patientDetails = await this.testPatientDetails();
    results.appointments = await this.testAppointments();
    results.documents = await this.testDocuments();
    results.insurance = await this.testInsurance();

    // Webhook tests
    if (this.config.webhookUrl) {
      results.webhookSetup = await this.testWebhookSetup();
    }

    return results;
  }

  /**
   * Test authentication with NexHealth
   */
  async testAuthentication(): Promise<TestResult> {
    try {
      const token = await this.getBearerToken(true);
      return {
        success: true,
        message: 'Successfully authenticated with NexHealth',
        data: { tokenReceived: !!token }
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to authenticate with NexHealth',
        error
      };
    }
  }

  /**
   * Test retrieving patients from NexHealth
   */
  async testPatientsRetrieval(): Promise<TestResult> {
    try {
      const token = await this.getBearerToken();
      const patientsUrl = new URL(`${this.config.baseUrl}/patients`);
      patientsUrl.searchParams.set('subdomain', this.config.subdomain);
      patientsUrl.searchParams.set('location_id', this.config.locationId);
      patientsUrl.searchParams.set('per_page', '10'); // Limit to 10 patients for testing

      const response = await axios.get(patientsUrl.toString(), {
        headers: {
          'Accept': 'application/vnd.Nexhealth+json;version=2',
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const patients = response.data?.data?.patients || [];
      const pagination = response.data?.meta?.pagination;

      return {
        success: true,
        message: `Successfully retrieved ${patients.length} patients`,
        data: {
          patientCount: patients.length,
          pagination,
          samplePatient: patients.length > 0 ? this.sanitizePatient(patients[0]) : null
        }
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to retrieve patients',
        error
      };
    }
  }

  /**
   * Test retrieving a specific patient's details
   */
  async testPatientDetails(): Promise<TestResult> {
    try {
      // First get a list of patients to pick one
      const patientsResult = await this.testPatientsRetrieval();
      if (!patientsResult.success || !patientsResult.data?.samplePatient) {
        return {
          success: false,
          message: 'Could not get a sample patient to test details',
          error: patientsResult.error
        };
      }

      const patientId = patientsResult.data.samplePatient.id;
      const token = await this.getBearerToken();
      const patientUrl = new URL(`${this.config.baseUrl}/patients/${patientId}`);
      patientUrl.searchParams.set('subdomain', this.config.subdomain);
      patientUrl.searchParams.set('location_id', this.config.locationId);

      const response = await axios.get(patientUrl.toString(), {
        headers: {
          'Accept': 'application/vnd.Nexhealth+json;version=2',
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const patient = response.data?.data?.patient;

      return {
        success: true,
        message: `Successfully retrieved details for patient ${patientId}`,
        data: {
          patient: this.sanitizePatient(patient)
        }
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to retrieve patient details',
        error
      };
    }
  }

  /**
   * Test retrieving appointments
   */
  async testAppointments(): Promise<TestResult> {
    try {
      // First get a list of patients to pick one
      const patientsResult = await this.testPatientsRetrieval();
      if (!patientsResult.success || !patientsResult.data?.samplePatient) {
        return {
          success: false,
          message: 'Could not get a sample patient to test appointments',
          error: patientsResult.error
        };
      }

      const patientId = patientsResult.data.samplePatient.id;
      const token = await this.getBearerToken();
      const appointmentsUrl = new URL(`${this.config.baseUrl}/appointments`);
      appointmentsUrl.searchParams.set('subdomain', this.config.subdomain);
      appointmentsUrl.searchParams.set('location_id', this.config.locationId);
      appointmentsUrl.searchParams.set('patient_id', patientId);

      const response = await axios.get(appointmentsUrl.toString(), {
        headers: {
          'Accept': 'application/vnd.Nexhealth+json;version=2',
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const appointments = response.data?.data?.appointments || [];

      return {
        success: true,
        message: `Successfully retrieved ${appointments.length} appointments for patient ${patientId}`,
        data: {
          appointmentCount: appointments.length,
          sampleAppointment: appointments.length > 0 ? appointments[0] : null
        }
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to retrieve appointments',
        error
      };
    }
  }

  /**
   * Test retrieving documents
   */
  async testDocuments(): Promise<TestResult> {
    try {
      // First get a list of patients to pick one
      const patientsResult = await this.testPatientsRetrieval();
      if (!patientsResult.success || !patientsResult.data?.samplePatient) {
        return {
          success: false,
          message: 'Could not get a sample patient to test documents',
          error: patientsResult.error
        };
      }

      const patientId = patientsResult.data.samplePatient.id;
      const token = await this.getBearerToken();
      const documentsUrl = new URL(`${this.config.baseUrl}/documents`);
      documentsUrl.searchParams.set('subdomain', this.config.subdomain);
      documentsUrl.searchParams.set('location_id', this.config.locationId);
      documentsUrl.searchParams.set('patient_id', patientId);

      const response = await axios.get(documentsUrl.toString(), {
        headers: {
          'Accept': 'application/vnd.Nexhealth+json;version=2',
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const documents = response.data?.data?.documents || [];

      return {
        success: true,
        message: `Successfully retrieved ${documents.length} documents for patient ${patientId}`,
        data: {
          documentCount: documents.length,
          sampleDocument: documents.length > 0 ? documents[0] : null
        }
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to retrieve documents',
        error
      };
    }
  }

  /**
   * Test retrieving insurance information
   */
  async testInsurance(): Promise<TestResult> {
    try {
      // First get a list of patients to pick one
      const patientsResult = await this.testPatientsRetrieval();
      if (!patientsResult.success || !patientsResult.data?.samplePatient) {
        return {
          success: false,
          message: 'Could not get a sample patient to test insurance',
          error: patientsResult.error
        };
      }

      const patientId = patientsResult.data.samplePatient.id;
      const token = await this.getBearerToken();
      const insuranceUrl = new URL(`${this.config.baseUrl}/insurance_coverages`);
      insuranceUrl.searchParams.set('subdomain', this.config.subdomain);
      insuranceUrl.searchParams.set('location_id', this.config.locationId);
      insuranceUrl.searchParams.set('patient_id', patientId);

      const response = await axios.get(insuranceUrl.toString(), {
        headers: {
          'Accept': 'application/vnd.Nexhealth+json;version=2',
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const insuranceCoverages = response.data?.data?.insurance_coverages || [];

      return {
        success: true,
        message: `Successfully retrieved ${insuranceCoverages.length} insurance coverages for patient ${patientId}`,
        data: {
          insuranceCount: insuranceCoverages.length,
          sampleInsurance: insuranceCoverages.length > 0 ? insuranceCoverages[0] : null
        }
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to retrieve insurance information',
        error
      };
    }
  }

  /**
   * Test webhook setup
   */
  async testWebhookSetup(): Promise<TestResult> {
    if (!this.config.webhookUrl) {
      return {
        success: false,
        message: 'Webhook URL not provided in configuration',
        error: new Error('Missing webhookUrl in configuration')
      };
    }

    try {
      const token = await this.getBearerToken();
      
      // Create webhook endpoint
      const endpointResponse = await axios.post(
        `${this.config.baseUrl}/webhook_endpoints`,
        { target_url: this.config.webhookUrl },
        {
          headers: {
            'Accept': 'application/vnd.Nexhealth+json;version=2',
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          params: {
            subdomain: this.config.subdomain,
            location_id: this.config.locationId
          }
        }
      );
      
      const endpointId = endpointResponse.data?.data?.webhook_endpoint?.id;
      
      if (!endpointId) {
        return {
          success: false,
          message: 'Failed to create webhook endpoint',
          error: new Error('No endpoint ID returned')
        };
      }
      
      // Create webhook subscription for patient events
      const subscriptionResponse = await axios.post(
        `${this.config.baseUrl}/webhook_endpoints/${endpointId}/webhook_subscriptions`,
        { resource_type: 'patient', event: 'created' },
        {
          headers: {
            'Accept': 'application/vnd.Nexhealth+json;version=2',
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          params: {
            subdomain: this.config.subdomain,
            location_id: this.config.locationId
          }
        }
      );
      
      const subscriptionId = subscriptionResponse.data?.data?.webhook_subscription?.id;
      
      return {
        success: true,
        message: 'Successfully set up webhook endpoint and subscription',
        data: {
          endpointId,
          subscriptionId,
          targetUrl: this.config.webhookUrl
        }
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to set up webhook',
        error
      };
    }
  }

  /**
   * Get a bearer token for NexHealth API
   */
  private async getBearerToken(forceRefresh = false): Promise<string> {
    const now = Date.now();
    
    // Check cache first
    if (!forceRefresh && this.token && this.tokenExpiresAt && this.tokenExpiresAt > now) {
      return this.token;
    }
    
    try {
      const authUrl = `${this.config.baseUrl}/authenticates`;
      const response = await axios.post(authUrl, {}, {
        headers: {
          'Accept': 'application/vnd.Nexhealth+json;version=2',
          'Authorization': this.config.apiKey
        }
      });
      
      // Extract token
      const newToken = response.data?.data?.token;
      if (!newToken) {
        throw new Error('Authentication failed: Could not retrieve bearer token from NexHealth.');
      }
      
      // Cache the token (expires in 1 hour, cache for 55 mins to be safe)
      this.token = newToken;
      this.tokenExpiresAt = now + 55 * 60 * 1000; // 55 minutes in milliseconds
      
      return newToken;
    } catch (error) {
      throw new Error(`Failed to authenticate with NexHealth: ${error.message}`);
    }
  }

  /**
   * Sanitize patient data for logging (remove sensitive information)
   */
  private sanitizePatient(patient: any): any {
    if (!patient) return null;
    
    // Create a copy to avoid modifying the original
    const sanitized = { ...patient };
    
    // Remove or mask sensitive fields
    if (sanitized.email) sanitized.email = this.maskEmail(sanitized.email);
    if (sanitized.phone_number) sanitized.phone_number = this.maskPhoneNumber(sanitized.phone_number);
    if (sanitized.ssn) sanitized.ssn = '***-**-****';
    
    // Handle nested bio object
    if (sanitized.bio) {
      sanitized.bio = { ...sanitized.bio };
      if (sanitized.bio.ssn) sanitized.bio.ssn = '***-**-****';
      if (sanitized.bio.date_of_birth) sanitized.bio.date_of_birth = sanitized.bio.date_of_birth; // Keep DOB for testing
    }
    
    return sanitized;
  }

  /**
   * Mask email address for privacy
   */
  private maskEmail(email: string): string {
    if (!email) return '';
    const [username, domain] = email.split('@');
    if (!username || !domain) return email;
    
    return `${username.substring(0, 2)}***@${domain}`;
  }

  /**
   * Mask phone number for privacy
   */
  private maskPhoneNumber(phone: string): string {
    if (!phone) return '';
    return phone.replace(/(\d{3})\d{3}(\d{4})/, '$1***$2');
  }
}

export default NexHealthTester;

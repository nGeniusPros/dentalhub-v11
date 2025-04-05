import { useMCPRequest } from '../mcp/client/MCPClient';

// Types for NexHealth API responses
export interface NexHealthPatient {
  id: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone_number?: string;
  bio?: {
    date_of_birth?: string;
    gender?: string;
    address?: {
      street?: string;
      city?: string;
      state?: string;
      zip?: string;
    };
  };
  created_at: string;
  updated_at: string;
}

export interface NexHealthProvider {
  id: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone_number?: string;
  requestable: boolean;
  created_at: string;
  updated_at: string;
}

export interface NexHealthLocation {
  id: string;
  name: string;
  address: {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
  };
  phone_number?: string;
  created_at: string;
  updated_at: string;
}

export interface NexHealthOperatory {
  id: string;
  name: string;
  location_id: string;
  created_at: string;
  updated_at: string;
}

export interface NexHealthAppointmentType {
  id: string;
  name: string;
  minutes: number;
  parent_type: string;
  parent_id: string;
  created_at: string;
  updated_at: string;
}

export interface NexHealthAppointment {
  id: string;
  patient_id: string;
  provider_id: string;
  location_id: string;
  operatory_id?: string;
  appointment_type_id: string;
  start_time: string;
  end_time: string;
  status: 'confirmed' | 'cancelled' | 'pending';
  created_at: string;
  updated_at: string;
}

export interface NexHealthAppointmentSlot {
  start_time: string;
  end_time: string;
  provider_id: string;
  location_id: string;
  operatory_id?: string;
}

export interface NexHealthAvailability {
  id: string;
  provider_id: string;
  days: string[];
  begin_time: string;
  end_time: string;
  appointment_type_ids: string[];
  operatory_id?: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface NexHealthDocument {
  id: string;
  patient_id: string;
  filename: string;
  content_type: string;
  size: number;
  url: string;
  created_at: string;
  updated_at: string;
}

export interface NexHealthInsurancePlan {
  id: string;
  name: string;
  carrier: string;
  created_at: string;
  updated_at: string;
}

export interface NexHealthInsuranceCoverage {
  id: string;
  patient_id: string;
  insurance_plan_id: string;
  subscriber_id: string;
  group_number?: string;
  is_primary: boolean;
  created_at: string;
  updated_at: string;
}

export interface NexHealthWebhookEndpoint {
  id: string;
  target_url: string;
  created_at: string;
  updated_at: string;
}

export interface NexHealthWebhookSubscription {
  id: string;
  webhook_endpoint_id: string;
  resource_type: string;
  event: string;
  created_at: string;
  updated_at: string;
}

// Pagination parameters
export interface PaginationParams {
  page?: number;
  per_page?: number;
}

// Common response structure
export interface NexHealthResponse<T> {
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
}

// Hook for authentication
export const useNexHealthAuth = () => {
  const { data, loading, error, execute } = useMCPRequest<{ token: string }>(
    '/api/nexhealth/authenticates',
    'POST'
  );

  return {
    token: data?.token,
    loading,
    error,
    authenticate: execute
  };
};

// Hook for patient management
export const useNexHealthPatients = (initialParams?: PaginationParams) => {
  const { data, loading, error, execute } = useMCPRequest<NexHealthResponse<{ patients: NexHealthPatient[] }>>(
    '/api/nexhealth/patients',
    'GET'
  );

  const fetchPatients = (params?: PaginationParams) => {
    return execute(null, { ...initialParams, ...params });
  };

  return {
    patients: data?.data?.patients || [],
    pagination: data?.meta?.pagination,
    loading,
    error,
    fetchPatients
  };
};

export const useNexHealthPatient = (patientId?: string) => {
  const { data, loading, error, execute } = useMCPRequest<NexHealthResponse<{ patient: NexHealthPatient }>>(
    patientId ? `/api/nexhealth/patients/${patientId}` : '/api/nexhealth/patients',
    'GET'
  );

  const fetchPatient = (id?: string) => {
    if (!id && !patientId) {
      throw new Error('Patient ID is required');
    }
    return execute();
  };

  return {
    patient: data?.data?.patient,
    loading,
    error,
    fetchPatient
  };
};

export const useCreateNexHealthPatient = () => {
  const { data, loading, error, execute } = useMCPRequest<NexHealthResponse<{ patient: NexHealthPatient }>>(
    '/api/nexhealth/patients',
    'POST'
  );

  const createPatient = (patientData: Partial<NexHealthPatient>) => {
    return execute(patientData);
  };

  return {
    createdPatient: data?.data?.patient,
    loading,
    error,
    createPatient
  };
};

export const useUpdateNexHealthPatient = (patientId?: string) => {
  const { data, loading, error, execute } = useMCPRequest<NexHealthResponse<{ patient: NexHealthPatient }>>(
    patientId ? `/api/nexhealth/patients/${patientId}` : '/api/nexhealth/patients',
    'PATCH'
  );

  const updatePatient = (id: string, patientData: Partial<NexHealthPatient>) => {
    return execute(patientData, { id });
  };

  return {
    updatedPatient: data?.data?.patient,
    loading,
    error,
    updatePatient
  };
};

// Hook for provider management
export const useNexHealthProviders = (initialParams?: PaginationParams) => {
  const { data, loading, error, execute } = useMCPRequest<NexHealthResponse<{ providers: NexHealthProvider[] }>>(
    '/api/nexhealth/providers',
    'GET'
  );

  const fetchProviders = (params?: PaginationParams) => {
    return execute(null, { ...initialParams, ...params });
  };

  return {
    providers: data?.data?.providers || [],
    pagination: data?.meta?.pagination,
    loading,
    error,
    fetchProviders
  };
};

// Hook for location management
export const useNexHealthLocations = (initialParams?: PaginationParams) => {
  const { data, loading, error, execute } = useMCPRequest<NexHealthResponse<{ locations: NexHealthLocation[] }>>(
    '/api/nexhealth/locations',
    'GET'
  );

  const fetchLocations = (params?: PaginationParams) => {
    return execute(null, { ...initialParams, ...params });
  };

  return {
    locations: data?.data?.locations || [],
    pagination: data?.meta?.pagination,
    loading,
    error,
    fetchLocations
  };
};

export const useNexHealthLocation = (locationId?: string) => {
  const { data, loading, error, execute } = useMCPRequest<NexHealthResponse<{ location: NexHealthLocation }>>(
    locationId ? `/api/nexhealth/locations/${locationId}` : '/api/nexhealth/locations',
    'GET'
  );

  const fetchLocation = (id?: string) => {
    if (!id && !locationId) {
      throw new Error('Location ID is required');
    }
    return execute();
  };

  return {
    location: data?.data?.location,
    loading,
    error,
    fetchLocation
  };
};

// Hook for operatory management
export const useNexHealthOperatories = (initialParams?: PaginationParams) => {
  const { data, loading, error, execute } = useMCPRequest<NexHealthResponse<{ operatories: NexHealthOperatory[] }>>(
    '/api/nexhealth/operatories',
    'GET'
  );

  const fetchOperatories = (params?: PaginationParams) => {
    return execute(null, { ...initialParams, ...params });
  };

  return {
    operatories: data?.data?.operatories || [],
    pagination: data?.meta?.pagination,
    loading,
    error,
    fetchOperatories
  };
};

// Hook for appointment type management
export const useNexHealthAppointmentTypes = (initialParams?: PaginationParams) => {
  const { data, loading, error, execute } = useMCPRequest<NexHealthResponse<{ appointment_types: NexHealthAppointmentType[] }>>(
    '/api/nexhealth/appointment_types',
    'GET'
  );

  const fetchAppointmentTypes = (params?: PaginationParams) => {
    return execute(null, { ...initialParams, ...params });
  };

  return {
    appointmentTypes: data?.data?.appointment_types || [],
    pagination: data?.meta?.pagination,
    loading,
    error,
    fetchAppointmentTypes
  };
};

export const useCreateNexHealthAppointmentType = () => {
  const { data, loading, error, execute } = useMCPRequest<NexHealthResponse<{ appointment_type: NexHealthAppointmentType }>>(
    '/api/nexhealth/appointment_types',
    'POST'
  );

  const createAppointmentType = (appointmentTypeData: Partial<NexHealthAppointmentType>) => {
    return execute(appointmentTypeData);
  };

  return {
    createdAppointmentType: data?.data?.appointment_type,
    loading,
    error,
    createAppointmentType
  };
};

// Hook for appointment management
export const useNexHealthAppointments = (initialParams?: PaginationParams & { start_date?: string; end_date?: string; patient_id?: string; provider_id?: string }) => {
  const { data, loading, error, execute } = useMCPRequest<NexHealthResponse<{ appointments: NexHealthAppointment[] }>>(
    '/api/nexhealth/appointments',
    'GET'
  );

  const fetchAppointments = (params?: PaginationParams & { start_date?: string; end_date?: string; patient_id?: string; provider_id?: string }) => {
    return execute(null, { ...initialParams, ...params });
  };

  return {
    appointments: data?.data?.appointments || [],
    pagination: data?.meta?.pagination,
    loading,
    error,
    fetchAppointments
  };
};

export const useNexHealthAppointmentSlots = () => {
  const { data, loading, error, execute } = useMCPRequest<NexHealthResponse<{ slots: NexHealthAppointmentSlot[] }>>(
    '/api/nexhealth/appointment_slots',
    'GET'
  );

  const fetchAppointmentSlots = (params: { start_date: string; lids: string[]; pids: string[]; days?: number; slot_length?: number; slot_interval?: number }) => {
    return execute(null, params);
  };

  return {
    slots: data?.data?.slots || [],
    loading,
    error,
    fetchAppointmentSlots
  };
};

export const useCreateNexHealthAppointment = () => {
  const { data, loading, error, execute } = useMCPRequest<NexHealthResponse<{ appointment: NexHealthAppointment }>>(
    '/api/nexhealth/appointments',
    'POST'
  );

  const createAppointment = (appointmentData: Partial<NexHealthAppointment>, notify_patient: boolean = false) => {
    return execute(appointmentData, { notify_patient: notify_patient.toString() });
  };

  return {
    createdAppointment: data?.data?.appointment,
    loading,
    error,
    createAppointment
  };
};

export const useUpdateNexHealthAppointment = (appointmentId?: string) => {
  const { data, loading, error, execute } = useMCPRequest<NexHealthResponse<{ appointment: NexHealthAppointment }>>(
    appointmentId ? `/api/nexhealth/appointments/${appointmentId}` : '/api/nexhealth/appointments',
    'PATCH'
  );

  const updateAppointment = (id: string, appointmentData: Partial<NexHealthAppointment>) => {
    return execute(appointmentData, { id });
  };

  return {
    updatedAppointment: data?.data?.appointment,
    loading,
    error,
    updateAppointment
  };
};

// Hook for availability management
export const useNexHealthAvailabilities = (initialParams?: PaginationParams & { provider_id?: string }) => {
  const { data, loading, error, execute } = useMCPRequest<NexHealthResponse<{ availabilities: NexHealthAvailability[] }>>(
    '/api/nexhealth/availabilities',
    'GET'
  );

  const fetchAvailabilities = (params?: PaginationParams & { provider_id?: string }) => {
    return execute(null, { ...initialParams, ...params });
  };

  return {
    availabilities: data?.data?.availabilities || [],
    pagination: data?.meta?.pagination,
    loading,
    error,
    fetchAvailabilities
  };
};

export const useCreateNexHealthAvailability = () => {
  const { data, loading, error, execute } = useMCPRequest<NexHealthResponse<{ availability: NexHealthAvailability }>>(
    '/api/nexhealth/availabilities',
    'POST'
  );

  const createAvailability = (availabilityData: Partial<NexHealthAvailability>) => {
    return execute(availabilityData);
  };

  return {
    createdAvailability: data?.data?.availability,
    loading,
    error,
    createAvailability
  };
};

// Hook for document management
export const useNexHealthPatientDocuments = (patientId?: string, initialParams?: PaginationParams) => {
  const { data, loading, error, execute } = useMCPRequest<NexHealthResponse<{ documents: NexHealthDocument[] }>>(
    patientId ? `/api/nexhealth/patients/${patientId}/documents` : '/api/nexhealth/patients',
    'GET'
  );

  const fetchDocuments = (id: string, params?: PaginationParams) => {
    return execute(null, { ...initialParams, ...params });
  };

  return {
    documents: data?.data?.documents || [],
    pagination: data?.meta?.pagination,
    loading,
    error,
    fetchDocuments
  };
};

export const useUploadNexHealthDocument = (patientId?: string) => {
  const { data, loading, error, execute } = useMCPRequest<NexHealthResponse<{ document: NexHealthDocument }>>(
    patientId ? `/api/nexhealth/patients/${patientId}/documents` : '/api/nexhealth/patients',
    'POST'
  );

  const uploadDocument = (id: string, file: File, metadata?: Record<string, any>) => {
    const formData = new FormData();
    formData.append('file', file);
    if (metadata) {
      formData.append('metadata', JSON.stringify(metadata));
    }
    return execute(formData);
  };

  return {
    uploadedDocument: data?.data?.document,
    loading,
    error,
    uploadDocument
  };
};

// Hook for insurance management
export const useNexHealthInsurancePlans = (initialParams?: PaginationParams) => {
  const { data, loading, error, execute } = useMCPRequest<NexHealthResponse<{ insurance_plans: NexHealthInsurancePlan[] }>>(
    '/api/nexhealth/insurance_plans',
    'GET'
  );

  const fetchInsurancePlans = (params?: PaginationParams) => {
    return execute(null, { ...initialParams, ...params });
  };

  return {
    insurancePlans: data?.data?.insurance_plans || [],
    pagination: data?.meta?.pagination,
    loading,
    error,
    fetchInsurancePlans
  };
};

export const useNexHealthInsuranceCoverages = (patientId?: string, initialParams?: PaginationParams) => {
  const { data, loading, error, execute } = useMCPRequest<NexHealthResponse<{ insurance_coverages: NexHealthInsuranceCoverage[] }>>(
    '/api/nexhealth/insurance_coverages',
    'GET'
  );

  const fetchInsuranceCoverages = (id: string, params?: PaginationParams) => {
    return execute(null, { ...initialParams, ...params, patient_id: id });
  };

  return {
    insuranceCoverages: data?.data?.insurance_coverages || [],
    pagination: data?.meta?.pagination,
    loading,
    error,
    fetchInsuranceCoverages
  };
};

// Hook for webhook management
export const useNexHealthWebhookEndpoints = () => {
  const { data, loading, error, execute } = useMCPRequest<NexHealthResponse<{ webhook_endpoints: NexHealthWebhookEndpoint[] }>>(
    '/api/nexhealth/webhook_endpoints',
    'GET'
  );

  const fetchWebhookEndpoints = () => {
    return execute();
  };

  return {
    webhookEndpoints: data?.data?.webhook_endpoints || [],
    loading,
    error,
    fetchWebhookEndpoints
  };
};

export const useCreateNexHealthWebhookEndpoint = () => {
  const { data, loading, error, execute } = useMCPRequest<NexHealthResponse<{ webhook_endpoint: NexHealthWebhookEndpoint }>>(
    '/api/nexhealth/webhook_endpoints',
    'POST'
  );

  const createWebhookEndpoint = (targetUrl: string) => {
    return execute({ target_url: targetUrl });
  };

  return {
    createdWebhookEndpoint: data?.data?.webhook_endpoint,
    loading,
    error,
    createWebhookEndpoint
  };
};

export const useCreateNexHealthWebhookSubscription = (webhookEndpointId?: string) => {
  const { data, loading, error, execute } = useMCPRequest<NexHealthResponse<{ webhook_subscription: NexHealthWebhookSubscription }>>(
    webhookEndpointId ? `/api/nexhealth/webhook_endpoints/${webhookEndpointId}/webhook_subscriptions` : '/api/nexhealth/webhook_endpoints',
    'POST'
  );

  const createWebhookSubscription = (id: string, resourceType: string, event: string) => {
    return execute({ resource_type: resourceType, event });
  };

  return {
    createdWebhookSubscription: data?.data?.webhook_subscription,
    loading,
    error,
    createWebhookSubscription
  };
};

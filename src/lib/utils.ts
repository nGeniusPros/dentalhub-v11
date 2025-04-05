import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Define Patient type for utility functions
export interface Patient {
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
  // Added fields for NexHealth integration
  source?: 'internal' | 'nexhealth' | string;
  nexhealthData?: any; // Original data from NexHealth
  lastSyncedAt?: string;
}

export interface PatientNote {
  id: string;
  content: string;
  createdAt: string;
  createdBy: string;
}

/**
 * Format a phone number to a readable format
 * @param phoneNumber The phone number to format
 * @returns Formatted phone number
 */
export const formatPhoneNumber = (phoneNumber: string): string => {
  // Remove all non-numeric characters
  const cleaned = phoneNumber.replace(/\D/g, '');

  // Check if it's a valid US number
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  } else if (cleaned.length === 11 && cleaned.startsWith('1')) {
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }

  // Return original if not a standard format
  return phoneNumber;
};

/**
 * Format phone number for Twilio (E.164 format)
 * @param phoneNumber The phone number to format
 * @returns Formatted phone number in E.164 format
 */
export const formatPhoneForTwilio = (phoneNumber: string | undefined): string => {
  if (!phoneNumber) return '';

  // Remove all non-numeric characters
  const digitsOnly = phoneNumber.replace(/\D/g, '');

  // Ensure it has country code (assume US if not present)
  if (digitsOnly.length === 10) {
    return `+1${digitsOnly}`;
  } else if (digitsOnly.length > 10 && !digitsOnly.startsWith('1')) {
    return `+${digitsOnly}`;
  } else if (digitsOnly.length > 10 && digitsOnly.startsWith('1')) {
    return `+${digitsOnly}`;
  }

  // Default fallback
  return `+1${digitsOnly}`;
};

/**
 * Format a date string to a readable format
 * @param dateString The date string to format
 * @returns Formatted date string
 */
export const formatDate = (dateString?: string | null): string => {
  if (!dateString) return 'N/A';

  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    return dateString;
  }
};

/**
 * Format currency value
 * @param value The value to format
 * @returns Formatted currency string
 */
export const formatCurrency = (value: number | undefined): string => {
  if (value === undefined) return '$0.00';

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(value);
};

/**
 * Convert patients data to CSV format
 * @param patients Array of patient objects
 * @param fields Optional array of fields to include
 * @returns CSV string
 */
export const patientsToCSV = (
  patients: Patient[],
  fields: (keyof Patient)[] = ['id', 'name', 'email', 'phone', 'dob', 'nextAppointment', 'status', 'balance', 'lastVisit']
): string => {
  // Create header row
  const header = fields.map(field => {
    // Convert camelCase to Title Case
    return field.replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase());
  }).join(',');

  // Create data rows
  const rows = patients.map(patient => {
    return fields.map(field => {
      const value = patient[field];

      // Handle different types of values
      if (value === null || value === undefined) {
        return '';
      } else if (typeof value === 'string') {
        // Escape quotes and wrap in quotes if contains comma
        const escaped = value.replace(/"/g, '""');
        return escaped.includes(',') ? `"${escaped}"` : escaped;
      } else {
        return String(value);
      }
    }).join(',');
  });

  // Combine header and rows
  return [header, ...rows].join('\n');
};

/**
 * Download data as a file
 * @param data The data to download
 * @param filename The filename
 * @param mimeType The MIME type
 */
export const downloadFile = (data: string, filename: string, mimeType: string): void => {
  const blob = new Blob([data], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Export patients to CSV and download
 * @param patients Array of patient objects
 * @param filename Optional filename
 */
export const exportPatientsToCSV = (patients: Patient[], filename = 'patients.csv'): void => {
  const csv = patientsToCSV(patients);
  downloadFile(csv, filename, 'text/csv;charset=utf-8;');
};

/**
 * Apply filters to patients array
 * @param patients Array of patient objects
 * @param filters Filter options
 * @returns Filtered patients array
 */
export const applyFilters = (
  patients: Patient[],
  filters: {
    status: string[];
    balanceRange: { min: number | null; max: number | null };
    appointmentRange: { start: string | null; end: string | null };
    lastVisitRange: { start: string | null; end: string | null };
  }
): Patient[] => {
  return patients.filter(patient => {
    // Status filter
    if (filters.status.length > 0 && !filters.status.includes(patient.status || 'active')) {
      return false;
    }

    // Balance range filter
    if (filters.balanceRange.min !== null && (patient.balance || 0) < filters.balanceRange.min) {
      return false;
    }
    if (filters.balanceRange.max !== null && (patient.balance || 0) > filters.balanceRange.max) {
      return false;
    }

    // Appointment range filter
    if (patient.nextAppointment) {
      const appointmentDate = new Date(patient.nextAppointment);

      if (filters.appointmentRange.start && new Date(filters.appointmentRange.start) > appointmentDate) {
        return false;
      }

      if (filters.appointmentRange.end && new Date(filters.appointmentRange.end) < appointmentDate) {
        return false;
      }
    } else if (filters.appointmentRange.start || filters.appointmentRange.end) {
      // If appointment filters are set but patient has no appointment
      return false;
    }

    // Last visit range filter
    if (patient.lastVisit) {
      const lastVisitDate = new Date(patient.lastVisit);

      if (filters.lastVisitRange.start && new Date(filters.lastVisitRange.start) > lastVisitDate) {
        return false;
      }

      if (filters.lastVisitRange.end && new Date(filters.lastVisitRange.end) < lastVisitDate) {
        return false;
      }
    } else if (filters.lastVisitRange.start || filters.lastVisitRange.end) {
      // If last visit filters are set but patient has no last visit
      return false;
    }

    return true;
  });
};
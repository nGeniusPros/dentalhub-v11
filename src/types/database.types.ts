export interface Database {
  public: {
    Tables: {
      // 1. Administrative Tables
      achievements: {
        Row: {
          id: string
          title: string
          description: string
          icon: string
          progress: number
          target: number
          points: number
          unlocked: boolean
        }
        Insert: {
          id?: string
          title: string
          description: string
          icon: string
          progress: number
          target: number
          points: number
          unlocked: boolean
        }
        Update: {
          id?: string
          title?: string
          description?: string
          icon?: string
          progress?: number
          target?: number
          points?: number
          unlocked?: boolean
        }
      }
      audit_practice_settings: {
        Row: {
          id: number
          practice_settings_id: string
          changed_at: string
          changed_by: string
          old_value: any
          new_value: any
        }
        Insert: {
          id?: number
          practice_settings_id: string
          changed_at?: string
          changed_by: string
          old_value: any
          new_value: any
        }
        Update: {
          id?: number
          practice_settings_id?: string
          changed_at?: string
          changed_by?: string
          old_value?: any
          new_value?: any
        }
      }
      feature_flags: {
        Row: {
          id: string
          tenant_id: string
          key: string
          name: string
          description: string
          enabled: boolean
          created_at: string
          updated_at: string
          target_audience: any
          dependencies: string[]
        }
        Insert: {
          id?: string
          tenant_id: string
          key: string
          name: string
          description: string
          enabled: boolean
          created_at?: string
          updated_at?: string
          target_audience?: any
          dependencies?: string[]
        }
        Update: {
          id?: string
          tenant_id?: string
          key?: string
          name?: string
          description?: string
          enabled?: boolean
          created_at?: string
          updated_at?: string
          target_audience?: any
          dependencies?: string[]
        }
      }
      practice_settings: {
        Row: {
          id: string
          tenant_id: string
          practice_name: string
          address: string
          city: string
          state: string
          postal_code: string
          phone: string
          email: string
          website: string
          timezone: string
          date_format: string
          currency: string
          created_at: string
          updated_at: string
          default_locale: string
          closed_days: string[]
          version: number
        }
        Insert: {
          id?: string
          tenant_id: string
          practice_name: string
          address: string
          city: string
          state: string
          postal_code: string
          phone: string
          email: string
          website?: string
          timezone: string
          date_format?: string
          currency?: string
          created_at?: string
          updated_at?: string
          default_locale?: string
          closed_days?: string[]
          version?: number
        }
        Update: {
          id?: string
          tenant_id?: string
          practice_name?: string
          address?: string
          city?: string
          state?: string
          postal_code?: string
          phone?: string
          email?: string
          website?: string
          timezone?: string
          date_format?: string
          currency?: string
          created_at?: string
          updated_at?: string
          default_locale?: string
          closed_days?: string[]
          version?: number
        }
      }
      branding_settings: {
        Row: {
          id: string
          tenant_id: string
          logo_url: string
          primary_color: string
          secondary_color: string
          accent_color: string
          dark_mode: boolean
          created_at: string
          updated_at: string
          primary_font: string
          secondary_font: string
          favicon_url: string
        }
        Insert: {
          id?: string
          tenant_id: string
          logo_url?: string
          primary_color?: string
          secondary_color?: string
          accent_color?: string
          dark_mode?: boolean
          created_at?: string
          updated_at?: string
          primary_font?: string
          secondary_font?: string
          favicon_url?: string
        }
        Update: {
          id?: string
          tenant_id?: string
          logo_url?: string
          primary_color?: string
          secondary_color?: string
          accent_color?: string
          dark_mode?: boolean
          created_at?: string
          updated_at?: string
          primary_font?: string
          secondary_font?: string
          favicon_url?: string
        }
      }
      profiles: {
        Row: {
          id: string
          updated_at: string
          role: string
          first_name: string
          last_name: string
          phone_number: string
          date_of_birth: string
          address: string
          city: string
          state: string
          postal_code: string
          emergency_contact_name: string
          emergency_contact_phone: string
          medical_history: any
          is_active: boolean
          tenant_id: string
          location_id: string
          email: string
          phone: string
          enabled: boolean
          availability_hours: number
          status: string
        }
        Insert: {
          id?: string
          updated_at?: string
          role: string
          first_name: string
          last_name: string
          phone_number?: string
          date_of_birth?: string
          address?: string
          city?: string
          state?: string
          postal_code?: string
          emergency_contact_name?: string
          emergency_contact_phone?: string
          medical_history?: any
          is_active?: boolean
          tenant_id: string
          location_id?: string
          email: string
          phone?: string
          enabled?: boolean
          availability_hours?: number
          status?: string
        }
        Update: {
          id?: string
          updated_at?: string
          role?: string
          first_name?: string
          last_name?: string
          phone_number?: string
          date_of_birth?: string
          address?: string
          city?: string
          state?: string
          postal_code?: string
          emergency_contact_name?: string
          emergency_contact_phone?: string
          medical_history?: any
          is_active?: boolean
          tenant_id?: string
          location_id?: string
          email?: string
          phone?: string
          enabled?: boolean
          availability_hours?: number
          status?: string
        }
      }

      // 2. Security and Access Tables
      adminlogins: {
        Row: {
          id: string
          userid: string
          email: string
          lastlogin: string
          loginattempts: number
          islocked: boolean
        }
        Insert: {
          id?: string
          userid: string
          email: string
          lastlogin?: string
          loginattempts?: number
          islocked?: boolean
        }
        Update: {
          id?: string
          userid?: string
          email?: string
          lastlogin?: string
          loginattempts?: number
          islocked?: boolean
        }
      }
      patientlogins: {
        Row: {
          id: string
          userid: string
          email: string
          lastlogin: string
          loginattempts: number
          islocked: boolean
        }
        Insert: {
          id?: string
          userid: string
          email: string
          lastlogin?: string
          loginattempts?: number
          islocked?: boolean
        }
        Update: {
          id?: string
          userid?: string
          email?: string
          lastlogin?: string
          loginattempts?: number
          islocked?: boolean
        }
      }
      passwordresetactions: {
        Row: {
          id: string
          userid: string
          resettoken: string
          requestdate: string
          isused: boolean
        }
        Insert: {
          id?: string
          userid: string
          resettoken: string
          requestdate?: string
          isused?: boolean
        }
        Update: {
          id?: string
          userid?: string
          resettoken?: string
          requestdate?: string
          isused?: boolean
        }
      }
      ip_whitelist: {
        Row: {
          id: string
          security_settings_id: string
          ip_address: string
          description: string
          created_at: string
          created_by: string
          expires_at: string
        }
        Insert: {
          id?: string
          security_settings_id: string
          ip_address: string
          description?: string
          created_at?: string
          created_by: string
          expires_at?: string
        }
        Update: {
          id?: string
          security_settings_id?: string
          ip_address?: string
          description?: string
          created_at?: string
          created_by?: string
          expires_at?: string
        }
      }
      notification_settings: {
        Row: {
          id: string
          tenant_id: string
          email_enabled: boolean
          sms_enabled: boolean
          appointments_enabled: boolean
          marketing_enabled: boolean
          reminder_timing_hours: number
          created_at: string
          updated_at: string
          appointment_reminder_template: string
          cancellation_template: string
          preferred_channel: string
        }
        Insert: {
          id?: string
          tenant_id: string
          email_enabled?: boolean
          sms_enabled?: boolean
          appointments_enabled?: boolean
          marketing_enabled?: boolean
          reminder_timing_hours?: number
          created_at?: string
          updated_at?: string
          appointment_reminder_template?: string
          cancellation_template?: string
          preferred_channel?: string
        }
        Update: {
          id?: string
          tenant_id?: string
          email_enabled?: boolean
          sms_enabled?: boolean
          appointments_enabled?: boolean
          marketing_enabled?: boolean
          reminder_timing_hours?: number
          created_at?: string
          updated_at?: string
          appointment_reminder_template?: string
          cancellation_template?: string
          preferred_channel?: string
        }
      }

      // 3. Patient-Related Tables
      patientappointments: {
        Row: {
          id: string
          patientid: string
          appointmentdate: string
          providerid: string
          status: string
          notes: string
        }
        Insert: {
          id?: string
          patientid: string
          appointmentdate: string
          providerid: string
          status?: string
          notes?: string
        }
        Update: {
          id?: string
          patientid?: string
          appointmentdate?: string
          providerid?: string
          status?: string
          notes?: string
        }
      }
      patientbilling: {
        Row: {
          id: string
          patientid: string
          amountdue: number
          amountpaid: number
          billingdate: string
          status: string
        }
        Insert: {
          id?: string
          patientid: string
          amountdue: number
          amountpaid?: number
          billingdate?: string
          status?: string
        }
        Update: {
          id?: string
          patientid?: string
          amountdue?: number
          amountpaid?: number
          billingdate?: string
          status?: string
        }
      }
      patientdashboard: {
        Row: {
          id: string
          patientid: string
          totalvisits: number
          activetreatments: number
          lastvisitdate: string
          nextvisitdate: string
        }
        Insert: {
          id?: string
          patientid: string
          totalvisits?: number
          activetreatments?: number
          lastvisitdate?: string
          nextvisitdate?: string
        }
        Update: {
          id?: string
          patientid?: string
          totalvisits?: number
          activetreatments?: number
          lastvisitdate?: string
          nextvisitdate?: string
        }
      }
      patientdocuments: {
        Row: {
          id: string
          patientid: string
          documenttype: string
          documenturl: string
          uploadedat: string
          is_uploaded_to_nexhealth: boolean
          upload_status: string
          upload_error: string
          last_upload_attempt: string
          sync_direction: string
          content_hash: string
        }
        Insert: {
          id?: string
          patientid: string
          documenttype: string
          documenturl: string
          uploadedat?: string
          is_uploaded_to_nexhealth?: boolean
          upload_status?: string
          upload_error?: string
          last_upload_attempt?: string
          sync_direction?: string
          content_hash?: string
        }
        Update: {
          id?: string
          patientid?: string
          documenttype?: string
          documenturl?: string
          uploadedat?: string
          is_uploaded_to_nexhealth?: boolean
          upload_status?: string
          upload_error?: string
          last_upload_attempt?: string
          sync_direction?: string
          content_hash?: string
        }
      }
      patientfamilymembers: {
        Row: {
          id: string
          patientid: string
          name: string
          relationship: string
          contactnumber: string
          email: string
        }
        Insert: {
          id?: string
          patientid: string
          name: string
          relationship: string
          contactnumber?: string
          email?: string
        }
        Update: {
          id?: string
          patientid?: string
          name?: string
          relationship?: string
          contactnumber?: string
          email?: string
        }
      }
      patientmetrics: {
        Row: {
          id: string
          userid: string
          patientcount: number
          newpatients: number
          createdat: string
        }
        Insert: {
          id?: string
          userid: string
          patientcount: number
          newpatients: number
          createdat?: string
        }
        Update: {
          id?: string
          userid?: string
          patientcount?: number
          newpatients?: number
          createdat?: string
        }
      }
      patientonboarding: {
        Row: {
          id: string
          patientid: string
          firstname: string
          lastname: string
          dateofbirth: string
          gender: string
          contactnumber: string
          email: string
          address: string
          insuranceprovider: string
          policynumber: string
          createdat: string
        }
        Insert: {
          id?: string
          patientid: string
          firstname: string
          lastname: string
          dateofbirth: string
          gender?: string
          contactnumber?: string
          email?: string
          address?: string
          insuranceprovider?: string
          policynumber?: string
          createdat?: string
        }
        Update: {
          id?: string
          patientid?: string
          firstname?: string
          lastname?: string
          dateofbirth?: string
          gender?: string
          contactnumber?: string
          email?: string
          address?: string
          insuranceprovider?: string
          policynumber?: string
          createdat?: string
        }
      }
      patientresources: {
        Row: {
          id: string
          patientid: string
          resourcetype: string
          resourceurl: string
          uploadedat: string
        }
        Insert: {
          id?: string
          patientid: string
          resourcetype: string
          resourceurl: string
          uploadedat?: string
        }
        Update: {
          id?: string
          patientid?: string
          resourcetype?: string
          resourceurl?: string
          uploadedat?: string
        }
      }
      patientsettings: {
        Row: {
          id: string
          patientid: string
          settingname: string
          settingvalue: string
        }
        Insert: {
          id?: string
          patientid: string
          settingname: string
          settingvalue: string
        }
        Update: {
          id?: string
          patientid?: string
          settingname?: string
          settingvalue?: string
        }
      }
      patienttreatmentplan: {
        Row: {
          id: string
          patientid: string
          treatmenttype: string
          status: string
          notes: string
          createdat: string
        }
        Insert: {
          id?: string
          patientid: string
          treatmenttype: string
          status?: string
          notes?: string
          createdat?: string
        }
        Update: {
          id?: string
          patientid?: string
          treatmenttype?: string
          status?: string
          notes?: string
          createdat?: string
        }
      }
      patient_alerts: {
        Row: {
          id: string
          profile_id: string
          alert_type: string
          description: string
          severity: string
          start_date: string
          end_date: string
          is_active: boolean
          created_by: string
          tenant_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          profile_id: string
          alert_type: string
          description: string
          severity?: string
          start_date?: string
          end_date?: string
          is_active?: boolean
          created_by?: string
          tenant_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          profile_id?: string
          alert_type?: string
          description?: string
          severity?: string
          start_date?: string
          end_date?: string
          is_active?: boolean
          created_by?: string
          tenant_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      patient_alert_history: {
        Row: {
          id: string
          patient_alert_id: string
          previous_status: string
          new_status: string
          changed_by: string
          changed_at: string
          notes: string
        }
        Insert: {
          id?: string
          patient_alert_id: string
          previous_status?: string
          new_status: string
          changed_by?: string
          changed_at?: string
          notes?: string
        }
        Update: {
          id?: string
          patient_alert_id?: string
          previous_status?: string
          new_status?: string
          changed_by?: string
          changed_at?: string
          notes?: string
        }
      }
      patient_recalls: {
        Row: {
          id: string
          profile_id: string
          location_id: string
          provider_id: string
          recall_type_id: string
          due_date: string
          status: string
          notes: string
          last_communication_date: string
          tenant_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          profile_id: string
          location_id: string
          provider_id?: string
          recall_type_id: string
          due_date: string
          status: string
          notes?: string
          last_communication_date?: string
          tenant_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          profile_id?: string
          location_id?: string
          provider_id?: string
          recall_type_id?: string
          due_date?: string
          status?: string
          notes?: string
          last_communication_date?: string
          tenant_id?: string
          created_at?: string
          updated_at?: string
        }
      }

      // 4. Appointment and Scheduling Tables
      appointments: {
        Row: {
          id: string
          profile_id: string
          appointment_time: string
          status: string
          created_at: string
          location_id: string
        }
        Insert: {
          id?: string
          profile_id: string
          appointment_time: string
          status?: string
          created_at?: string
          location_id: string
        }
        Update: {
          id?: string
          profile_id?: string
          appointment_time?: string
          status?: string
          created_at?: string
          location_id?: string
        }
      }
      appointmentoverview: {
        Row: {
          id: string
          userid: string
          appointmentcount: number
          missedappointments: number
          createdat: string
        }
        Insert: {
          id?: string
          userid: string
          appointmentcount: number
          missedappointments?: number
          createdat?: string
        }
        Update: {
          id?: string
          userid?: string
          appointmentcount?: number
          missedappointments?: number
          createdat?: string
        }
      }
      calendar_settings: {
        Row: {
          id: string
          tenant_id: string
          provider: string
          default_appointment_duration_minutes: number
          buffer_time_minutes: number
          enabled: boolean
          created_at: string
          working_hours: any
          sync_interval: number
        }
        Insert: {
          id?: string
          tenant_id: string
          provider: string
          default_appointment_duration_minutes?: number
          buffer_time_minutes?: number
          enabled?: boolean
          created_at?: string
          working_hours?: any
          sync_interval?: number
        }
        Update: {
          id?: string
          tenant_id?: string
          provider?: string
          default_appointment_duration_minutes?: number
          buffer_time_minutes?: number
          enabled?: boolean
          created_at?: string
          working_hours?: any
          sync_interval?: number
        }
      }
      appointment_types: {
        Row: {
          id: string
          name: string
          description: string
          duration_minutes: number
          color: string
          is_active: boolean
          tenant_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string
          duration_minutes: number
          color?: string
          is_active?: boolean
          tenant_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          duration_minutes?: number
          color?: string
          is_active?: boolean
          tenant_id?: string
          created_at?: string
          updated_at?: string
        }
      }

      // Add more tables as needed...

      // NexHealth Integration Tables
      nexhealth_patients: {
        Row: {
          id: string
          nexhealth_id: string
          first_name: string
          middle_name: string | null
          last_name: string
          email: string | null
          created_at: string
          updated_at: string
          institution_id: string
          foreign_id: string | null
          foreign_id_type: string | null
          inactive: boolean
          last_sync_time: string
          guarantor_id: string | null
          unsubscribe_sms: boolean
          balance_amount: string | null
          balance_currency: string | null
          billing_type: string | null
          chart_id: string | null
          preferred_language: string | null
          location_ids: string[]
          bio: any // JSON containing all bio information
          raw_data: any // Complete raw data from NexHealth
          local_patient_id: string | null // Reference to local patient record if linked
          sync_status: string // 'synced', 'pending', 'error'
          last_error: string | null
          tenant_id: string
        }
        Insert: {
          id?: string
          nexhealth_id: string
          first_name: string
          middle_name?: string | null
          last_name: string
          email?: string | null
          created_at?: string
          updated_at?: string
          institution_id: string
          foreign_id?: string | null
          foreign_id_type?: string | null
          inactive?: boolean
          last_sync_time?: string
          guarantor_id?: string | null
          unsubscribe_sms?: boolean
          balance_amount?: string | null
          balance_currency?: string | null
          billing_type?: string | null
          chart_id?: string | null
          preferred_language?: string | null
          location_ids?: string[]
          bio?: any
          raw_data?: any
          local_patient_id?: string | null
          sync_status?: string
          last_error?: string | null
          tenant_id: string
        }
        Update: {
          id?: string
          nexhealth_id?: string
          first_name?: string
          middle_name?: string | null
          last_name?: string
          email?: string | null
          created_at?: string
          updated_at?: string
          institution_id?: string
          foreign_id?: string | null
          foreign_id_type?: string | null
          inactive?: boolean
          last_sync_time?: string
          guarantor_id?: string | null
          unsubscribe_sms?: boolean
          balance_amount?: string | null
          balance_currency?: string | null
          billing_type?: string | null
          chart_id?: string | null
          preferred_language?: string | null
          location_ids?: string[]
          bio?: any
          raw_data?: any
          local_patient_id?: string | null
          sync_status?: string
          last_error?: string | null
          tenant_id?: string
        }
      }
      nexhealth_appointments: {
        Row: {
          id: string
          nexhealth_id: string
          patient_id: string
          provider_id: string
          location_id: string
          operatory_id: string | null
          appointment_type_id: string
          start_time: string
          end_time: string
          status: string
          created_at: string
          updated_at: string
          raw_data: any
          local_appointment_id: string | null
          sync_status: string
          last_error: string | null
          tenant_id: string
        }
        Insert: {
          id?: string
          nexhealth_id: string
          patient_id: string
          provider_id: string
          location_id: string
          operatory_id?: string | null
          appointment_type_id: string
          start_time: string
          end_time: string
          status: string
          created_at?: string
          updated_at?: string
          raw_data?: any
          local_appointment_id?: string | null
          sync_status?: string
          last_error?: string | null
          tenant_id: string
        }
        Update: {
          id?: string
          nexhealth_id?: string
          patient_id?: string
          provider_id?: string
          location_id?: string
          operatory_id?: string | null
          appointment_type_id?: string
          start_time?: string
          end_time?: string
          status?: string
          created_at?: string
          updated_at?: string
          raw_data?: any
          local_appointment_id?: string | null
          sync_status?: string
          last_error?: string | null
          tenant_id?: string
        }
      }
      nexhealth_documents: {
        Row: {
          id: string
          nexhealth_id: string
          patient_id: string
          filename: string
          content_type: string
          size: number
          url: string
          created_at: string
          updated_at: string
          raw_data: any
          local_document_id: string | null
          sync_status: string
          last_error: string | null
          tenant_id: string
        }
        Insert: {
          id?: string
          nexhealth_id: string
          patient_id: string
          filename: string
          content_type: string
          size: number
          url: string
          created_at?: string
          updated_at?: string
          raw_data?: any
          local_document_id?: string | null
          sync_status?: string
          last_error?: string | null
          tenant_id: string
        }
        Update: {
          id?: string
          nexhealth_id?: string
          patient_id?: string
          filename?: string
          content_type?: string
          size?: number
          url?: string
          created_at?: string
          updated_at?: string
          raw_data?: any
          local_document_id?: string | null
          sync_status?: string
          last_error?: string | null
          tenant_id?: string
        }
      }
      nexhealth_insurance_coverages: {
        Row: {
          id: string
          nexhealth_id: string
          patient_id: string
          insurance_plan_id: string
          subscriber_id: string
          group_number: string | null
          is_primary: boolean
          created_at: string
          updated_at: string
          raw_data: any
          local_insurance_id: string | null
          sync_status: string
          last_error: string | null
          tenant_id: string
        }
        Insert: {
          id?: string
          nexhealth_id: string
          patient_id: string
          insurance_plan_id: string
          subscriber_id: string
          group_number?: string | null
          is_primary: boolean
          created_at?: string
          updated_at?: string
          raw_data?: any
          local_insurance_id?: string | null
          sync_status?: string
          last_error?: string | null
          tenant_id: string
        }
        Update: {
          id?: string
          nexhealth_id?: string
          patient_id?: string
          insurance_plan_id?: string
          subscriber_id?: string
          group_number?: string | null
          is_primary?: boolean
          created_at?: string
          updated_at?: string
          raw_data?: any
          local_insurance_id?: string | null
          sync_status?: string
          last_error?: string | null
          tenant_id?: string
        }
      }
      nexhealth_sync_logs: {
        Row: {
          id: string
          sync_type: string
          start_time: string
          end_time: string | null
          status: string
          records_processed: number
          records_created: number
          records_updated: number
          records_failed: number
          error_message: string | null
          details: any
          tenant_id: string
        }
        Insert: {
          id?: string
          sync_type: string
          start_time?: string
          end_time?: string | null
          status: string
          records_processed?: number
          records_created?: number
          records_updated?: number
          records_failed?: number
          error_message?: string | null
          details?: any
          tenant_id: string
        }
        Update: {
          id?: string
          sync_type?: string
          start_time?: string
          end_time?: string | null
          status?: string
          records_processed?: number
          records_created?: number
          records_updated?: number
          records_failed?: number
          error_message?: string | null
          details?: any
          tenant_id?: string
        }
      }
      nexhealth_webhooks: {
        Row: {
          id: string
          nexhealth_id: string
          target_url: string
          resource_type: string
          event: string
          created_at: string
          updated_at: string
          status: string
          last_error: string | null
          tenant_id: string
        }
        Insert: {
          id?: string
          nexhealth_id: string
          target_url: string
          resource_type: string
          event: string
          created_at?: string
          updated_at?: string
          status?: string
          last_error?: string | null
          tenant_id: string
        }
        Update: {
          id?: string
          nexhealth_id?: string
          target_url?: string
          resource_type?: string
          event?: string
          created_at?: string
          updated_at?: string
          status?: string
          last_error?: string | null
          tenant_id?: string
        }
      }
    }
    // Add Views, Functions, etc. if needed
  }
}

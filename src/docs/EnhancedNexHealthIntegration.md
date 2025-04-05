# Enhanced NexHealth Integration

This document provides an overview of the enhanced NexHealth integration in the DentalHub application.

## Overview

The enhanced NexHealth integration allows DentalHub to pull in all available data from the NexHealth API, store it in the database, and display it in the patient record page. It also includes a continuous sync mechanism to keep the data up-to-date.

## Features

### 1. Comprehensive Data Sync

The enhanced integration pulls in all available data from NexHealth, including:

- Patient demographic information
- Contact details
- Address information
- Insurance coverage
- Appointments
- Documents
- Financial information

All this data is stored in the database for quick access and to reduce API calls to NexHealth.

### 2. Initial Full Migration

The system supports a one-time full migration of all patient data from NexHealth. This process:

1. Fetches all patients from NexHealth with pagination
2. For each patient, fetches related data (appointments, documents, insurance)
3. Stores all data in the database
4. Links NexHealth records with local patient records when possible

### 3. Continuous Sync

After the initial migration, the system keeps the data in sync using webhooks:

1. A webhook endpoint is registered with NexHealth
2. The webhook is subscribed to patient and appointment events
3. When a patient is created or updated in NexHealth, the webhook is triggered
4. The system fetches the updated data and stores it in the database

### 4. Enhanced Patient Record Display

The patient record page has been enhanced to display all available NexHealth data:

1. A new "NexHealth Data" tab shows all data from NexHealth
2. The data is organized into sections for easy navigation
3. The raw data is available for developers to view

## Database Schema

The enhanced integration uses the following database tables:

- `nexhealth_patients`: Stores patient data from NexHealth
- `nexhealth_appointments`: Stores appointment data from NexHealth
- `nexhealth_documents`: Stores document metadata from NexHealth
- `nexhealth_insurance_coverages`: Stores insurance coverage data from NexHealth
- `nexhealth_sync_logs`: Logs sync operations for auditing and troubleshooting
- `nexhealth_webhooks`: Stores webhook configuration

## Usage

### Initial Full Migration

To perform an initial full migration of all patient data from NexHealth:

1. Go to the Patients page
2. Click the "Full Sync with All Data" button
3. Wait for the sync to complete (this may take some time depending on the number of patients)

### Setting Up Continuous Sync

To set up continuous sync with NexHealth:

1. Go to the Patients page
2. Click the "Set Up Auto-Sync" button
3. The system will register a webhook with NexHealth and subscribe to patient and appointment events

### Viewing NexHealth Data

To view NexHealth data for a patient:

1. Go to the Patients page
2. Click on a patient that has been synced from NexHealth
3. In the patient details dialog, click on the "NexHealth Data" tab

## Troubleshooting

### Sync Errors

If you encounter errors during sync:

1. Check the sync error message on the Patients page
2. Check the `nexhealth_sync_logs` table for more details
3. Ensure your NexHealth API credentials are correct
4. Verify that the NexHealth API is accessible

### Webhook Errors

If webhooks are not working:

1. Check that the webhook URL is accessible from the internet
2. Verify that the webhook is registered correctly in NexHealth
3. Check the `nexhealth_webhooks` table for the webhook configuration

## Best Practices

1. **Initial Sync**: Perform the initial sync during off-hours to minimize impact on system performance.
2. **Webhook Security**: Ensure the webhook endpoint is secure and validates incoming requests.
3. **Error Handling**: Monitor sync logs for errors and address them promptly.
4. **Data Privacy**: Ensure that patient data is handled in compliance with privacy regulations.

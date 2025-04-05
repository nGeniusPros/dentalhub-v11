#!/usr/bin/env ts-node
import { NexHealthTester } from '../src/utils/nexhealth-test-utils';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { program } from 'commander';

// Load environment variables
dotenv.config();

// Define command line options
program
  .option('-a, --auth', 'Test authentication only')
  .option('-p, --patients', 'Test patient data retrieval')
  .option('-d, --details', 'Test patient details retrieval')
  .option('-ap, --appointments', 'Test appointments retrieval')
  .option('-doc, --documents', 'Test documents retrieval')
  .option('-i, --insurance', 'Test insurance retrieval')
  .option('-w, --webhook', 'Test webhook setup')
  .option('-o, --output <path>', 'Output results to file')
  .option('-v, --verbose', 'Show verbose output')
  .parse(process.argv);

const options = program.opts();

// If no specific tests are selected, run all tests
const runAll = !options.auth && 
               !options.patients && 
               !options.details && 
               !options.appointments && 
               !options.documents && 
               !options.insurance && 
               !options.webhook;

// Get configuration from environment variables
const config = {
  apiKey: process.env.NEXHEALTH_API_KEY || '',
  subdomain: process.env.NEXHEALTH_SUBDOMAIN || '',
  locationId: process.env.NEXHEALTH_LOCATION_ID || '',
  baseUrl: process.env.NEXHEALTH_BASE_URL || 'https://nexhealth.info',
  webhookUrl: process.env.NEXHEALTH_WEBHOOK_URL || ''
};

// Validate configuration
if (!config.apiKey || !config.subdomain || !config.locationId) {
  console.error('Error: Missing required environment variables.');
  console.error('Please ensure the following variables are set:');
  console.error('- NEXHEALTH_API_KEY');
  console.error('- NEXHEALTH_SUBDOMAIN');
  console.error('- NEXHEALTH_LOCATION_ID');
  process.exit(1);
}

// Initialize tester
const tester = new NexHealthTester(config);

// Run selected tests
async function runTests() {
  console.log('Starting NexHealth integration tests...');
  console.log(`Configuration:`);
  console.log(`- API Key: ${config.apiKey ? '****' + config.apiKey.substring(config.apiKey.length - 4) : 'Not set'}`);
  console.log(`- Subdomain: ${config.subdomain}`);
  console.log(`- Location ID: ${config.locationId}`);
  console.log(`- Base URL: ${config.baseUrl}`);
  console.log(`- Webhook URL: ${config.webhookUrl || 'Not set'}`);
  console.log('');

  const results: Record<string, any> = {};

  // Authentication test (always run this first)
  console.log('Testing authentication...');
  results.authentication = await tester.testAuthentication();
  logTestResult('Authentication', results.authentication);

  if (!results.authentication.success) {
    console.error('Authentication failed. Aborting remaining tests.');
    outputResults(results);
    process.exit(1);
  }

  // Run selected tests
  if (runAll || options.patients) {
    console.log('\nTesting patient retrieval...');
    results.patientsRetrieval = await tester.testPatientsRetrieval();
    logTestResult('Patient Retrieval', results.patientsRetrieval);
  }

  if (runAll || options.details) {
    console.log('\nTesting patient details...');
    results.patientDetails = await tester.testPatientDetails();
    logTestResult('Patient Details', results.patientDetails);
  }

  if (runAll || options.appointments) {
    console.log('\nTesting appointments...');
    results.appointments = await tester.testAppointments();
    logTestResult('Appointments', results.appointments);
  }

  if (runAll || options.documents) {
    console.log('\nTesting documents...');
    results.documents = await tester.testDocuments();
    logTestResult('Documents', results.documents);
  }

  if (runAll || options.insurance) {
    console.log('\nTesting insurance...');
    results.insurance = await tester.testInsurance();
    logTestResult('Insurance', results.insurance);
  }

  if ((runAll || options.webhook) && config.webhookUrl) {
    console.log('\nTesting webhook setup...');
    results.webhookSetup = await tester.testWebhookSetup();
    logTestResult('Webhook Setup', results.webhookSetup);
  }

  // Output final results
  outputResults(results);
}

// Log test result
function logTestResult(testName: string, result: any) {
  if (result.success) {
    console.log(`✅ ${testName}: ${result.message}`);
    if (options.verbose && result.data) {
      console.log('Data:', JSON.stringify(result.data, null, 2));
    }
  } else {
    console.error(`❌ ${testName}: ${result.message}`);
    if (result.error) {
      console.error('Error:', result.error.message);
      if (options.verbose && result.error.response) {
        console.error('Response:', JSON.stringify(result.error.response.data, null, 2));
      }
    }
  }
}

// Output results to file if requested
function outputResults(results: Record<string, any>) {
  if (options.output) {
    try {
      const outputDir = path.dirname(options.output);
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }
      
      fs.writeFileSync(
        options.output, 
        JSON.stringify({
          timestamp: new Date().toISOString(),
          config: {
            subdomain: config.subdomain,
            locationId: config.locationId,
            baseUrl: config.baseUrl,
            webhookUrl: config.webhookUrl || null
          },
          results
        }, null, 2)
      );
      console.log(`\nResults saved to ${options.output}`);
    } catch (error) {
      console.error(`\nError saving results to file: ${error.message}`);
    }
  }

  // Print summary
  console.log('\nTest Summary:');
  let passCount = 0;
  let failCount = 0;
  
  Object.entries(results).forEach(([testName, result]) => {
    if (result.success) {
      passCount++;
    } else {
      failCount++;
    }
  });
  
  console.log(`Passed: ${passCount}, Failed: ${failCount}, Total: ${passCount + failCount}`);
  
  if (failCount > 0) {
    process.exit(1);
  }
}

// Run the tests
runTests().catch(error => {
  console.error('Unexpected error:', error);
  process.exit(1);
});

import axios from 'axios';
import { config } from 'dotenv';
import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Initialize dotenv
config();

// Get environment variables
const apiKey = process.env.NEXHEALTH_API_KEY;
const subdomain = process.env.NEXHEALTH_SUBDOMAIN;
const locationId = process.env.NEXHEALTH_LOCATION_ID;

console.log('Testing NexHealth API with:');
console.log(`- API Key: ${apiKey ? '****' + apiKey.substring(apiKey.length - 4) : 'Not set'}`);
console.log(`- Subdomain: ${subdomain || 'Not set'}`);
console.log(`- Location ID: ${locationId || 'Not set'}`);

async function testNexHealth() {
  try {
    // Step 1: Get bearer token
    console.log('\nStep 1: Getting bearer token...');
    const authUrl = 'https://nexhealth.info/authenticates';
    const authResponse = await axios.post(authUrl, {}, {
      headers: {
        'Accept': 'application/vnd.Nexhealth+json;version=2',
        'Authorization': apiKey
      }
    });

    console.log('Auth response:', JSON.stringify(authResponse.data, null, 2));

    const token = authResponse.data?.data?.token;
    if (!token) {
      console.error('Failed to extract token from NexHealth response:', authResponse.data);
      throw new Error('Authentication failed: Could not retrieve bearer token from NexHealth.');
    }

    console.log('Successfully obtained bearer token.');

    // Step 2: Get patients
    console.log('\nStep 2: Getting patients...');
    const patientsUrl = new URL('https://nexhealth.info/patients');
    patientsUrl.searchParams.set('subdomain', subdomain);
    patientsUrl.searchParams.set('location_id', locationId);
    patientsUrl.searchParams.set('per_page', '5'); // Limit to 5 patients for testing

    console.log(`Making request to: ${patientsUrl.toString()}`);
    console.log(`With Authorization: Bearer ${token.substring(0, 10)}...`);

    const patientsResponse = await axios.get(patientsUrl.toString(), {
      headers: {
        'Accept': 'application/vnd.Nexhealth+json;version=2',
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log(`Patients response status: ${patientsResponse.status}`);
    console.log(`Response structure:`, Object.keys(patientsResponse.data));
    console.log(`Total patients: ${patientsResponse.data?.count || 0}`);

    // Save the full response to a file for examination
    writeFileSync('nexhealth-response.json', JSON.stringify(patientsResponse.data, null, 2));
    console.log('\nSaved full response to nexhealth-response.json');

    // Check if data is an array or if it's nested differently
    if (Array.isArray(patientsResponse.data?.data)) {
      console.log(`Data is an array with ${patientsResponse.data.data.length} items`);

      if (patientsResponse.data.data.length > 0) {
        console.log('\nSample patient data:');
        const samplePatient = patientsResponse.data.data[0];
        console.log(`- ID: ${samplePatient.id}`);
        console.log(`- Name: ${samplePatient.name || `${samplePatient.first_name || ''} ${samplePatient.last_name || ''}`.trim()}`);
        console.log(`- Email: ${samplePatient.email || 'N/A'}`);
        console.log(`- Phone: ${samplePatient.bio?.phone_number || samplePatient.bio?.cell_phone_number || 'N/A'}`);

        // Save the patients to a file for reference
        writeFileSync('nexhealth-patients-sample.json', JSON.stringify(patientsResponse.data.data, null, 2));
        console.log('\nSaved patients to nexhealth-patients-sample.json');
      } else {
        console.log('Data array is empty.');
      }
    } else {
      console.log('Data is not an array. Examining structure...');
      console.log(JSON.stringify(patientsResponse.data, null, 2).substring(0, 500) + '...');
    }

    return patientsResponse.data;
  } catch (error) {
    console.error('Error testing NexHealth API:', error.response?.data || error.message);
    throw error;
  }
}

testNexHealth()
  .then(data => {
    console.log('\nTest completed successfully.');
  })
  .catch(error => {
    console.error('\nTest failed:', error);
    process.exit(1);
  });

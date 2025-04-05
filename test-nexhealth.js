const axios = require('axios');
require('dotenv').config();

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
    
    const patientsResponse = await axios.get(patientsUrl.toString(), {
      headers: {
        'Accept': 'application/vnd.Nexhealth+json;version=2',
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log(`Patients response status: ${patientsResponse.status}`);
    console.log(`Total patients: ${patientsResponse.data?.count || 0}`);
    
    if (patientsResponse.data?.data && patientsResponse.data.data.length > 0) {
      console.log('\nSample patient data:');
      const samplePatient = patientsResponse.data.data[0];
      console.log(`- ID: ${samplePatient.id}`);
      console.log(`- Name: ${samplePatient.name}`);
      console.log(`- Email: ${samplePatient.email}`);
      console.log(`- Phone: ${samplePatient.bio?.phone_number || samplePatient.bio?.cell_phone_number || 'N/A'}`);
    } else {
      console.log('No patients found.');
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

const axios = require('axios');
const { spawn } = require('child_process');
const path = require('path');

const PORT = 3001; // Use a different port for testing
process.env.PORT = PORT;
process.env.DB_NAME = 'postgres'; // Use default postgres db for test just to make sure it connects if user didn't create the specific DB
// ACTUALLY, sticking to the .env config is better, assuming the user will create the DB or has one.
// Let's assume standard config from .env but override PORT.

const API_URL = `http://localhost:${PORT}/api`;

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function runTests() {
  console.log('Starting server for testing...');
  const server = spawn('node', ['src/app.js'], {
    env: { ...process.env, PORT },
    stdio: 'inherit',
    cwd: path.resolve(__dirname, '..')
  });

  // Give server time to start
  await sleep(5000);

  try {
    console.log('--- Test 1: Create Patient (Admin) ---');
    const createRes = await axios.post(`${API_URL}/patients`, {
      name: 'John Doe',
      age: 30,
      gender: 'Male',
      contactInfo: '123-456-7890',
      medicalHistory: 'None'
    }, {
      headers: { 'X-User-Role': 'admin' }
    });
    console.log('Patient Created:', createRes.data.id);
    const patientId = createRes.data.id;
    const initialVersion = createRes.data.version;

    console.log('--- Test 2: Concurrent Update (Admin) ---');
    // We will simulate two admins trying to update the same patient with the SAME version
    const updatePayload1 = { version: initialVersion, name: 'John Updated First' };
    const updatePayload2 = { version: initialVersion, name: 'John Updated Second' };

    const req1 = axios.put(`${API_URL}/patients/${patientId}`, updatePayload1, {
      headers: { 'X-User-Role': 'admin' }
    }).catch(e => e.response);

    const req2 = axios.put(`${API_URL}/patients/${patientId}`, updatePayload2, {
      headers: { 'X-User-Role': 'admin' }
    }).catch(e => e.response);

    const [res1, res2] = await Promise.all([req1, req2]);

    console.log('Response 1 Status:', res1.status);
    console.log('Response 2 Status:', res2.status);

    const successCount = [res1, res2].filter(r => r.status === 200).length;
    const conflictCount = [res1, res2].filter(r => r.status === 409).length;

    if (successCount === 1 && conflictCount === 1) {
      console.log('✅ Concurrency Test Passed: One succeeded, one failed with Conflict.');
    } else {
      console.log('❌ Concurrency Test Failed.');
    }

  } catch (error) {
    console.error('Test Error:', error.message);
    if (error.response) console.error('Response data:', error.response.data);
  } finally {
    console.log('Stopping server...');
    server.kill();
    process.exit(0);
  }
}

runTests();

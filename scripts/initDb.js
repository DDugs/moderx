const { Client } = require('pg');
require('dotenv').config();

const dbName = process.env.DB_NAME;
const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  database: 'postgres', // Connect to default DB to create new one
};

async function createDb() {
  const client = new Client(config);
  try {
    await client.connect();
    const res = await client.query(`SELECT 1 FROM pg_database WHERE datname = '${dbName}'`);
    if (res.rowCount === 0) {
      console.log(`Database ${dbName} not found. Creating...`);
      await client.query(`CREATE DATABASE "${dbName}"`);
      console.log(`Database ${dbName} created.`);
    } else {
      console.log(`Database ${dbName} already exists.`);
    }
  } catch (err) {
    console.error('Error checking/creating database:', err);
  } finally {
    await client.end();
  }
}

createDb();

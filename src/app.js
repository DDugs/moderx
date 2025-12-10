const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('./config/database');
const setupArchiveJob = require('./jobs/archiveService');

const patientRoutes = require('./routes/patientRoutes');
const visitRoutes = require('./routes/visitRoutes');

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use('/api/patients', patientRoutes);
app.use('/api/visits', visitRoutes);

// Sync Database
// In production, use migrations instead of sync()
sequelize.sync({ alter: true })
  .then(() => {
    console.log('Database synced successfully.');
  })
  .catch(err => {
    console.error('Error syncing database:', err);
  });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  // Start the cron job
  setupArchiveJob();
});

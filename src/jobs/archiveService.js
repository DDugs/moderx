const cron = require('node-cron');
const { Op } = require('sequelize');
const Visit = require('../models/Visit');

const setupArchiveJob = () => {
  // Run every day at midnight
  cron.schedule('0 0 * * *', async () => {
    console.log('Running auto-archive job...');
    try {
      const distinctMonths = 6;
      const cutoffDate = new Date();
      cutoffDate.setMonth(cutoffDate.getMonth() - distinctMonths);

      const [updatedCount] = await Visit.update(
        { status: 'archived' },
        {
          where: {
            status: 'active',
            updatedAt: {
              [Op.lt]: cutoffDate
            }
          }
        }
      );

      console.log(`Auto-archive job complete. Archived ${updatedCount} visits.`);
    } catch (error) {
      console.error('Error in auto-archive job:', error);
    }
  });
};

module.exports = setupArchiveJob;

// cronJobs
// Scheduled background tasks — runs automatically on a timer
// Currently: auto-close expired jobs every day at midnight

const cron = require('node-cron');
const Job  = require('../models/Job');

const startCronJobs = () => {

  // Cron syntax: '0 0 * * *' = at 00:00 every day
  // minute hour day month weekday
  cron.schedule('0 0 * * *', async () => {

    try {
      const now = new Date();

      // Find all active jobs where deadline has passed
      // Update them all at once using updateMany (atomic DB operation)
      const result = await Job.updateMany(
        {
          isDeleted: false,
          isActive:  true,
          status:    { $in: ['published', 'draft'] },
          deadline:  { $lt: now, $exists: true },  // deadline exists AND is in past
        },
        {
          $set: {
            isActive: false,
            status: 'expired',
          }
        }
      );

      if (result.modifiedCount > 0) {
        console.log(`[CRON] ${new Date().toISOString()} — Auto-closed ${result.modifiedCount} expired job(s)`);
      }

    } catch (err) {
      // Log error but never crash the server
      console.error('[CRON] Job expiration error:', err.message);
    }

  }, {
    timezone: 'Asia/Kolkata'  // IST timezone — important for Indian companies
  });

  console.log('[CRON] Job expiration scheduler started (runs daily at 00:00 IST)');
};

module.exports = { startCronJobs };
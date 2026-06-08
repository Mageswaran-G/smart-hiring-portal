// cronJobs
// Scheduled background tasks — runs automatically on a timer
// Currently: auto-close expired jobs every day at midnight

const cron         = require('node-cron');
const Job          = require('../models/Job');
const Notification = require('../models/Notification');
const logger       = require('./logger');

const startCronJobs = () => {

  // Cron syntax: '0 0 * * *' = at 00:00 every day
  // minute hour day month weekday
  cron.schedule('*/15 * * * *', async () => {

    try {
      const now = new Date();

      // Find all active jobs where deadline has passed
      // Update them all at once using updateMany (atomic DB operation)
      const result = await Job.updateMany(
        {
          isDeleted: { $ne: true },
          isActive:  true,
          status:    'published',
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
        logger.info(`[CRON] Auto-closed ${result.modifiedCount} expired job(s)`);
      }

    } catch (err) {
      // Log error but never crash the server
      logger.error(`[CRON] Job expiration error: ${err.message}`);
    }

  }, {
    timezone: 'Asia/Kolkata'  // IST timezone — important for Indian companies
  });

  logger.info('[CRON] Job expiration scheduler started (runs every 15 minutes)');
};

  // Run every night at midnight IST — clean old notifications
  cron.schedule('0 0 * * *', async () => {
    try {
      // Keep only latest 100 notifications per user — delete older ones
      const users = await require('../models/User').find({}, '_id').lean();
      let cleaned = 0;
      for (const u of users) {
        const oldest = await Notification.find({ user: u._id })
          .sort({ createdAt: -1 })
          .skip(100)
          .select('_id')
          .lean();
        if (oldest.length > 0) {
          await Notification.deleteMany({ _id: { $in: oldest.map(n => n._id) } });
          cleaned += oldest.length;
        }
      }
      if (cleaned > 0) logger.info(`[CRON] Cleaned ${cleaned} old notification(s)`);
    } catch (err) {
      logger.error(`[CRON] Notification cleanup error: ${err.message}`);
    }
  }, { timezone: 'Asia/Kolkata' });

  logger.info('[CRON] Notification cleanup scheduler started (runs daily at midnight IST)');

module.exports = { startCronJobs };
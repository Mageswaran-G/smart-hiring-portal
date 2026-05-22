const Job = require('../models/Job');

const expireJobs = async () => {
  await Job.updateMany(
    {
      deadline: { $lt: new Date() },
      isActive: true,
      isDeleted: { $ne: true },
    },
    {
      isActive: false,
      status: 'expired',
    }
  );
};

module.exports = expireJobs;

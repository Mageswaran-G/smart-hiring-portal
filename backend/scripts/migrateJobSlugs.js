// Run once: node scripts/migrateJobSlugs.js
// Generates slugs for all existing jobs that don't have one

// Safety guard — never run in production accidentally
if (process.env.NODE_ENV === 'production') {
  console.error('ERROR: This migration script cannot run in production.');
  process.exit(1);
}

require('dotenv').config();
const mongoose     = require('mongoose');
const Job          = require('../models/Job');
const generateSlug = require('../utils/generateSlug');

const migrate = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  const jobs = await Job.find({
    $or: [
      { slug: { $exists: false } },
      { slug: null },
      { slug: '' }
    ]
  });

  console.log(`Found ${jobs.length} jobs without slug`);

  for (const job of jobs) {
    job.slug = generateSlug(job.title, job.location, job._id);
    await job.save();
    console.log(`  Slug generated: ${job.slug}`);
  }

  console.log('Migration complete!');
  process.exit(0);
};

migrate().catch(err => {
  console.error(err);
  process.exit(1);
});
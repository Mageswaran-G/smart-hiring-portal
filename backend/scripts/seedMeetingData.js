require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Job = require('../models/Job');

const MONGO_URI = process.env.MONGO_URI;

const jobTemplates = [
  { title: 'Frontend Developer', jobType: 'full-time', workMode: 'remote', experienceLevel: 'junior', skillsRequired: ['react','javascript','css'] },
  { title: 'Backend Developer', jobType: 'full-time', workMode: 'hybrid', experienceLevel: 'mid', skillsRequired: ['nodejs','express','mongodb'] },
  { title: 'Full Stack Developer', jobType: 'full-time', workMode: 'onsite', experienceLevel: 'mid', skillsRequired: ['react','nodejs','mongodb'] },
  { title: 'Data Analyst', jobType: 'full-time', workMode: 'hybrid', experienceLevel: 'junior', skillsRequired: ['python','sql','excel'] },
  { title: 'UI/UX Designer', jobType: 'full-time', workMode: 'remote', experienceLevel: 'junior', skillsRequired: ['figma','uiux'] },
  { title: 'DevOps Engineer', jobType: 'full-time', workMode: 'onsite', experienceLevel: 'senior', skillsRequired: ['docker','aws','cicd'] },
  { title: 'QA Engineer', jobType: 'full-time', workMode: 'hybrid', experienceLevel: 'junior', skillsRequired: ['testing','selenium'] },
  { title: 'Mobile App Developer', jobType: 'full-time', workMode: 'remote', experienceLevel: 'mid', skillsRequired: ['reactnative','javascript'] },
  { title: 'Product Manager', jobType: 'full-time', workMode: 'onsite', experienceLevel: 'senior', skillsRequired: ['agile','productmanagement'] },
  { title: 'HR Executive', jobType: 'full-time', workMode: 'onsite', experienceLevel: 'junior', skillsRequired: ['communication','recruitment'] },
  { title: 'Software Intern', jobType: 'internship', workMode: 'remote', experienceLevel: 'fresher', skillsRequired: ['javascript'] },
  { title: 'Data Science Intern', jobType: 'internship', workMode: 'hybrid', experienceLevel: 'fresher', skillsRequired: ['python','machinelearning'] },
  { title: 'Sales Executive', jobType: 'full-time', workMode: 'onsite', experienceLevel: 'junior', skillsRequired: ['sales','communication'] },
  { title: 'Content Writer', jobType: 'part-time', workMode: 'remote', experienceLevel: 'fresher', skillsRequired: ['writing','seo'] },
  { title: 'Cloud Engineer', jobType: 'full-time', workMode: 'remote', experienceLevel: 'senior', skillsRequired: ['aws','azure','docker'] },
  { title: 'Java Developer', jobType: 'full-time', workMode: 'hybrid', experienceLevel: 'mid', skillsRequired: ['java','spring'] },
  { title: 'Python Developer', jobType: 'full-time', workMode: 'remote', experienceLevel: 'mid', skillsRequired: ['python','django'] },
  { title: 'Business Analyst', jobType: 'full-time', workMode: 'onsite', experienceLevel: 'junior', skillsRequired: ['excel','sql'] },
  { title: 'AI/ML Engineer', jobType: 'full-time', workMode: 'remote', experienceLevel: 'senior', skillsRequired: ['python','machinelearning','tensorflow'] },
  { title: 'Graphic Designer', jobType: 'part-time', workMode: 'remote', experienceLevel: 'junior', skillsRequired: ['figma','photoshop'] },
  { title: 'Network Engineer', jobType: 'full-time', workMode: 'onsite', experienceLevel: 'mid', skillsRequired: ['networking','linux'] },
  { title: 'Marketing Executive', jobType: 'full-time', workMode: 'hybrid', experienceLevel: 'junior', skillsRequired: ['marketing','seo'] },
];

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to DB');

  const company = await User.findOne({ email: 'company@test.com' });
  if (!company) {
    console.log('Company user not found! Check email.');
    process.exit(1);
  }

  company.companyName = 'ABC Tech Solutions';
  company.companyWebsite = 'https://abctechsolutions.com';
  company.industry = 'Information Technology';
  company.companySize = '50-200';
  company.foundedYear = '2019';
  company.companyCity = 'Chennai';
  company.companyState = 'Tamil Nadu';
  company.companyCountry = 'India';
  company.companyDescription = 'ABC Tech Solutions builds modern web and AI products for global clients.';
  company.companyCulture = 'We value collaboration, ownership, and continuous learning.';
  company.employeeBenefits = ['Health Insurance', 'Remote Work', 'Flexible Hours', 'Annual Bonus'];
  company.companyTechStack = ['React', 'Node.js', 'MongoDB', 'Docker', 'AWS'];
  company.hiringStatus = true;
  company.phone = '9876543210';
  company.bio = 'Hiring innovative talent across engineering and design roles.';

  await company.save();
  console.log('Company profile updated');

  for (const job of jobTemplates) {
    await Job.create({
      title: job.title,
      description: '<p>We are looking for a talented ' + job.title + ' to join our growing team.</p>',
      postedBy: company._id,
      location: 'Chennai',
      jobType: job.jobType,
      workMode: job.workMode,
      experienceLevel: job.experienceLevel,
      skillsRequired: job.skillsRequired,
      salary: { min: 300000, max: 800000, currency: 'INR', isDisclosed: true },
      openings: 2,
      status: 'published',
      isActive: true,
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });
  }
  console.log(jobTemplates.length + ' jobs created');

  const candidate = await User.findOne({ email: 'candidate@test.com' });
  if (!candidate) {
    console.log('Candidate user not found! Check email.');
    process.exit(1);
  }

  candidate.name = 'Mageswaran G';
  candidate.headline = 'Full Stack Developer | React & Node.js';
  candidate.bio = 'Passionate full stack developer with hands-on experience building production-grade SaaS applications.';
  candidate.phone = '9876501234';
  candidate.city = 'Chennai';
  candidate.state = 'Tamil Nadu';
  candidate.country = 'India';
  candidate.skills = [
    { name: 'React', proficiency: 'advanced' },
    { name: 'Node.js', proficiency: 'advanced' },
    { name: 'MongoDB', proficiency: 'intermediate' },
    { name: 'JavaScript', proficiency: 'advanced' },
  ];
  candidate.educationList = [{
    institution: 'Anna University',
    degree: 'B.E. Computer Science',
    field: 'Computer Science',
    startYear: '2021',
    endYear: '2025',
  }];
  candidate.workHistory = [{
    company: 'Smart Hiring Portal (Internship)',
    role: 'Full Stack Developer Intern',
    type: 'internship',
    startDate: '2026-04-27',
    endDate: '',
    current: true,
    description: 'Built a full stack AI-powered hiring platform from scratch.',
  }];
  candidate.linkedIn = 'https://linkedin.com/in/mageswaran-g';
  candidate.github = 'https://github.com/Mageswaran-G';
  candidate.portfolio = 'https://github.com/Mageswaran-G/smart-hiring-portal';
  candidate.openToWork = true;
  candidate.resumeVisibility = 'public';
  candidate.profileVisibility = 'public';

  await candidate.save();
  console.log('Candidate profile updated');

  console.log('ALL DONE!');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});

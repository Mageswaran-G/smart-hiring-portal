require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("../models/User");
const Job = require("../models/Job");
const Application = require("../models/Application");
const SavedJob = require("../models/SavedJob");

const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT || "10");

async function connectDB() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB Connected");
}

async function hashPassword(password) {
  return bcrypt.hash(password, SALT_ROUNDS);
}

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomItems(arr, count) {
  const copy = [...arr];
  const result = [];

  while (copy.length && result.length < count) {
    const index = Math.floor(Math.random() * copy.length);
    result.push(copy.splice(index, 1)[0]);
  }

  return result;
}

const cities = [
  "Chennai","Bangalore","Hyderabad","Pune",
  "Coimbatore","Mumbai","Delhi","Noida"
];

const skills = [
  "React","Node.js","MongoDB","Express.js","JavaScript",
  "TypeScript","Java","Spring Boot","Python","Django",
  "AWS","Docker","Kubernetes","SQL","HTML","CSS",
  "Tailwind CSS","Next.js","Flutter","React Native",
  "Power BI","Excel","Git","GitHub"
];

console.log("Demo Seeder Loaded");


async function createCompanies() {

  const companies = [];

  const names = [
    "NovaTech Solutions",
    "Skyline Technologies",
    "CloudNest Systems",
    "Quantum Labs",
    "PixelForge",
    "NextGen Software",
    "Apex Innovations",
    "BlueOcean Technologies"
  ];

  for (let i = 0; i < names.length; i++) {

    const email = `company${i+1}@demo.com`;

    const exists = await User.findOne({ email });

    if (exists) {
      companies.push(exists);
      continue;
    }

    const company = await User.create({
      name: names[i],
      email,
      password: "Password@123",
      role: "company",

      companyName: names[i],
      companyWebsite: `https://www.${names[i].replace(/\s+/g,'').toLowerCase()}.com`,
      industry: randomItem([
        "Software",
        "FinTech",
        "Healthcare",
        "EdTech",
        "AI",
        "Cloud"
      ]),
      companySize: randomItem([
        "11-50",
        "51-200",
        "201-500"
      ]),

      companyDescription:
        `${names[i]} builds scalable enterprise software solutions.`,

      foundedYear: String(2014 + i),

      companyCity: randomItem(cities),
      companyState: "Tamil Nadu",
      companyCountry: "India",

      hiringStatus: true,
      isVerified: true,
      profileVisibility: "public"
    });

    companies.push(company);

    console.log("Created company:", company.companyName);
  }

  return companies;
}



async function createCandidates() {

  const candidates = [];

  const firstNames = [
    "Arun","Vignesh","Karthik","Rahul","Praveen",
    "Deepak","Sathish","Ajay","Harish","Surya",
    "Naveen","Lokesh","Rakesh","Manoj","Santhosh"
  ];

  for (let i = 0; i < firstNames.length; i++) {

    const email = `candidate${i+1}@demo.com`;

    const exists = await User.findOne({ email });

    if (exists) {
      candidates.push(exists);
      continue;
    }

    const selectedSkills = randomItems(skills, 5);

    const user = await User.create({

      name: firstNames[i] + " Kumar",

      email,

      password: "Password@123",

      role: "candidate",

      headline: randomItem([
        "Full Stack Developer",
        "Frontend Developer",
        "Backend Developer",
        "React Developer",
        "Software Engineer"
      ]),

      bio:
        "Passionate software developer looking for challenging opportunities.",

      phone: `98${String(10000000+i).padStart(8,'0')}`,

      city: randomItem(cities),

      state: "Tamil Nadu",

      country: "India",

      linkedIn:
        `https://linkedin.com/in/${firstNames[i].toLowerCase()}`,

      github:
        `https://github.com/${firstNames[i].toLowerCase()}`,

      portfolio:
        `https://${firstNames[i].toLowerCase()}.dev`,

      skills: selectedSkills.map(s => ({
        name: s,
        proficiency: randomItem([
          "beginner",
          "intermediate",
          "advanced"
        ])
      })),

      educationList: [{
        degree: "B.Tech",
        field: "Information Technology",
        institution: "Anna University",
        startYear: "2020",
        endYear: "2024",
        current: false
      }],

      workHistory: [{
        company: randomItem([
          "Infosys",
          "TCS",
          "Wipro",
          "Cognizant",
          "HCL"
        ]),
        role: "Software Engineer Intern",
        type: "internship",
        startDate: "2025-01-01",
        endDate: "",
        current: true,
        description: "Worked on full stack development."
      }],

      profileVisibility: "public",

      resumeVisibility: "public",

      openToWork: true,

      isVerified: true

    });

    candidates.push(user);

    console.log("Created candidate:", user.email);
  }

  return candidates;
}



async function main() {
  try {
    await connectDB();

    console.log("Creating companies...");
    const companies = await createCompanies();

    console.log("Creating candidates...");
    const candidates = await createCandidates();

    console.log("Creating jobs...");
    const jobs = await createJobs(companies);

    console.log("Creating applications...");
    await createApplications(candidates, jobs);

    console.log("Creating saved jobs...");
    await createSavedJobs(candidates, jobs);

    console.log("--------------------------------");
    console.log("Companies :", companies.length);
    console.log("Candidates:", candidates.length);
    console.log("Jobs      :", jobs.length);
    console.log("--------------------------------");

    process.exit(0);

  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

main();



async function createJobs(companies) {

  const titles = [
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Developer",
    "React Developer",
    "Node.js Developer",
    "Java Developer",
    "Python Developer",
    "DevOps Engineer",
    "Cloud Engineer",
    "UI UX Designer",
    "QA Engineer",
    "Data Analyst",
    "Business Analyst",
    "AI Engineer",
    "ML Engineer"
  ];

  const jobs = [];

  for (let i = 1; i <= 30; i++) {

    const company = companies[(i - 1) % companies.length];

    
    const title = titles[(i - 1) % titles.length];

    const slug =
      "demo-" +
      company.companyName.toLowerCase().replace(/\s+/g,"-") +
      "-" + i;


    const exists = await Job.findOne({
      slug
    });

    if (exists) {
      jobs.push(exists);
      continue;
    }

    const job = await Job.create({

      slug,

      title,

      description:
        "We are looking for talented software engineers to build scalable web applications.",

      postedBy: company._id,

      skillsRequired: randomItems(skills,3),

      preferredSkills: randomItems(skills,2),

      location: randomItem(cities),

      jobType: randomItem([
        "internship",
        "full-time",
        "part-time",
        "contract"
      ]),

      workMode: randomItem([
        "remote",
        "onsite",
        "hybrid"
      ]),

      salary: {
        min: 300000,
        max: 900000,
        currency: "INR",
        isDisclosed: true
      },

      experienceLevel: randomItem([
        "fresher",
        "junior",
        "mid",
        "senior"
      ]),

      deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 45),

      openings: Math.floor(Math.random()*5)+1,

      requirements: [
        "Good communication",
        "Problem solving"
      ],

      responsibilities: [
        "Develop features",
        "Fix bugs"
      ],

      benefits: [
        "WFH",
        "Medical Insurance"
      ],

      status: "published",

      isActive: true

    });

    jobs.push(job);

    console.log("Created Job:", job.title);

  }

  return jobs;

}



async function createApplications(candidates, jobs) {

  const statuses = [
    "applied",
    "reviewing",
    "shortlisted",
    "hired",
    "rejected"
  ];

  let created = 0;

  for (const candidate of candidates) {

    const selectedJobs = randomItems(jobs, 5);

    for (const job of selectedJobs) {

      const exists = await Application.findOne({
        candidate: candidate._id,
        job: job._id
      });

      if (exists) continue;

      await Application.create({

        candidate: candidate._id,

        job: job._id,

        status: randomItem(statuses),

        coverLetter:
          "I am interested in this opportunity and believe my skills match your requirements.",

        resume: candidate.resume?.url || ""

      });

      await Job.updateOne(
        { _id: job._id },
        { $inc: { applicationsCount: 1 } }
      );

      created++;

    }

  }

  console.log("Applications Created:", created);

}



async function createSavedJobs(candidates, jobs) {

  let created = 0;

  for (const candidate of candidates) {

    const selectedJobs = randomItems(jobs, 3);

    for (const job of selectedJobs) {

      const exists = await SavedJob.findOne({
        candidate: candidate._id,
        job: job._id
      });

      if (exists) continue;

      await SavedJob.create({
        candidate: candidate._id,
        job: job._id
      });

      created++;
    }
  }

  console.log("Saved Jobs Created:", created);
}


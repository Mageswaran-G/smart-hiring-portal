const Job = require("../../models/Job");
const User = require("../../models/User");
const Application = require("../../models/Application");

const getHomeData = async () => {
  const [
    totalJobs,
    totalCompanies,
    totalCandidates,
    totalApplications,
    latestJobs,
    featuredCompanies,
  ] = await Promise.all([
    Job.countDocuments({
      isDeleted: false,
      isActive: true,
      status: "published",
    }),

    User.countDocuments({
      role: "company",
    }),

    User.countDocuments({
      role: "candidate",
    }),

    Application.countDocuments(),

    Job.find(
        {
            isDeleted: false,
            isActive: true,
            status: "published",
        },
        "title slug location workMode jobType experienceLevel salary createdAt"
        )
      .populate("postedBy", "companyName profilePhoto isVerified")
      .sort({ createdAt: -1 })
      .limit(6)
      .lean(),

    User.find({
      role: "company",
    })
      .select("companyName profilePhoto industry companySize isVerified")
      .limit(8)
      .lean(),
  ]);

  return {
    stats: {
        jobs: totalJobs,
        companies: totalCompanies,
        candidates: totalCandidates,
        applications: totalApplications,
    },

    latestJobs,

    featuredCompanies,
    };
};

module.exports = {
  getHomeData,
};
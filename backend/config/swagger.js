const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Smart Hiring Portal API',
      version: '1.0.0',
      description: 'Complete REST API documentation for Smart Hiring Portal — A SaaS Recruitment Platform',
      contact: {
        name: 'Mageswaran G',
        email: 'mageswaran@example.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:8000',
        description: 'Development Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT access token',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id:    { type: 'string', example: '64f1a2b3c4d5e6f7a8b9c0d1' },
            name:   { type: 'string', example: 'Mageswaran G' },
            email:  { type: 'string', example: 'candidate@test.com' },
            role:   { type: 'string', enum: ['candidate', 'company', 'admin'] },
          },
        },
        Job: {
          type: 'object',
          properties: {
            _id:            { type: 'string' },
            title:          { type: 'string', example: 'Senior React Developer' },
            location:       { type: 'string', example: 'Chennai' },
            jobType:        { type: 'string', enum: ['full-time', 'part-time', 'internship', 'contract'] },
            workMode:       { type: 'string', enum: ['remote', 'hybrid', 'onsite'] },
            experienceLevel:{ type: 'string', enum: ['fresher', 'junior', 'mid', 'senior'] },
            status:         { type: 'string', enum: ['draft', 'published', 'closed', 'expired'] },
            skillsRequired: { type: 'array', items: { type: 'string' } },
            preferredSkills:{ type: 'array', items: { type: 'string' } },
          },
        },
        Application: {
          type: 'object',
          properties: {
            _id:         { type: 'string' },
            candidate:   { type: 'string' },
            job:         { type: 'string' },
            status:      { type: 'string', enum: ['applied', 'reviewing', 'shortlisted', 'rejected', 'hired', 'withdrawn'] },
            coverLetter: { type: 'string' },
            createdAt:   { type: 'string', format: 'date-time' },
          },
        },
        ApiResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            data:    { type: 'object' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Error message here' },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
    tags: [
      { name: 'Auth',          description: 'Authentication — signup, login, refresh, logout' },
      { name: 'Users',         description: 'User profile management' },
      { name: 'Jobs',          description: 'Job posting and discovery' },
      { name: 'Applications',  description: 'Job application lifecycle' },
      { name: 'Saved Jobs',    description: 'Candidate saved jobs' },
      { name: 'AI',            description: 'AI features — match scoring, ATS, recommendations, ranking' },
      { name: 'Chat',          description: 'HireBot AI chat' },
      { name: 'Interviews',    description: 'Interview scheduling and management' },
      { name: 'Notifications', description: 'In-app notification system' },
      { name: 'Admin',         description: 'Admin platform management' },
    ],
  },
  apis: ['./routes/v1/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);
module.exports = swaggerSpec;

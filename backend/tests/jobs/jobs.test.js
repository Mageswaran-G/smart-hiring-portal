const request = require('supertest');
const app     = require('../../server');
const { connectTestDB, disconnectTestDB, clearCollections } = require('../setup');

beforeAll(async () => await connectTestDB());
afterAll(async () => await disconnectTestDB());
afterEach(async () => await clearCollections());

// Helper — login and get token
const getToken = async (userData) => {
  await request(app).post('/api/v1/auth/signup').send(userData);
  const res = await request(app).post('/api/v1/auth/login').send({
    email: userData.email, password: userData.password
  });
  return res.body.data.accessToken;
};

const companyUser = { name: 'Test Company', email: 'company@test.com', password: 'Test@1234', role: 'company' };
const candidateUser = { name: 'Test Candidate', email: 'candidate@test.com', password: 'Test@1234', role: 'candidate' };

const jobData = {
  title:       'React Developer',
  description: 'We need a React developer with 2 years experience',
  location:    'Chennai',
  jobType:     'full-time',
  workMode:    'remote',
  skills:      ['React', 'JavaScript'],
};

describe('POST /api/v1/jobs', () => {
  it('should allow company to create a job', async () => {
    const token = await getToken(companyUser);
    const res = await request(app)
      .post('/api/v1/jobs')
      .set('Authorization', `Bearer ${token}`)
      .send(jobData);
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBe(jobData.title);
  });

  it('should reject job creation by candidate', async () => {
    const token = await getToken(candidateUser);
    const res = await request(app)
      .post('/api/v1/jobs')
      .set('Authorization', `Bearer ${token}`)
      .send(jobData);
    expect(res.statusCode).toBe(403);
  });

  it('should reject job creation without token', async () => {
    const res = await request(app)
      .post('/api/v1/jobs')
      .send(jobData);
    expect(res.statusCode).toBe(401);
  });
});

describe('GET /api/v1/public/jobs', () => {
  it('should return public jobs list', async () => {
    const res = await request(app).get('/api/v1/jobs');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data.jobs || res.body.data)).toBe(true);
  });
});

describe('GET /api/v1/jobs/my-jobs', () => {
  it('should return company own jobs', async () => {
    const token = await getToken(companyUser);
    await request(app).post('/api/v1/jobs').set('Authorization', `Bearer ${token}`).send(jobData);
    const res = await request(app)
      .get('/api/v1/jobs/company/my-jobs')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('should reject without token', async () => {
    const res = await request(app).get('/api/v1/jobs/company/my-jobs');
    expect(res.statusCode).toBe(401);
  });
});

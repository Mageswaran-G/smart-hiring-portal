const request = require('supertest');
const app     = require('../../server');
const { connectTestDB, disconnectTestDB, clearCollections } = require('../setup');

beforeAll(async () => await connectTestDB());
afterAll(async () => await disconnectTestDB());
afterEach(async () => await clearCollections());

const getToken = async (userData) => {
  await request(app).post('/api/v1/auth/signup').send(userData);
  const res = await request(app).post('/api/v1/auth/login').send({
    email: userData.email, password: userData.password
  });
  return res.body.data.accessToken;
};

const companyUser   = { name: 'Test Company',   email: 'company@test.com',   password: 'Test@1234', role: 'company'   };
const candidateUser = { name: 'Test Candidate', email: 'candidate@test.com', password: 'Test@1234', role: 'candidate' };

const jobData = {
  title: 'React Developer', description: 'React dev needed',
  location: 'Chennai', jobType: 'full-time', workMode: 'remote',
};

const createJob = async () => {
  const token = await getToken(companyUser);
  const res = await request(app)
    .post('/api/v1/jobs')
    .set('Authorization', `Bearer ${token}`)
    .send(jobData);
  const jobId = res.body.data._id;

  // Publish the job so candidates can apply
  await request(app)
    .patch(`/api/v1/jobs/${jobId}/status`)
    .set('Authorization', `Bearer ${token}`)
    .send({ status: 'published' });

  return { jobId, companyToken: token };
};

describe('POST /api/v1/applications/:jobId/apply', () => {
  it('should allow candidate to apply for a job', async () => {
    const { jobId } = await createJob();
    const token = await getToken(candidateUser);
    const res = await request(app)
      .post(`/api/v1/applications/${jobId}/apply`)
      .set('Authorization', `Bearer ${token}`)
      .send({ coverLetter: 'I am interested' });
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
  });

  it('should prevent duplicate application', async () => {
    const { jobId } = await createJob();
    const token = await getToken(candidateUser);
    await request(app)
      .post(`/api/v1/applications/${jobId}/apply`)
      .set('Authorization', `Bearer ${token}`)
      .send({});
    const res = await request(app)
      .post(`/api/v1/applications/${jobId}/apply`)
      .set('Authorization', `Bearer ${token}`)
      .send({});
    expect(res.statusCode).toBe(400);
  });

  it('should reject application by company', async () => {
    const { jobId, companyToken } = await createJob();
    const res = await request(app)
      .post(`/api/v1/applications/${jobId}/apply`)
      .set('Authorization', `Bearer ${companyToken}`)
      .send({});
    expect(res.statusCode).toBe(403);
  });
});

describe('GET /api/v1/applications/my', () => {
  it('should return candidate applications', async () => {
    const token = await getToken(candidateUser);
    const res = await request(app)
      .get('/api/v1/applications/my')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('should reject without token', async () => {
    const res = await request(app).get('/api/v1/applications/my');
    expect(res.statusCode).toBe(401);
  });
});

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

let _counter = 0;
const uid = () => `${Date.now()}_${++_counter}`;
const companyUser   = () => ({ name: 'Test Company',   email: `company_${uid()}@test.com`,   password: 'Test@1234', role: 'company'   });
const candidateUser = () => ({ name: 'Test Candidate', email: `candidate_${uid()}@test.com`, password: 'Test@1234', role: 'candidate' });

const jobData = {
  title: 'React Developer', description: 'React dev needed',
  location: 'Chennai', jobType: 'full-time', workMode: 'remote',
};

const setupShortlistedApplication = async () => {
  const companyToken   = await getToken(companyUser());
  const candidateToken = await getToken(candidateUser());
  const jobRes = await request(app).post('/api/v1/jobs').set('Authorization', `Bearer ${companyToken}`).send(jobData);
  const jobId = jobRes.body.data._id;
  await request(app).patch(`/api/v1/jobs/${jobId}/status`).set('Authorization', `Bearer ${companyToken}`).send({ status: 'published' });
  const appRes = await request(app).post(`/api/v1/applications/${jobId}/apply`).set('Authorization', `Bearer ${candidateToken}`).send({});
  const applicationId = appRes.body.data._id;
  await request(app).patch(`/api/v1/applications/${applicationId}/status`).set('Authorization', `Bearer ${companyToken}`).send({ status: 'shortlisted' });
  return { companyToken, candidateToken, applicationId, jobId };
};

const futureDate = () => new Date(Date.now() + 7 * 86400000).toISOString();

describe('POST /api/v1/interviews', () => {
  it('should allow company to schedule interview for shortlisted candidate', async () => {
    const { companyToken, applicationId } = await setupShortlistedApplication();
    const res = await request(app).post('/api/v1/interviews').set('Authorization', `Bearer ${companyToken}`)
      .send({ applicationId, scheduledAt: futureDate(), mode: 'online', meetingLink: 'https://meet.google.com/test' });
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
  });

  it('should reject scheduling for non-shortlisted candidate', async () => {
    const companyToken   = await getToken(companyUser());
    const candidateToken = await getToken(candidateUser());
    const jobRes = await request(app).post('/api/v1/jobs').set('Authorization', `Bearer ${companyToken}`).send(jobData);
    const jobId = jobRes.body.data._id;
    await request(app).patch(`/api/v1/jobs/${jobId}/status`).set('Authorization', `Bearer ${companyToken}`).send({ status: 'published' });
    const appRes = await request(app).post(`/api/v1/applications/${jobId}/apply`).set('Authorization', `Bearer ${candidateToken}`).send({});
    const applicationId = appRes.body.data._id;
    const res = await request(app).post('/api/v1/interviews').set('Authorization', `Bearer ${companyToken}`)
      .send({ applicationId, scheduledAt: futureDate(), mode: 'online', meetingLink: 'https://meet.google.com/test' });
    expect(res.statusCode).toBe(400);
  });

  it('should reject past date scheduling', async () => {
    const { companyToken, applicationId } = await setupShortlistedApplication();
    const pastDate = new Date(Date.now() - 86400000).toISOString();
    const res = await request(app).post('/api/v1/interviews').set('Authorization', `Bearer ${companyToken}`)
      .send({ applicationId, scheduledAt: pastDate, mode: 'online', meetingLink: 'https://meet.google.com/test' });
    expect(res.statusCode).toBe(400);
  });

  it('should reject scheduling by candidate', async () => {
    const { candidateToken, applicationId } = await setupShortlistedApplication();
    const res = await request(app).post('/api/v1/interviews').set('Authorization', `Bearer ${candidateToken}`)
      .send({ applicationId, scheduledAt: futureDate(), mode: 'online' });
    expect(res.statusCode).toBe(403);
  });
});

describe('GET /api/v1/interviews/my', () => {
  it('should return candidate interviews', async () => {
    const { candidateToken } = await setupShortlistedApplication();
    const res = await request(app).get('/api/v1/interviews/my').set('Authorization', `Bearer ${candidateToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });
});

describe('PATCH /api/v1/interviews/:id/status', () => {
  it('should allow candidate to accept interview', async () => {
    const { companyToken, candidateToken, applicationId } = await setupShortlistedApplication();
    const intRes = await request(app).post('/api/v1/interviews').set('Authorization', `Bearer ${companyToken}`)
      .send({ applicationId, scheduledAt: futureDate(), mode: 'online', meetingLink: 'https://meet.google.com/test' });
    const interviewId = intRes.body.data._id;
    const res = await request(app).patch(`/api/v1/interviews/${interviewId}/status`).set('Authorization', `Bearer ${candidateToken}`).send({ status: 'accepted' });
    expect(res.statusCode).toBe(200);
    expect(res.body.data.status).toBe('accepted');
  });

  it('should allow candidate to reject interview', async () => {
    const { companyToken, candidateToken, applicationId } = await setupShortlistedApplication();
    const intRes = await request(app).post('/api/v1/interviews').set('Authorization', `Bearer ${companyToken}`)
      .send({ applicationId, scheduledAt: futureDate(), mode: 'online', meetingLink: 'https://meet.google.com/test' });
    const interviewId = intRes.body.data._id;
    const res = await request(app).patch(`/api/v1/interviews/${interviewId}/status`).set('Authorization', `Bearer ${candidateToken}`).send({ status: 'rejected' });
    expect(res.statusCode).toBe(200);
    expect(res.body.data.status).toBe('rejected');
  });
});

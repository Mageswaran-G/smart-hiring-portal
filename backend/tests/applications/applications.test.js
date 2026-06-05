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

describe('DELETE /api/v1/applications/:id/withdraw', () => {

  it('should allow candidate to withdraw their own application', async () => {
    const { jobId } = await createJob();
    const token = await getToken(candidateUser);

    // Apply first
    const applyRes = await request(app)
      .post(`/api/v1/applications/${jobId}/apply`)
      .set('Authorization', `Bearer ${token}`)
      .send({});
    const appId = applyRes.body.data._id;

    // Withdraw
    const res = await request(app)
      .delete(`/api/v1/applications/${appId}/withdraw`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('should not allow withdrawing another candidate application', async () => {
    const { jobId } = await createJob();
    const token1 = await getToken(candidateUser);

    // Candidate 1 applies
    const applyRes = await request(app)
      .post(`/api/v1/applications/${jobId}/apply`)
      .set('Authorization', `Bearer ${token1}`)
      .send({});
    const appId = applyRes.body.data._id;

    // Candidate 2 tries to withdraw
    const candidate2 = { name: 'Candidate 2', email: 'cand2@test.com', password: 'Test@1234', role: 'candidate' };
    const token2 = await getToken(candidate2);
    const res = await request(app)
      .delete(`/api/v1/applications/${appId}/withdraw`)
      .set('Authorization', `Bearer ${token2}`);

    expect(res.statusCode).toBe(403);
  });

  it('should not allow company to withdraw application', async () => {
    const { jobId, companyToken } = await createJob();
    const token = await getToken(candidateUser);

    const applyRes = await request(app)
      .post(`/api/v1/applications/${jobId}/apply`)
      .set('Authorization', `Bearer ${token}`)
      .send({});
    const appId = applyRes.body.data._id;

    const res = await request(app)
      .delete(`/api/v1/applications/${appId}/withdraw`)
      .set('Authorization', `Bearer ${companyToken}`);

    expect(res.statusCode).toBe(403);
  });

  it('should not allow withdrawing already withdrawn application', async () => {
    const { jobId } = await createJob();
    const token = await getToken(candidateUser);

    const applyRes = await request(app)
      .post(`/api/v1/applications/${jobId}/apply`)
      .set('Authorization', `Bearer ${token}`)
      .send({});
    const appId = applyRes.body.data._id;

    // First withdraw
    await request(app)
      .delete(`/api/v1/applications/${appId}/withdraw`)
      .set('Authorization', `Bearer ${token}`);

    // Second withdraw — should fail
    const res = await request(app)
      .delete(`/api/v1/applications/${appId}/withdraw`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(400);
  });

  it('should set status to withdrawn not delete record', async () => {
    const { jobId } = await createJob();
    const token = await getToken(candidateUser);

    const applyRes = await request(app)
      .post(`/api/v1/applications/${jobId}/apply`)
      .set('Authorization', `Bearer ${token}`)
      .send({});
    const appId = applyRes.body.data._id;

    await request(app)
      .delete(`/api/v1/applications/${appId}/withdraw`)
      .set('Authorization', `Bearer ${token}`);

    // Record should still exist in DB — check via my applications
    const myApps = await request(app)
      .get('/api/v1/applications/my')
      .set('Authorization', `Bearer ${token}`);

    const withdrawn = myApps.body.data.find(a => a._id === appId);
    expect(withdrawn).toBeDefined();
    expect(withdrawn.status).toBe('withdrawn');
  });

});

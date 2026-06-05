const request = require('supertest');
const app     = require('../../server');
const { connectTestDB, disconnectTestDB, clearCollections } = require('../setup');

beforeAll(async () => await connectTestDB());
afterAll(async () => await disconnectTestDB());
afterEach(async () => await clearCollections());

let _c = 0;
const uid = () => `${Date.now()}_${++_c}`;
const candidateUser = () => ({ name: 'Test Candidate', email: `candidate_${uid()}@test.com`, password: 'Test@1234', role: 'candidate' });
const companyUser   = () => ({ name: 'Test Company',   email: `company_${uid()}@test.com`,   password: 'Test@1234', role: 'company'   });

const getToken = async (userData) => {
  await request(app).post('/api/v1/auth/signup').send(userData);
  const res = await request(app).post('/api/v1/auth/login').send({ email: userData.email, password: userData.password });
  return res.body.data.accessToken;
};

describe('GET /api/v1/notifications', () => {
  it('should return empty notifications for new user', async () => {
    const token = await getToken(candidateUser());
    const res = await request(app).get('/api/v1/notifications').set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data.notifications)).toBe(true);
  });

  it('should reject without token', async () => {
    const res = await request(app).get('/api/v1/notifications');
    expect(res.statusCode).toBe(401);
  });
});

describe('GET /api/v1/notifications/unread-count', () => {
  it('should return unread count', async () => {
    const token = await getToken(candidateUser());
    const res = await request(app).get('/api/v1/notifications/unread-count').set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(typeof res.body.data.count).toBe('number');
  });
});

describe('Notification triggers', () => {
  it('should create notification for company when candidate applies', async () => {
    const cToken = await getToken(companyUser());
    const candToken = await getToken(candidateUser());

    const jobRes = await request(app).post('/api/v1/jobs').set('Authorization', `Bearer ${cToken}`)
      .send({ title: 'Dev', description: 'Dev needed', location: 'Chennai', jobType: 'full-time', workMode: 'remote' });
    const jobId = jobRes.body.data._id;
    await request(app).patch(`/api/v1/jobs/${jobId}/status`).set('Authorization', `Bearer ${cToken}`).send({ status: 'published' });
    await request(app).post(`/api/v1/applications/${jobId}/apply`).set('Authorization', `Bearer ${candToken}`).send({});

    const res = await request(app).get('/api/v1/notifications').set('Authorization', `Bearer ${cToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.data.notifications.length).toBeGreaterThan(0);
    expect(res.body.data.notifications[0].type).toBe('new_application');
  });

  it('should create notification for candidate when status changes', async () => {
    const cToken   = await getToken(companyUser());
    const candToken = await getToken(candidateUser());

    const jobRes = await request(app).post('/api/v1/jobs').set('Authorization', `Bearer ${cToken}`)
      .send({ title: 'Dev', description: 'Dev needed', location: 'Chennai', jobType: 'full-time', workMode: 'remote' });
    const jobId = jobRes.body.data._id;
    await request(app).patch(`/api/v1/jobs/${jobId}/status`).set('Authorization', `Bearer ${cToken}`).send({ status: 'published' });
    const appRes = await request(app).post(`/api/v1/applications/${jobId}/apply`).set('Authorization', `Bearer ${candToken}`).send({});
    const applicationId = appRes.body.data._id;
    await request(app).patch(`/api/v1/applications/${applicationId}/status`).set('Authorization', `Bearer ${cToken}`).send({ status: 'shortlisted' });

    const res = await request(app).get('/api/v1/notifications').set('Authorization', `Bearer ${candToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.data.notifications.some(n => n.type === 'application_shortlisted')).toBe(true);
  });
});

describe('PATCH /api/v1/notifications/read-all', () => {
  it('should mark all notifications as read', async () => {
    const token = await getToken(candidateUser());
    const res = await request(app).patch('/api/v1/notifications/read-all').set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });
});

describe('PATCH /api/v1/notifications/:id/read', () => {
  it('should mark single notification as read', async () => {
    const cToken    = await getToken(companyUser());
    const candToken = await getToken(candidateUser());

    const jobRes = await request(app).post('/api/v1/jobs').set('Authorization', `Bearer ${cToken}`)
      .send({ title: 'Dev', description: 'Dev needed', location: 'Chennai', jobType: 'full-time', workMode: 'remote' });
    const jobId = jobRes.body.data._id;
    await request(app).patch(`/api/v1/jobs/${jobId}/status`).set('Authorization', `Bearer ${cToken}`).send({ status: 'published' });
    await request(app).post(`/api/v1/applications/${jobId}/apply`).set('Authorization', `Bearer ${candToken}`).send({});

    const notifRes = await request(app).get('/api/v1/notifications').set('Authorization', `Bearer ${cToken}`);
    const notifId = notifRes.body.data.notifications[0]._id;

    const res = await request(app)
      .patch(`/api/v1/notifications/${notifId}/read`)
      .set('Authorization', `Bearer ${cToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });
});

describe('DELETE /api/v1/notifications', () => {
  it('should clear all notifications', async () => {
    const token = await getToken(candidateUser());
    const res = await request(app).delete('/api/v1/notifications').set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });
});

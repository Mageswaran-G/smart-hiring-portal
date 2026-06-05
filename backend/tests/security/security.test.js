const request = require('supertest');
const app     = require('../../server');
const { connectTestDB, disconnectTestDB, clearCollections } = require('../setup');

beforeAll(async () => await connectTestDB());
afterAll(async () => await disconnectTestDB());
afterEach(async () => await clearCollections());

let _c = 0;
const uid = () => `${Date.now()}_${++_c}`;
const candidateUser = () => ({ name: 'Test Candidate', email: `candidate_${uid()}@test.com`, password: 'Test@1234', role: 'candidate' });

const getToken = async (userData) => {
  await request(app).post('/api/v1/auth/signup').send(userData);
  const res = await request(app).post('/api/v1/auth/login').send({ email: userData.email, password: userData.password });
  return res.body.data.accessToken;
};

describe('JWT Protection', () => {
  it('should reject expired or invalid token', async () => {
    const res = await request(app)
      .get('/api/v1/applications/my')
      .set('Authorization', 'Bearer invalidtoken123');
    expect(res.statusCode).toBe(401);
  });

  it('should reject missing token', async () => {
    const res = await request(app).get('/api/v1/applications/my');
    expect(res.statusCode).toBe(401);
  });

  it('should reject malformed Authorization header', async () => {
    const res = await request(app)
      .get('/api/v1/applications/my')
      .set('Authorization', 'NotBearer token123');
    expect(res.statusCode).toBe(401);
  });
});

describe('XSS Protection', () => {
  it('should sanitize XSS in signup name field', async () => {
    const res = await request(app)
      .post('/api/v1/auth/signup')
      .send({
        name:     '<script>alert("xss")</script>',
        email:    `xss_${uid()}@test.com`,
        password: 'Test@1234',
        role:     'candidate',
      });
    // Should either sanitize or reject — not crash
    expect([201, 400]).toContain(res.statusCode);
    if (res.statusCode === 201) {
      expect(res.body.data.name).not.toContain('<script>');
    }
  });
});

describe('Input Validation', () => {
  it('should reject signup with invalid email', async () => {
    const res = await request(app)
      .post('/api/v1/auth/signup')
      .send({ name: 'Test', email: 'notanemail', password: 'Test@1234' });
    expect(res.statusCode).toBe(400);
  });

  it('should reject signup with short password', async () => {
    const res = await request(app)
      .post('/api/v1/auth/signup')
      .send({ name: 'Test', email: `test_${uid()}@test.com`, password: '123' });
    expect(res.statusCode).toBe(400);
  });

  it('should reject login with missing fields', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'test@test.com' });
    expect(res.statusCode).toBe(400);
  });
});

describe('ObjectId Validation', () => {
  it('should reject invalid ObjectId in notification read', async () => {
    const token = await getToken(candidateUser());
    const res = await request(app)
      .patch('/api/v1/notifications/invalidid/read')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(400);
  });

  it('should reject invalid ObjectId in interview status', async () => {
    const token = await getToken(candidateUser());
    const res = await request(app)
      .patch('/api/v1/interviews/invalidid/status')
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'accepted' });
    expect(res.statusCode).toBe(400);
  });
});

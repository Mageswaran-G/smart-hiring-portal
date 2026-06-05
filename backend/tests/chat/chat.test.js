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

describe('POST /api/v1/chat/message', () => {
  it('should return reply for candidate message', async () => {
    const token = await getToken(candidateUser());
    const res = await request(app)
      .post('/api/v1/chat/message')
      .set('Authorization', `Bearer ${token}`)
      .send({ message: 'What jobs are available?' });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.reply).toBeDefined();
    expect(typeof res.body.data.reply).toBe('string');
  }, 30000);

  it('should return reply for company message', async () => {
    const token = await getToken(companyUser());
    const res = await request(app)
      .post('/api/v1/chat/message')
      .set('Authorization', `Bearer ${token}`)
      .send({ message: 'How do I post a job?' });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.reply).toBeDefined();
  }, 30000);

  it('should reject empty message', async () => {
    const token = await getToken(candidateUser());
    const res = await request(app)
      .post('/api/v1/chat/message')
      .set('Authorization', `Bearer ${token}`)
      .send({ message: '' });
    expect(res.statusCode).toBe(400);
  });

  it('should reject message over 1000 chars', async () => {
    const token = await getToken(candidateUser());
    const res = await request(app)
      .post('/api/v1/chat/message')
      .set('Authorization', `Bearer ${token}`)
      .send({ message: 'a'.repeat(1001) });
    expect(res.statusCode).toBe(400);
  });

  it('should reject without token', async () => {
    const res = await request(app)
      .post('/api/v1/chat/message')
      .send({ message: 'Hello' });
    expect(res.statusCode).toBe(401);
  });
});

describe('POST /api/v1/chat/message — admin', () => {
  it('should return reply for admin message', async () => {
    const User = require('../../models/User');
    const admin = await User.create({ name: 'Admin User', email: `admin_${uid()}@test.com`, password: 'Admin@1234', role: 'admin' });
    const loginRes = await request(app).post('/api/v1/auth/login').send({ email: admin.email, password: 'Admin@1234' });
    const token = loginRes.body.data.accessToken;

    const res = await request(app)
      .post('/api/v1/chat/message')
      .set('Authorization', `Bearer ${token}`)
      .send({ message: 'How many users are on the platform?' });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.reply).toBeDefined();
  }, 30000);
});

describe('GET /api/v1/chat/history', () => {
  it('should return chat history', async () => {
    const token = await getToken(candidateUser());
    const res = await request(app)
      .get('/api/v1/chat/history')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data.messages)).toBe(true);
  });

  it('should reject without token', async () => {
    const res = await request(app).get('/api/v1/chat/history');
    expect(res.statusCode).toBe(401);
  });
});

describe('DELETE /api/v1/chat/history', () => {
  it('should clear chat history', async () => {
    const token = await getToken(candidateUser());
    const res = await request(app)
      .delete('/api/v1/chat/history')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });
});

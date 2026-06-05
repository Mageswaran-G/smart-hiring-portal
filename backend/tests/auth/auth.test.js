const request = require('supertest');
const app     = require('../../server');
const { connectTestDB, disconnectTestDB, clearCollections } = require('../setup');

beforeAll(async () => await connectTestDB());
afterAll(async () => await disconnectTestDB());
afterEach(async () => await clearCollections());

const testCandidate = {
  name:     'Test Candidate',
  email:    'candidate@test.com',
  password: 'Test@1234',
  role:     'candidate',
};

const testCompany = {
  name:     'Test Company',
  email:    'company@test.com',
  password: 'Test@1234',
  role:     'company',
};

describe('POST /api/v1/auth/signup', () => {
  it('should register a new candidate successfully', async () => {
    const res = await request(app)
      .post('/api/v1/auth/signup')
      .send(testCandidate);
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.email).toBe(testCandidate.email);
    expect(res.body.data.role).toBe('candidate');
  });

  it('should register a new company successfully', async () => {
    const res = await request(app)
      .post('/api/v1/auth/signup')
      .send(testCompany);
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.role).toBe('company');
  });

  it('should reject duplicate email', async () => {
    await request(app).post('/api/v1/auth/signup').send(testCandidate);
    const res = await request(app).post('/api/v1/auth/signup').send(testCandidate);
    expect(res.statusCode).toBe(409);
    expect(res.body.success).toBe(false);
  });

  it('should reject signup without required fields', async () => {
    const res = await request(app)
      .post('/api/v1/auth/signup')
      .send({ email: 'test@test.com' });
    expect(res.statusCode).toBe(400);
  });
});

describe('POST /api/v1/auth/login', () => {
  beforeEach(async () => {
    await request(app).post('/api/v1/auth/signup').send(testCandidate);
  });

  it('should login with correct credentials', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: testCandidate.email, password: testCandidate.password });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.accessToken).toBeDefined();
  });

  it('should reject wrong password', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: testCandidate.email, password: 'wrongpassword' });
    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('should reject non-existent email', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'nobody@test.com', password: 'Test@1234' });
    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
  });
});

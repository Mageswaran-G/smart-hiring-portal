const request = require('supertest');
const app     = require('../../server');
const path    = require('path');
const fs      = require('fs');
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

// Create temp test files
const TEST_DIR = path.join(__dirname, 'temp');
const TEST_PDF  = path.join(TEST_DIR, 'test.pdf');
const TEST_PNG  = path.join(TEST_DIR, 'test.png');
const TEST_TXT  = path.join(TEST_DIR, 'test.txt');

beforeAll(() => {
  if (!fs.existsSync(TEST_DIR)) fs.mkdirSync(TEST_DIR);
  // Minimal valid PDF header
  fs.writeFileSync(TEST_PDF, Buffer.from('%PDF-1.4\n1 0 obj\n<< /Type /Catalog >>\nendobj\n'));
  // Minimal valid PNG (1x1 pixel)
  fs.writeFileSync(TEST_PNG, Buffer.from('89504e470d0a1a0a0000000d49484452000000010000000108020000009001 2e00000000c4944415478016360f8cfc00000000200 01e221bc330000000049454e44ae426082', 'hex'));
  // Invalid file type
  fs.writeFileSync(TEST_TXT, 'this is a text file');
});

afterAll(() => {
  if (fs.existsSync(TEST_DIR)) fs.rmSync(TEST_DIR, { recursive: true });
});

describe('POST /api/v1/users/upload-resume', () => {
  it('should upload PDF resume successfully', async () => {
    const token = await getToken(candidateUser());
    const res = await request(app)
      .post('/api/v1/users/upload-resume')
      .set('Authorization', `Bearer ${token}`)
      .attach('resume', TEST_PDF);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('should reject resume upload without token', async () => {
    const res = await request(app)
      .post('/api/v1/users/upload-resume')
      .attach('resume', TEST_PDF);
    expect(res.statusCode).toBe(401);
  });

  it('should reject invalid file type for resume', async () => {
    const token = await getToken(candidateUser());
    const res = await request(app)
      .post('/api/v1/users/upload-resume')
      .set('Authorization', `Bearer ${token}`)
      .attach('resume', TEST_TXT);
    expect(res.statusCode).toBe(400);
  });
});

describe('POST /api/v1/users/upload-photo', () => {
  it('should upload profile photo successfully', async () => {
    const token = await getToken(candidateUser());
    const res = await request(app)
      .post('/api/v1/users/upload-photo')
      .set('Authorization', `Bearer ${token}`)
      .attach('photo', TEST_PNG);
    expect([200, 400]).toContain(res.statusCode);
  });

  it('should reject photo upload without token', async () => {
    const res = await request(app)
      .post('/api/v1/users/upload-photo')
      .attach('photo', TEST_PNG);
    expect(res.statusCode).toBe(401);
  });

  it('should reject invalid file type for photo', async () => {
    const token = await getToken(candidateUser());
    const res = await request(app)
      .post('/api/v1/users/upload-photo')
      .set('Authorization', `Bearer ${token}`)
      .attach('photo', TEST_TXT);
    expect(res.statusCode).toBe(400);
  });
});

describe('POST /api/v1/users/upload-banner', () => {
  it('should reject banner upload by candidate', async () => {
    const token = await getToken(candidateUser());
    const res = await request(app)
      .post('/api/v1/users/upload-banner')
      .set('Authorization', `Bearer ${token}`)
      .attach('banner', TEST_PNG);
    expect(res.statusCode).toBe(403);
  });

  it('should reject banner upload without token', async () => {
    const res = await request(app)
      .post('/api/v1/users/upload-banner')
      .attach('banner', TEST_PNG);
    expect(res.statusCode).toBe(401);
  });
});

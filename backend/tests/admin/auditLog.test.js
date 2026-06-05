const request = require('supertest');
const app      = require('../../server');
const AuditLog = require('../../models/AuditLog');
const User     = require('../../models/User');
const { connectTestDB, disconnectTestDB, clearCollections } = require('../setup');

beforeAll(async () => await connectTestDB());
afterAll(async () => await disconnectTestDB());
afterEach(async () => await clearCollections());

let _c = 0;
const uid = () => `${Date.now()}_${++_c}`;

const candidateUser = () => ({ name: 'Candidate', email: `cand_${uid()}@test.com`, password: 'Test@1234', role: 'candidate' });

const getToken = async (userData) => {
  await request(app).post('/api/v1/auth/signup').send(userData);
  const res = await request(app).post('/api/v1/auth/login').send({
    email: userData.email, password: userData.password,
  });
  return res.body.data.accessToken;
};

const createAdmin = async () => {
  const admin = await User.create({ name: 'Admin', email: `admin_${uid()}@test.com`, password: 'Admin@1234', role: 'admin' });
  const res = await request(app).post('/api/v1/auth/login').send({ email: admin.email, password: 'Admin@1234' });
  return res.body.data.accessToken;
};

describe('GET /api/v1/admin/audit-logs', () => {

  it('should return audit logs for admin', async () => {
    const token = await createAdmin();
    const res = await request(app)
      .get('/api/v1/admin/audit-logs')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('should reject non-admin access', async () => {
    const token = await getToken(candidateUser());
    const res = await request(app)
      .get('/api/v1/admin/audit-logs')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(403);
  });

  it('should reject unauthenticated request', async () => {
    const res = await request(app).get('/api/v1/admin/audit-logs');
    expect(res.statusCode).toBe(401);
  });

  it('should create audit log when admin suspends user', async () => {
    const adminToken = await createAdmin();

    // Create a candidate to suspend — get ID from signup response
    const cand = candidateUser();
    const signupRes = await request(app).post('/api/v1/auth/signup').send(cand);
    const candId = signupRes.body.data.id;

    // Admin suspends candidate
    const suspendRes = await request(app)
      .patch(`/api/v1/admin/users/${candId}/suspend`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(suspendRes.statusCode).toBe(200);

    // Check audit log created
    const log = await AuditLog.findOne({ action: { $in: ['suspend_user', 'unsuspend_user'] } });
    expect(log).not.toBeNull();
    expect(log.targetType).toBe('user');
  });

  it('should return pagination info', async () => {
    const token = await createAdmin();
    const res = await request(app)
      .get('/api/v1/admin/audit-logs?page=1&limit=5')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.pagination).toBeDefined();
    expect(res.body.pagination).toHaveProperty('total');
    expect(res.body.pagination).toHaveProperty('hasMore');
  });

});

describe('GET /api/v1/admin/audit-logs with filters', () => {

  it('should filter audit logs by action', async () => {
    const adminToken = await createAdmin();

    // Create and suspend a candidate to generate a log
    const cand = candidateUser();
    const signupRes = await request(app).post('/api/v1/auth/signup').send(cand);
    const candId = signupRes.body.data.id;
    const suspendRes2 = await request(app)
      .patch(`/api/v1/admin/users/${candId}/suspend`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(suspendRes2.statusCode).toBe(200);

    // Filter by action
    const res = await request(app)
      .get('/api/v1/admin/audit-logs?action=suspend_user')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.every(l => l.action === 'suspend_user')).toBe(true);
  });

});

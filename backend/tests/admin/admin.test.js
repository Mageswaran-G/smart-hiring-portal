const request = require('supertest');
const app     = require('../../server');
const { connectTestDB, disconnectTestDB, clearCollections } = require('../setup');
const User = require('../../models/User');

beforeAll(async () => await connectTestDB());
afterAll(async () => await disconnectTestDB());
afterEach(async () => await clearCollections());

let _c = 0;
const uid = () => `${Date.now()}_${++_c}`;
const companyUser   = () => ({ name: 'Test Company',   email: `company_${uid()}@test.com`,   password: 'Test@1234', role: 'company'   });
const candidateUser = () => ({ name: 'Test Candidate', email: `candidate_${uid()}@test.com`, password: 'Test@1234', role: 'candidate' });

const getToken = async (userData) => {
  await request(app).post('/api/v1/auth/signup').send(userData);
  const res = await request(app).post('/api/v1/auth/login').send({ email: userData.email, password: userData.password });
  return res.body.data.accessToken;
};

// Create admin directly in DB (no signup route for admin)
const createAdmin = async () => {
  const admin = await User.create({ name: 'Admin User', email: `admin_${uid()}@test.com`, password: 'Admin@1234', role: 'admin' });
  const res = await request(app).post('/api/v1/auth/login').send({ email: admin.email, password: 'Admin@1234' });
  return { adminToken: res.body.data.accessToken, adminId: admin._id };
};

describe('Admin — User Management', () => {
  it('should return users list for admin', async () => {
    const { adminToken } = await createAdmin();
    const res = await request(app).get('/api/v1/admin/users').set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('should reject users list for non-admin', async () => {
    const token = await getToken(candidateUser());
    const res = await request(app).get('/api/v1/admin/users').set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(403);
  });

  it('should reject without token', async () => {
    const res = await request(app).get('/api/v1/admin/users');
    expect(res.statusCode).toBe(401);
  });
});

describe('Admin — Platform Stats', () => {
  it('should return platform stats for admin', async () => {
    const { adminToken } = await createAdmin();
    const res = await request(app)
      .get('/api/v1/admin/stats')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeDefined();
  });

  it('should reject stats for non-admin', async () => {
    const token = await getToken(candidateUser());
    const res = await request(app)
      .get('/api/v1/admin/stats')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(403);
  });
});

describe('Admin — Company List', () => {
  it('should return companies list for admin', async () => {
    const { adminToken } = await createAdmin();
    const res = await request(app)
      .get('/api/v1/admin/companies')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('should reject companies list for candidate', async () => {
    const token = await getToken(candidateUser());
    const res = await request(app)
      .get('/api/v1/admin/companies')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(403);
  });
});

describe('Admin — Company Verification', () => {
  it('should allow admin to verify a company', async () => {
    const { adminToken } = await createAdmin();
    const cData = companyUser();
    await request(app).post('/api/v1/auth/signup').send(cData);
    const company = await User.findOne({ email: cData.email });

    const res = await request(app)
      .patch(`/api/v1/admin/companies/${company._id}/verify`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ isVerified: true });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('should reject company verification by non-admin', async () => {
    const token = await getToken(candidateUser());
    const cData = companyUser();
    await request(app).post('/api/v1/auth/signup').send(cData);
    const company = await User.findOne({ email: cData.email });

    const res = await request(app)
      .patch(`/api/v1/admin/companies/${company._id}/verify`)
      .set('Authorization', `Bearer ${token}`)
      .send({ isVerified: true });
    expect(res.statusCode).toBe(403);
  });
});

describe('Admin — User Suspension', () => {
  it('should allow admin to suspend a user', async () => {
    const { adminToken } = await createAdmin();
    const cData = candidateUser();
    await request(app).post('/api/v1/auth/signup').send(cData);
    const user = await User.findOne({ email: cData.email });

    const res = await request(app)
      .patch(`/api/v1/admin/users/${user._id}/suspend`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('should allow admin to unsuspend a user by toggling suspend again', async () => {
    const { adminToken } = await createAdmin();
    const cData = candidateUser();
    await request(app).post('/api/v1/auth/signup').send(cData);
    const user = await User.findOne({ email: cData.email });

    // Suspend first
    await request(app).patch(`/api/v1/admin/users/${user._id}/suspend`).set('Authorization', `Bearer ${adminToken}`);

    // Toggle back — unsuspend
    const res = await request(app)
      .patch(`/api/v1/admin/users/${user._id}/suspend`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });
});

describe('Admin — Soft Delete User', () => {
  it('should allow admin to soft delete a user', async () => {
    const { adminToken } = await createAdmin();
    const cData = candidateUser();
    await request(app).post('/api/v1/auth/signup').send(cData);
    const user = await User.findOne({ email: cData.email });

    const res = await request(app)
      .delete(`/api/v1/admin/users/${user._id}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('should allow admin to restore a soft deleted user', async () => {
    const { adminToken } = await createAdmin();
    const cData = candidateUser();
    await request(app).post('/api/v1/auth/signup').send(cData);
    const user = await User.findOne({ email: cData.email });

    // Soft delete first
    await request(app).delete(`/api/v1/admin/users/${user._id}`).set('Authorization', `Bearer ${adminToken}`);

    // Restore
    const res = await request(app)
      .patch(`/api/v1/admin/users/${user._id}/restore`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });
});

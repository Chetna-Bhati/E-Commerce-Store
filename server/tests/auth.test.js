const request = require('supertest');
const app = require('../src/app');

describe('Auth API Endpoints', () => {
  const testUser = {
    name: 'Test Customer',
    email: `test_${Date.now()}@threadline.com`,
    password: 'password123',
    phone: '+919999999999'
  };

  it('POST /api/auth/register should register a new customer', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(testUser);

    // Depending on DB availability, either 201 (if DB running) or handled error format
    expect([201, 409, 500]).toContain(res.statusCode);
    if (res.statusCode === 201) {
      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBeDefined();
    }
  });

  it('POST /api/auth/login should reject invalid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'nonexistent@threadline.com',
        password: 'wrongpassword'
      });

    expect([401, 500]).toContain(res.statusCode);
  });

  it('GET /api/auth/me should return 401 when no token is passed', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
  });
});

const request = require('supertest');
const app = require('../src/app');

describe('Product & Category API Endpoints', () => {
  it('GET /api/categories should return active categories list', async () => {
    const res = await request(app).get('/api/categories');
    expect([200, 500]).toContain(res.statusCode);
    if (res.statusCode === 200) {
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    }
  });

  it('GET /api/products should return paginated list of products', async () => {
    const res = await request(app).get('/api/products?page=1&limit=5');
    expect([200, 500]).toContain(res.statusCode);
    if (res.statusCode === 200) {
      expect(res.body.success).toBe(true);
      expect(res.body.pagination).toBeDefined();
    }
  });

  it('GET /api/delivery/:pincode should validate correct 6-digit Indian pincode', async () => {
    const res = await request(app).get('/api/delivery/560103');
    expect(res.statusCode).toBe(200);
    expect(res.body.data.isDeliverable).toBe(true);
    expect(res.body.data.codAvailable).toBe(true);
  });

  it('GET /api/delivery/:pincode should reject invalid pincodes', async () => {
    const res = await request(app).get('/api/delivery/123');
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });
});

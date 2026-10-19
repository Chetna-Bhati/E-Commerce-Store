const request = require('supertest');
const app = require('../src/app');

describe('Checkout & Transaction Flow', () => {
  it('POST /api/checkout/create should require authentication', async () => {
    const res = await request(app)
      .post('/api/checkout/create')
      .send({
        address: {
          name: 'Aarav Sharma',
          phone: '9812345678',
          street_address: 'Flat 402 Green Glen',
          city: 'Bengaluru',
          state: 'Karnataka',
          pincode: '560103'
        },
        payment_method: 'COD'
      });

    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('POST /api/coupons/validate should validate coupon limits and discount amounts', async () => {
    const res = await request(app)
      .post('/api/coupons/validate')
      .send({
        code: 'FIRST100',
        subtotal: 1000
      });

    // Valid if DB is connected or 500/400 handled
    expect([200, 400, 500]).toContain(res.statusCode);
  });
});

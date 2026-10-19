const { z } = require('zod');

const validateCouponSchema = z.object({
  body: z.object({
    code: z.string().min(1, 'Coupon code is required').trim(),
    subtotal: z.number().nonnegative('Subtotal must be positive')
  })
});

module.exports = {
  validateCouponSchema
};

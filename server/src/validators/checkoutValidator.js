const { z } = require('zod');

const addressSchema = z.object({
  name: z.string().min(2, 'Full name is required').max(100),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian phone number'),
  street_address: z.string().min(5, 'Street address is required'),
  landmark: z.string().optional().nullable(),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  pincode: z.string().regex(/^\d{6}$/, 'Please enter a valid 6-digit PIN code')
});

const createCheckoutSchema = z.object({
  body: z.object({
    address: addressSchema,
    payment_method: z.enum(['ONLINE', 'COD']),
    coupon_code: z.string().optional().nullable()
  })
});

const verifyCheckoutSchema = z.object({
  body: z.object({
    order_id: z.string().optional(),
    razorpay_order_id: z.string().optional(),
    razorpay_payment_id: z.string().optional(),
    razorpay_signature: z.string().optional(),
    payment_method: z.enum(['ONLINE', 'COD']),
    address: addressSchema,
    coupon_code: z.string().optional().nullable()
  })
});

module.exports = {
  createCheckoutSchema,
  verifyCheckoutSchema
};

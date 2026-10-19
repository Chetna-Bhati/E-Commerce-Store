const { z } = require('zod');

const addToCartSchema = z.object({
  body: z.object({
    product_id: z.number().int().positive('Product ID is required'),
    size: z.string().min(1, 'Size selection is required'),
    color: z.string().min(1, 'Color selection is required'),
    quantity: z.number().int().min(1, 'Quantity must be at least 1').max(10, 'Maximum 10 units per item').default(1)
  })
});

const updateCartItemSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, 'Cart item ID must be numeric')
  }),
  body: z.object({
    quantity: z.number().int().min(1, 'Quantity must be at least 1').max(10, 'Maximum 10 units per item')
  })
});

module.exports = {
  addToCartSchema,
  updateCartItemSchema
};

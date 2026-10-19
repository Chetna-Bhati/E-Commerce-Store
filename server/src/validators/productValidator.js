const { z } = require('zod');

const listProductsSchema = z.object({
  query: z.object({
    q: z.string().optional(),
    category: z.string().optional(),
    minPrice: z.string().regex(/^\d+$/, 'minPrice must be a number').optional(),
    maxPrice: z.string().regex(/^\d+$/, 'maxPrice must be a number').optional(),
    sort: z.enum(['popular', 'price_asc', 'price_desc', 'rating', 'newest']).optional().default('popular'),
    page: z.string().regex(/^\d+$/).optional().default('1'),
    limit: z.string().regex(/^\d+$/).optional().default('12')
  })
});

const createProductSchema = z.object({
  body: z.object({
    category_id: z.coerce.number().int().positive('Category is required'),
    name: z.string().min(2).max(200),
    description: z.string().min(10),
    fabric: z.string().min(3).max(150),
    price: z.coerce.number().positive('Price must be greater than 0'),
    mrp: z.coerce.number().positive('MRP must be greater than 0'),
    stock: z.coerce.number().int().min(0),
    sizes: z.preprocess((val) => {
      if (typeof val === 'string') {
        try { return JSON.parse(val); } catch (e) { return val; }
      }
      return val;
    }, z.array(z.object({
      size: z.string(),
      stock: z.number().int().min(0)
    }))),
    colors: z.preprocess((val) => {
      if (typeof val === 'string') {
        try { return JSON.parse(val); } catch (e) { return val; }
      }
      return val;
    }, z.array(z.object({
      name: z.string(),
      hex: z.string()
    }))),
    is_active: z.coerce.boolean().optional().default(true)
  })
});

module.exports = {
  listProductsSchema,
  createProductSchema
};

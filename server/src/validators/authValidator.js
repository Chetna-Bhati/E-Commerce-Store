const { z } = require('zod');

const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(100),
    email: z.string().email('Please enter a valid email address').max(150),
    password: z.string().min(6, 'Password must be at least 6 characters').max(100),
    phone: z.string().optional()
  })
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(1, 'Password is required')
  })
});

module.exports = {
  registerSchema,
  loginSchema
};

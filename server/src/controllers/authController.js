const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { query } = require('../config/db');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess, sendError } = require('../utils/apiResponse');

function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET || 'dev_jwt_secret_key_threadline_auth_2026_super_secure',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

// @desc    Register a new customer account
// @route   POST /api/auth/register
// @access  Public
const register = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;

  // Check if email already exists
  const existingUsers = await query('SELECT id FROM users WHERE email = ?', [email.toLowerCase().trim()]);
  if (existingUsers.length > 0) {
    return sendError(res, 'An account with this email address already exists.', 409);
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  // Insert user
  const result = await query(
    'INSERT INTO users (name, email, password_hash, role, phone) VALUES (?, ?, ?, ?, ?)',
    [name.trim(), email.toLowerCase().trim(), passwordHash, 'USER', phone || null]
  );

  const userId = result.insertId;
  const user = {
    id: userId,
    name: name.trim(),
    email: email.toLowerCase().trim(),
    role: 'USER',
    phone: phone || null
  };

  const token = generateToken(user);

  return sendSuccess(
    res,
    { user, token },
    'Account registered successfully.',
    201
  );
});

// @desc    Authenticate user & get JWT token
// @route   POST /api/auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const users = await query(
    'SELECT id, name, email, password_hash, role, phone, created_at FROM users WHERE email = ?',
    [email.toLowerCase().trim()]
  );

  if (users.length === 0) {
    return sendError(res, 'Invalid email or password.', 401);
  }

  const userRecord = users[0];
  const isMatch = await bcrypt.compare(password, userRecord.password_hash);
  if (!isMatch) {
    return sendError(res, 'Invalid email or password.', 401);
  }

  const user = {
    id: userRecord.id,
    name: userRecord.name,
    email: userRecord.email,
    role: userRecord.role,
    phone: userRecord.phone,
    createdAt: userRecord.created_at
  };

  const token = generateToken(user);

  return sendSuccess(res, { user, token }, 'Logged in successfully.');
});

// @desc    Get current authenticated user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  return sendSuccess(res, { user: req.user }, 'Profile fetched successfully.');
});

module.exports = {
  register,
  login,
  getMe
};

const jwt = require('jsonwebtoken');
const { query } = require('../config/db');
const { sendError } = require('../utils/apiResponse');

// Authenticate JWT bearer token
async function auth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendError(res, 'Authentication required. No token provided.', 401);
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev_jwt_secret_key_threadline_auth_2026_super_secure');

    // Fetch active user from database
    const users = await query(
      'SELECT id, name, email, role, phone, created_at FROM users WHERE id = ?',
      [decoded.id]
    );

    if (!users || users.length === 0) {
      return sendError(res, 'User account no longer exists.', 401);
    }

    req.user = users[0];
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return sendError(res, 'Invalid or expired session token. Please log in again.', 401);
    }
    next(error);
  }
}

// Optional Auth (populates req.user if token is present, but allows guest traffic)
async function optionalAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev_jwt_secret_key_threadline_auth_2026_super_secure');
      const users = await query('SELECT id, name, email, role FROM users WHERE id = ?', [decoded.id]);
      if (users.length > 0) {
        req.user = users[0];
      }
    }
    next();
  } catch (err) {
    // If token invalid, proceed as guest
    next();
  }
}

module.exports = {
  auth,
  optionalAuth
};

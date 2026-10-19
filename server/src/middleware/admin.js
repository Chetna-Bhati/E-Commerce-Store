const { sendError } = require('../utils/apiResponse');

// Restrict route access to ADMIN role
function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'ADMIN') {
    return sendError(res, 'Access denied. Administrator role required.', 403);
  }
  next();
}

module.exports = requireAdmin;

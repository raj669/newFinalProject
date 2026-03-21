'use strict';

const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/auth');

/**
 * Middleware to verify JWT token from Authorization header
 * Expected format: Authorization: Bearer <token>
 */
function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: 'No authorization token provided',
    });
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({
      success: false,
      message: 'Invalid authorization header format. Use: Bearer <token>',
    });
  }

  const token = parts[1];

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token has expired',
      });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token',
      });
    }
    return res.status(401).json({
      success: false,
      message: 'Token verification failed',
    });
  }
}

/**
 * Middleware to verify user is an admin
 * Must be used after verifyToken middleware
 */
function verifyAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'User not authenticated',
    });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Admin privileges required',
    });
  }

  next();
}

module.exports = {
  verifyToken,
  verifyAdmin,
};

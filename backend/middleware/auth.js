const jwt = require('jsonwebtoken');
const User = require('../models/UserAdapter');

// Middleware to verify JWT token and authenticate user
const auth = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.startsWith('Bearer ') 
      ? authHeader.slice(7) 
      : null;

    // Check if token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user and check if still active
    const user = await User.findById(decoded.userId);
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Invalid token or user not found.'
      });
    }

    // Add user info to request object
    req.userId = decoded.userId;
    req.user = user;
    
    next();

  } catch (error) {
    console.error('Auth middleware error:', error.message);
    
    // Handle specific JWT errors
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Invalid token.'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Token expired.'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Authentication error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Middleware to check if user has admin role
const requireAdmin = async (req, res, next) => {
  try {
    // This middleware should be used after auth middleware
    if (!req.user) {
      return res.status(500).json({
        success: false,
        message: 'Authentication required before authorization check'
      });
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    next();

  } catch (error) {
    console.error('Admin middleware error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Authorization error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Optional auth middleware - doesn't fail if no token provided
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.startsWith('Bearer ') 
      ? authHeader.slice(7) 
      : null;

    // If no token, continue without setting user
    if (!token) {
      req.userId = null;
      req.user = null;
      return next();
    }

    // Try to verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (user && user.isActive) {
      req.userId = decoded.userId;
      req.user = user;
    } else {
      req.userId = null;
      req.user = null;
    }

    next();

  } catch (error) {
    // If token is invalid, continue without setting user
    req.userId = null;
    req.user = null;
    next();
  }
};

module.exports = {
  auth,
  requireAdmin,
  optionalAuth
};
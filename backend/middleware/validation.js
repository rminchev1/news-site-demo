const { body, validationResult } = require('express-validator');

// Helper function to handle validation results
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// Common validation rules
const validateRegister = [
  body('firstName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('First name can only contain letters and spaces'),
  
  body('lastName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Last name can only contain letters and spaces'),
    
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
    
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
    
  handleValidationErrors
];

const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
    
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
    
  handleValidationErrors
];

const validateUpdateProfile = [
  body('firstName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('First name can only contain letters and spaces'),
    
  body('lastName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Last name can only contain letters and spaces'),
    
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
    
  handleValidationErrors
];

const validatePreferences = [
  body('newsletter')
    .optional()
    .isBoolean()
    .withMessage('Newsletter preference must be a boolean'),
    
  body('notifications')
    .optional()
    .isBoolean()
    .withMessage('Notifications preference must be a boolean'),
    
  handleValidationErrors
];

// Sanitization middleware
const sanitizeInput = (req, res, next) => {
  // Remove any HTML tags and trim whitespace from string fields
  const sanitizeString = (str) => {
    if (typeof str === 'string') {
      return str.replace(/<[^>]*>?/gm, '').trim();
    }
    return str;
  };

  // Recursively sanitize object
  const sanitizeObject = (obj) => {
    if (obj && typeof obj === 'object') {
      for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
          if (typeof obj[key] === 'string') {
            obj[key] = sanitizeString(obj[key]);
          } else if (typeof obj[key] === 'object') {
            sanitizeObject(obj[key]);
          }
        }
      }
    }
  };

  sanitizeObject(req.body);
  next();
};

// Rate limiting helper (basic implementation)
const createRateLimit = (windowMs = 15 * 60 * 1000, max = 5) => {
  const attempts = new Map();
  
  return (req, res, next) => {
    const clientIP = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    
    // Clean up old entries
    for (let [ip, data] of attempts.entries()) {
      if (now - data.firstAttempt > windowMs) {
        attempts.delete(ip);
      }
    }
    
    // Check current client
    if (!attempts.has(clientIP)) {
      attempts.set(clientIP, { firstAttempt: now, count: 1 });
      return next();
    }
    
    const clientData = attempts.get(clientIP);
    
    if (now - clientData.firstAttempt > windowMs) {
      // Reset window
      attempts.set(clientIP, { firstAttempt: now, count: 1 });
      return next();
    }
    
    if (clientData.count >= max) {
      return res.status(429).json({
        success: false,
        message: 'Too many attempts. Please try again later.',
        retryAfter: Math.ceil((clientData.firstAttempt + windowMs - now) / 1000)
      });
    }
    
    clientData.count++;
    next();
  };
};

module.exports = {
  validateRegister,
  validateLogin,
  validateUpdateProfile,
  validatePreferences,
  sanitizeInput,
  createRateLimit,
  handleValidationErrors
};
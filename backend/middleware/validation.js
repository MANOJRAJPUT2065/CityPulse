import { body, param, query } from 'express-validator';

// Validation for creating a new post
export const validateCreatePost = [
  body('content')
    .isLength({ min: 10, max: 1000 })
    .withMessage('Content must be between 10 and 1000 characters')
    .trim(),
  body('location')
    .isLength({ min: 3, max: 100 })
    .withMessage('Location must be between 3 and 100 characters')
    .trim(),
  body('domain')
    .isIn(['water', 'garbage', 'road', 'street', 'animals', 'recycling', 'others'])
    .withMessage('Invalid domain'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high', 'critical'])
    .withMessage('Invalid priority level'),
  body('isUrgent')
    .optional()
    .isBoolean()
    .withMessage('isUrgent must be a boolean'),
  body('tags')
    .optional()
    .custom((value) => {
      // Handle both string and array formats
      if (typeof value === 'string') {
        try {
          const parsed = JSON.parse(value);
          if (!Array.isArray(parsed)) throw new Error('Tags must be an array');
          return true;
        } catch (e) {
          return true; // Allow single string tag
        }
      }
      if (!Array.isArray(value)) {
        throw new Error('Tags must be an array');
      }
      if (value.length > 10) {
        throw new Error('Maximum 10 tags allowed');
      }
      return true;
    })
];

// Validation for updating a post
export const validateUpdatePost = [
  body('content')
    .optional()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Content must be between 10 and 1000 characters')
    .trim(),
  body('location')
    .optional()
    .isLength({ min: 3, max: 100 })
    .withMessage('Location must be between 3 and 100 characters')
    .trim(),
  body('domain')
    .optional()
    .isIn(['water', 'garbage', 'road', 'street', 'animals', 'recycling', 'others'])
    .withMessage('Invalid domain'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high', 'critical'])
    .withMessage('Invalid priority level'),
  body('status')
    .optional()
    .isIn(['pending', 'in_progress', 'resolved', 'rejected'])
    .withMessage('Invalid status'),
  body('isUrgent')
    .optional()
    .isBoolean()
    .withMessage('isUrgent must be a boolean'),
  body('tags')
    .optional()
    .isArray({ max: 10 })
    .withMessage('Tags must be an array with maximum 10 items')
];

// Validation for adding comments
export const validateAddComment = [
  body('text')
    .isLength({ min: 1, max: 500 })
    .withMessage('Comment must be between 1 and 500 characters')
    .trim()
];

// Validation for MongoDB ObjectId parameters
export const validateObjectId = [
  param('id')
    .isMongoId()
    .withMessage('Invalid post ID')
];

// Validation for domain parameter
export const validateDomain = [
  param('domain')
    .isIn(['water', 'garbage', 'road', 'street', 'animals', 'recycling', 'others'])
    .withMessage('Invalid domain')
];

// Validation for query parameters
export const validateQuery = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 and 50'),
  query('sortBy')
    .optional()
    .isIn(['createdAt', 'likes', 'stars', 'priority', 'status'])
    .withMessage('Invalid sort field'),
  query('status')
    .optional()
    .isIn(['pending', 'in_progress', 'resolved', 'rejected'])
    .withMessage('Invalid status'),
  query('priority')
    .optional()
    .isIn(['low', 'medium', 'high', 'critical'])
    .withMessage('Invalid priority'),
  query('domain')
    .optional()
    .isIn(['water', 'garbage', 'road', 'street', 'animals', 'recycling', 'others'])
    .withMessage('Invalid domain')
];

// Validation for user registration
export const validateUserRegistration = [
  body('name')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters')
    .trim(),
  body('email')
    .isEmail()
    .withMessage('Invalid email address')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  body('userType')
    .optional()
    .isIn(['user', 'admin'])
    .withMessage('Invalid user type')
];

// Validation for user login
export const validateUserLogin = [
  body('email')
    .isEmail()
    .withMessage('Invalid email address')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 1 })
    .withMessage('Password is required')
];

// Admin-specific validations
export const validateAdminAction = [
  body('status')
    .optional()
    .isIn(['pending', 'in_progress', 'resolved', 'rejected'])
    .withMessage('Invalid status'),
  body('assignedTo')
    .optional()
    .isMongoId()
    .withMessage('Invalid user ID for assignment'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high', 'critical'])
    .withMessage('Invalid priority level'),
  body('estimatedResolutionTime')
    .optional()
    .isLength({ min: 1, max: 50 })
    .withMessage('Invalid estimated resolution time')
];
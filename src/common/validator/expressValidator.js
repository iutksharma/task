// src/common/validator/expressValidator.js

import { body, validationResult } from 'express-validator';

// Function to define validation rules
export const validator = (action) => {
  switch (action) {
    case 'register':
      return [
        body('name').notEmpty().withMessage('Name is required.'),
        body('email').isEmail().withMessage('Invalid email format.'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.'),
      ];

    case 'verifyEmail':
      return [
        body('email').isEmail().withMessage('Invalid email format.'),
        body('token').notEmpty().withMessage('Token is required.'),
      ];

    case 'login':
      return [
        body('email').isEmail().withMessage('Invalid email format.'),
        body('password').notEmpty().withMessage('Password is required.'),
      ];

    default:
      throw new Error('Invalid action');
  }
};

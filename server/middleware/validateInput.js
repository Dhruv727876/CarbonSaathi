const { body, validationResult } = require('express-validator');
const xss = require('xss');

const ALLOWED_PERSONAS = ['innovator', 'skeptic', 'policy_maker', 'citizen', 'coach', 'auditor', 'investor', 'debunker'];

const validateChat = [
  body('message')
    .isString()
    .withMessage('Message must be a string')
    .trim()
    .notEmpty()
    .withMessage('Message cannot be empty')
    .isLength({ max: 1000 })
    .withMessage('Message cannot exceed 1000 characters')
    .customSanitizer(value => xss(value)),
  body('personaId')
    .isIn(ALLOWED_PERSONAS)
    .withMessage('Invalid personaId'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Payload validation failed.' });
    }
    next();
  }
];

const validateMythbust = [
  body('myth')
    .isString()
    .withMessage('Myth must be a string')
    .trim()
    .notEmpty()
    .withMessage('Myth cannot be empty')
    .isLength({ max: 500 })
    .withMessage('Myth cannot exceed 500 characters')
    .customSanitizer(value => xss(value)),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Payload validation failed.' });
    }
    next();
  }
];

module.exports = {
  validateChat,
  validateMythbust,
  ALLOWED_PERSONAS
};

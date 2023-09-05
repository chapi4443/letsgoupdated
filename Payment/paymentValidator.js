// PaymentValidator.js
const { body, validationResult } = require('express-validator');

exports.validateCreateCheckoutSession = [
  body('priceId').notEmpty().withMessage('Price ID is required.'),
  body('successUrl').notEmpty().withMessage('Success URL is required.'),
  body('cancelUrl').notEmpty().withMessage('Cancel URL is required.'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

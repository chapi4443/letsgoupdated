const stripeSecretKey = process.env.STRIPE_KEY;
const stripe = require('stripe')(stripeSecretKey);

module.exports = stripe;
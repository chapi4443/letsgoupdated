const express = require("express");
const router = express.Router();

const paymentController = require("./paymentController");

// Define a route for creating payment intents
router.post("/create-payment-intent", paymentController.createPaymentIntent);

module.exports = router;

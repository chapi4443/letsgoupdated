// paymentController.js

// Import the Stripe library
const stripe = require("stripe")(process.env.STRIPE_KEY);

// Function to create a payment intent and handle payment
const createPaymentIntent = async (req, res) => {
  try {
    // Get the bookingData from the request body
    const bookingData = req.body; // This assumes that the request body contains the bookingData

    // Calculate the total amount for the flight booking
    const flightPrice = parseFloat(bookingData.flightOffers[0].price.total);

    // Convert the flight price to cents (Stripe requires amount in cents)
    const totalAmountCents = Math.round(flightPrice * 100);

    // Create a payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmountCents,
      currency: "usd",
      description: "Flight Booking Payment",
      metadata: {
        bookingId: bookingData._id, // Attach booking ID as metadata (optional)
      },
    });

    // Return the client secret of the payment intent
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while processing the payment." });
  }
};

module.exports = {
  createPaymentIntent, // Export the createPaymentIntent function
};

const mongoose = require("mongoose");

// Define the schema for the booked hotel data
const bookedHotelSchema = new mongoose.Schema({
  offerId: {
    type: String,
    required: true,
  },
  guests: {
    type: Number,
    required: true,
  },
  payments: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create the model using the schema
const BookedHotel = mongoose.model("BookedHotel", bookedHotelSchema);

module.exports = BookedHotel;

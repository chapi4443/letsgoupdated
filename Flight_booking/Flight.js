const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  flightOffers: Array,
  travelers: Array,
  dateOfBirth: String,
  email: String,
  phoneNumber: String,
  firstName: String,
  lastName: String,
  gender: String,
  documentType: String,
  birthPlace: String,
  issuanceLocation: String,
  issuanceDate: String,
  documentNumber: String,
  expiryDate: String,
  issuanceCountry: String,
  validityCountry: String,
  nationality: String,
  holder: Boolean,
});

const Booking = mongoose.model("flight-Booking", bookingSchema);

module.exports = Booking;

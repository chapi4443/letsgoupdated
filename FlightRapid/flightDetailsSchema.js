// flightDetailsSchema.js

const mongoose = require("mongoose");

const flightDetailsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User", // Reference to the User model
  },
  token: {
    type: String,
    required: true,
  },
   apiResponse: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },

});

const FlightDetails = mongoose.model("FlightDetails", flightDetailsSchema);

module.exports = FlightDetails;

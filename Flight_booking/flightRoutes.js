const express = require('express');
const router = express.Router();
const controllers = require('./flightController.js');
const {
  authenticateUser,
  authorizePermissions,
} = require("../middleware/authentication");



router.get(
  "/city-and-airport-search/:parameter",controllers.cityAndAirportSearch
);
router.get('/flight-search',authenticateUser, controllers.flightSearch);
router.post(
  "/flight-confirmation",
  authenticateUser,
  controllers.flightConfirmation
);
router.post('/flight-booking', controllers.flightBooking);
router.get(
  "/booking", 
  authenticateUser,
  authorizePermissions('admin'),
  controllers.getAllBookings
);

module.exports = router;

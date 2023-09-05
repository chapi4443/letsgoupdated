// routes/hotelRoutes.js
const express = require("express");
const router = express.Router();
const hotelController = require("./hotelamadeusController");

// Route for searching hotels

router.get("/search-location", hotelController.getHotelSuggestions);
router.get("/hotels", hotelController.getHotelsInCity);
router.get("/hotel-offers", hotelController.getHotelOffers);
router.get("/hotel-offer", hotelController.getHotelOfferDetails);
router.post("/book-hotel", hotelController.bookHotel);

module.exports = router;

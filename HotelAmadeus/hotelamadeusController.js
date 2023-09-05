// controllers/hotelController.js
const Amadeus = require("amadeus");
const { API_KEY, API_SECRET } = require("../config/config");
const BookedHotel = require("./Hotelamadeus");

const amadeus = new Amadeus({
  clientId: API_KEY,
  clientSecret: API_SECRET,
});

const getHotelSuggestions = async (req, res) => {
  try {
    const { keyword, pageLimit, pageOffset } = req.query;
    const response = await amadeus.referenceData.locations.get({
      keyword,
      "page[limit]": pageLimit,
      "page[offset]": pageOffset,
      subType: Amadeus.location.city,
    });

    res.json(JSON.parse(response.body));
  } catch (err) {
    res.json(err);
  }
};

const getHotelsInCity = async (req, res) => {
  const { cityCode } = req.query;
  const response = await amadeus.referenceData.locations.hotels.byCity.get({
    cityCode,
  });
  try {
    await res.json(JSON.parse(response.body));
  } catch (err) {
    await res.json(err);
  }
};

const getHotelOffers = async (req, res) => {
  try {
    const { hotelIds } = req.query;
    const response = await amadeus.shopping.hotelOffersByHotel.get({
      hotelIds,
    });

    res.json(JSON.parse(response.body));
  } catch (err) {
    res.json(err);
  }
};

const getHotelOfferDetails = async (req, res) => {
  try {
    const { offerId } = req.query;
    const response = await amadeus.shopping.hotelOffer(offerId).get();

    res.json(JSON.parse(response.body));
  } catch (err) {
    res.json(err);
  }
};


const bookHotel = async (req, res) => {
  try {
    const { data } = req.body;
    const { offerId, guests, payments } = data;

    // Save the booked hotel data to the database using the BookedHotel model
    const bookedHotel = new BookedHotel({
      offerId,
      guests,
      payments,
    });

    const savedBooking = await bookedHotel.save();

    res.json(savedBooking);
  } catch (err) {
    res.json(err);
  }
};
module.exports = {
  getHotelSuggestions,
  getHotelsInCity,
  getHotelOffers,
  getHotelOfferDetails,
  bookHotel,
};
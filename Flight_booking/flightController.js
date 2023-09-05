
const Amadeus = require('amadeus');
const { checkPermissions } = require("../utils/checkPermissions");
const mongoose = require("mongoose");
const Booking = require("./Flight");

const amadeus = new Amadeus({
  clientId: process.env.YOUR_API_KEY,
  clientSecret: process.env.YOUR_API_SECRET,
});

// City and Airport Search Controller
exports.cityAndAirportSearch = (req, res) => {
  const parameter = req.params.parameter;
  amadeus.referenceData.locations
    .get({
      keyword: parameter,
      subType: Amadeus.location.any,
    })
    .then(function (response) {
      res.send(response.result);
    })
    .catch(function (response) {
      res.send(response);
    });
};

// Flight Search Controller
exports.flightSearch = (req, res) => {
  const originCode = req.query.originCode;
  const destinationCode = req.query.destinationCode;
  const dateOfDeparture = req.query.dateOfDeparture;

  // Find the cheapest flights
  amadeus.shopping.flightOffersSearch
    .get({
      originLocationCode: originCode,
      destinationLocationCode: destinationCode,
      departureDate: dateOfDeparture,
      adults: '1',
      max: '7',
    })
    .then(function (response) {
      res.send(response.result);
    })
    .catch(function (error) {
      res.send(error);
    });
};

// Flight Confirmation Controller
exports.flightConfirmation = (req, res) => {
  const flight = req.body.flight;
  // checkPermissions(req.user, order.user);

  // Confirm availability and price
  amadeus.shopping.flightOffers.pricing.post(
        JSON.stringify({
            'data': {
                'type': 'flight-offers-pricing',
                'flightOffers': [flight],
            }
        })
    ).then(function (response) {
            res.send(response.result);
        }).catch(function (response) {
            res.send(response)
        })
    
};

// Flight Booking Controller
exports.flightBooking = async (req, res) => {
  const flight = req.body.flight;
  const name = req.body.name;

  try {
    // Confirm availability and price
    const pricingResponse = await amadeus.shopping.flightOffers.pricing.post(
      JSON.stringify({
        'data': {
          'type': 'flight-offers-pricing',
          'flightOffers': [flight],
        },
      })
    );

    // Save booking data to MongoDB
    const bookingData = {
      flightOffers: pricingResponse.result.data.flightOffers,
      travelers: [{
        id: '1',
        dateOfBirth: '1982-01-16',
        name: {
          firstName: name.first,
          lastName: name.last,
        },
        gender: 'MALE',
        contact: {
          emailAddress: 'jorge.gonzales833@telefonica.es',
          phones: [{
            deviceType: 'MOBILE',
            countryCallingCode: '34',
            number: '480080076',
          }],
        },
        documents: [{
          documentType: 'PASSPORT',
          birthPlace: 'Madrid',
          issuanceLocation: 'Madrid',
          issuanceDate: '2015-04-14',
          number: '00000000',
          expiryDate: '2025-04-14',
          issuanceCountry: 'ES',
          validityCountry: 'ES',
          nationality: 'ES',
          holder: true,
        }],
      }],
    };

    // Create a new Booking document using the Booking schema and save it to the database
    const newBooking = new Booking(bookingData);
    const savedBooking = await newBooking.save();

    // Send the booking response to the client
    res.send(savedBooking);
  } catch (error) {
    // Handle the error and send an appropriate response
    res.status(500).json({ error: 'An error occurred while processing the flight booking.' });
  }
};

exports.getAllBookings = async (req, res) => {
  try {
    const allBookings = await Booking.find({}); // Retrieve all bookings from the database

    res.send(allBookings); // Send the booking data as a response to the admin
  } catch (error) {
    // Handle the error and send an appropriate response
    res
      .status(500)
      .json({ error: "An error occurred while fetching the booking data." });
  }
};


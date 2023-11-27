const express = require("express");
const router = express.Router();
const flightController = require("./flightRapidController");

// Define a route to search for destinations
router.get("/search-destination", async (req, res) => {
  const { query } = req.query;
  if (!query) {
    return res.status(400).json({ error: "Query parameter is required" });
  }

  try {
    const destinations = await flightController.searchDestination(query);
    res.json(destinations);
  } catch (error) {
    res.status(500).json({ error: "Failed to search for destinations" });
  }
});


router.get("/search-flights", flightController.searchFlights);
router.get("/search-flights-multi-stops", async (req, res) => {
  await flightController.searchFlightsMultiStops(req, res);
});


router.get("/get-flight-details", async (req, res) => {
  try {
    const { token, currencyCode } = req.query;

    // Validate required parameters
    if (!token) {
      return res
        .status(400)
        .json({ error: "Token required" });
    }

    const flightDetails = await flightController.getFlightDetails(
      token,
      currencyCode
    );
    res.json(flightDetails);
  } catch (error) {
    res.status(500).json({ error: "Failed to get flight details" });
  }
});
router.get("/getminpricemultistops", async (req, res) => {
  try {
    await flightController.getMinPriceMultiStops(req, res);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Failed to get minimum flight price for multiple stops" });
  }
});

router.get("/getminprice", async (req, res) => {
  try {
    await flightController.getMinPrice(req, res);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to get minimum flight price" });
  }
});


router.get("/getseatmap", async (req, res) => {
  try {
    await flightController.getSeatMap(req, res);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to get seat map" });
  }
});



module.exports = router;

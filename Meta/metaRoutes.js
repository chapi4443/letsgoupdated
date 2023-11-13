const express = require("express");
const router = express.Router();
const metaController = require("./metaController");

// Define a route to get languages
router.get("/languages", async (req, res) => {
  try {
    const languages = await metaController.getLanguages();
    res.json(languages);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve languages" });
  }
});

router.get("/currency", async (req, res) => {
  try {
    const currency = await metaController.getCurrency();
    res.json(currency);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve currency information" });
  }
});


router.get("/exchange-rates", async (req, res) => {
  try {
    const exchangeRates = await metaController.getExchangeRates();
    res.json(exchangeRates);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve exchange rates" });
  }
});

// Define a route to get location-to-latlong
router.get('/location-to-latlong', async (req, res) => {
  const { query } = req.query;
  if (!query) {
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  try {
    const locationData = await metaController.locationToLatLong(query);
    res.json(locationData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve location-to-latlong information' });
  }
});


module.exports = router;

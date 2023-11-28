const axios = require("axios");
const FlightDetails = require("./flightDetailsSchema");
const rapidAPIOptions = {
  headers: {
    "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
    "X-RapidAPI-Host": "booking-com15.p.rapidapi.com",
  },
};

async function searchDestination(query) {
  const options = {
    method: "GET",
    url: "https://booking-com15.p.rapidapi.com/api/v1/flights/searchDestination",
    params: { query },
    ...rapidAPIOptions,
  };

  try {
    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    throw error;
  }
}

async function searchFlights(req, res) {
  try {
    const {
      fromId,
      toId,
      departDate,
      pageNo,
      adults,
      children,
      currencyCode,
      returnDate,
      sort,
      cabinClass,
    } = req.query;

    // Validate required parameters
    if (!fromId || !toId || !departDate) {
      return res.status(400).json({ error: "All parameters are required" });
    }

    // Build params object
    const params = {
      fromId,
      toId,
      departDate,
      returnDate, // Optional parameter
      sort, // Optional parameter
      cabinClass, // Optional parameter
      pageNo,
      adults,
      children,
      currency_code: currencyCode,
    };

    const options = {
      method: "GET",
      url: "https://booking-com15.p.rapidapi.com/api/v1/flights/searchFlights",
      params,
      ...rapidAPIOptions,
    };

    const response = await axios.request(options);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Failed to search for flights" });
  }
}

async function searchFlightsMultiStops(req, res) {
  try {
    const { legs, pageNo, adults, children, currencyCode } = req.query;

    // Validate required parameters
    if (!legs) {
      return res.status(400).json({ error: "All parameters are required" });
    }

    const params = {
      legs,
      pageNo,
      adults,
      children,
      currency_code: currencyCode,
    };

    const options = {
      method: "GET",
      url: "https://booking-com15.p.rapidapi.com/api/v1/flights/searchFlightsMultiStops",
      params,
      ...rapidAPIOptions,
    };

    const response = await axios.request(options);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Failed to search for multi-stop flights" });
  }
}

async function getFlightDetails(req, res) {
  try {
    const { token } = req.query;
    console.log(req.query);

    // Validate required parameters
    if (!token) {
      throw new Error("Token is required");
    }

    // Assuming you have user information in req.user after authentication
    const userId = req.user.userId;

    console.log(userId);

    // Check if flight details for the given token already exist in the database
    let flightDetails = await FlightDetails.findOne({ token });

    if (!flightDetails) {
      // If not, fetch flight details from the API
      const params = {    
        token,
        // currency_code: currencyCode,
      };

      const options = {
        method: "GET",
        url: "https://booking-com15.p.rapidapi.com/api/v1/flights/getFlightDetails",
        params,
        ...rapidAPIOptions,
      };

      const response = await axios.request(options);

      if (response.data) {
        // Save flight details to the database
        flightDetails = new FlightDetails({
          userId,
          token,
          ...response.data, // Include all data from the API response
        });

        await flightDetails.save();
      } else {
        throw new Error("Invalid API response format");
      }
    }

    // You can access the flight details and user information here
    console.log("Flight details:", flightDetails);
    console.log("User ID:", userId);

    // Continue with your existing code to return the flight details to the client
    res.json({ flightDetails });
  } catch (error) {
    console.error(error); // Log the entire error object for debugging
    res.status(500).json({ error: "Failed to get flight details" });
  }
}
async function getMinPrice(req, res) {
  try {
    const { fromId, toId, departDate, currencyCode, returnDate } = req.query;

    // Validate required parameters
    if (!fromId || !toId || !departDate) {
      return res.status(400).json({ error: "All parameters are required" });
    }

    // Build params object
    const params = {
      fromId,
      toId,
      departDate,
      returnDate,
      currency_code: currencyCode,
    };

    const options = {
      method: "GET",
      url: "https://booking-com15.p.rapidapi.com/api/v1/flights/getMinPrice",
      params,
      ...rapidAPIOptions,
    };

    const response = await axios.request(options);
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to get minimum flight price" });
  }
}
async function getMinPriceMultiStops(req, res) {
  try {
    const { legs, cabinClass, currencyCode } = req.query;

    // Validate required parameters
    if (!legs) {
      return res
        .status(400)
        .json({ error: "legs and cabinClass parameters are required" });
    }

    const params = {
      legs,
      cabinClass,
      currency_code: currencyCode,
    };

    const options = {
      method: "GET",
      url: "https://booking-com15.p.rapidapi.com/api/v1/flights/getMinPriceMultiStops",
      params,
      ...rapidAPIOptions,
    };

    const response = await axios.request(options);
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Failed to get minimum flight price for multiple stops" });
  }
}
async function getSeatMap(req, res) {
  try {
    const { offerToken, currencyCode } = req.query;

    // Validate required parameters
    if (!offerToken) {
      return res.status(400).json({ error: "Offer token is required" });
    }

    const params = {
      offerToken,
      currency_code: currencyCode,
    };

    const options = {
      method: "GET",
      url: "https://booking-com15.p.rapidapi.com/api/v1/flights/getSeatMap",
      params,
      ...rapidAPIOptions,
    };

    const response = await axios.request(options);
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to get seat map" });
  }
}

module.exports = {
  searchDestination,
  searchFlights,
  searchFlightsMultiStops,
  getFlightDetails,
  getSeatMap,
  getMinPrice,
  getMinPriceMultiStops,
};

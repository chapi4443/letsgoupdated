const axios = require("axios");

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
    params: { query},
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
    if (
      !fromId ||
      !toId ||
      !departDate
    ) {
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


async function getFlightDetails(token, currencyCode) {
  try {
    // Validate required parameters
    if (!token) {
      throw new Error("Token are required");
    }

    const params = {
      token,
      currency_code: currencyCode,
    };

    const options = {
      method: "GET",
      url: "https://booking-com15.p.rapidapi.com/api/v1/flights/getFlightDetails",
      params,
      ...rapidAPIOptions,
    };

    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  searchDestination,
  searchFlights,
  searchFlightsMultiStops,
  getFlightDetails
};

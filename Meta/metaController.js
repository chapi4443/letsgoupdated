const axios = require("axios");

const rapidAPIOptions = {
  headers: {
    "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
    "X-RapidAPI-Host": "booking-com15.p.rapidapi.com",
  },
};

async function getLanguages() {
  const options = {
    method: "GET",
    url: "https://booking-com15.p.rapidapi.com/api/v1/meta/getLanguages",
    ...rapidAPIOptions,
  };

  try {
    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    throw error;
  }
}

async function getCurrency() {
  const options = {
    method: "GET",
    url: "https://booking-com15.p.rapidapi.com/api/v1/meta/getCurrency",
    ...rapidAPIOptions,
  };

  try {
    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    throw error;
  }
}


async function getExchangeRates() {
  const options = {
    method: "GET",
    url: "https://booking-com15.p.rapidapi.com/api/v1/meta/getExchangeRates",
    params: {
      base_currency: "USD",
    },
    ...rapidAPIOptions,
  };

  try {
    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    throw error;
  }
}

async function locationToLatLong(query) {
  const options = {
    method: "GET",
    url: "https://booking-com15.p.rapidapi.com/api/v1/meta/locationToLatLong",
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


module.exports = {
  getLanguages,
  getCurrency,
  getExchangeRates,
  locationToLatLong
};

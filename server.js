const cors = require("cors");
const express = require("express");
const app = express();
const stripe = require('stripe')('sk_test_4eC39HqLyjWDarjtT1zdp7dc');
const rateLimiter = require('express-rate-limit')
const dotenv = require("dotenv");
dotenv.config();
// rest packages
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const fileupload = require("express-fileupload");
// db
const connectDB = require("./db/connect.js");
//router
const authRouter = require("./Auth/authRoutes.js");
const userRouter = require("./Auth/userRoutes.js");
const flightRouter = require("./Flight_booking/flightRoutes.js");
const hotelRouter = require("./Hotel_booking/hotelRoutes.js");
const reviewRouter = require("./Hotel_booking/reviewRoutes.js");
const orderRouter= require("./Hotel_booking/orderRoutes.js");
const hotelamadeusRouter = require("./HotelAmadeus/hotelamadeusRoutes.js");
const Payment = require("./Payment/paymentRoutes.js")
const flightRapid = require("./FlightRapid/flightRapidRoutes")
const Meta = require("./Meta/metaRoutes")
const HotelRapid = require("./Hotel_rapid/HotelrapidRoutes.js")

//middleware
const {logger,logEvents}=require('./middleware/logger.js')
const notFoundMiddleware = require("./middleware/not-found.js");
const errorHandlerMiddleware = require("./middleware/error-handler.js");
const corsOptions= require("./config/corsOptions")

const limiter = rateLimiter({
  max: 100,
  windowsMs: 60 * 60 * 1000,
  message: "too many requests. please try again after one hour",
});
app.use(limiter);
app.use(logger)
app.use(cors(corsOptions));
app.use(morgan("tiny"));

app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));
app.use(express.static("./public"));
app.use(fileupload());

app.get("/", (req, res) => {
  res.send("welcome");
});
app.get("/api/v1", (req, res) => {
  console.log(req.signedCookies);

  res.send("welcome");
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/flights", flightRouter);
app.use("/api/v1/hotels", hotelRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/amadeushotel", hotelamadeusRouter);
app.use("/api/v1/Payment", Payment);
app.use("/api/v1/meta", Meta);
app.use("/api/v1/flightrapid",flightRapid)



app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);


const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.Mongo_URL);
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();

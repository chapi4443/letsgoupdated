const Services = require("./Hotel");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const path = require("path");

const createServices = async (req, res) => {
  req.body.user = req.user.userId;
  const service = await Services.create(req.body); // Fix the variable name here
  res.status(StatusCodes.CREATED).send(service);
};

const getAllServices = async (req, res) => {
  const services = await Services.find({});

  res.status(StatusCodes.OK).json({ services, count: services.length });
};
const getSingleServices = async (req, res) => {
  const { id: serviceId } = req.params;
  const service = await Services.findOne({ _id: serviceId }).populate('reviews');

  if (!service) {
    throw new CustomError(StatusCodes.NOT_FOUND, "Service not found");
  }
  res.status(StatusCodes.OK).json({ service });
};
const updateServices = async (req, res) => {
  const { id: serviceId } = req.params;
  const service = await Services.findOneAndUpdate(
    { _id: serviceId },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );
  if (!service) {
    throw new CustomError(StatusCodes.NOT_FOUND, "Service not found");
  }
  res.status(StatusCodes.OK).json({ service });
};
const deleteServices = async (req, res) => {
  const { id: serviceId } = req.params;
  const service = await Services.findOneAndDelete({ _id: serviceId });
  if (!service) {
    throw new CustomError(StatusCodes.NOT_FOUND, "Service not found");
  }
  res.status(StatusCodes.OK).json({ msg: "Success! Product removed." });
};
const uploadImage = async (req, res) => {
  if (!req.files) {
    throw new CustomError.BadRequestError("No File Uploaded");
  }
  const serviceImage = req.files.image;

  if (!serviceImage.mimetype.startsWith("image")) {
    throw new CustomError.BadRequestError("Please Upload Image");
  }

  const maxSize = 1024 * 1024;

  if (serviceImage.size > maxSize) {
    throw new CustomError.BadRequestError(
      "Please upload image smaller than 1MB"
    );
  }

  const imagePath = path.join(
    __dirname,
    "../public/uploads/" + `${serviceImage.name}`
  );
  await serviceImage.mv(imagePath);
  res.status(StatusCodes.OK).json({ image: `/uploads/${serviceImage.name}` });
};

module.exports = {
  createServices,
  getAllServices,
  getSingleServices,
  updateServices,
  deleteServices,
  uploadImage,
};

// // const express = require('express');
// const Hotel = require('../Hotel_booking/Hotel');

// // Controller method to create a new service for a hotel
// exports.createService = async (req, res) => {
//   try {
//     const { hotelId, name, description } = req.body;

//     const hotel = await Hotel.findById(hotelId);
//     if (!hotel) {
//       return res.status(404).json({ error: 'Hotel not found' });
//     }

//     const newService = {
//       name,
//       description
//     };

//     hotel.services.push(newService);
//     await hotel.save();

//     res.status(201).json(hotel);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Server error' });
//   }
// };

// // Controller method to update a hotel service
// exports.updateService = async (req, res) => {
//   try {
//     const { hotelId, serviceId, name, description } = req.body;

//     const hotel = await Hotel.findById(hotelId);
//     if (!hotel) {
//       return res.status(404).json({ error: 'Hotel not found' });
//     }

//     const service = hotel.services.id(serviceId);
//     if (!service) {
//       return res.status(404).json({ error: 'Service not found' });
//     }

//     service.name = name;
//     service.description = description;
//     await hotel.save();

//     res.json(hotel);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Server error' });
//   }
// };

// // Controller method to delete a hotel service
// exports.deleteService = async (req, res) => {
//   try {
//     const { hotelId, serviceId } = req.body;

//     const hotel = await Hotel.findById(hotelId);
//     if (!hotel) {
//       return res.status(404).json({ error: 'Hotel not found' });
//     }

//     const service = hotel.services.id(serviceId);
//     if (!service) {
//       return res.status(404).json({ error: 'Service not found' });
//     }

//     service.remove();
//     await hotel.save();

//     res.json(hotel);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Server error' });
//   }
// };

// // Controller method to get all services of a hotel
// exports.getServices = async (req, res) => {
//   try {
//     const { hotelId } = req.params;

//     const hotel = await Hotel.findById(hotelId);
//     if (!hotel) {
//       return res.status(404).json({ error: 'Hotel not found' });
//     }

//     res.json(hotel.services);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Server error' });
//   }
// };

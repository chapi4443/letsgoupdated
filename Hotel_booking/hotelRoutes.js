const express = require("express");
const router = express.Router();
const {
  authenticateUser,
  authorizePermissions,
} = require("../middleware/authentication");

const {
  createServices,
  getAllServices,
  getSingleServices,
  updateServices,
  deleteServices,
  uploadImage,
} = require("./hotelController.js");
const { getSingleProductReviews } = require("./reviewController");


router.route("/").post([authenticateUser], createServices).get(getAllServices);

router
  .route("/uploadImage")
  .post(
    [authenticateUser, authorizePermissions("admin", "serviceprovider")],
    uploadImage
  );

router
  .route("/:id")
  .get(getSingleServices)
  .patch(
    [authenticateUser, authorizePermissions("admin", "serviceprovider")],
    updateServices
  )
  .delete(
    [authenticateUser, authorizePermissions("admin")],
    deleteServices
  );
router.route("/:id/reviews").get(getSingleProductReviews);

module.exports = router;

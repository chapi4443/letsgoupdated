const express = require("express");
const router = express.Router();
// const path = require("path");

const {
  authenticateUser,
  authorizePermissions,
} = require("../middleware/authentication");


const {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
} = require("./reviewController");

router.route("/")
.post(authenticateUser, createReview)
.get(getAllReviews);

router
  .route("/:id")
  .get(getSingleReview)
  .patch(authenticateUser, updateReview)
  .delete(
    [authenticateUser, authorizePermissions("admin", "serviceprovider")],
    deleteReview
  );

module.exports = router;

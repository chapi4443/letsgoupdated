const express = require('express');
const router = express.Router();
const {
  authenticateUser,
  authorizePermissions,
} = require('../middleware/authentication');
const {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
  deleteUser,
  editProfilePicture,
  deleteProfilePicture,
  createProfilePicture,
} = require("./userController.js");

router
  .route('/')
  .get(authenticateUser,authorizePermissions('admin'),  getAllUsers);

router.route('/showMe').get(authenticateUser, showCurrentUser);
router.route('/updateUser').patch(authenticateUser, updateUser);
router.route('/updateUserPassword').patch(authenticateUser, updateUserPassword);

router.delete('/:id', authenticateUser, authorizePermissions('admin'), deleteUser);


router.route('/:id').get(authenticateUser, getSingleUser);

// Route for editing profile picture
router.patch("/editProfilePicture", editProfilePicture);

// Route for deleting profile picture
router.delete("/deleteProfilePicture",  deleteProfilePicture);

// Route for creating a profile picture
router.post("/createProfilePicture",  createProfilePicture);

module.exports = router;

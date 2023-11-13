const User = require('./User.js');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const {
  createTokenUser,
  attachCookiesToResponse,
  checkPermissions,
} = require('../utils');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/"); // Define the destination folder for profile pictures
  },
  filename: (req, file, cb) => {
    cb(null, `profile_${req.user.userId}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5, // Limit file size to 5 MB
  },
});

// Create a profile picture
const addProfilePicture = upload.single("profilePicture"); // 'profilePicture' is the field name in your form

const createProfilePicture = async (req, res) => {
  try {
    addProfilePicture(req, res, async (err) => {
      if (err) {
        throw new CustomError.BadRequestError(
          "Error uploading profile picture"
        );
      }
      const user = await User.findOne({ _id: req.user.userId });

      // You can save the file path or other relevant information in the user profile
      user.profilePicture = req.file.path; // Assumes the field in your User model is 'profilePicture'

      await user.save();

      res
        .status(StatusCodes.OK)
        .json({ msg: "Profile picture uploaded successfully" });
    });
  } catch (error) {
    // Handle errors appropriately
    res
      .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

const editProfilePicture = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user.userId });
    const profilePicturePath = user.profilePicture;

    if (profilePicturePath) {
      // Delete the old profile picture using fs.unlink or other methods
      fs.unlink(profilePicturePath, (err) => {
        if (err) {
          throw new CustomError.InternalServerError(
            "Error deleting old profile picture"
          );
        }
      });
    }

    // Now, update the profile picture with the new one
    addProfilePicture(req, res, async (err) => {
      if (err) {
        throw new CustomError.BadRequestError(
          "Error uploading new profile picture"
        );
      }

      // Update the user's profilePicture field with the new path
      user.profilePicture = req.file.path; // Assumes the field in your User model is 'profilePicture'

      await user.save();

      res
        .status(StatusCodes.OK)
        .json({ msg: "Profile picture updated successfully" });
    });
  } catch (error) {
    // Handle errors appropriately
    res
      .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

const deleteProfilePicture = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user.userId });
    const profilePicturePath = user.profilePicture;

    if (profilePicturePath) {
      // Delete the profile picture from the server using fs.unlink or other methods
      fs.unlink(profilePicturePath, (err) => {
        if (err) {
          throw new CustomError.InternalServerError(
            "Error deleting profile picture"
          );
        }

        // Clear the profilePicture field in the User model
        user.profilePicture = null;

        // Save the user
        user.save((err) => {
          if (err) {
            throw new CustomError.InternalServerError(
              "Error saving user after deleting profile picture"
            );
          }
          res
            .status(StatusCodes.OK)
            .json({ msg: "Profile picture deleted successfully" });
        });
      });
    } else {
      throw new CustomError.BadRequestError("No profile picture to delete");
    }
  } catch (error) {
    // Handle errors appropriately
    res
      .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};



const getAllUsers = async (req, res) => {
  console.log(req.user);
  const users = await User.find({ role: 'user' }).select('-password');
  res.status(StatusCodes.OK).json({ users });
};



const getSingleUser = async (req, res) => {
  const user = await User.findOne({ _id: req.params.id }).select('-password');
  if (!user) {
    throw new CustomError.NotFoundError(`No user with id : ${req.params.id}`);
  }
  // checkPermissions(req.user, user._id);
  res.status(StatusCodes.OK).json({ user });
};

const showCurrentUser = async (req, res) => {
  res.status(StatusCodes.OK).json({ user: req.user });
};
// update user with user.save()
const updateUser = async (req, res) => {
  const { email, name } = req.body;
  if (!email || !name) {
    throw new CustomError.BadRequestError('Please provide all values');
  }
  const user = await User.findOne({ _id: req.user.userId });

  user.email = email;
  user.name = name;

  await user.save();

  const tokenUser = createTokenUser(user);
  attachCookiesToResponse({ res, user: tokenUser });
  res.status(StatusCodes.OK).json({ user: tokenUser });
};
const updateUserPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    throw new CustomError.BadRequestError('Please provide both values');
  }
  const user = await User.findOne({ _id: req.user.userId });

  const isPasswordCorrect = await user.comparePassword(oldPassword);
  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError('Invalid Credentials');
  }
  user.password = newPassword;

  await user.save();
  res.status(StatusCodes.OK).json({ msg: 'Success! Password Updated.' });
};
const deleteUser = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findOneAndDelete({ _id: userId });

    if (!user) {
      throw new CustomError.NotFoundError(`No user with id: ${userId}`);
    }

    res.status(StatusCodes.OK).json({ msg: 'User deleted successfully' });
  } catch (error) {
    if (error instanceof CustomError.NotFoundError) {
      res.status(StatusCodes.NOT_FOUND).json({ error: error.message });
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Failed to delete user' });
    }
  }
};

module.exports = {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
  deleteUser,
  editProfilePicture,
  deleteProfilePicture,
  createProfilePicture,
};




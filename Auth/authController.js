const User = require("./User.js");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const { attachCookiesToResponse, createTokenUser } = require("../utils");
const BadRequestError = require("../errors/BadRequestError.js"); // Correct the file path based on your project's directory structure

const register = async (req, res) => {
  const {
    title,
    first_name,
    middle_name,
    username,
    email,
    password,
    gender,
    date_of_birth,
  } = req.body;

  let role = "user";

  const emailAlreadyExists = await User.findOne({ email });
  if (emailAlreadyExists) {
    const errorMessage = "Email already exists";
    return res.status(400).json({ error: errorMessage });
  }

  // Check if the email contains the keyword 'admin'
  if (email.includes("admin")) {
    role = "admin";
  }
  // Check if the email contains the keyword 'SP' (service provider)
  else if (email.includes("SP")) {
    role = "serviceprovider";
  }

  try {
    const user = await User.create({
      title,
      first_name,
      middle_name,
      username,
      email,
      password,
      gender,
      date_of_birth,
      role,
    });

    const tokenUser = createTokenUser(user);

    attachCookiesToResponse({ res, user: tokenUser });
    res.status(StatusCodes.CREATED).json({ user: tokenUser });
  } catch (error) {
    // Handle any error that occurred during user creation
    res.status(500).json({ error: "Failed to create user" });
  }
};
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Please provide email and password" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: "Invalid Credentials" });
    }

    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ error: "Invalid Credentials" });
    }

    const tokenUser = createTokenUser(user);
    attachCookiesToResponse({ res, user: tokenUser });

    res.status(StatusCodes.CREATED).json({ user: tokenUser });
  } catch (error) {
    // Handle other errors here, if needed
    return res.status(500).json({ error: "An error occurred" });
  }
};

const logout = async (req, res) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now() + 1000),
  });
  res.status(StatusCodes.OK).json({ msg: "user logged out!" });
};

module.exports = {
  register,
  login,
  logout,
};

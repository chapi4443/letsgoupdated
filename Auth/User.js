const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  first_name: {
    type: String,
    required: [true, 'Please provide name'],
    minlength: 3,
    maxlength: 50,
  },
  middle_name: {
    type: String,
    required: [true, 'Please provide name'],
    minlength: 3,
    maxlength: 50,
  },
  username: {
    type: String,
    required: [true, 'Please provide name'],
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'Please provide email'],
    validate: {
      validator: validator.isEmail,
      message: 'Please provide a valid email',
    },
  },
  password: {
    type: String,
    required: [true, 'Please provide password'],
    minlength: 6,
  },
  // phone: {
  //   type: String,
  //   validate: {
  //     validator: function (value) {
  //       return validator.isMobilePhone(value, 'any'); // Validate as any mobile phone number
  //     },
  //     message: 'Please provide a valid phone number',
  //   },
  //   required: [true, 'User phone number required'],
  // },
  gender: {
    type: String,
  },
  date_of_birth: {
    type: Date,
  },
  role: {
    type: String,
    enum: ['admin', 'user', 'serviceprovider'],
    default: 'user',
  },
});
UserSchema.pre('save', async function () {

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};


module.exports = mongoose.model('User', UserSchema);

const validator = require('validator');
const User = require('../models/User');
const catchAsync = require('../utils/asyncErrorWrapper');
const AppError = require('../utils/AppError');

exports.signupValidator = catchAsync(async (req, res, next) => {
  let isValid = false;
  const errors = {};

  const { name = '', email = '', password = '' } = req.body;

  // validate email
  if (await User.findOne({ email })) {
    errors.email = 'That email is already registered.';
  }
  if (!validator.default.isEmail(email)) {
    errors.email = 'Invalid email.';
  }
  if (!validator.default.isLength(email, { max: 100 })) {
    errors.email = 'Sorry, your email cannot be greater than 100 characters.';
  }
  if (validator.default.isEmpty(email)) {
    errors.email = 'An email is required';
  }

  // validate name
  if (!validator.default.isLength(name, { max: 40 })) {
    errors.name = 'Sorry, your name cannot be greater than 40 characters';
  }
  if (validator.default.isEmpty(name)) {
    errors.name = 'A name is required';
  }

  // validate password
  if (!validator.default.isLength(password, { min: 8, max: 40 })) {
    errors.password = 'Your password must be between 8 and 40 characters';
  }
  if (validator.default.isEmpty(password)) {
    errors.password = 'A password is required';
  }

  isValid = Object.keys(errors).length === 0;

  if (!isValid) {
    return next(new AppError('Registration failed', 400, errors));
  }

  next();
});

exports.signinValidator = catchAsync(async (req, res, next) => {
  let isValid = false;
  const errors = {};

  const { email = '', password = '' } = req.body;

  if (validator.default.isEmpty(email)) {
    errors.email = 'Email is required';
  }
  if (validator.default.isEmpty(password)) {
    errors.password = 'Password is required';
  }

  isValid = Object.keys(errors).length === 0;

  if (!isValid) {
    return next(new AppError('Login failed', 400, errors));
  }

  next();
});

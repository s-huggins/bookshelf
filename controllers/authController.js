const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const Profile = require('../models/Profile');
const catchAsync = require('../utils/asyncErrorWrapper');
const AppError = require('../utils/AppError');
const sendEmail = require('../utils/email');

// TODO: updating email will require a password confirmation
// TODO: max login attempts

/* Helpers */

const signToken = userId => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES
  });
};

const createAndSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRATION_DAYS * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);

  // remove any password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
};

/* Auth middleware */

// jwt authentication middleware
exports.protect = catchAsync(async (req, res, next) => {
  let token;
  const { authorization } = req.headers;
  if (authorization && authorization.startsWith('Bearer')) {
    [, token] = authorization.split(' ');
  }

  // check for token in request
  if (!token) {
    return next(new AppError('You must log in to access this page.', 401));
  }

  // verify token and get payload
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // check user still exists
  const user = await User.findById(decoded.id);
  if (!user) {
    return next(
      new AppError('The user owning this token no longer exists.'),
      401
    );
  }

  // check if user changed password after token was issued
  if (user.changedPasswordAfterTokenIssued(decoded.iat)) {
    return next(
      new AppError('Password was recently changed. Please log in again.', 401)
    );
  }

  // if here, grant access
  req.user = user;

  next();
});

// authorization middleware to distinguish admins from users
// follows protect authentication middleware
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action.', 403)
      );
    }

    next();
  };
};

/* Handlers */

exports.signup = catchAsync(async (req, res) => {
  // TODO: gravatar, create profile, use filterBlack helper
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm
  });

  // initialize profile
  await Profile.create({
    user: newUser._id,
    firstName: req.body.name
  });

  createAndSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Email and password required.', 400));
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password.'), 401); // deliberately ambiguous error
  }

  createAndSendToken(user, 200, res);
});

// // gets current user, for use by user
// exports.getUser = catchAsync(async (req, res) => {
//   const user = await User.findById(req.user.id);

//   res.status(200).json({
//     status: 'success',
//     data: {
//       user
//     }
//   });
// });

// // gets current user profile, for use by user
// exports.getProfile = catchAsync(async (req, res) => {
//   const profile = await Profile.findOne({ user: req.user.id });

//   res.status(200).json({
//     status: 'success',
//     data: {
//       profile
//     }
//   });
// });

// requests a password reset link
// no catchAsync, will handle async errors locally
exports.forgotPassword = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('There is no user with this email address.', 404));
  }

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Submit a patch request to this link to reset your password: ${resetURL}. It expires in 10 minutes.`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Password reset',
      message
    });

    return res.status(200).json({
      status: 'success',
      message: 'Password reset token emailed.'
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError(
        'There was an error sending the email. Please try again later.',
        500
      )
    );
  }
};

// resets a forgotten password from outside account
exports.resetPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  });

  if (!user) {
    return next(new AppError('Token is invalid or has expired.', 400));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  // catchAsync to catch validation errors
  await user.save();

  createAndSendToken(user, 200, res);
});

// updates password from inside account
exports.updatePassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');

  if (!user) {
    return next(new AppError('There user does not exist.', 404));
  }

  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError('Your current password is incorrect', 401));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  createAndSendToken(user, 200, res);
});

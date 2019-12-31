const User = require('../models/User');
const Profile = require('../models/Profile');
const catchAsync = require('../utils/asyncErrorWrapper');
const AppError = require('../utils/AppError');
const { filterBlack } = require('../utils/filters');

// gets current user, for use by user
exports.getUser = catchAsync(async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  // const user = await User.findById(req.user.id);
  const user = await User.findById(req.user._id).populate(
    'profile',
    '_id id displayName avatar'
  );
  await Profile.findByIdAndUpdate(req.user.profile._id, {
    lastActive: new Date()
  });

  res.status(200).json({
    status: 'success',
    data: {
      user,
      token
    }
  });
});

exports.getAllUsers = catchAsync(async (req, res) => {
  const users = await User.find();

  res.status(200).json({
    status: 'success',
    data: {
      users
    }
  });
});

exports.getUserById = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.userId);

  if (!user) {
    return next(new AppError('No user with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError('This route is not for password updates.', 400));
  }

  // guard against user patching role to admin, effectively delete req.body['role']
  const updates = filterBlack({ ...req.body }, { role: 1 });

  const updatedUser = await User.findByIdAndUpdate(req.user.id, updates, {
    new: true,
    runValidators: true
  });

  if (!updatedUser) {
    next(new AppError('No user with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  });
});

exports.updateUserAdmin = catchAsync(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(req.params.userId, updates, {
    new: true,
    runValidators: true
  });

  if (!updatedUser) {
    next(new AppError('No user with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const deletedUser = await User.findByIdAndRemove(req.user.id);
  // if (!deletedUser) {
  //   next(new AppError('No user with that ID', 404));
  // }
  // TODO: can we cascade this from user deletion somehow?
  await Profile.findOneAndRemove({ user: deletedUser._id });

  res.status(204).json({
    status: 'success'
  });
});

exports.deleteUserAdmin = catchAsync(async (req, res, next) => {
  const deletedUser = await User.findByIdAndRemove(req.params.userId);
  if (!deletedUser) {
    next(new AppError('No user with that ID', 404));
  }
  // TODO: can we cascade this from user deletion somehow?
  await Profile.findOneAndRemove({ user: deletedUser._id });

  res.status(204).json({
    status: 'success'
  });
});

// TODO: body data validation
// admin use, not for signup
exports.createUser = catchAsync(async (req, res) => {
  const newUser = await User.create(req.body);

  // initialize profile
  await Profile.create({
    user: newUser._id,
    firstName: req.body.name
  });

  res.status(201).json({
    status: 'success',
    data: {
      user: newUser
    }
  });
});

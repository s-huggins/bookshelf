const Profile = require('../models/Profile');
const catchAsync = require('../utils/asyncErrorWrapper');
const AppError = require('../utils/AppError');

// TODO: factor this out into a helper function to be exported into usersController
// OR work out a forwarding to this route
// OR use a mongoose middleware somehow
// a profile will be initialized on account registration

// exports.createProfile = catchAsync(async (req, res, next) => {
//   res.status(201).json();
// });

// gets current user profile, for use by user
exports.getProfile = catchAsync(async (req, res) => {
  const profile = await Profile.findOne({ user: req.user.id });

  res.status(200).json({
    status: 'success',
    data: {
      profile
    }
  });
});

exports.getProfileByUserId = catchAsync(async (req, res, next) => {
  const profile = await Profile.findOne({ user: req.params.userId });
  if (!profile) {
    return next(new AppError('No user owning this profile exists.', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      profile
    }
  });
});

const updateProfileHelper = catchAsync(async (req, res, next) => {});

// TODO: use helper above
exports.updateProfile = catchAsync(async (req, res, next) => {
  const updatedProfile = await Profile.findOneAndUpdate(
    { user: req.user.id },
    req.body,
    { runValidators: true, new: true }
  );
  if (!updatedProfile) {
    return next(
      new AppError('The user owning this profile no longer exists.', 404)
    );
  }

  res.status(200).json({
    status: 'success',
    data: {
      profile: updatedProfile
    }
  });
});

// admin
exports.updateProfileByUserId = catchAsync(async (req, res, next) => {
  const updatedProfile = await Profile.findOneAndUpdate(
    { user: req.params.userId },
    req.body,
    { runValidators: true, new: true }
  );
  if (!updatedProfile) {
    return next(
      new AppError('The user owning this profile no longer exists.', 404)
    );
  }

  res.status(200).json({
    status: 'success',
    data: {
      profile: updatedProfile
    }
  });
});

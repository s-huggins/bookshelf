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

// @DESC: For fetching profiles by id. Returns any public profile, and returns a
// private profile if it belongs to the user or a friend of the user.
// @ACCESS: private
// @NB: Optional id param references either an auto-incrementing id field (which is not MongoDB's _id)
// or profile handle from the Profile model. The profile handle cannot begin with a digit, which is
// how we distinguish the parameter type.
exports.getProfile = catchAsync(async (req, res, next) => {
  let profile;
  if (!req.params.id) {
    // user fetching own profile
    profile = await Profile.findOne({
      user: req.user._id
    });
  } else {
    // fetching a profile by id.
    const nums = new Set(['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']);
    // if regex matches, search profile by handle, else search by profile id
    if (!nums.has(req.params.id[0])) {
      // profile = await Profile.findOne({
      //   handle: req.params.id
      // });

      const reg = new RegExp(`^${req.params.id}$`, 'i');
      profile = await Profile.findOne({ handle: { $regex: reg } });
    } else {
      profile = await Profile.findOne({
        id: req.params.id
      });
    }

    if (!profile) {
      return next(new AppError('This profile does not exist.', 404));
    }

    // if not own profile
    if (!(profile.user.toString() === req.user.id)) {
      // TODO: check if it is a friend's profile, and if so, return it regardless

      if (!profile.isPublic) {
        return res.status(200).json({
          status: 'success',
          code: 'PRIVATE',
          message: 'This profile is private.',
          data: {
            profile: {
              isPublic: false,
              displayName: profile.displayName,
              handle: profile.handle,
              avatar: profile.avatar
            }
          }
        });
      }

      // remove userdata declared private
      // const profileJson = profile.toJSON();
      // console.log(profile._doc);
      Object.keys(profile._doc).forEach(k => {
        if (profile._doc[k].private) {
          delete profile._doc[k];
        }
      });

      delete profile._doc.friendRequests;
    }
  }

  res.status(200).json({
    status: 'success',
    data: {
      profile
    }
  });
});

exports.checkHandleAvailability = catchAsync(async (req, res) => {
  // handle async requests for cleared input field, shouldn't be needed since frontend cancels empty lookups
  if (!req.params.handle) {
    return res.status(200).json({
      status: 'fail'
    });
  }

  const reg = new RegExp(`^${req.params.handle}$`, 'i');
  const profile = await Profile.findOne({ handle: { $regex: reg } });
  const handleTaken = !!profile;

  res.status(200).json({
    status: 'success',
    data: {
      handleTaken
    }
  });
});

exports.getProfileByUserId = catchAsync(async (req, res, next) => {
  const profile = await Profile.findOne({
    user: req.params.userId
  });
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

// const updateProfileHelper = catchAsync(async (req, res, next) => {});

// TODO: use helper above
exports.updateProfile = catchAsync(async (req, res, next) => {
  const updatedProfile = await Profile.findOneAndUpdate(
    {
      user: req.user.id
    },
    req.body,
    {
      runValidators: true,
      new: true
    }
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
    {
      user: req.params.userId
    },
    req.body,
    {
      runValidators: true,
      new: true
    }
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

// exports.sendFriendRequest = catchAsync(async (req, res, next) => {
//   /**
//    * expecting a body of the form { profile: profId }
//    *
//    */

//    const userProfile = await Profile.findOne({user: req.user._id});

//   const { profileId } = req.body;
//    const update = {
//      kind: 'Received',
//      profile:
//    };

//    await Profile.findOneAndUpdate(
//      {id: profileId},
//      { $push: {friendRequests: } },
//      {new: true}
//     );
// });

const mongoose = require('mongoose');
const catchAsync = require('../utils/asyncErrorWrapper');
const Avatar = require('../models/Avatar');
const Profile = require('../models/Profile');

exports.uploadAvatar = catchAsync(async (req, res) => {
  // gridfs-multer middleware has saved the new avatar
  // first check for and remove old avatar
  const oldAvatar = await Avatar.findOneAndDelete({
    'metadata.profile_id': req.user.profile._id
  })
    .where('uploadDate')
    .lt(req.file.uploadDate);

  // if a previous avatar existed, delete its associated data chunks
  if (oldAvatar) {
    await mongoose.connection.db
      .collection('avatars.chunks')
      .deleteMany({ files_id: oldAvatar._id });
  }

  // store new avatar's objectId in user's profile model
  const updatedProfile = await Profile.findByIdAndUpdate(
    req.user.profile._id,
    {
      avatar_id: req.file.id
    },
    { new: true }
  );

  const updatedUser = {
    ...req.user,
    profile: {
      ...req.user.profile._doc,
      // handle: updatedProfile.handle,
      avatar_id: updatedProfile.avatar_id
    }
  };

  res.status(200).json({
    status: 'success',
    data: { profile: updatedProfile, user: updatedUser }
  });
});

exports.deleteAvatar = catchAsync(async (req, res) => {
  // delete doc in avatars.files collection
  const file = await Avatar.findOneAndDelete({
    'metadata.user_id': req.user._id
  });

  // then delete all associated docs from avatars.chunks
  if (file) {
    await mongoose.connection.db
      .collection('avatars.chunks')
      .deleteMany({ files_id: file._id });
  }

  const updatedProfile = await Profile.findByIdAndUpdate(
    req.user.profile._id,
    {
      avatar_id: null
    },
    { new: true }
  );

  const updatedUser = {
    ...req.user,
    profile: {
      ...req.user.profile._doc,
      // handle: updatedProfile.handle,
      avatar_id: updatedProfile.avatar_id
    }
  };

  res.status(200).json({
    status: 'success',
    data: { profile: updatedProfile, user: updatedUser }
  });
});

exports.getAvatar = catchAsync(async (req, res) => {
  const gfs = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    bucketName: 'avatars'
  });
  const file = await Avatar.findOne({
    _id: req.params.avatar_id
  });
  if (!file) {
    return res.status(404).json({
      status: 'fail',
      err: 'File does not exist'
    });
  }

  gfs.openDownloadStream(file._id).pipe(res);
});

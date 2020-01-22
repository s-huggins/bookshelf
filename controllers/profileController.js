const Profile = require('../models/Profile');
const User = require('../models/User');
const Book = require('../models/Book');
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
// TODO: refactor into separate handlers based on profile fetch condition - use middleware to fork request
// exports.getProfile = catchAsync(async (req, res, next) => {
//   let profile;
//   if (!req.params.id) {
//     // user fetching own profile
//     // acount-editing pages fetch the user's profile this way
//     profile = await Profile.findOne({
//       user: req.user._id
//     })
//       .populate('books.bookId')
//       .populate(
//         'friendRequests.profile',
//         'displayName avatar_id location friends books'
//       )
//       .populate('friends.profile', 'displayName avatar_id friends books');
//     if (!profile) {
//       return next(new AppError('This profile does not exist.', 404));
//     }
//   } else {
//     // fetching a profile by id.
//     const nums = new Set(['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']);
//     // if regex matches, search profile by handle, else search by profile id
//     if (!nums.has(req.params.id[0])) {
//       // profile = await Profile.findOne({
//       //   handle: req.params.id
//       // });

//       const reg = new RegExp(`^${req.params.id}$`, 'i');
//       profile = await Profile.findOne({ handle: { $regex: reg } }).populate(
//         'books.bookId'
//       );
//     } else {
//       profile = await Profile.findOne({
//         id: req.params.id
//       }).populate('books.bookId');
//     }

//     if (!profile) {
//       return next(new AppError('This profile does not exist.', 404));
//     }

//     // if not own profile
//     if (!(profile.user.toString() === req.user.id)) {
//       // TODO: check if it is a friend's profile, and if so, return it regardless

//       if (!profile.isPublic) {
//         return res.status(200).json({
//           status: 'success',
//           code: 'PRIVATE',
//           message: 'This profile is private.',
//           data: {
//             profile: {
//               isPublic: false,
//               displayName: profile.displayName,
//               handle: profile.handle,
//               avatar: profile.avatar
//             }
//           }
//         });
//       }

//       // remove userdata declared private
//       // const profileJson = profile.toJSON();
//       // console.log(profile._doc);
//       Object.keys(profile._doc).forEach(k => {
//         if (profile._doc[k].private) {
//           delete profile._doc[k];
//         }
//       });

//       delete profile._doc.friendRequests;
//     }
//   }

//   res.status(200).json({
//     status: 'success',
//     data: {
//       profile
//     }
//   });
// });

// exports.getProfile = catchAsync(async (req, res, next) => {
//   let profile;
//   if (!req.params.id) {
//     // user fetching own profile
//     // acount-editing pages fetch the user's profile this way
//     profile = await Profile.findOne({
//       user: req.user._id
//     })
//       .populate('books.bookId')
//       .populate(
//         'friendRequests.profile',
//         'displayName avatar_id location friends books'
//       )
//       // .populate('friends.profile', 'displayName avatar_id friends books');
//       .populate({
//         path: 'friends.profile',
//         select: 'displayName avatar_id friends books lastActive',
//         populate: {
//           path: 'books.bookId'
//         }
//       });

//     if (!profile) {
//       return next(new AppError('This profile does not exist.', 404));
//     }

//     profile = profile.toJSON();
//     // // remove the overfetched data that was needed for virtual props
//     profile.friends.forEach(fr => {
//       delete fr.profile.books;
//       delete fr.profile.friends;
//     });
//     profile.friendRequests.forEach(fReq => {
//       delete fReq.profile.books;
//       delete fReq.profile.friends;
//     });
//   } else {
//     // fetching a profile by id.
//     const nums = new Set(['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']);
//     // if regex matches, search profile by handle, else search by profile id
//     if (!nums.has(req.params.id[0])) {
//       const reg = new RegExp(`^${req.params.id}$`, 'i');
//       profile = await Profile.findOne({ handle: { $regex: reg } }).populate(
//         'books.bookId'
//       );
//     } else {
//       profile = await Profile.findOne({
//         id: req.params.id
//       }).populate('books.bookId');
//     }

//     if (!profile) {
//       return next(new AppError('This profile does not exist.', 404));
//     }

//     // if not own profile
//     if (!(profile.user.toString() === req.user.id)) {
//       // TODO: check if it is a friend's profile, and if so, return it regardless

//       if (!profile.isPublic) {
//         return res.status(200).json({
//           status: 'success',
//           code: 'PRIVATE',
//           message: 'This profile is private.',
//           data: {
//             profile: {
//               isPublic: false,
//               displayName: profile.displayName,
//               handle: profile.handle,
//               avatar: profile.avatar
//             }
//           }
//         });
//       }

//       // remove userdata declared private
//       // const profileJson = profile.toJSON();
//       // console.log(profile._doc);
//       Object.keys(profile._doc).forEach(k => {
//         if (profile._doc[k].private) {
//           delete profile._doc[k];
//         }
//       });

//       delete profile._doc.friendRequests;
//     }
//   }

//   res.status(200).json({
//     status: 'success',
//     data: {
//       profile
//     }
//   });
// });

// const fetchOwnProfile = catchAsync(async (filterObj) => {
//   const ownProfile = await Profile.findOne(filterObj)
//     .populate('books.bookId')
//     .populate(
//       'friendRequests.profile',
//       'displayName avatar_id location friends books'
//     )
//     .populate({
//       path: 'friends.profile',
//       select: 'displayName avatar_id friends books lastActive',
//       populate: {
//         path: 'books.bookId'
//       }
//     });
// });

// const isFetchingOwnProfile = req => {
//   // if no identifier, then always fetching own profile
//   if (!req.params.id) return true;

//   const identifier = req.params.id;

//   const nums = new Set(['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']);
//   if (!nums.has(identifier.charAt(0))) {
//     // fetching a profile by handle
//     return req.user.profile.handle.toLowerCase() === identifier.toLowerCase();
//   }

//   // else fetching profile by id
//   return +req.user.profile.id === +identifier;
// };

const prepareGetProfile = req => {
  let [fetchingOwn, filterObj] = [null, null];

  // if no identifier, then always fetching own profile
  if (!req.params.id) {
    [fetchingOwn, filterObj] = [true, { user: req.user._id }];
  } else {
    const identifier = req.params.id; // identifier is a string
    const nums = new Set(['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']);

    if (!nums.has(identifier.charAt(0))) {
      // fetching a profile by handle
      const reg = new RegExp(`^${identifier}$`, 'i');

      fetchingOwn =
        req.user.profile.handle.toLowerCase() === identifier.toLowerCase();
      filterObj = { handle: { $regex: reg } };
    } else {
      // else fetching profile by id
      fetchingOwn = +req.user.profile.id === +identifier;
      filterObj = { id: +identifier };
    }
  }

  return [fetchingOwn, filterObj];
};

exports.getProfile = catchAsync(async (req, res, next) => {
  const [fetchingOwn, filterObj] = prepareGetProfile(req);
  let profile;

  if (fetchingOwn) {
    profile = await Profile.getOwnProfile(filterObj);
  } else {
    profile = await Profile.getOtherProfile(
      filterObj,
      req.user.profile.friends
    );
  }

  if (!profile) {
    return next(new AppError('This profile does not exist.', 404));
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

exports.updateProfile = catchAsync(async (req, res, next) => {
  const updatedProfile = await Profile.findOneAndUpdate(
    {
      user: req.user._id
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

  const updatedUser = {
    ...req.user,
    profile: {
      ...req.user.profile._doc,
      handle: updatedProfile.handle
    }
  };

  res.status(200).json({
    status: 'success',
    // token,
    data: {
      user: updatedUser,
      profile: updatedProfile
    }
  });
});

/**
 * req.body arrives with a `shelf` key taking one of the following values
 * shelf: 'to-read',
 * shelf: 'reading',
 * shelf: 'read',
 * shelf: '' (used for clearing a book from its current shelf)
 *
 * A book's primary shelf field, if it is shelved, must be exactly one of
 * `to-read`, `reading`, or `read`.
 *
 * After adjusting the book's shelf, we must make sure it exists in the
 * Book collection.
 *
 */
exports.updateBookshelves = catchAsync(async (req, res, next) => {
  let profile;
  const bookId = +req.body.bookId;
  if (req.body.shelf === '') {
    profile = await Profile.findOneAndUpdate(
      {
        user: req.user._id,
        'books.bookId': bookId
      },
      {
        $pull: {
          books: {
            bookId
          }
        }
      },
      {
        runValidators: true
      }
    );
  } else {
    profile = await Profile.findOneAndUpdate(
      {
        user: req.user._id,
        'books.bookId': bookId
      },
      {
        $set: {
          'books.$.primaryShelf': req.body.shelf,
          'books.$.dateShelved': Date.now()
        }
      },
      {
        runValidators: true
      }
    );
    if (!profile)
      profile = await Profile.findOneAndUpdate(
        {
          user: req.user._id
        },
        {
          $push: {
            books: {
              bookId,
              primaryShelf: req.body.shelf
            }
          }
        },
        {
          runValidators: true
        }
      );
  }

  if (!(await Book.exists({ _id: bookId }))) {
    const book = {
      _id: bookId,
      title: req.body.title,
      authors: req.body.authors,
      image_url: req.body.image_url
    };
    await Book.create(book);
  }

  res.status(200).json({
    status: 'success'
  });
});

exports.handleRating = catchAsync(async (req, res) => {
  // update ratings in user profile
  // create book if it doesn't exist
  // update ratings on book
  // req.body.rating = 0 implies remove rating

  const bookId = +req.body.bookId;
  const rating = +req.body.rating;
  // const newRating = req.body.newRating;
  const removedRating = !rating; // no `rating` field or rating of 0 implies user revoked a rating

  const profile = await Profile.findOne({ user: req.user._id });
  const ix = profile.ratings.findIndex(r => r.bookId === bookId);

  if (ix !== -1) {
    // here if user updated a previous rating for the book
    if (removedRating) {
      profile.ratings.splice(ix, 1);
    } else {
      profile.ratings[ix].rating = rating;
    }
  } else if (!removedRating) {
    // here if user did not have a previous rating for the book
    profile.ratings.push({ bookId, rating });
  }
  await profile.save();
  // create book if it doesn't already exist
  if (!(await Book.exists({ _id: bookId }))) {
    if (!removedRating) {
      // remove this?
      const book = {
        _id: bookId,
        title: req.body.title,
        authors: req.body.authors,
        image_url: req.body.image_url,
        ratings: [
          {
            profileId: req.user.profile.id,
            rating
          }
        ]
      };

      await Book.create(book);
    }
  } else if (removedRating) {
    // book exists in db, this block handles removal of rating whether the user has rated it or not
    await Book.findByIdAndUpdate(bookId, {
      $pull: {
        ratings: {
          profileId: req.user.profile.id
        }
      }
    });
  } else {
    // else book exists, user has set a rating, to be patched in or pushed on to ratings array
    const updatedRating = await Book.findOneAndUpdate(
      { _id: bookId, 'ratings.profileId': req.user.profile.id },
      {
        $set: {
          'ratings.$.rating': rating
        }
      }
    );

    if (!updatedRating) {
      await Book.findOneAndUpdate(
        { _id: bookId },
        {
          $push: {
            ratings: {
              profileId: req.user.profile.id,
              rating
            }
          }
        }
      );
    }
  }

  res.status(200).json({ status: 'success' });
});

// // admin
// exports.updateProfileByUserId = catchAsync(async (req, res, next) => {
//   const updatedProfile = await Profile.findOneAndUpdate(
//     {
//       user: req.params.userId
//     },
//     req.body,
//     {
//       runValidators: true,
//       new: true
//     }
//   );
//   if (!updatedProfile) {
//     return next(
//       new AppError('The user owning this profile no longer exists.', 404)
//     );
//   }

//   res.status(200).json({
//     status: 'success',
//     data: {
//       profile: updatedProfile
//     }
//   });
// });

exports.sendFriendRequest = catchAsync(async (req, res) => {
  // add a Sent request to sender's friendRequests, and a Received request
  // to recipient's friendRequests

  const otherProfileId = +req.params.profileId; // number

  if (req.user.profile.id === otherProfileId) {
    return res.status(400).json({
      status: 'fail',
      message: 'Users cannot friend themselves.'
    });
  }

  // no sent or received request can be outstanding
  const updatedProfile = await Profile.findOneAndUpdate(
    {
      id: otherProfileId,
      friendRequests: {
        $not: {
          $elemMatch: {
            profileId: +req.user.profile.id
          }
        }
      }
    },
    {
      $push: {
        friendRequests: {
          kind: 'Received',
          profile: req.user.profile._id,
          profileId: req.user.profile.id
        }
      }
    }
  );

  if (!updatedProfile) {
    return res.status(400).json({
      status: 'fail',
      message: 'Profile does not exist or a request is already outstanding.'
    });
  }
  const ownUpdatedProfile = await Profile.findOneAndUpdate(
    {
      _id: req.user.profile._id,
      friendRequests: {
        $not: {
          $elemMatch: {
            profileId: otherProfileId
          }
        }
      }
    },
    {
      $push: {
        friendRequests: {
          kind: 'Sent',
          profile: updatedProfile._id,
          profileId: otherProfileId
        }
      }
    },
    { new: true }
  );
  if (!ownUpdatedProfile) {
    return res.status(400).json({
      status: 'fail',
      message: 'Friend request is already pending.'
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      friendRequests: ownUpdatedProfile.friendRequests
    }
  });
});

// pulling non-existent entries is fine
exports.cancelFriendRequest = catchAsync(async (req, res) => {
  const otherProfile = await Profile.findOneAndUpdate(
    { id: +req.params.profileId },
    { $pull: { friendRequests: { profile: req.user.profile._id } } }
  );

  const ownUpdatedProfile = await Profile.findByIdAndUpdate(
    req.user.profile._id,
    {
      $pull: { friendRequests: { profile: otherProfile._id } }
    },
    { new: true }
  );

  res.status(200).json({
    status: 'success',
    data: {
      friendRequests: ownUpdatedProfile.friendRequests
    }
  });
});

exports.acceptFriendRequest = catchAsync(async (req, res) => {
  // ensure outgoing friend request exists
  // remove outstanding friend request entries
  // add each profile to the other's friends list
  const otherProfileId = +req.params.profileId;

  const otherProfile = await Profile.findOneAndUpdate(
    {
      id: otherProfileId,
      friendRequests: {
        $elemMatch: { kind: 'Sent', profile: req.user.profile._id }
      }
    },
    {
      $pull: { friendRequests: { profile: req.user.profile._id } },
      $push: {
        friends: {
          profile: req.user.profile._id,
          profileId: req.user.profile.id
        }
      } // adds friend
    }
  );

  if (!otherProfile)
    return res.status(400).json({
      status: 'fail',
      message: 'Profile or outstanding request does not exist.'
    });

  const ownUpdatedProfile = await Profile.findOneAndUpdate(
    {
      _id: req.user.profile._id,
      friendRequests: {
        $elemMatch: { kind: 'Received', profile: otherProfile._id }
      }
    },
    {
      $pull: { friendRequests: { profile: otherProfile._id } },
      $push: {
        friends: { profile: otherProfile._id, profileId: otherProfileId }
      } // adds friend
    },
    { new: true }
  );

  if (!ownUpdatedProfile)
    return res.status(400).json({
      status: 'fail',
      message: 'Profile or outstanding request does not exist.'
    });

  res.status(200).json({
    status: 'success',
    data: {
      friendRequests: ownUpdatedProfile.friendRequests,
      friends: ownUpdatedProfile.friends
    }
  });
});

// don't remove outgoing request from sender's profile
// users are not informed of a rejected request
// the request's `ignored` field is set to true
exports.rejectFriendRequest = catchAsync(async (req, res) => {
  // const otherProfile = await Profile.findOne({
  //   id: +req.params.profileId
  // });

  // const ownUpdatedProfile = await Profile.findOneAndUpdate(
  //   {
  //     _id: req.user.profile._id,
  //     friendRequests: {
  //       $elemMatch: { kind: 'Received', profile: otherProfile._id }
  //     }
  //   },
  //   {
  //     $pull: { friendRequests: { profile: otherProfile._id } }
  //   }
  // );
  const otherProfileId = +req.params.profileId;
  const ownUpdatedProfile = await Profile.findOneAndUpdate(
    {
      _id: req.user.profile._id,
      friendRequests: {
        $elemMatch: { kind: 'Received', profileId: otherProfileId }
      }
    },
    {
      $set: { 'friendRequests.$.ignored': true }
    },
    { new: true }
  );

  if (!ownUpdatedProfile)
    return res.status(400).json({
      status: 'fail',
      message: 'Profile or outstanding request does not exist.'
    });

  res.status(200).json({
    status: 'success',
    data: {
      friendRequests: ownUpdatedProfile.friendRequests
    }
  });
});

exports.removeFriend = catchAsync(async (req, res) => {
  const otherProfile = await Profile.findOneAndUpdate(
    {
      id: +req.params.profileId
    },
    {
      $pull: { friends: { profile: req.user.profile._id } }
    }
  );

  if (!otherProfile)
    return res.status(400).json({
      status: 'fail',
      message: 'Profile or friend does not exist.'
    });

  const ownUpdatedProfile = await Profile.findOneAndUpdate(
    {
      _id: req.user.profile._id
    },
    {
      $pull: { friends: { profile: otherProfile._id } }
    },
    { new: true }
  );

  if (!ownUpdatedProfile)
    return res.status(400).json({
      status: 'fail',
      message: 'Profile or friend does not exist.'
    });

  res.status(200).json({
    status: 'success',
    data: {
      friends: ownUpdatedProfile.friends
    }
  });
});

exports.getFriendsReading = catchAsync(async (req, res, next) => {
  // user fetching current reads of all friends
  let profile = await Profile.findOne({
    user: req.user._id
  }).populate({
    path: 'friends.profile',
    select: 'displayName books',
    populate: {
      path: 'books.bookId'
    }
  });

  if (!profile) {
    return next(new AppError('This profile does not exist.', 404));
  }

  profile = profile.toJSON();

  profile.friends.forEach(fr => {
    // eslint-disable-next-line no-param-reassign
    fr.profile.books = fr.profile.books.filter(
      book => book.primaryShelf === 'reading'
    );
    delete fr.profile.currentRead;
  });

  res.status(200).json({
    status: 'success',
    data: {
      profile
    }
  });
});

exports.searchProfiles = catchAsync(async (req, res, next) => {
  const { email, twitter, search } = req.query;
  let profiles = [];
  if (twitter) {
    const twitterReg = new RegExp(`^${twitter.trim()}$`, 'i');
    profiles = await Profile.find({
      'social.twitter': { $regex: twitterReg }
    }).select('displayName avatar_id location id'); // returns array
  } else if (email) {
    const emailReg = new RegExp(`^${email.trim()}$`, 'i');

    const user = await User.findOne({ email: { $regex: emailReg } }).populate(
      'profile',
      'displayName avatar_id location id'
    );
    if (user) {
      profiles[0] = user.profile;
    }
  } else {
    // search lookup
    // profiles = await Profile.find({$or: [{email}, {twitter}, {displayName}]})
  }

  profiles.forEach(prof => {
    if (prof.location.private) delete prof.location;
  });

  res.status(200).json({
    status: 'success',
    data: {
      profiles
    }
  });
});

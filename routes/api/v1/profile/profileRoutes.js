const express = require('express');
const profileController = require('../../../../controllers/profileController');
const authController = require('../../../../controllers/authController');
const avatarRouter = require('./avatarRoutes');

// const { protect, restrictTo } = authController;
const { protect } = authController;

// nested route: api/v1/users/:userId/profile
const router = express.Router({ mergeParams: true });

router.use('/avatar', avatarRouter);

const fromUsersRoute = (req, res, next) => {
  if (req.params.userId) return next('route');
  next();
};

router.patch('/bookshelves', protect, profileController.updateBookshelves);
router.patch('/rating', protect, profileController.handleRating);

router.get(
  '/handleCheck/:handle?',
  protect,
  profileController.checkHandleAvailability
);

router
  .route('/:id?')
  .all(fromUsersRoute, protect)
  .get(profileController.getProfile)
  .patch(profileController.updateProfile);

// for getting a public profile, using the autoincrementing Profile id field (not _id)
// // @/api/v1/profile/:id
// router
//   .route('/:id')
//   .all(fromUsersRoute)
//   .get(profileController.getProfile);

// if arriving through /users/:userId/profile
// router.route('/').get(profileController.getProfileByUserId);
// .patch(protect, restrictTo('admin'), profileController.updateProfileByUserId);

// router
//   .route('friendRequests/out')
//   .all(protect)
//   .patch(profileController.sendFriendRequest) // send a friend request
//   .delete(profileController.cancelFriendRequest); // cancel a friend request

// router.patch(
//   'friendRequests/in',
//   protect,
//   profileController.handleFriendRequest
// ); // accept or reject a friend request

module.exports = router;

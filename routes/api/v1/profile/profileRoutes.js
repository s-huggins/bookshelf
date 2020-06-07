const express = require('express');
const profileController = require('../../../../controllers/profileController');
const authController = require('../../../../controllers/authController');
const avatarRouter = require('./avatarRoutes');

// const { protect, restrictTo } = authController;
const { protect } = authController;

// nested route: /api/v1/users/:userId/profile
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

router.get('/friends/reading', protect, profileController.getFriendsReading);
router.get(
  '/friends/ofFriends',
  protect,
  profileController.getFriendsOfFriends
);

router.delete('/friends/:profileId', protect, profileController.removeFriend);

router
  .route('/friendRequests/outgoing/:profileId')
  .all(protect)
  .post(profileController.sendFriendRequest)
  .delete(profileController.cancelFriendRequest);

router
  .route('/friendRequests/incoming/:profileId')
  .all(protect)
  .post(profileController.acceptFriendRequest)
  .delete(profileController.rejectFriendRequest);

router.get('/search', protect, profileController.searchProfiles);

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

module.exports = router;

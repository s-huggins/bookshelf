const express = require('express');
const profileController = require('../../../controllers/profileController');
const authController = require('../../../controllers/authController');

const { protect, restrictTo } = authController;

// nested route: api/v1/users/:userId/profile
const router = express.Router({ mergeParams: true });

const fromUsersRoute = (req, res, next) => {
  if (req.params.userId) return next('route');
  next();
};

router
  .route('/')
  .all(fromUsersRoute)
  .get(protect, profileController.getProfile)
  .patch(protect, profileController.updateProfile);

router
  .route('/')
  .get(profileController.getProfileByUserId)
  .patch(protect, restrictTo('admin'), profileController.updateProfileByUserId);

module.exports = router;

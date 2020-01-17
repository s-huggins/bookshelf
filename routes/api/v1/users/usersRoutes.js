const express = require('express');
const usersController = require('../../../../controllers/usersController');
const authController = require('../../../../controllers/authController');
const profileRouter = require('../profile/profileRoutes');
const {
  signupValidator,
  signinValidator
} = require('../../../../validators/authValidators');

// api/v1/users/
const router = express.Router();
const { protect, restrictTo } = authController;

router.use('/:userId/profile', profileRouter);

// TODO: user's 'name' at registration is sticky. patch in update from profile `firstName` change?
router.post('/signup', signupValidator, authController.signup);
router.post('/login', signinValidator, authController.login);

// returns current user, for use by user
router
  .route('/')
  .all(protect)
  .get(usersController.getUser)
  .patch(usersController.updateUser)
  .delete(usersController.deleteUser);

router.get('/all', usersController.getAllUsers);

router.patch('/updateEmail', protect, authController.updateEmail);
router.post('/emailCheck', protect, authController.checkEmailAvailability);
router.patch('/updatePassword', protect, authController.updatePassword);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

// patch and delete for admin use
// router
//   .route('/:userId')
//   .get(usersController.getUserById)
//   .patch(protect, restrictTo('admin'), usersController.updateUserAdmin)
//   .delete(protect, restrictTo('admin'), usersController.deleteUserAdmin);

module.exports = router;

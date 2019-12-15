const express = require('express');
const usersController = require('../../../controllers/usersController');
const authController = require('../../../controllers/authController');
const profileRouter = require('./profileRoutes');

const router = express.Router();
const { protect, restrictTo } = authController;

// param middleware
// router.param('userId', (req, res, next, val) => {
//   console.log(`User ID is ${val}`);
//   next();
// });

router.use('/:userId/profile', profileRouter);

// TODO: user's 'name' at registration is sticky. cascade update from profile change?
router.post('/signup', authController.signup);
router.post('/login', authController.login);

// returns current user, for use by user
router
  .route('/')
  .all(protect)
  .get(usersController.getUser)
  .patch(usersController.updateUser)
  .delete(usersController.deleteUser);

router.get('/all', usersController.getAllUsers);

// patch and delete for admin use
router
  .route('/:userId')
  .get(usersController.getUserById)
  .patch(protect, restrictTo('admin'), usersController.updateUserAdmin)
  .delete(protect, restrictTo('admin'), usersController.deleteUserAdmin);

router.post('/forgotPassword', protect, authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);
router.patch('/updatePassword', protect, authController.updatePassword);

/* TODO: Can this be avoided with slugs? */
router
  .route('/handle/:handleId')
  .get((req, res) =>
    res.status(200).send('users/handle/:handleId GET route works!')
  )
  .patch((req, res) =>
    res.status(200).send('users/handle/:handleId PATCH route works!')
  )
  .delete((req, res) =>
    res.status(200).send('users/handle/:handleId DELETE route works!')
  );

module.exports = router;

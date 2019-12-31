const express = require('express');
const multer = require('multer');
const crypto = require('crypto');
const path = require('path');
const GridFsStorage = require('multer-gridfs-storage');
const authController = require('../../../../controllers/authController');
const avatarController = require('../../../../controllers/avatarController');

const { protect } = authController;

const router = express.Router();

/* GRIDFS & MULTER CONFIG */

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const storage = new GridFsStorage({
  url: process.env.DB_CONNECTION,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename,
          bucketName: 'avatars',
          metadata: {
            user_id: req.user._id,
            profile_id: req.user.profile._id,
            profileId: req.user.profile.id
          }
        };
        resolve(fileInfo);
      });
    });
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 3 // max 3mb
  },
  fileFilter
});

/* ROUTES */

router
  .route('/')
  .all(protect)
  .post(upload.single('img'), avatarController.uploadAvatar)
  .delete(avatarController.deleteAvatar);

router.get('/:avatar_id', protect, avatarController.getAvatar);

module.exports = router;

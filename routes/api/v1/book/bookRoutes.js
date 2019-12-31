const express = require('express');
const bookController = require('../../../../controllers/bookController');
const { protect } = require('../../../../controllers/authController');

const router = express.Router();

router.get('/:bookId', protect, bookController.getBookProfile);

module.exports = router;

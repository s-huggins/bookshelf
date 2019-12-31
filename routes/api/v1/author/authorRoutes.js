const express = require('express');
const authorController = require('../../../../controllers/authorController');
const { protect } = require('../../../../controllers/authController');

const router = express.Router();

router.get('/:authorId', protect, authorController.getAuthorProfile);

module.exports = router;

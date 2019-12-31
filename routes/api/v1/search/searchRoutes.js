const express = require('express');
const searchController = require('../../../../controllers/searchController');
const { protect } = require('../../../../controllers/authController');

const router = express.Router();

router.get('/', protect, searchController.searchBooks);

module.exports = router;

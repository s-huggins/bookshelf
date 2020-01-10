const express = require('express');
const authorController = require('../../../../controllers/authorController');
const { protect } = require('../../../../controllers/authController');

const router = express.Router();

function withoutAuthorImage(req, res, next) {
  if (req.query.image && req.query.image.toLowerCase() === 'true')
    next('route');
  else next();
}

router.get('/:authorId', protect, authorController.getAuthorProfile);
router.get(
  '/:authorId/books',
  protect,
  withoutAuthorImage,
  authorController.getAuthorBooks
);
router.get(
  '/:authorId/books',
  protect,
  authorController.getAuthorBooksWithImage
);
router.get('/:authorId/ratings', protect, authorController.getRatingsData);

module.exports = router;

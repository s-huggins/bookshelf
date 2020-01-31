const express = require('express');
const messageController = require('../../../../controllers/messageController');
const { protect } = require('../../../../controllers/authController');
const messageValidator = require('../../../../validators/messageValidator');

const router = express.Router();

router.use('/', protect);

router.get('/', messageController.getMailbox);
router.post('/', messageValidator, messageController.sendMessage);
router.patch('/trash', messageController.trashMessages);
router.patch('/mark', messageController.markMessages);
router.delete('/', messageController.deleteMessages);

module.exports = router;

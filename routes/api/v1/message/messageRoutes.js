const express = require('express');
const messageController = require('.././../../../controllers/messageController');
const { protect } = require('../../../../controllers/authController');
const messageValidator = require('../../../../controllers/messageController/messageValidator');
const {
  Folder
} = require('../../../../controllers/messageController/controllerTypes');

const router = express.Router();

router.use('/', protect);
router.get(
  '/folder/inbox',
  messageController.validateFetch,
  messageController.handleFetchFolder(Folder.inbox)
);
router.get(
  '/folder/saved',
  messageController.validateFetch,
  messageController.handleFetchFolder(Folder.saved)
);
router.get(
  '/folder/trash',
  messageController.validateFetch,
  messageController.handleFetchFolder(Folder.trash)
);
router.get(
  '/folder/sent',
  messageController.validateFetch,
  messageController.handleFetchFolder(Folder.sent)
);
router.get(
  '/spool/:groupId',
  messageController.validateFetch,
  messageController.fetchSpool
);
router.get(
  '/folder/inbox/:seq/:messageId',
  messageController.validateFetchMessage,
  messageController.fetchInboxMessage
);
router.get(
  '/folder/sent/:seq/:messageId',
  messageController.validateFetchMessage,
  messageController.fetchOutboxMessage
);

router.post('/', messageValidator, messageController.sendMessage);

router.patch(
  '/trash',
  messageController.prepareTrashHandler,
  messageController.handleTrash
);
router.patch(
  '/mark/read',
  messageController.prepareMarkReadHandler,
  messageController.handleMarkRead
);
router.patch(
  '/mark/saved',
  messageController.prepareMarkSavedHandler,
  messageController.handleMarkSaved
);
router.patch(
  '/delete/trash',
  messageController.prepareDeleteTrashHandler,
  messageController.deleteTrash
);
router.patch(
  '/delete/sent',
  messageController.prepareDeleteSentHandler,
  messageController.deleteSent
);

module.exports = router;

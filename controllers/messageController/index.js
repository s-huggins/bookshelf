/* Middleware */
const {
  validateFetch,
  prepareMarkReadHandler,
  prepareMarkSavedHandler,
  prepareTrashHandler,
  prepareDeleteTrashHandler,
  prepareDeleteSentHandler,
  validateFetchMessage
} = require('./middleware');

/* Fetching mail */
const {
  handleFetchFolder,
  fetchSpool,
  fetchInboxMessage,
  fetchOutboxMessage
} = require('./fetchMail');

/* Trashing mail */
const { handleTrash } = require('./trashMail');

/* Marking mail */
const { handleMarkRead, handleMarkSaved } = require('./markMail');

/* Sending mail */
const { sendMessage } = require('./sendMail');

/* Deleting mail */
const { deleteTrash, deleteSent } = require('./deleteMail');

module.exports = {
  validateFetch,
  prepareMarkReadHandler,
  prepareMarkSavedHandler,
  prepareTrashHandler,
  handleFetchFolder,
  handleMarkRead,
  handleMarkSaved,
  sendMessage,
  handleTrash,
  deleteTrash,
  deleteSent,
  prepareDeleteTrashHandler,
  prepareDeleteSentHandler,
  fetchSpool,
  fetchInboxMessage,
  fetchOutboxMessage,
  validateFetchMessage
};

/* eslint-disable no-continue, default-case */
const mongoose = require('mongoose');
const AppError = require('../../utils/AppError');

/* FETCHING MAIL */
// exports.validateFetch = (req, res, next) => {
//   let skip = parseInt(req.params.skip, 10) || 0; // messages to skip, defaulting to 0
//   if (skip < 0) skip = 0;

//   let limit = parseInt(req.params.limit, 10) || 20; // num messages to fetch, defaulting to 20
//   if (limit < 0) limit = 20;

//   req.params.skip = skip;
//   req.params.limit = limit;
//   next();
// };

exports.validateFetch = (req, res, next) => {
  let skip = parseInt(req.query.skip, 10) || 0; // messages to skip, defaulting to 0
  if (skip < 0) skip = 0;

  let limit = parseInt(req.query.limit, 10) || 20; // num messages to fetch, defaulting to 20
  if (limit < 0) limit = 20;

  req.query.skip = skip;
  req.query.limit = limit;
  next();
};

/* PATCHING MAIL */

// patch types
const MARK_READ = 'MARK_READ';
const MARK_SAVED = 'MARK_SAVED';
const TRASH = 'TRASH';
const DELETE_TRASH = 'DELETE_TRASH';
const DELETE_SENT = 'DELETE_SENT';

// helpers
const isValidSeq = seq => {
  const seqParsed = Number(seq);
  if (!Number.isInteger(seqParsed)) return false;
  if (seqParsed < 0) return false;
  return true;
};
const isMongoId = _id => mongoose.Types.ObjectId.isValid(_id);
const isBoolean = val => typeof val === 'boolean';
const isArray = messages => Array.isArray(messages);

const buildTargets = (messages, patchType) => {
  const targets = {};

  for (let i = 0; i < messages.length; i += 1) {
    const { seq, _id, saved, read, trash = {} } = messages[i];

    if (!isMongoId(_id)) continue;
    if (!isValidSeq(seq)) continue;
    if (patchType === MARK_SAVED && !isBoolean(trash.trashed)) continue;
    if (patchType === TRASH && !isBoolean(saved)) continue;
    if (patchType === DELETE_TRASH && !isBoolean(read)) continue;

    if (!targets[seq]) targets[seq] = [];

    switch (patchType) {
      case MARK_SAVED:
        targets[seq].push({ _id, trashed: trash.trashed });
        break;
      case MARK_READ:
        targets[seq].push({ _id });
        break;
      case TRASH:
        targets[seq].push({ _id, saved });
        break;
      case DELETE_TRASH:
        targets[seq].push({ _id, read });
        break;
      case DELETE_SENT:
        targets[seq].push({ _id });
        break;
    }
  }
  return targets;
};

const createPatchHandler = patchType => (req, res, next) => {
  let { messages } = req.body;

  if (!isArray(messages))
    return next(new AppError('Messages array missing from request.'), 400);

  messages = messages.filter(msg => !!msg);
  if (!messages.length)
    return next(new AppError('Messages missing from request.'), 400);

  let targets;
  if (patchType === MARK_READ) targets = buildTargets(messages, MARK_READ);
  if (patchType === MARK_SAVED) targets = buildTargets(messages, MARK_SAVED);
  if (patchType === TRASH) targets = buildTargets(messages, TRASH);
  if (patchType === DELETE_TRASH)
    targets = buildTargets(messages, DELETE_TRASH);
  if (patchType === DELETE_SENT) targets = buildTargets(messages, DELETE_SENT);

  if (Object.keys(targets).length === 0)
    return next(new AppError('Invalid message data.', 400));

  req.body.targets = targets;
  delete req.body.messages;
  next();
};

exports.prepareMarkReadHandler = createPatchHandler(MARK_READ);
exports.prepareMarkSavedHandler = createPatchHandler(MARK_SAVED);
exports.prepareTrashHandler = createPatchHandler(TRASH);
exports.prepareDeleteTrashHandler = createPatchHandler(DELETE_TRASH);
exports.prepareDeleteSentHandler = createPatchHandler(DELETE_SENT);

exports.validateFetchMessage = (req, res, next) => {
  if (!isValidSeq(req.params.seq))
    return next(new AppError('Invalid bucket number.', 400));
  if (!isMongoId(req.params.messageId))
    return next(new AppError('Invalid message Id.', 400));

  next();
};

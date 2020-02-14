/* eslint-disable no-await-in-loop, no-continue, camelcase, no-param-reassign, default-case  */

const mongoose = require('mongoose');
const catchAsync = require('../../utils/asyncErrorWrapper');
const InboxBucket = require('../../models/InboxBucket');
const OutboxBucket = require('../../models/OutboxBucket');
const SpoolBucket = require('../../models/SpoolBucket');
const Profile = require('../../models/Profile');
const AppError = require('../../utils/AppError');
const { Folder } = require('./controllerTypes');

/** FETCHING MAIL */

/* validation middleware */
exports.validateFetch = (req, res, next) => {
  let skip = parseInt(req.params.skip, 10) || 0; // messages to skip, defaulting to 0
  if (skip < 0) skip = 0;

  let limit = parseInt(req.params.limit, 10) || 20; // num messages to fetch, defaulting to 20
  if (limit < 0) limit = 20;

  req.params.skip = skip;
  req.params.limit = limit;
  next();
};

const findBuckets = (folder, bucketList, skip, limit) => {
  let bucketYield;
  if (folder === Folder.inbox)
    bucketYield = bucket =>
      bucket.size - (bucket.numTrashed + bucket.numSaved + bucket.numDeleted);
  else if (folder === Folder.saved) bucketYield = bucket => bucket.numSaved;
  else if (folder === Folder.trash) bucketYield = bucket => bucket.numTrashed;
  else if (folder === Folder.sent)
    bucketYield = bucket => bucket.size - bucket.numDeleted;
  else throw new Error('Invalid folder.');

  let messagesSkipped = 0;
  let messagesToSkip = 0;
  let bucketNum = bucketList.length - 1; // most recent bucket is at the end of the array

  while (bucketNum >= 0) {
    const yieldCount = bucketYield(bucketList[bucketNum]);
    if (messagesSkipped + yieldCount > skip) {
      // skipping this bucket entirely will skip too many messages
      // store how many more to skip inside this bucket
      messagesToSkip = skip - messagesSkipped;
      break;
    }
    messagesSkipped += yieldCount;

    bucketNum -= 1;
  }

  let found = 0;
  const targetBuckets = [];

  // resume path through the bucket sequence, now selecting the buckets to query for
  while (bucketNum >= 0) {
    const yieldCount = bucketYield(bucketList[bucketNum]);
    if (yieldCount > 0) targetBuckets.push(bucketNum); // ensure yield > 0, so we don't wastefully visit buckets void of folder messages
    found += yieldCount;
    if (found >= limit) break; // reached the last bucket our aggregation query needs to visit

    bucketNum -= 1; // otherwise move on to next bucket (backwards in list is backwards in time)
  }

  return [targetBuckets, messagesToSkip];
};

const cleanTrash = async (profile_id, mailbox) => {
  if (mailbox.numTrashed === 0) return; // no trash to clean

  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
  if (mailbox.lastCleaned && mailbox.lastCleaned > yesterday) return; // trash already cleaned today

  const trashPeriod = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds
  const trashThreshold = new Date(Date.now() - trashPeriod);

  const inboxBuckets = mailbox.buckets.inbox;
  const bucketsToClean = [];
  // find buckets containing trash older than 30 days
  for (let i = inboxBuckets.length - 1; i >= 0; i -= 1) {
    if (
      inboxBuckets[i].numTrashed > 0 &&
      inboxBuckets[i].trashOldest < trashThreshold
    )
      bucketsToClean.push(i);
  }

  // buckets can be updated in JS without concurrency issues
  const bucketData = {};
  let numDeleted = 0;
  if (bucketsToClean.length > 0) {
    /* eslint-disable-next-line */
    while (true) {
      try {
        const bucketDocs = await InboxBucket.find({
          profile: profile_id,
          seq: { $in: bucketsToClean }
        });
        /* eslint-disable-next-line */
        bucketDocs.forEach(doc => {
          let trashOldest;
          // let deleteCount = 0;
          doc.messages.forEach(msg => {
            if (msg.trash.trashed && msg.trash.dateTrashed < trashThreshold) {
              msg.deleted = true;
              msg.trash.trashed = false;
              msg.trash.dateTrashed = undefined;

              if (!bucketData[doc.seq])
                bucketData[doc.seq] = { deletedCount: 1 };
              else bucketData[doc.seq].deletedCount += 1;

              numDeleted += 1;
              // deleteCount += 1;
            } else if (msg.trash.trashed) {
              if (!trashOldest) trashOldest = msg.trash.dateTrashed;
              else if (msg.trash.dateTrashed < trashOldest)
                trashOldest = msg.trash.dateTrashed;
            }
          });

          if (trashOldest) bucketData[doc.seq].trashOldest = trashOldest;
        });

        await Promise.all(bucketDocs.map(doc => doc.save()));
        break;
      } catch (err) {
        if (!err.VersionError) throw err;
      }
    }
  }

  const incUpdates = {};
  const trashUpdates = {};
  Object.keys(bucketData).forEach(seq => {
    const key = `mailbox.buckets.inbox.${seq}`;
    const incUpdate = {
      numTrashed: -bucketData[seq].deletedCount,
      numDeleted: bucketData[seq].deletedCount
    };
    const trashUpdate = {
      trashOldest: bucketData[seq].trashOldest
    };
    incUpdates[key] = incUpdate;
    trashUpdates[key] = trashUpdate;
  });

  const cleanedMailbox = await Profile.findByIdAndUpdate(
    profile_id,
    {
      $set: {
        'mailbox.lastCleaned': Date.now(),

        ...trashUpdates
      },
      $inc: {
        'mailbox.numTrashed': -numDeleted,
        ...incUpdates
      }
    },
    {
      new: true,
      lean: true,
      select: 'mailbox'
    }
  );

  return cleanedMailbox;
};

exports.handleFetchFolder = folder => {
  let selectBuckets;
  let bucketModel;
  let messageFilter;
  let groupStage;
  if (folder !== Folder.sent) {
    selectBuckets = mailbox => mailbox.buckets.inbox;
    bucketModel = mongoose.model('InboxBucket');
    groupStage = {
      _id: '$message_id',
      from: { $first: '$from' },
      trash: { $first: '$trash' },
      read: { $first: '$read' },
      saved: { $first: '$saved' },
      to: { $addToSet: '$to' },
      subject: { $first: '$subject' },
      body: { $first: '$body' },
      spoolBucket: { $first: '$spoolBucket' },
      dateCreated: { $first: '$dateCreated' },
      seq: { $first: '$seq' },
      message_id: { $first: '$message_id' },
      bucket_id: { $first: '$bucket_id' }
    };

    switch (folder) {
      case Folder.inbox:
      default:
        messageFilter = {
          deleted: false,
          'trash.trashed': false,
          saved: false
        };
        break;
      case Folder.saved:
        messageFilter = { deleted: false, 'trash.trashed': false, saved: true };
        break;
      case Folder.trash:
        messageFilter = { deleted: false, 'trash.trashed': true, saved: false };
        break;
    }
  } else {
    selectBuckets = mailbox => mailbox.buckets.outbox;
    bucketModel = mongoose.model('OutboxBucket');
    messageFilter = { deleted: false };
    groupStage = {
      _id: '$message_id',
      from: { $first: '$from' },
      to: { $addToSet: '$to' },
      subject: { $first: '$subject' },
      body: { $first: '$body' },
      spoolBucket: { $first: '$spoolBucket' },
      dateCreated: { $first: '$dateCreated' },
      seq: { $first: '$seq' },
      message_id: { $first: '$message_id' },
      bucket_id: { $first: '$bucket_id' }
    };
  }

  return catchAsync(async (req, res) => {
    if (folder === Folder.trash)
      await cleanTrash(req.user.profile.profile_id, req.user.profile.mailbox);

    const { skip, limit } = req.params;

    const mailBuckets = selectBuckets(req.user.profile.mailbox);
    const [targetBuckets, messagesToSkip] = findBuckets(
      folder,
      mailBuckets,
      skip,
      limit
    );

    const messages = await bucketModel
      .aggregate()
      .match({
        profile: req.user.profile._id,
        seq: { $in: targetBuckets }
      })
      .sort({ seq: -1 }) // sorts most recent first
      .project({ __v: 0, profile: 0, dateBucketCreated: 0 })
      .unwind('$messages')
      .addFields({ 'messages.message_id': '$messages._id', bucket_id: '$_id' })
      .replaceRoot({
        $mergeObjects: ['$$ROOT', '$$ROOT.messages']
      })
      .project({ messages: 0 })
      .match(messageFilter)
      .sort({ dateCreated: -1 })
      .skip(messagesToSkip)
      .limit(limit)
      .lookup({
        from: 'profiles',
        let: { from_id: '$from.profile' },
        pipeline: [
          { $match: { $expr: { $eq: ['$_id', '$$from_id'] } } },
          { $project: { profileId: 1, displayName: 1, avatar_id: 1 } }
        ],
        as: 'from.profile'
      })
      .unwind('$to')
      .project({ 'to._id': 0 })
      .lookup({
        from: 'profiles',
        let: { to_id: '$to.profile' },
        pipeline: [
          { $match: { $expr: { $eq: ['$_id', '$$to_id'] } } },
          { $project: { profileId: 1, displayName: 1, avatar_id: 1 } }
        ],
        as: 'to.profile'
      })
      .group(groupStage)
      .sort({ dateCreated: -1 });

    res.status(200).json({
      status: 'success',
      data: {
        messages
      }
    });
  });
};

/** PATCHING MAIL */

/* validation middleware */
exports.transformInboxPatchBody = (req, res, next) => {
  const { messages = [] } = req.body;

  if (!messages || messages.length === 0)
    return res.status(200).json({ status: 'success' });

  const targets = {};

  for (let i = 0; i < messages.length; i += 1) {
    if (!messages[i]) continue;
    const { seq, _id, saved, read } = messages[i];

    if (!mongoose.Types.ObjectId.isValid(_id)) continue;
    if (typeof saved !== 'boolean') continue;
    if (typeof read !== 'boolean') continue;

    const seqParsed = Number(seq);
    if (!Number.isInteger(seqParsed)) continue;
    if (seqParsed < 0) continue;

    if (!targets[seq]) targets[seq] = [];
    targets[seq].push({ _id, saved });
  }

  if (Object.keys(targets).length === 0)
    return next(new AppError('Invalid message data.', 400));

  req.body.targets = targets;
  delete req.body.messages;
  next();
};

const trashMessages = async (req, res) => {
  const { targets } = req.body;

  const bucketNums = Object.keys(targets); // ['3', '1']
  const bucketData = {};
  bucketNums.forEach(seq => {
    bucketData[seq] = {
      trashFlips: 0, // num messages sent to trash
      savedFlips: 0, // num messages removed from saved folder in the process
      messages: [], // {_id, saved}
      filters: [],
      trashOldest: null
    };
  });

  bucketNums.forEach(seq => {
    targets[seq].forEach(msg => {
      bucketData[seq].messages.push({ _id: msg._id, saved: msg.saved });

      bucketData[seq].trashFlips += 1;
      // trashFlipsTotal += 1;

      if (msg.saved) {
        bucketData[seq].savedFlips += 1;
        // savedFlipsTotal += 1;
      }
    });
  });

  const trashDate = Date.now();

  // ensure all the messages selected to be trashed exist and are not already trashed

  bucketNums.forEach(seq => {
    bucketData[seq].messages.forEach(msg => {
      bucketData[seq].filters.push({
        messages: {
          $elemMatch: { _id: msg._id, 'trash.trashed': false, saved: msg.saved }
        }
      });
    });
  });

  const bucketQueries = bucketNums.map(seq =>
    InboxBucket.findOneAndUpdate(
      {
        $and: [
          { seq },
          { profile: req.user.profile._id },
          ...bucketData[seq].filters
        ]
      },
      {
        $set: {
          'messages.$[el].trash': {
            trashed: true,
            dateTrashed: trashDate
          },
          'messages.$[el].saved': false
        }
      },
      {
        arrayFilters: [
          { 'el._id': { $in: bucketData[seq].messages.map(msg => msg._id) } }
        ],
        new: true,
        lean: true
      }
    )
  );

  let buckets = await Promise.all(bucketQueries);
  buckets = buckets.filter(bucket => bucket); // remove null buckets, TODO: collapse into 1 line?
  const changed = {};
  let trashFlipsTotal = 0;
  let savedFlipsTotal = 0;
  buckets.forEach(bucket => {
    changed[bucket.seq] = true;
    trashFlipsTotal += bucketData[bucket.seq].trashFlips;
    savedFlipsTotal += bucketData[bucket.seq].savedFlips;
  });

  buckets.forEach(bucket => {
    let oldest;
    bucket.messages.forEach(msg => {
      if (msg.trash.trashed) {
        if (!oldest) oldest = msg.trash.dateTrashed;
        else
          oldest =
            msg.trash.dateTrashed < oldest ? msg.trash.dateTrashed : oldest;
      }
    });
    bucketData[bucket.seq].trashOldest = oldest;
  });

  const bucketIncUpdates = {};
  Object.entries(bucketData).forEach(([seq, update]) => {
    if (changed[seq]) {
      bucketIncUpdates[`mailbox.buckets.inbox.${seq}.numTrashed`] =
        update.trashFlips;
      bucketIncUpdates[
        `mailbox.buckets.inbox.${seq}.numSaved`
      ] = -update.savedFlips;
    }
  });

  const trashDateUpdates = {};
  Object.keys(bucketData).forEach(seq => {
    if (changed[seq])
      trashDateUpdates[`mailbox.buckets.inbox.${seq}.trashOldest`] =
        bucketData[seq].trashOldest;
  });

  await Profile.updateOne(
    { _id: req.user.profile._id },
    {
      $inc: {
        'mailbox.numTrashed': trashFlipsTotal,
        'mailbox.numSaved': -savedFlipsTotal,
        'mailbox.numInbox': -(trashFlipsTotal - savedFlipsTotal),
        ...bucketIncUpdates
      },
      $set: {
        ...trashDateUpdates
      }
    }
  );

  res.status(200).json({
    status: 'success'
  });
};

const untrashMessages = async (req, res) => {
  const { targets } = req.body;

  const bucketNums = Object.keys(targets); // ['3', '1']
  const bucketData = {};
  bucketNums.forEach(seq => {
    bucketData[seq] = {
      trashFlips: 0, // num messages sent to trash
      messages: [], // {_id, saved}
      filters: [],
      trashOldest: null
    };
  });

  bucketNums.forEach(seq => {
    targets[seq].forEach(msg => {
      bucketData[seq].messages.push({ _id: msg._id });
      bucketData[seq].trashFlips += 1;
    });
  });

  bucketNums.forEach(seq => {
    bucketData[seq].messages.forEach(msg => {
      bucketData[seq].filters.push({
        messages: {
          $elemMatch: { _id: msg._id, 'trash.trashed': true }
        }
      });
    });
  });

  const bucketQueries = bucketNums.map(seq =>
    InboxBucket.findOneAndUpdate(
      {
        $and: [
          { seq },
          { profile: req.user.profile._id },
          ...bucketData[seq].filters
        ]
      },
      {
        $set: {
          'messages.$[el].trash': {
            trashed: false,
            dateTrashed: undefined
          },
          'messages.$[el].saved': false // should be false already
        }
      },
      {
        arrayFilters: [
          { 'el._id': { $in: bucketData[seq].messages.map(msg => msg._id) } }
        ],
        new: true,
        lean: true
      }
    )
  );

  let buckets = await Promise.all(bucketQueries);
  buckets = buckets.filter(bucket => bucket); // remove null buckets, TODO: collapse into 1 line?
  const changed = {};
  let trashFlipsTotal = 0;
  buckets.forEach(bucket => {
    changed[bucket.seq] = true;
    trashFlipsTotal += bucketData[bucket.seq].trashFlips;
  });

  buckets.forEach(bucket => {
    let oldest;
    bucket.messages.forEach(msg => {
      if (msg.trash.trashed) {
        if (!oldest) oldest = msg.trash.dateTrashed;
        else
          oldest =
            msg.trash.dateTrashed < oldest ? msg.trash.dateTrashed : oldest;
      }
    });
    bucketData[bucket.seq].trashOldest = oldest;
  });

  const bucketIncUpdates = {};
  Object.entries(bucketData).forEach(([seq, update]) => {
    if (changed[seq]) {
      bucketIncUpdates[
        `mailbox.buckets.inbox.${seq}.numTrashed`
      ] = -update.trashFlips;
    }
  });

  const trashDateUpdates = {};
  Object.keys(bucketData).forEach(seq => {
    if (changed[seq])
      trashDateUpdates[`mailbox.buckets.inbox.${seq}.trashOldest`] =
        bucketData[seq].trashOldest;
  });

  await Profile.updateOne(
    { _id: req.user.profile._id },
    {
      $inc: {
        'mailbox.numTrashed': -trashFlipsTotal,
        'mailbox.numInbox': trashFlipsTotal,
        ...bucketIncUpdates
      },
      $set: {
        ...trashDateUpdates
      }
    }
  );

  res.status(200).json({
    status: 'success'
  });
};

exports.handleTrash = catchAsync(async (req, res, next) => {
  const { undo } = req.query; // ?undo=true on endpoint untrashes mail
  try {
    if (undo && undo.toLowerCase() === 'true') await untrashMessages(req, res);
    else await trashMessages(req, res);
  } catch (err) {
    return next(new AppError('Something went wrong.', 500));
  }
});

const markRead = async (req, res) => {
  res.status(200).json({ status: 'success' });
};
const markUnread = async (req, res) => {
  res.status(200).json({ status: 'success' });
};
const markSaved = async (req, res) => {
  res.status(200).json({ status: 'success' });
};
const markUnsaved = async (req, res) => {
  res.status(200).json({ status: 'success' });
};

exports.validateMark = (req, res, next) => {
  const error = new AppError(
    'Invalid query string. Use exactly one of ?read=true, ?read=false, ?saved=true, ?saved=false.',
    400
  );
  const { read, saved } = req.query;

  if (read && saved) return next(error);
  if (!read && !saved) return next(error);
  if (read && read.toLowerCase() !== 'true' && read.toLowerCase() !== 'false')
    return next(error);
  if (
    saved &&
    saved.toLowerCase() !== 'true' &&
    saved.toLowerCase() !== 'false'
  )
    return next(error);

  next();
};

exports.handleMark = catchAsync(async (req, res, next) => {
  const { read, saved } = req.query; // strings 'true' or 'false'
  try {
    if (read) {
      switch (read.toLowerCase()) {
        case 'true':
          await markRead(req, res, next);
          break;
        case 'false':
          await markUnread(req, res, next);
          break;
      }
    } else {
      switch (saved.toLowerCase()) {
        case 'true':
          await markSaved(req, res, next);
          break;
        case 'false':
          await markUnsaved(req, res, next);
          break;
      }
    }
  } catch (err) {
    return next(new AppError('Something went wrong.', 500));
  }
});

/** SENDING MAIL */

const updateSpools = async (group, spoolMessage, profiles, profileLinks) => {
  let done = false; // flip to signal finished
  let seq = 0;
  let spoolRefLast;
  let spoolBucket;
  let spoolProfiles = profiles;

  // entry point is most recent bucket
  [spoolBucket] = await SpoolBucket.find({ group })
    .sort({ seq: -1 })
    .limit(1)
    .lean();

  if (spoolBucket) {
    seq = spoolBucket.seq;
    spoolRefLast = spoolBucket.previousBucket; // will be needed if a new bucket is required
    spoolProfiles = spoolBucket.profiles;
  } else {
    seq = 0; // create first bucket on the next loop
    spoolRefLast = null; // first bucket in the sequence has no previous bucket
  }

  while (!done) {
    try {
      /**
       * If a bucket is available, push in the message.
       * If a match isn't found (i.e. that seq bucket is full, having 50 messages), the attempt to upsert
       * will fail since seq is a unique field. In that case, the catch block will increment seq and we move
       * up the bucket chain to try again.
       */
      spoolBucket = await SpoolBucket.findOneAndUpdate(
        {
          group,
          seq,
          // $expr: { $lt: [{ $size: '$messages' }, 50] }
          // messages: {$size: {$lt: 50}}
          'messages.49': { $exists: false }
        },
        {
          $push: {
            messages: spoolMessage
          },
          seq,
          profiles: spoolProfiles,
          profileLinks,
          previousBucket: spoolRefLast
        },
        {
          new: true,
          lean: true,
          upsert: true
        }
      );

      // execution reaches here if update succeeds
      done = true;
      spoolRefLast = spoolBucket._id; // new bucket reference to return
    } catch (err) {
      if (err.code !== 11000) throw err;

      // here if bucket size exceeded
      spoolBucket = await SpoolBucket.findOne({
        group,
        seq
      }).lean();

      spoolRefLast = spoolBucket._id;

      seq += 1; // move to next bucket
    }
  }

  return spoolRefLast;
};

const updateBuckets = async (modelName, profile_id, message) => {
  let done = false; // flip to signal finished
  let seq = 0;
  let pos; // array index of newly inserted message
  // let bucket;

  // entry point is most recent bucket
  const [bucket] = await mongoose
    .model(modelName)
    .find({ profile: profile_id })
    .sort({ seq: -1 })
    .limit(1);

  if (bucket) {
    seq = bucket.seq;
  } else {
    seq = 0; // create first bucket on the next loop
  }

  while (!done) {
    try {
      /**
       * If a bucket is available, push in the message.
       * If a match isn't found (i.e. that seq bucket is full, having 50 messages), the attempt to upsert
       * will fail since seq is a unique field. In that case, the catch block will increment seq and we move
       * up the bucket chain to try again.
       */
      const bucketResult = await mongoose.model(modelName).findOneAndUpdate(
        {
          profile: profile_id,
          seq,
          'messages.49': { $exists: false }
        },
        {
          profile: profile_id,
          seq,
          $push: {
            messages: message
          }
        },
        {
          new: true,
          lean: true,
          upsert: true,
          setDefaultsOnInsert: true,
          runValidators: true
        }
      );

      // execution reaches here if update succeeds
      pos = bucketResult.messages.length - 1;
      done = true;
    } catch (err) {
      if (err.code !== 11000) throw err;

      // here if bucket size exceeded
      seq += 1; // move to next bucket
    }
  }

  return [seq, pos];
};

const updateOutboxBuckets = async (profile_id, message) => {
  const [bucketNum, messageIndex] = await updateBuckets(
    'OutboxBucket',
    profile_id,
    message
  );

  // if a new bucket was created
  if (messageIndex === 0) {
    await Profile.findByIdAndUpdate(profile_id, {
      $inc: { 'mailbox.numSent': 1 },
      $push: {
        'mailbox.buckets.outbox': { size: 1, numDeleted: 0 }
      }
    });
    return;
  }

  // otherwise not the first bucket message
  let done = false;
  while (!done) {
    try {
      await Profile.findByIdAndUpdate(profile_id, {
        $inc: {
          'mailbox.numSent': 1,
          [`mailbox.buckets.outbox.${bucketNum}.size`]: 1
        }
      });

      done = true;
    } catch (err) {
      // almost certainly will never reach here, but we loop in case of concurrency issues where the new array element is not yet created
    }
  }
};

const updateInboxBuckets = async (recip, message) => {
  const [bucketNum, messageIndex] = await updateBuckets(
    'InboxBucket',
    recip.get('_id', String),
    message
  );

  // if a new bucket was created
  if (messageIndex === 0) {
    await recip.update({
      $inc: { 'mailbox.numInbox': 1, 'mailbox.numUnread': 1 },
      $push: {
        'mailbox.buckets.inbox': {
          size: 1,
          numSaved: 0,
          numTrashed: 0,
          numDeleted: 0
        }
      }
    });
    return;
  }

  // otherwise not the first bucket message
  let done = false;
  while (!done) {
    try {
      await recip.update({
        $inc: {
          'mailbox.numInbox': 1,
          'mailbox.numUnread': 1,
          [`mailbox.buckets.inbox.${bucketNum}.size`]: 1
        }
      });

      done = true;
    } catch (err) {
      // almost certainly will never reach here, but we loop in case of concurrency issues where the new array element is not yet created
    }
  }
};

// a 'fan-out-on-write' esque implementation
exports.sendMessage = catchAsync(async (req, res, next) => {
  const { recipients } = req; // prepared in message validation middleware

  const from = {
    profileId: req.user.profile.id,
    profile: req.user.profile._id,
    archived: {
      displayName: req.user.profile.displayName
    }
  };
  const to = recipients.map(recip => ({
    profileId: recip.get('id'),
    profile: recip.get('_id', String),
    archived: {
      displayName: recip.get('displayName')
    }
  }));

  const spoolProfiles = to.find(recip => recip.profileId === from.profileId)
    ? to
    : to.concat(from);

  // ordered profile IDs without duplication to identify the spool
  let group = [...req.body.to, req.user.profile.id];
  group = Array.from(new Set(group));
  group = group.sort((n1, n2) => {
    if (n1 < n2) return -1;
    if (n1 === n2) return 0;
    return 1;
  });

  // profileLinks array is used to track living profiles with a connection to the spool
  let profileLinks = recipients.map(recip => recip.get('id'));
  profileLinks.push(req.user.profile.id);
  profileLinks = Array.from(new Set(profileLinks));

  let message = {
    from: req.user.profile.id,
    subject: req.body.subject,
    body: req.body.body
  };

  // CREATE SPOOL MESSAGE FIRST SO THAT INBOX/OUTBOX MESSAGES CAN REFERENCE THE SPOOL BUCKET
  const spoolRef = await updateSpools(
    group,
    message,
    spoolProfiles,
    profileLinks
  );

  // UPDATE SENDER OUTBOX AND RECIPIENT INBOX BUCKETS

  message = {
    to,
    from,
    subject: req.body.subject,
    body: req.body.body,
    spoolBucket: spoolRef
  };

  try {
    const tasks = [];
    // update outbox and profile of sender
    tasks.push(updateOutboxBuckets(req.user.profile._id, message));
    // update inboxes and profiles of recipients
    recipients.forEach(recip => tasks.push(updateInboxBuckets(recip, message)));

    await Promise.all(tasks);
  } catch (err) {
    console.log(err);
  }

  res.status(200).json({
    status: 'success'
  });
});

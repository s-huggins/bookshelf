/* eslint-disable no-await-in-loop, no-param-reassign, camelcase */
const mongoose = require('mongoose');
const catchAsync = require('../../utils/asyncErrorWrapper');
const InboxBucket = require('../../models/InboxBucket');
const OutboxBucket = require('../../models/OutboxBucket');
const SpoolGroup = require('../../models/SpoolGroup');
const AppError = require('../../utils/AppError');
const SpoolBucket = require('../../models/SpoolBucket');
const Profile = require('../../models/Profile');
// const AppError = require('../../utils/AppError');
const { Folder } = require('./controllerTypes');

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
  // prepare pipeline stages
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
      bucket_id: { $first: '$bucket_id' },
      spoolGroup: { $first: '$spoolGroup' }
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
      bucket_id: { $first: '$bucket_id' },
      spoolGroup: { $first: '$spoolGroup' }
    };
  }

  // return handler for each folder type
  return catchAsync(async (req, res) => {
    if (folder === Folder.trash)
      await cleanTrash(req.user.profile.profile_id, req.user.profile.mailbox);

    const { skip, limit } = req.query;

    const mailBuckets = selectBuckets(req.user.profile.mailbox);
    const [targetBuckets, messagesToSkip] = findBuckets(
      folder,
      mailBuckets,
      skip,
      limit
    );

    // const messages = await bucketModel
    //   .aggregate()
    //   .match({
    //     profile: req.user.profile._id,
    //     seq: { $in: targetBuckets }
    //   })
    //   .sort({ seq: -1 }) // sorts most recent first
    //   .project({ __v: 0, profile: 0, dateBucketCreated: 0 })
    //   .unwind('$messages')
    //   .addFields({ 'messages.message_id': '$messages._id', bucket_id: '$_id' })
    //   .replaceRoot({
    //     $mergeObjects: ['$$ROOT', '$$ROOT.messages']
    //   })
    //   .project({ messages: 0 })
    //   .match(messageFilter)
    //   .sort({ dateCreated: -1 })
    //   .skip(messagesToSkip)
    //   .limit(limit)
    //   .lookup({
    //     from: 'profiles',
    //     let: { from_id: '$from.profile' },
    //     pipeline: [
    //       { $match: { $expr: { $eq: ['$_id', '$$from_id'] } } },
    //       { $project: { profileId: 1, displayName: 1, avatar_id: 1 } }
    //     ],
    //     as: 'from.profile'
    //   })
    //   .unwind({ path: '$from.profile', preserveNullAndEmptyArrays: true })
    //   .addFields({
    //     'from._id': '$from.profile._id',
    //     'from.displayName': '$from.profile.displayName',
    //     'from.avatar_id': '$from.profile.avatar_id'
    //   })
    //   .project({ 'from.profile': 0 })
    //   // .unwind('$to')
    //   .unwind({ path: '$to', preserveNullAndEmptyArrays: true })
    //   .project({ 'to._id': 0 })
    //   .lookup({
    //     from: 'profiles',
    //     let: { to_id: '$to.profile' },
    //     pipeline: [
    //       { $match: { $expr: { $eq: ['$_id', '$$to_id'] } } },
    //       { $project: { profileId: 1, displayName: 1, avatar_id: 1 } }
    //     ],
    //     as: 'to.profile'
    //   })
    //   .unwind({ path: '$to', preserveNullAndEmptyArrays: true })
    //   .addFields({
    //     'to._id': '$to.profile._id',
    //     'to.displayName': '$to.profile.displayName',
    //     'to.avatar_id': '$to.profile.avatar_id'
    //   })
    //   .project({ 'to.profile': 0 })
    //   .lookup({
    //     from: 'spoolgroups',
    //     let: { group_id: '$spoolGroup' },
    //     pipeline: [
    //       { $match: { $expr: { $eq: ['$_id', '$$group_id'] } } },
    //       { $project: { newestSpoolBucket: 1, messagesTotal: 1 } }
    //     ],
    //     as: 'spoolGroup'
    //   })
    //   .unwind('$spoolGroup')
    //   .group(groupStage)
    //   .sort({ dateCreated: -1 });

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
      .unwind({ path: '$from.profile', preserveNullAndEmptyArrays: true })
      .addFields({
        'from._id': '$from.profile._id',
        'from.displayName': '$from.profile.displayName',
        'from.avatar_id': '$from.profile.avatar_id'
      })
      .project({ 'from.profile': 0 })
      // .unwind('$to')
      .unwind({ path: '$to', preserveNullAndEmptyArrays: true })
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
      .unwind({ path: '$to', preserveNullAndEmptyArrays: true })
      .unwind('$to.profile')
      .addFields({
        'to._id': '$to.profile._id',
        'to.displayName': '$to.profile.displayName',
        'to.avatar_id': '$to.profile.avatar_id'
      })
      .project({ 'to.profile': 0 })
      .lookup({
        from: 'spoolgroups',
        let: { group_id: '$spoolGroup' },
        pipeline: [
          { $match: { $expr: { $eq: ['$_id', '$$group_id'] } } },
          { $project: { newestSpoolBucket: 1, messagesTotal: 1 } }
        ],
        as: 'spoolGroup'
      })
      .unwind('$spoolGroup')
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

exports.fetchSpool = catchAsync(async (req, res, next) => {
  const { skip, limit } = req.query;
  const { groupId } = req.params;

  const spoolGroup = await SpoolGroup.findById(groupId).lean(true);
  if (!spoolGroup) return next(new AppError('Spool group not found.', 404));

  if (
    !spoolGroup.group
      .split(':')
      .slice(1, -1)
      .includes(`${req.user.profile.id}`)
  )
    return next(new AppError('You are not part of this spool.', 401));

  const { messagesTotal, newestSpoolBucket } = spoolGroup;
  const seqHigh = newestSpoolBucket.seq;
  const newestBucketSize = messagesTotal - seqHigh * 50;
  // if skip >= messagesTotal ?

  // num buckets to skip: floor(skip/50) = numSkip
  // newestSpoolBucket.seq - numSkip = start bucket
  // num skips in first visited bucket: skip - (50*numSkip)
  // buckets with seq value < seqHigh have size 50

  let bucketSkips = 0;
  let skipped = 0;
  if (skip >= newestBucketSize) {
    bucketSkips = 1; // skip the newest bucket
    skipped += newestBucketSize; // can be anything from 1 - 50
    const remainingMessageSkips = skip - newestBucketSize;
    const remainingBucketSkips = Math.floor(remainingMessageSkips / 50);
    bucketSkips += remainingBucketSkips;
    skipped += remainingBucketSkips * 50; // older buckets have exactly 50 messages
  }

  const startingBucket = seqHigh - bucketSkips; // bucket sequence descends from latest bucket
  const visits = [startingBucket, startingBucket - 1, startingBucket - 2]; // visiting 3 is always sufficient for max 100 messages
  const remainingSkips = skip - skipped; // remaining skips to apply on starting bucket

  let messages = await SpoolBucket.aggregate()
    .match({
      spoolGroup: spoolGroup._id,
      seq: { $in: visits }
    })
    .unwind('$profiles')
    .lookup({
      from: 'profiles',
      let: { profileId: '$profiles.profile' },
      pipeline: [
        { $match: { $expr: { $eq: ['$_id', '$$profileId'] } } },
        { $project: { profileId: 1, displayName: 1, avatar_id: 1 } }
      ],
      as: 'profiles.profile'
    })
    .unwind({ path: '$profiles.profile', preserveNullAndEmptyArrays: true })
    // .addFields({
    //   'profiles._id': '$profiles.profile._id',
    //   'profiles.displayName': '$profiles.profile.displayName',
    //   'profiles.avatar_id': '$profiles.profile.avatar_id'
    // })
    .group({
      _id: '$_id',
      seq: { $first: '$seq' },
      spoolGroup: { $first: '$spoolGroup' },
      messages: { $first: '$messages' },
      profiles: { $addToSet: '$profiles' }
    })
    .sort({ seq: -1 })
    .unwind('$messages')
    .sort({ 'messages.dateCreated': -1 })
    .skip(remainingSkips)
    .limit(limit)
    .addFields({
      'messages.spoolBucket_id': '$_id',
      'messages.spoolBucketSeq': '$seq'
    })
    .lookup({
      from: 'spoolgroups',
      let: { groupId: '$spoolGroup' },
      pipeline: [
        { $match: { $expr: { $eq: ['$_id', '$$groupId'] } } },
        { $project: { messagesTotal: 1 } }
      ],
      as: 'groupData'
    })
    .unwind('$groupData')
    .project({ _id: 0, 'profiles._id': 0 })

    .group({
      _id: '$spoolGroup',
      spoolGroup: { $first: '$spoolGroup' },
      profiles: { $first: '$profiles' },
      messages: { $addToSet: '$messages' },
      groupData: { $first: '$groupData' }
    });

  // sort messages from most recent first
  [messages] = messages;
  messages.messages.sort(
    (msg1, msg2) => new Date(msg2.dateCreated) - new Date(msg1.dateCreated)
  );

  return res.status(200).json({
    status: 'success',
    data: {
      messages
    }
  });
});

exports.fetchInboxMessage = catchAsync(async (req, res, next) => {
  const { seq, messageId } = req.params;

  const [message] = await InboxBucket.aggregate()
    .match({
      profile: req.user.profile._id,
      seq: +seq
    })
    .unwind('$messages')
    .match({
      'messages._id': mongoose.Types.ObjectId(messageId)
    })
    .addFields({ 'messages.message_id': '$messages._id', bucket_id: '$_id' })
    .replaceRoot({
      $mergeObjects: ['$$ROOT', '$$ROOT.messages']
    })
    .project({ __v: 0, messages: 0 })
    .lookup({
      from: 'profiles',
      let: { from_id: '$from.profile' },
      pipeline: [
        { $match: { $expr: { $eq: ['$_id', '$$from_id'] } } },
        { $project: { profileId: 1, displayName: 1, avatar_id: 1 } }
      ],
      as: 'from.profile'
    })
    .unwind({ path: '$from.profile', preserveNullAndEmptyArrays: true })
    .addFields({
      'from._id': '$from.profile._id',
      'from.displayName': '$from.profile.displayName',
      'from.avatar_id': '$from.profile.avatar_id'
    })
    .project({ 'from.profile': 0 })
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
    .unwind('$to.profile')
    .addFields({
      'to._id': '$to.profile._id',
      'to.displayName': '$to.profile.displayName',
      'to.avatar_id': '$to.profile.avatar_id'
    })
    .project({ 'to.profile': 0 })
    .lookup({
      from: 'spoolgroups',
      let: { group_id: '$spoolGroup' },
      pipeline: [
        { $match: { $expr: { $eq: ['$_id', '$$group_id'] } } },
        { $project: { newestSpoolBucket: 1, messagesTotal: 1 } }
      ],
      as: 'spoolGroup'
    })
    .unwind('$spoolGroup')
    .group({
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
      bucket_id: { $first: '$bucket_id' },
      spoolGroup: { $first: '$spoolGroup' }
    });

  if (!message) return next(new AppError('Message not found.', 404));

  // find 'next' and 'previous' IDs & inbox seq values
  // go forwards/backwards through inbox bucket sequence looking for messages with same spoolGroup

  const [nextMessage, previousMessage] = await Promise.all([
    findInboxNext(req.user.profile._id, message),
    findInboxPrevious(req.user.profile._id, message)
  ]);

  message.nextMessage = nextMessage;
  message.previousMessage = previousMessage;

  res.status(200).json({
    status: 'success',
    data: {
      message
      // nextMessage,
      // previousMessage
    }
  });
});

const findInboxNext = async (_idProfile, message) => {
  const [nextMessageData] = await InboxBucket.aggregate()
    .match({
      profile: _idProfile,
      seq: { $gte: message.seq },
      messages: {
        $elemMatch: {
          dateCreated: { $gt: new Date(message.dateCreated) },
          spoolGroup: message.spoolGroup._id
        }
      }
    })
    .unwind('$messages')
    .match({
      'messages.dateCreated': { $gt: new Date(message.dateCreated) },
      // 'messages.deleted': false,
      'messages.spoolGroup': message.spoolGroup._id
    })
    .sort({ 'messages.dateCreated': 1 })
    .limit(1)
    .project({ 'messages._id': 1, seq: 1 })
    .addFields({ _id: '$messages._id' })
    .project({ messages: 0 });

  return nextMessageData;
};

const findInboxPrevious = async (_idProfile, message) => {
  const [prevMessageData] = await InboxBucket.aggregate()
    .match({
      profile: _idProfile,
      seq: { $lte: message.seq },
      messages: {
        $elemMatch: {
          dateCreated: { $lt: new Date(message.dateCreated) },
          spoolGroup: message.spoolGroup._id
        }
      }
    })
    .unwind('$messages')
    .match({
      'messages.dateCreated': { $lt: new Date(message.dateCreated) },
      // 'messages.deleted': false,
      'messages.spoolGroup': message.spoolGroup._id
    })
    .sort({ 'messages.dateCreated': -1 })
    .limit(1)
    .project({ 'messages._id': 1, seq: 1 })
    .addFields({ _id: '$messages._id' })
    .project({ messages: 0 });
  return prevMessageData;
};

exports.fetchOutboxMessage = catchAsync(async (req, res, next) => {
  const { seq, messageId } = req.params;

  const [message] = await OutboxBucket.aggregate()
    .match({
      profile: req.user.profile._id,
      seq: +seq
    })
    .unwind('$messages')
    .match({
      'messages._id': mongoose.Types.ObjectId(messageId)
    })
    .addFields({ 'messages.message_id': '$messages._id', bucket_id: '$_id' })
    .replaceRoot({
      $mergeObjects: ['$$ROOT', '$$ROOT.messages']
    })
    .project({ __v: 0, messages: 0 })
    .lookup({
      from: 'profiles',
      let: { from_id: '$from.profile' },
      pipeline: [
        { $match: { $expr: { $eq: ['$_id', '$$from_id'] } } },
        { $project: { profileId: 1, displayName: 1, avatar_id: 1 } }
      ],
      as: 'from.profile'
    })
    .unwind('$from.profile')
    .addFields({
      'from._id': '$from.profile._id',
      'from.displayName': '$from.profile.displayName',
      'from.avatar_id': '$from.profile.avatar_id'
    })
    .project({ 'from.profile': 0 })
    // .unwind('$to')
    .unwind({ path: '$to', preserveNullAndEmptyArrays: true })
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
    // .unwind('$to.profile')
    .unwind({ path: '$to', preserveNullAndEmptyArrays: true })
    .unwind({ path: '$to.profile', preserveNullAndEmptyArrays: true })
    .addFields({
      'to._id': '$to.profile._id',
      'to.displayName': '$to.profile.displayName',
      'to.avatar_id': '$to.profile.avatar_id'
    })
    .project({ 'to.profile': 0 })
    .lookup({
      from: 'spoolgroups',
      let: { group_id: '$spoolGroup' },
      pipeline: [
        { $match: { $expr: { $eq: ['$_id', '$$group_id'] } } },
        { $project: { newestSpoolBucket: 1, messagesTotal: 1 } }
      ],
      as: 'spoolGroup'
    })
    .unwind('$spoolGroup')
    .group({
      _id: '$message_id',
      from: { $first: '$from' },
      to: { $addToSet: '$to' },
      subject: { $first: '$subject' },
      body: { $first: '$body' },
      spoolBucket: { $first: '$spoolBucket' },
      dateCreated: { $first: '$dateCreated' },
      seq: { $first: '$seq' },
      message_id: { $first: '$message_id' },
      bucket_id: { $first: '$bucket_id' },
      spoolGroup: { $first: '$spoolGroup' },
      deleted: { $first: '$deleted' }
    });

  if (!message) return next(new AppError('Message not found.', 404));

  const [nextMessage, previousMessage] = await Promise.all([
    findOutboxNext(req.user.profile._id, message),
    findOutboxPrevious(req.user.profile._id, message)
  ]);

  message.nextMessage = nextMessage;
  message.previousMessage = previousMessage;

  res.status(200).json({
    status: 'success',
    data: {
      message
      // nextMessage,
      // previousMessage
    }
  });
});

const findOutboxNext = async (_idProfile, message) => {
  const [nextMessageData] = await OutboxBucket.aggregate()
    .match({
      profile: _idProfile,
      seq: { $gte: message.seq },
      messages: {
        $elemMatch: {
          dateCreated: { $gt: new Date(message.dateCreated) },
          spoolGroup: message.spoolGroup._id
        }
      }
    })
    .unwind('$messages')
    .match({
      'messages.dateCreated': { $gt: new Date(message.dateCreated) },
      // 'messages.deleted': false,
      'messages.spoolGroup': message.spoolGroup._id
    })
    .sort({ 'messages.dateCreated': 1 })
    .limit(1)
    .project({ 'messages._id': 1, seq: 1 })
    .addFields({ _id: '$messages._id' })
    .project({ messages: 0 });

  return nextMessageData;
};

const findOutboxPrevious = async (_idProfile, message) => {
  const [prevMessageData] = await OutboxBucket.aggregate()
    .match({
      profile: _idProfile,
      seq: { $lte: message.seq },
      messages: {
        $elemMatch: {
          dateCreated: { $lt: new Date(message.dateCreated) },
          spoolGroup: message.spoolGroup._id
        }
      }
    })
    .unwind('$messages')
    .match({
      'messages.dateCreated': { $lt: new Date(message.dateCreated) },
      // 'messages.deleted': false,
      'messages.spoolGroup': message.spoolGroup._id
    })
    .sort({ 'messages.dateCreated': -1 })
    .limit(1)
    .project({ 'messages._id': 1, seq: 1 })
    .addFields({ _id: '$messages._id' })
    .project({ messages: 0 });
  return prevMessageData;
};

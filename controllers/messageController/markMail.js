/* eslint-disable default-case */
const AppError = require('../../utils/AppError');
const catchAsync = require('../../utils/asyncErrorWrapper');
const InboxBucket = require('../../models/InboxBucket');
const Profile = require('../../models/Profile');

/* MARK READ */

const updateReadMark = async (newMark, req, res) => {
  const { targets } = req.body;
  const bucketNums = Object.keys(targets); // ['0', '1', ...]
  const bucketData = {};
  let markFlipsTotal = 0;
  const currentMark = !newMark;

  bucketNums.forEach(seq => {
    bucketData[seq] = {
      messageIds: [],
      filters: [],
      markFlips: 0
    };

    targets[seq].forEach(msg => {
      bucketData[seq].messageIds.push(msg._id);
      const filter = {
        messages: {
          $elemMatch: { _id: msg._id, read: currentMark }
        }
      };
      bucketData[seq].filters.push(filter);
      bucketData[seq].markFlips += 1;
    });
  });

  const queries = bucketNums.map(seq =>
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
          'messages.$[el].read': newMark
        }
      },
      {
        arrayFilters: [{ 'el._id': { $in: bucketData[seq].messageIds } }],
        new: true,
        lean: true
      }
    )
  );

  const buckets = await Promise.all(queries);
  buckets.forEach(bucket => {
    if (bucket) {
      markFlipsTotal += bucketData[bucket.seq].markFlips;
    }
  });

  // if (markFlipsTotal > 0) {
  //   const incValue = newMark ? -markFlipsTotal : markFlipsTotal;
  //   await Profile.findByIdAndUpdate(req.user.profile._id, {
  //     $inc: {
  //       'mailbox.numUnread': incValue
  //     }
  //   });
  // }

  const incValue = newMark ? -markFlipsTotal : markFlipsTotal;
  const { mailbox } = await Profile.findOneAndUpdate(
    {
      _id: req.user.profile._id
    },
    {
      $inc: {
        'mailbox.numUnread': incValue
      }
    },
    {
      new: true,
      lean: true,
      select: 'mailbox'
    }
  );

  res.status(200).json({ status: 'success', data: { mailbox } });
};

exports.handleMarkRead = catchAsync(async (req, res, next) => {
  const { undo } = req.query;
  try {
    if (undo && undo.toLowerCase() === 'true') {
      await updateReadMark(false, req, res, next);
    } else {
      await updateReadMark(true, req, res, next);
    }
  } catch (err) {
    return next(new AppError('Something went wrong.', 500));
  }
});

/* MARK SAVED */

const updateSavedMark = async (newMark, req, res) => {
  // saving inbox mail: numSaved ^ numInbox v
  // saving trashed mail: numSaved ^ numTrashed v
  // unsaving saved mail: numSaved v numInbox ^

  const { targets } = req.body;
  const bucketNums = Object.keys(targets); // ['0', '1', ...]
  const bucketData = {};
  let savedFlipsTotal = 0;
  let trashFlipsTotal = 0;
  const currentMark = !newMark;

  bucketNums.forEach(seq => {
    bucketData[seq] = {
      messages: [],
      filters: [],
      markFlips: 0,
      trashFlips: 0
    };

    targets[seq].forEach(msg => {
      bucketData[seq].messages.push({ _id: msg._id, trashed: msg.trashed });
      const filter = {
        messages: {
          $elemMatch: {
            _id: msg._id,
            saved: currentMark,
            'trash.trashed': msg.trashed
          }
        }
      };
      bucketData[seq].filters.push(filter);
      bucketData[seq].markFlips += 1;
      if (msg.trashed) bucketData[seq].trashFlips += 1;
    });
  });

  const queries = bucketNums.map(seq =>
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
          'messages.$[el].saved': newMark,
          'messages.$[el].trash.trashed': false, // in case message was in trash
          'messages.$[el].trash.dateTrashed': null // in case message was in trash
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

  const buckets = await Promise.all(queries);
  const bucketIncUpdates = {};
  const bucketDateUpdates = {};
  buckets.forEach(bucket => {
    if (bucket) {
      savedFlipsTotal += bucketData[bucket.seq].markFlips;
      trashFlipsTotal += bucketData[bucket.seq].trashFlips;

      const { seq } = bucket;
      const multiplier = newMark ? 1 : -1;
      bucketIncUpdates[`mailbox.buckets.inbox.${seq}.numSaved`] =
        multiplier * bucketData[seq].markFlips;
      bucketIncUpdates[`mailbox.buckets.inbox.${seq}.numTrashed`] = -bucketData[
        seq
      ].trashFlips;

      let trashOldest;
      bucket.messages.forEach(msg => {
        if (msg.trash.trashed) {
          if (!trashOldest) trashOldest = msg.trash.dateTrashed;
          else if (msg.trash.dateTrashed < trashOldest)
            trashOldest = msg.trash.dateTrashed;
        }
      });

      bucketDateUpdates[
        `mailbox.buckets.inbox.${seq}.trashOldest`
      ] = trashOldest;
    }
  });

  // if (savedFlipsTotal > 0) {
  //   const savedInc = newMark ? savedFlipsTotal : -savedFlipsTotal;
  //   const trashedInc = -trashFlipsTotal;
  //   const inboxInc = newMark
  //     ? -(savedFlipsTotal - trashFlipsTotal)
  //     : savedFlipsTotal - trashFlipsTotal;
  //   await Profile.findByIdAndUpdate(req.user.profile._id, {
  //     $inc: {
  //       'mailbox.numSaved': savedInc,
  //       'mailbox.numTrashed': trashedInc,
  //       'mailbox.numInbox': inboxInc,
  //       ...bucketIncUpdates
  //     },
  //     $set: {
  //       ...bucketDateUpdates
  //     }
  //   });
  // }

  const savedInc = newMark ? savedFlipsTotal : -savedFlipsTotal;
  const trashedInc = -trashFlipsTotal;
  const inboxInc = newMark
    ? -(savedFlipsTotal - trashFlipsTotal)
    : savedFlipsTotal - trashFlipsTotal;
  const { mailbox } = await Profile.findOneAndUpdate(
    { _id: req.user.profile._id },
    {
      $inc: {
        'mailbox.numSaved': savedInc,
        'mailbox.numTrashed': trashedInc,
        'mailbox.numInbox': inboxInc,
        ...bucketIncUpdates
      },
      $set: {
        ...bucketDateUpdates
      }
    },
    {
      new: true,
      lean: true,
      select: 'mailbox'
    }
  );

  res.status(200).json({ status: 'success', data: { mailbox } });
};

exports.handleMarkSaved = catchAsync(async (req, res, next) => {
  const { undo } = req.query;
  try {
    if (undo && undo.toLowerCase() === 'true') {
      await updateSavedMark(false, req, res, next);
    } else {
      await updateSavedMark(true, req, res, next);
    }
  } catch (err) {
    return next(new AppError('Something went wrong.', 500));
  }
});

const catchAsync = require('../../utils/asyncErrorWrapper');
const InboxBucket = require('../../models/InboxBucket');
const OutboxBucket = require('../../models/OutboxBucket');
const Profile = require('../../models/Profile');

exports.deleteTrash = catchAsync(async (req, res, next) => {
  const { targets } = req.body;

  // numTrashed v numDeleted ^
  // update numTrashed (prof mailbox)
  // update numUnread (prof mailbox)
  // update trashOldest (prof inbox buckets)
  // update numTrashed (prof inbox buckets)
  // update numDeleted (prof inbox buckets)
  // update trash.trashed, trash.dateTrashed (inboxbucket messages)
  // update saved, trash (inboxbucket messages)
  // update deleted (inboxbucket messages)

  const bucketNums = Object.keys(targets); // ['3', '1']
  const bucketData = {};
  bucketNums.forEach(seq => {
    bucketData[seq] = {
      numDeleted: 0, // num messages sent to trash
      numUnread: 0,
      messages: [],
      filters: [],
      trashOldest: null
    };
  });
  let deletedTotal = 0;
  let unreadTotal = 0;

  bucketNums.forEach(seq => {
    targets[seq].forEach(msg => {
      bucketData[seq].messages.push({ _id: msg._id, read: msg.read });
      bucketData[seq].numDeleted += 1;

      if (!msg.read) bucketData[seq].numUnread += 1;
    });
  });

  bucketNums.forEach(seq => {
    bucketData[seq].messages.forEach(msg => {
      bucketData[seq].filters.push({
        messages: {
          $elemMatch: {
            _id: msg._id,
            'trash.trashed': true,
            read: msg.read,
            deleted: false
          }
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
            dateTrashed: null
          },
          'messages.$[el].deleted': true
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
  buckets = buckets.filter(bucket => bucket);
  buckets.forEach(bucket => {
    deletedTotal += bucketData[bucket.seq].numDeleted;
    unreadTotal += bucketData[bucket.seq].numUnread;

    let oldest;
    bucket.messages.forEach(msg => {
      if (msg.trash.trashed) {
        if (!oldest) oldest = msg.trash.dateTrashed;
        else if (msg.trash.dateTrashed < oldest) oldest = msg.trash.dateTrashed;
      }
    });
    bucketData[bucket.seq].trashOldest = oldest;
  });

  const bucketIncUpdates = {};
  buckets.forEach(bucket => {
    const { seq } = bucket;
    bucketIncUpdates[`mailbox.buckets.inbox.${seq}.numTrashed`] = -bucketData[
      seq
    ].numDeleted;
    bucketIncUpdates[`mailbox.buckets.inbox.${bucket.seq}.numDeleted`] =
      bucketData[seq].numDeleted;
  });

  const trashDateUpdates = {};
  buckets.forEach(bucket => {
    const { seq } = bucket;
    trashDateUpdates[`mailbox.buckets.inbox.${seq}.trashOldest`] =
      bucketData[seq].trashOldest;
  });

  const { mailbox } = await Profile.findOneAndUpdate(
    { _id: req.user.profile._id },
    {
      $inc: {
        'mailbox.numTrashed': -deletedTotal,
        'mailbox.numUnread': -unreadTotal,
        ...bucketIncUpdates
      },
      $set: {
        ...trashDateUpdates
      }
    },
    {
      new: true,
      lean: true,
      select: 'mailbox'
    }
  );

  res.status(200).json({
    status: 'success',
    data: {
      mailbox
    }
  });
});

exports.deleteSent = catchAsync(async (req, res, next) => {
  const { targets } = req.body;

  const bucketNums = Object.keys(targets); // ['3', '1']
  const bucketData = {};
  bucketNums.forEach(seq => {
    bucketData[seq] = {
      numDeleted: 0, // num messages sent to trash
      messageIds: [],
      filters: []
    };
  });
  let deletedTotal = 0;

  bucketNums.forEach(seq => {
    targets[seq].forEach(msg => {
      bucketData[seq].messageIds.push(msg._id);
      bucketData[seq].numDeleted += 1;
    });
  });

  bucketNums.forEach(seq => {
    bucketData[seq].messageIds.forEach(_id => {
      bucketData[seq].filters.push({
        messages: {
          $elemMatch: { _id, deleted: false }
        }
      });
    });
  });

  const bucketQueries = bucketNums.map(seq =>
    OutboxBucket.findOneAndUpdate(
      {
        $and: [
          { seq },
          { profile: req.user.profile._id },
          ...bucketData[seq].filters
        ]
      },
      {
        $set: {
          'messages.$[el].deleted': true
        }
      },
      {
        arrayFilters: [{ 'el._id': { $in: bucketData[seq].messageIds } }],
        new: true,
        lean: true
      }
    )
  );

  let buckets = await Promise.all(bucketQueries);
  buckets = buckets.filter(bucket => bucket);
  buckets.forEach(bucket => {
    deletedTotal += bucketData[bucket.seq].numDeleted;
  });

  const bucketIncUpdates = {};
  buckets.forEach(bucket => {
    const { seq } = bucket;
    bucketIncUpdates[`mailbox.buckets.outbox.${bucket.seq}.numDeleted`] =
      bucketData[seq].numDeleted;
  });

  const { mailbox } = await Profile.findOneAndUpdate(
    { _id: req.user.profile._id },
    {
      $inc: {
        'mailbox.numSent': -deletedTotal,
        ...bucketIncUpdates
      }
    },
    {
      new: true,
      lean: true,
      select: 'mailbox'
    }
  );

  res.status(200).json({
    status: 'success',
    data: {
      mailbox
    }
  });
});

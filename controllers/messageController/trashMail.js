/*  */
const InboxBucket = require('../../models/InboxBucket');
const Profile = require('../../models/Profile');
const catchAsync = require('../../utils/asyncErrorWrapper');
const AppError = require('../../utils/AppError');

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

  // await Profile.updateOne(
  //   { _id: req.user.profile._id },
  //   {
  //     $inc: {
  //       'mailbox.numTrashed': trashFlipsTotal,
  //       'mailbox.numSaved': -savedFlipsTotal,
  //       'mailbox.numInbox': -(trashFlipsTotal - savedFlipsTotal),
  //       ...bucketIncUpdates
  //     },
  //     $set: {
  //       ...trashDateUpdates
  //     }
  //   }
  // );

  const { mailbox } = await Profile.findOneAndUpdate(
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
    },
    { new: true, lean: true, select: 'mailbox' }
  );

  res.status(200).json({
    status: 'success',
    data: {
      mailbox
    }
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

  const { mailbox } = await Profile.findOneAndUpdate(
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

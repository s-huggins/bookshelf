/* eslint-disable no-await-in-loop, camelcase */
const mongoose = require('mongoose');
const SpoolBucket = require('../../models/SpoolBucket');
const SpoolGroup = require('../../models/SpoolGroup');
const Profile = require('../../models/Profile');
const catchAsync = require('../../utils/asyncErrorWrapper');

const updateSpools = async (group_id, spoolMessage, profiles, profileLinks) => {
  let done = false; // flip to signal finished
  let seq = 0;
  let spoolRefFirst;
  let spoolRefLast;
  let spoolBucket;
  let spoolProfiles = profiles;

  // entry point is most recent bucket
  [spoolBucket] = await SpoolBucket.find({ spoolGroup: group_id })
    .sort({ seq: -1 })
    .limit(1)
    .lean();

  if (spoolBucket) {
    seq = spoolBucket.seq;
    spoolRefLast = spoolBucket.previousBucket; // will be needed if a new bucket is required
    spoolRefFirst = spoolBucket._id;
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
          spoolGroup: group_id,
          seq,
          'messages.49': { $exists: false }
        },
        {
          $push: {
            messages: spoolMessage
          },
          spoolGroup: group_id,
          seq,
          profiles: spoolProfiles,
          previousBucket: spoolRefLast
        },
        {
          new: true,
          lean: true,
          upsert: true,
          runValidators: true
        }
      );

      // execution reaches here if update succeeds
      done = true;
      // spoolRefLast = spoolBucket._id; // new bucket reference to return
    } catch (err) {
      if (err.code !== 11000) throw err;

      // here if bucket size exceeded
      if (spoolRefFirst) {
        // optimization
        spoolRefLast = spoolRefFirst;
        spoolRefFirst = null;
      } else {
        spoolBucket = await SpoolBucket.findOne({
          spoolGroup: group_id,
          seq
        }).lean();

        spoolRefLast = spoolBucket._id;
      }

      seq += 1; // move to next bucket
    }
  }

  return spoolBucket;
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

// const updateOutboxBuckets = async (profile_id, message) => {
//   const [bucketNum, messageIndex] = await updateBuckets(
//     'OutboxBucket',
//     profile_id,
//     message
//   );

//   // if a new bucket was created
//   if (messageIndex === 0) {
//     await Profile.findByIdAndUpdate(profile_id, {
//       $inc: { 'mailbox.numSent': 1 },
//       $push: {
//         'mailbox.buckets.outbox': { size: 1, numDeleted: 0, seq: bucketNum }
//       }
//     });
//     return;
//   }

//   // otherwise not the first bucket message
//   let done = false;
//   while (!done) {
//     try {
//       await Profile.findByIdAndUpdate(profile_id, {
//         $inc: {
//           'mailbox.numSent': 1,
//           [`mailbox.buckets.outbox.${bucketNum}.size`]: 1
//         }
//       });

//       done = true;
//     } catch (err) {
//       // almost certainly will never reach here, but we loop in case of concurrency issues where the new array element is not yet created
//     }
//   }
// };

const updateOutboxBuckets = async (profile_id, message) => {
  const [bucketNum, messageIndex] = await updateBuckets(
    'OutboxBucket',
    profile_id,
    message
  );

  // if a new bucket was created
  if (messageIndex === 0) {
    const { mailbox } = await Profile.findOneAndUpdate(
      { _id: profile_id },
      {
        $inc: { 'mailbox.numSent': 1 },
        $push: {
          'mailbox.buckets.outbox': { size: 1, numDeleted: 0, seq: bucketNum }
        }
      },
      {
        new: true,
        lean: true,
        select: 'mailbox'
      }
    );
    return mailbox;
  }

  // otherwise not the first bucket message
  // const done = false;
  /* eslint-disable-next-line */
  while (true) {
    const update = await Profile.findOneAndUpdate(
      { _id: profile_id },
      {
        $inc: {
          'mailbox.numSent': 1,
          [`mailbox.buckets.outbox.${bucketNum}.size`]: 1
        }
      },
      {
        new: true,
        lean: true,
        select: 'mailbox'
      }
    );

    // done = true;
    if (update) return update.mailbox;
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
          numDeleted: 0,
          seq: bucketNum
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
exports.sendMessage = catchAsync(async (req, res) => {
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

  // don't duplicate sender's profile
  const spoolProfiles = to.find(recip => recip.profileId === from.profileId)
    ? to
    : to.concat(from); // .tostring

  // ordered profile IDs without duplication to identify the spool
  let group = [...req.body.to, req.user.profile.id];
  group = Array.from(new Set(group));
  group = group.sort((n1, n2) => {
    if (n1 < n2) return -1;
    if (n1 === n2) return 0;
    return 1;
  });
  group = group.join(':');
  group = `:${group}:`;

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

  // const spoolGroup = await SpoolGroup.findOneAndUpdate(
  //   {
  //     group // ordered array
  //   },
  //   { profileLinks }, // if upsert required
  //   {
  //     upsert: true,
  //     new: true,
  //     lean: true,
  //     setDefaultsOnInsert: true
  //   }
  // );

  const spoolGroup = await SpoolGroup.findOneAndUpdate(
    {
      group
    },
    { profileLinks, group }, // if upsert required
    {
      upsert: true,
      new: true,
      lean: true,
      setDefaultsOnInsert: true
    }
  );

  const spoolBucket = await updateSpools(
    spoolGroup._id,
    message,
    spoolProfiles,
    profileLinks
  );

  await SpoolGroup.findOneAndUpdate(
    {
      _id: spoolGroup._id,
      'newestSpoolBucket.seq': { $lte: spoolBucket.seq } // in case seqCurrent has already increased
    },
    {
      $set: {
        'newestSpoolBucket.bucket': spoolBucket._id,
        'newestSpoolBucket.seq': spoolBucket.seq
      },
      $inc: {
        messagesTotal: 1
      }
    }
  );

  // UPDATE SENDER OUTBOX AND RECIPIENT INBOX BUCKETS

  message = {
    to,
    from,
    subject: req.body.subject,
    body: req.body.body,
    spoolBucket: spoolBucket._id,
    spoolGroup: spoolGroup._id
  };

  const tasks = [];
  // update outbox and profile of sender
  tasks.push(updateOutboxBuckets(req.user.profile._id, message));
  // update inboxes and profiles of recipients
  recipients.forEach(recip => tasks.push(updateInboxBuckets(recip, message)));

  const results = await Promise.all(tasks);
  const mailbox = results[0];

  res.status(200).json({
    status: 'success',
    data: {
      mailbox
    }
  });
});

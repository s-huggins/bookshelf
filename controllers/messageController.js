const catchAsync = require('../utils/asyncErrorWrapper');
const Message = require('../models/Message');
const Profile = require('../models/Profile');
const AppError = require('../utils/AppError');

exports.getMailbox = catchAsync(async (req, res, next) => {
  // fetch inbox & outbox
  // deleting inbox mail that has been trashed > 30 days
  const trashPeriod = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds
  const trashThreshold = new Date(Date.now() - trashPeriod);

  const profile = await Profile.findByIdAndUpdate(
    req.user.profile._id,
    { $pull: { inbox: { 'trash.dateTrashed': { $lt: trashThreshold } } } },
    { new: true, lean: true }
  )
    .populate({
      path: 'inbox.message',
      populate: [
        { path: 'from.profile', select: 'displayName avatar_id' },
        { path: 'to.profile', select: 'displayName avatar_id' }
      ]
    })
    .populate({
      path: 'outbox.message',
      populate: [
        { path: 'from.profile', select: 'displayName avatar_id' },
        { path: 'to.profile', select: 'displayName avatar_id' }
      ]
    });

  if (!profile) {
    return next(new AppError("That mailbox doesn't exist.", 404));
  }

  // most recent first
  profile.inbox.sort((m1, m2) => m2.message.dateSent - m1.message.dateSent);
  profile.outbox.sort((m1, m2) => m2.message.dateSent - m1.message.dateSent);

  res.status(200).json({
    status: 'success',
    data: {
      profile
    }
  });
});

exports.sendMessage = catchAsync(async (req, res, next) => {
  const { to, subject, body } = req.body;
  const { recipients } = req;

  let profileLinks = recipients.map(recip => recip.id);
  profileLinks.push(req.user.profile.id);
  profileLinks = Array.from(new Set(profileLinks));

  // store message in db
  const msg = await Message.create({
    from: {
      profileId: req.user.profile.id,
      displayName: req.user.profile.displayName,
      profile: req.user.profile._id
    },
    to: recipients.map(recip => ({
      profileId: recip.id,
      profile: recip._id,
      displayName: recip.displayName
    })),
    profileLinks,
    subject,
    body
  });

  if (!msg) {
    return next(new AppError("Message wasn't sent.", 400));
  }

  // push message into inbox of all recipients
  await Profile.updateMany(
    { id: { $in: to } },
    { $push: { inbox: { message: msg._id } } }
  );

  // return updated mailbox
  const mailbox = await Profile.findByIdAndUpdate(
    req.user.profile._id,
    {
      $push: {
        outbox: { message: msg._id }
      }
    },
    { new: true, lean: true, select: 'inbox outbox' }
  )
    .populate({
      path: 'inbox.message',
      populate: { path: 'from.profile', select: 'displayName avatar_id' }
    })
    .populate({
      path: 'outbox.message',
      populate: { path: 'to.profile', select: 'displayName avatar_id' }
    });

  const { inbox, outbox } = mailbox;

  res.status(200).json({
    status: 'success',
    data: {
      inbox,
      outbox
    }
  });
});

exports.trashMessages = catchAsync(async (req, res, next) => {
  const { trash = '' } = req.query;
  const { messageIds } = req.body;


  if (trash.toLowerCase() !== 'true' && trash.toLowerCase() !== 'false') {
    return res.status(400).json({
      status: 'fail',
      message: 'Invalid query string. Use ?trash=true or ?trash=false.'
    });
  }

  let trashQuery;
  if (trash === 'true') {
    // trashing a message should unsave it too
    trashQuery = Profile.findOneAndUpdate(
      { _id: req.user.profile._id, 'inbox.message': { $in: messageIds } },
      {
        $set: {
          'inbox.$[el].trash': {
            trashed: true,
            dateTrashed: Date.now()
          },
          'inbox.$[el].saved': false
        }
      },
      {
        new: true,
        lean: true,
        select: 'inbox outbox',
        arrayFilters: [{ 'el.message': { $in: messageIds } }]
      }
    );
  } else {
    trashQuery = Profile.findOneAndUpdate(
      { _id: req.user.profile._id, 'inbox.message': { $in: messageIds } },
      {
        $set: {
          'inbox.$[el].trash': {
            trashed: false,
            dateTrashed: null
          }
        }
      },
      {
        new: true,
        lean: true,
        select: 'inbox outbox',
        arrayFilters: [{ 'el.message': { $in: messageIds } }]
      }
    );
  }

  const mailbox = await trashQuery
    .populate({
      path: 'inbox.message',
      populate: { path: 'from.profile', select: 'displayName avatar_id' }
    })
    .populate({
      path: 'outbox.message',
      populate: { path: 'to.profile', select: 'displayName avatar_id' }
    });

  if (!mailbox) {
    return next(new AppError("That mailbox doesn't exist.", 404));
  }

  const { inbox, outbox } = mailbox;

  res.status(200).json({
    status: 'success',
    data: {
      inbox,
      outbox
    }
  });
});

exports.markMessages = catchAsync(async (req, res, next) => {
  const { messageIds } = req.body;
  const { read, saved } = req.query; // strings

  if (read) {
    if (read.toLowerCase() !== 'true' && read.toLowerCase() !== 'false') {
      return res.status(400).json({
        status: 'fail',
        message: 'Invalid query string. Use ?read=true or ?read=false.'
      });
    }

    const readStatus = read.toLowerCase() === 'true';

    const mailbox = await Profile.findOneAndUpdate(
      { _id: req.user.profile._id, 'inbox.message': { $in: messageIds } },
      {
        $set: {
          'inbox.$[el].read': readStatus
        }
      },
      {
        new: true,
        lean: true,
        select: 'inbox outbox',
        arrayFilters: [{ 'el.message': { $in: messageIds } }]
      }
    )
      .populate({
        path: 'inbox.message',
        populate: { path: 'from.profile', select: 'displayName avatar_id' }
      })
      .populate({
        path: 'outbox.message',
        populate: { path: 'to.profile', select: 'displayName avatar_id' }
      });

    if (!mailbox) {
      return next(new AppError("That mailbox doesn't exist.", 404));
    }

    const { inbox, outbox } = mailbox;
    return res.status(200).json({
      status: 'success',
      data: {
        inbox,
        outbox
      }
    });
  }

  if (saved) {
    if (saved.toLowerCase() !== 'true' && saved.toLowerCase() !== 'false') {
      return res.status(400).json({
        status: 'fail',
        message: 'Invalid query string. Use ?saved=true or ?saved=false.'
      });
    }

    const savedStatus = saved.toLowerCase() === 'true';

    // also untrash if trashed
    const mailbox = await Profile.findOneAndUpdate(
      { _id: req.user.profile._id, 'inbox.message': { $in: messageIds } },
      {
        $set: {
          'inbox.$[el].saved': savedStatus,
          'inbox.$[el].trash': {
            trashed: false,
            dateTrashed: null
          }
        }
      },
      {
        new: true,
        lean: true,
        select: 'inbox outbox',
        arrayFilters: [{ 'el.message': { $in: messageIds } }]
      }
    )
      .populate({
        path: 'inbox.message',
        populate: { path: 'from.profile', select: 'displayName avatar_id' }
      })
      .populate({
        path: 'outbox.message',
        populate: { path: 'to.profile', select: 'displayName avatar_id' }
      });

    if (!mailbox) {
      return next(new AppError("That mailbox doesn't exist.", 404));
    }

    const { inbox, outbox } = mailbox;

    return res.status(200).json({
      status: 'success',
      data: {
        inbox,
        outbox
      }
    });
  }

  return res.status(400).json({
    status: 'fail',
    message: 'Invalid query string.'
  });
});

const updateProfileLinks = async (profId, ...messageIds) => {
  let tasks = messageIds.map(id =>
    Message.findByIdAndUpdate(
      id,
      {
        $pull: { profileLinks: profId }
      },
      { new: true }
    )
  );
  const updatedMessages = await Promise.all(tasks);

  // delete messages whose profileLinks array became empty
  const toDelete = updatedMessages.filter(msg => !msg.profileLinks.length);
  tasks = toDelete.map(msg => Message.findByIdAndDelete(msg.id));
  await Promise.all(tasks);
};

exports.deleteMessages = catchAsync(async (req, res, next) => {
  const { messageIds } = req.body;
  const mailbox = await Profile.findByIdAndUpdate(
    req.user.profile._id,
    {
      $pull: {
        inbox: { message: { $in: messageIds } },
        outbox: { message: { $in: messageIds } }
      }
    },
    { new: true, lean: true, select: 'inbox outbox' }
  )
    .populate({
      path: 'inbox.message',
      populate: { path: 'from.profile', select: 'displayName avatar_id' }
    })
    .populate({
      path: 'outbox.message',
      populate: { path: 'to.profile', select: 'displayName avatar_id' }
    });

  if (!mailbox) {
    return next(new AppError("That mailbox doesn't exist.", 404));
  }

  await updateProfileLinks(req.user.profile.id, ...messageIds);

  const { inbox, outbox } = mailbox;

  return res.status(200).json({
    status: 'success',
    data: {
      inbox,
      outbox
    }
  });
});

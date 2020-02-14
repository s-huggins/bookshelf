// const catchAsync = require('../utils/asyncErrorWrapper');
// const Message = require('../models/Message');
// const Profile = require('../models/Profile');
// const AppError = require('../utils/AppError');

// const fetchReceived = (fetchType, _id, skip, limit) => {
//   let mail = Profile.aggregate()
//     .match({ _id })
//     .project({ inbox: 1, _id: 0 })
//     .unwind('$inbox')
//     .replaceRoot('$inbox');

//   if (fetchType === 'inbox')
//     mail = mail.match({ 'trash.trashed': false, saved: false });
//   if (fetchType === 'saved') mail = mail.match({ saved: true });
//   if (fetchType === 'trash') mail = mail.match({ 'trash.trashed': true });

//   mail = mail
//     .sort({ dateReceived: -1 })
//     .skip(skip)
//     .limit(limit)
//     .lookup({
//       from: 'messages',
//       localField: 'message',
//       foreignField: '_id',
//       as: 'message'
//     })
//     .unwind('$message')
//     .lookup({
//       from: 'profiles',
//       let: { fromId: '$message.from.profile' },
//       pipeline: [
//         { $match: { $expr: { $eq: ['$_id', '$$fromId'] } } },
//         { $project: { profileId: 1, displayName: 1, avatar_id: 1 } }
//       ],
//       as: 'from'
//     })
//     .unwind('$message.to')
//     .lookup({
//       from: 'profiles',
//       let: { toId: '$message.to.profile' },
//       pipeline: [
//         { $match: { $expr: { $eq: ['$_id', '$$toId'] } } },
//         { $project: { profileId: 1, displayName: 1, avatar_id: 1 } }
//       ],
//       as: 'to'
//     })
//     .unwind('$from')
//     .unwind('$to')
//     .group({
//       _id: '$_id',
//       trash: { $first: '$trash' },
//       read: { $first: '$read' },
//       saved: { $first: '$saved' },
//       fromArchive: { $first: '$message.from' },
//       toArchive: { $addToSet: '$message.to' },
//       from: { $first: '$from' },
//       to: { $addToSet: '$to' },
//       profileLinks: { $first: '$message.profileLinks' },
//       messageId: { $first: '$message._id' },
//       subject: { $first: '$message.subject' },
//       body: { $first: '$message.body' },
//       dateReceived: { $first: '$dateReceived' }
//     })
//     .sort({ dateReceived: -1 });

//   return mail;
// };

// exports.fetchInbox = catchAsync(async (req, res, next) => {
//   const skip = parseInt(req.params.skip, 10) || 0;
//   const limit = parseInt(req.params.limit, 10) || 20;

//   const inbox = await fetchReceived('inbox', req.user.profile._id, skip, limit);

//   if (!inbox) {
//     return next(new AppError("That mailbox doesn't exist.", 404));
//   }

//   res.status(200).json({
//     status: 'success',
//     data: {
//       inbox
//     }
//   });
// });

// exports.fetchSaved = catchAsync(async (req, res, next) => {
//   const skip = parseInt(req.params.skip, 10) || 0;
//   const limit = parseInt(req.params.limit, 10) || 20;

//   const saved = await fetchReceived('saved', req.user.profile._id, skip, limit);

//   if (!saved) {
//     return next(new AppError("That mailbox doesn't exist.", 404));
//   }

//   res.status(200).json({
//     status: 'success',
//     data: {
//       saved
//     }
//   });
// });

// exports.fetchTrash = catchAsync(async (req, res, next) => {
//   const skip = parseInt(req.params.skip, 10) || 0;
//   const limit = parseInt(req.params.limit, 10) || 20;

//   const trashPeriod = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds
//   const trashThreshold = new Date(Date.now() - trashPeriod);

//   // remove trashed messages older than 30 days
//   await Profile.findByIdAndUpdate(req.user.profile._id, {
//     $pull: { inbox: { 'trash.dateTrashed': { $lt: trashThreshold } } }
//   });

//   const trash = await fetchReceived('trash', req.user.profile._id, skip, limit);

//   if (!trash) {
//     return next(new AppError("That mailbox doesn't exist.", 404));
//   }

//   res.status(200).json({
//     status: 'success',
//     data: {
//       trash
//     }
//   });
// });

// exports.fetchOutbox = catchAsync(async (req, res, next) => {
//   const skip = parseInt(req.params.skip, 10) || 0;
//   const limit = parseInt(req.params.limit, 10) || 20;

//   const outbox = await Profile.aggregate([
//     { $match: { _id: req.user.profile._id } },
//     { $project: { outbox: 1, _id: 0 } },
//     { $unwind: '$outbox' },
//     { $replaceRoot: { newRoot: '$outbox' } },
//     { $sort: { dateSent: -1 } },
//     { $skip: skip },
//     { $limit: limit },
//     {
//       $lookup: {
//         from: 'messages',
//         localField: 'message',
//         foreignField: '_id',
//         as: 'message'
//       }
//     },
//     {
//       $unwind: '$message'
//     },
//     {
//       $lookup: {
//         from: 'profiles',
//         let: { fromId: '$message.from.profile' },
//         pipeline: [
//           { $match: { $expr: { $eq: ['$_id', '$$fromId'] } } },
//           { $project: { profileId: 1, displayName: 1, avatar_id: 1 } }
//         ],
//         as: 'from'
//       }
//     },
//     {
//       $unwind: '$message.to'
//     },
//     {
//       $lookup: {
//         from: 'profiles',
//         let: { toId: '$message.to.profile' },
//         pipeline: [
//           { $match: { $expr: { $eq: ['$_id', '$$toId'] } } },
//           { $project: { profileId: 1, displayName: 1, avatar_id: 1 } }
//         ],
//         as: 'to'
//       }
//     },
//     {
//       $unwind: '$from'
//     },
//     {
//       $unwind: '$to'
//     },
//     {
//       $group: {
//         _id: '$_id',
//         fromArchive: { $first: '$message.from' },
//         toArchive: { $addToSet: '$message.to' },
//         from: { $first: '$from' },
//         to: { $addToSet: '$to' },
//         profileLinks: { $first: '$message.profileLinks' },
//         messageId: { $first: '$message._id' },
//         subject: { $first: '$message.subject' },
//         body: { $first: '$message.body' },
//         dateSent: { $first: '$dateSent' }
//       }
//     },
//     { $sort: { dateSent: -1 } }
//   ]);

//   if (!outbox) {
//     return next(new AppError("That mailbox doesn't exist.", 404));
//   }

//   res.status(200).json({
//     status: 'success',
//     data: {
//       outbox
//     }
//   });
// });

// exports.sendMessage = catchAsync(async (req, res, next) => {
//   const { to, subject, body } = req.body;
//   const { recipients } = req;

//   let profileLinks = recipients.map(recip => recip.id);
//   profileLinks.push(req.user.profile.id);
//   profileLinks = Array.from(new Set(profileLinks));

//   // store message in db
//   const msg = await Message.create({
//     from: {
//       profileId: req.user.profile.id,
//       displayName: req.user.profile.displayName,
//       profile: req.user.profile._id
//     },
//     to: recipients.map(recip => ({
//       profileId: recip.id,
//       profile: recip._id,
//       displayName: recip.displayName
//     })),
//     profileLinks,
//     subject,
//     body
//   });

//   if (!msg) {
//     return next(new AppError("Message wasn't sent.", 400));
//   }

//   // push message into inbox of all recipients
//   await Profile.updateMany(
//     { id: { $in: to } },
//     { $push: { inbox: { message: msg._id } } }
//   );

//   // return updated mailbox
//   const mailbox = await Profile.findByIdAndUpdate(
//     req.user.profile._id,
//     {
//       $push: {
//         outbox: { message: msg._id }
//       }
//     },
//     { new: true, lean: true, select: 'inbox outbox' }
//   )
//     .populate({
//       path: 'inbox.message',
//       populate: { path: 'from.profile', select: 'displayName avatar_id' }
//     })
//     .populate({
//       path: 'outbox.message',
//       populate: { path: 'to.profile', select: 'displayName avatar_id' }
//     });

//   const { inbox, outbox } = mailbox;

//   res.status(200).json({
//     status: 'success',
//     data: {
//       inbox,
//       outbox
//     }
//   });
// });

// exports.trashMessages = catchAsync(async (req, res, next) => {
//   const { trash = '' } = req.query;
//   const { messageIds } = req.body;

//   if (trash.toLowerCase() !== 'true' && trash.toLowerCase() !== 'false') {
//     return res.status(400).json({
//       status: 'fail',
//       message: 'Invalid query string. Use ?trash=true or ?trash=false.'
//     });
//   }

//   let trashQuery;
//   if (trash === 'true') {
//     // trashing a message should unsave it too
//     trashQuery = Profile.findOneAndUpdate(
//       { _id: req.user.profile._id, 'inbox.message': { $in: messageIds } },
//       {
//         $set: {
//           'inbox.$[el].trash': {
//             trashed: true,
//             dateTrashed: Date.now()
//           },
//           'inbox.$[el].saved': false
//         }
//       },
//       {
//         new: true,
//         lean: true,
//         select: 'inbox outbox',
//         arrayFilters: [{ 'el.message': { $in: messageIds } }]
//       }
//     );
//   } else {
//     trashQuery = Profile.findOneAndUpdate(
//       { _id: req.user.profile._id, 'inbox.message': { $in: messageIds } },
//       {
//         $set: {
//           'inbox.$[el].trash': {
//             trashed: false,
//             dateTrashed: null
//           }
//         }
//       },
//       {
//         new: true,
//         lean: true,
//         select: 'inbox outbox',
//         arrayFilters: [{ 'el.message': { $in: messageIds } }]
//       }
//     );
//   }

//   const mailbox = await trashQuery
//     .populate({
//       path: 'inbox.message',
//       populate: { path: 'from.profile', select: 'displayName avatar_id' }
//     })
//     .populate({
//       path: 'outbox.message',
//       populate: { path: 'to.profile', select: 'displayName avatar_id' }
//     });

//   if (!mailbox) {
//     return next(new AppError("That mailbox doesn't exist.", 404));
//   }

//   const { inbox, outbox } = mailbox;

//   res.status(200).json({
//     status: 'success',
//     data: {
//       inbox,
//       outbox
//     }
//   });
// });

// exports.markMessages = catchAsync(async (req, res, next) => {
//   const { messageIds } = req.body;
//   const { read, saved } = req.query; // strings

//   if (read) {
//     if (read.toLowerCase() !== 'true' && read.toLowerCase() !== 'false') {
//       return res.status(400).json({
//         status: 'fail',
//         message: 'Invalid query string. Use ?read=true or ?read=false.'
//       });
//     }

//     const readStatus = read.toLowerCase() === 'true';

//     const mailbox = await Profile.findOneAndUpdate(
//       { _id: req.user.profile._id, 'inbox.message': { $in: messageIds } },
//       {
//         $set: {
//           'inbox.$[el].read': readStatus
//         }
//       },
//       {
//         new: true,
//         lean: true,
//         select: 'inbox outbox',
//         arrayFilters: [{ 'el.message': { $in: messageIds } }]
//       }
//     )
//       .populate({
//         path: 'inbox.message',
//         populate: { path: 'from.profile', select: 'displayName avatar_id' }
//       })
//       .populate({
//         path: 'outbox.message',
//         populate: { path: 'to.profile', select: 'displayName avatar_id' }
//       });

//     if (!mailbox) {
//       return next(new AppError("That mailbox doesn't exist.", 404));
//     }

//     const { inbox, outbox } = mailbox;
//     return res.status(200).json({
//       status: 'success',
//       data: {
//         inbox,
//         outbox
//       }
//     });
//   }

//   if (saved) {
//     if (saved.toLowerCase() !== 'true' && saved.toLowerCase() !== 'false') {
//       return res.status(400).json({
//         status: 'fail',
//         message: 'Invalid query string. Use ?saved=true or ?saved=false.'
//       });
//     }

//     const savedStatus = saved.toLowerCase() === 'true';

//     // also untrash if trashed
//     const mailbox = await Profile.findOneAndUpdate(
//       { _id: req.user.profile._id, 'inbox.message': { $in: messageIds } },
//       {
//         $set: {
//           'inbox.$[el].saved': savedStatus,
//           'inbox.$[el].trash': {
//             trashed: false,
//             dateTrashed: null
//           }
//         }
//       },
//       {
//         new: true,
//         lean: true,
//         select: 'inbox outbox',
//         arrayFilters: [{ 'el.message': { $in: messageIds } }]
//       }
//     )
//       .populate({
//         path: 'inbox.message',
//         populate: { path: 'from.profile', select: 'displayName avatar_id' }
//       })
//       .populate({
//         path: 'outbox.message',
//         populate: { path: 'to.profile', select: 'displayName avatar_id' }
//       });

//     if (!mailbox) {
//       return next(new AppError("That mailbox doesn't exist.", 404));
//     }

//     const { inbox, outbox } = mailbox;

//     return res.status(200).json({
//       status: 'success',
//       data: {
//         inbox,
//         outbox
//       }
//     });
//   }

//   return res.status(400).json({
//     status: 'fail',
//     message: 'Invalid query string.'
//   });
// });

// const updateProfileLinks = async (profId, ...messageIds) => {
//   let tasks = messageIds.map(id =>
//     Message.findByIdAndUpdate(
//       id,
//       {
//         $pull: { profileLinks: profId }
//       },
//       { new: true }
//     )
//   );
//   const updatedMessages = await Promise.all(tasks);

//   // delete messages whose profileLinks array became empty
//   const toDelete = updatedMessages.filter(msg => !msg.profileLinks.length);
//   tasks = toDelete.map(msg => Message.findByIdAndDelete(msg.id));
//   await Promise.all(tasks);
// };

// exports.deleteMessages = catchAsync(async (req, res, next) => {
//   const { messageIds } = req.body;
//   const mailbox = await Profile.findByIdAndUpdate(
//     req.user.profile._id,
//     {
//       $pull: {
//         inbox: { message: { $in: messageIds } },
//         outbox: { message: { $in: messageIds } }
//       }
//     },
//     { new: true, lean: true, select: 'inbox outbox' }
//   )
//     .populate({
//       path: 'inbox.message',
//       populate: { path: 'from.profile', select: 'displayName avatar_id' }
//     })
//     .populate({
//       path: 'outbox.message',
//       populate: { path: 'to.profile', select: 'displayName avatar_id' }
//     });

//   if (!mailbox) {
//     return next(new AppError("That mailbox doesn't exist.", 404));
//   }

//   await updateProfileLinks(req.user.profile.id, ...messageIds);

//   const { inbox, outbox } = mailbox;

//   return res.status(200).json({
//     status: 'success',
//     data: {
//       inbox,
//       outbox
//     }
//   });
// });

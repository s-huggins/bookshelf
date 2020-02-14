// const mongoose = require('mongoose');

// const { Schema } = mongoose;

// const MessageSchema = new Schema({
//   from: {
//     profileId: {
//       type: Number,
//       // index: true,
//       required: [true, "Sender's profile ID is required."]
//     },
//     displayName: {
//       type: String,
//       required: [true, "Sender's display name is required."]
//     },
//     profile: {
//       type: Schema.Types.ObjectId,
//       ref: 'Profile'
//     }
//   },
//   to: [
//     {
//       profileId: {
//         type: Number,
//         // index: true,
//         required: [true, "Recipient's profile ID is required."]
//       },
//       displayName: {
//         type: String,
//         required: [true, "Recipient's display name is required."]
//       },
//       profile: {
//         type: Schema.Types.ObjectId,
//         ref: 'Profile'
//       }
//     }
//   ],
//   subject: {
//     type: String,
//     trim: true,
//     maxlength: 256
//   },
//   body: {
//     type: String,
//     trim: true,
//     maxlength: 20000
//   },
//   dateSent: {
//     type: Date,
//     default: Date.now,
//     index: true
//   },
//   profileLinks: [Number]
// });

// const Message = mongoose.model('Message', MessageSchema);

// module.exports = Message;

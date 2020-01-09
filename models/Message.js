/* eslint-disable object-shorthand, func-names */
const mongoose = require('mongoose');

const { Schema } = mongoose;

const MessageSchema = new Schema({
  from: {
    type: Schema.Types.ObjectId,
    ref: 'Profile'
  },
  to: {
    type: Schema.Types.ObjectId,
    ref: 'Profile'
  },
  subject: {
    type: String,
    maxlength: 256
  },
  body: {
    type: String,
    maxlength: 5000
  },
  seen: {
    type: Boolean,
    default: false
  },
  dateSent: {
    type: Date,
    default: Date.now
  }
});

const Message = mongoose.model('Message', MessageSchema);

module.exports = Message;

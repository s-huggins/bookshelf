// const mongoose = require('mongoose');

// const { Schema } = mongoose;

// const SpoolGroupSchema = new Schema({
//   group: {
//     type: [Number], // array of profile IDs in ascending order
//     required: [true, 'The spool group is required.'],
//     index: true,
//     unique: true
//   },

//   profileLinks: [Number], // remaining live profiles of the group, delete the spool chain when this becomes empty

//   newestSpoolBucket: {
//     type: Schema.Types.ObjectId,
//     ref: 'SpoolBucket',
//     required: [true, 'Reference to newest spool bucket is required.']
//   },

//   seqCurrent: {
//     type: Number,
//     required: [true, 'Seq value of newest spool bucket is required.'],
//     default: 0
//   }
// });

// const SpoolGroup = mongoose.model('SpoolGroup', SpoolGroupSchema);

// module.exports = SpoolGroup;

const mongoose = require('mongoose');

const { Schema } = mongoose;

const SpoolGroupSchema = new Schema({
  group: {
    type: [Number], // array of profile IDs in ascending order
    required: [true, 'The spool group is required.'],
    index: true,
    unique: true
  },

  profileLinks: [Number], // remaining live profiles of the group, delete the spool chain when this becomes empty
  messagesTotal: {
    // total number of messages from all buckets in sequence
    type: Number,
    default: 0
  },
  newestSpoolBucket: {
    bucket: {
      type: Schema.Types.ObjectId,
      ref: 'SpoolBucket',
      required: [true, 'Reference to newest spool bucket is required.']
    },
    seq: {
      type: Number,
      required: [true, 'Seq value of newest spool bucket is required.'],
      default: 0
    }
  }
});

const SpoolGroup = mongoose.model('SpoolGroup', SpoolGroupSchema);

module.exports = SpoolGroup;

/* eslint-disable object-shorthand, func-names */
const mongoose = require('mongoose');

const { Schema } = mongoose;

const InboxBucketSchema = new Schema({
  profile: {
    // bucket owner
    type: Schema.Types.ObjectId,
    ref: 'Profile'
  },
  seq: {
    // position in bucket chain, to start from 0
    type: Number,
    // index: true,
    required: [true, 'Bucket number is required.']
    // unique: true
  },
  dateBucketCreated: {
    type: Date,
    default: Date.now
  },
  messages: {
    type: [
      {
        from: {
          profileId: {
            type: Number,
            required: [true, "Sender's profile ID is required."]
          },
          profile: {
            type: Schema.Types.ObjectId,
            ref: 'Profile'
          },
          archived: {
            displayName: {
              type: String,
              required: [true, "Sender's display name must be archived."]
            }
          }
        },
        to: [
          {
            profileId: {
              type: Number,
              required: [true, "Recipient's profile ID is required."]
            },
            profile: {
              type: Schema.Types.ObjectId,
              ref: 'Profile'
            },
            archived: {
              displayName: {
                type: String,
                required: [true, "Recipient's display name must be archived."]
              }
            }
          }
        ],
        subject: {
          type: String,
          trim: true,
          maxlength: 256
        },
        body: {
          type: String,
          trim: true,
          maxlength: 30000,
          required: [true, 'A message body is required.']
        },
        spoolBucket: {
          type: Schema.Types.ObjectId,
          ref: 'SpoolBucket'
        },
        spoolGroup: {
          type: Schema.Types.ObjectId,
          ref: 'SpoolGroup'
        },
        // defaults below
        dateCreated: {
          type: Date,
          default: Date.now
          // index: true
        },
        read: {
          type: Boolean,
          default: false
        },
        trash: {
          trashed: {
            type: Boolean,
            default: false
          },
          dateTrashed: {
            type: Date
          }
        },
        saved: {
          type: Boolean,
          default: false
        },
        deleted: {
          type: Boolean,
          default: false
        }
      }
    ]
  }
});

InboxBucketSchema.index({ profile: 1, seq: 1 }, { unique: true });

const InboxBucket = mongoose.model('InboxBucket', InboxBucketSchema);

module.exports = InboxBucket;

/* eslint-disable object-shorthand, func-names */
const mongoose = require('mongoose');
const validator = require('validator');
const autoIncrementModelId = require('./Counter');
const Book = require('./Book');
const Avatar = require('./Avatar');

const { Schema } = mongoose;

// Expects birthday as a Date
function getAge(birthday) {
  const today = new Date();
  const yearsDiff = today.getFullYear() - birthday.getFullYear();
  if (
    today.getMonth() < birthday.getMonth() ||
    today.getDate() < birthday.getDate()
  ) {
    return yearsDiff - 1;
  }
  return yearsDiff;
}

const ProfileSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    id: {
      type: Number,
      unique: true,
      min: 1
    },
    isPublic: {
      type: Boolean,
      default: true
    },
    friends: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: 'Profile'
        }
      ],
      default: []
    },
    friendRequests: {
      type: [
        {
          kind: {
            type: String,
            enum: ['Sent', 'Received']
          },
          profile: {
            type: Schema.Types.ObjectId,
            ref: 'Profile'
          }
        }
      ],
      default: []
    },
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      minlength: 1,
      maxlength: 40
    },
    lastName: {
      value: {
        type: String,
        maxlength: 40
      },
      private: {
        type: Boolean,
        default: false
      }
    },
    displayName: {
      type: String,
      maxlength: 20,
      default() {
        return this.firstName.substring(0, 20);
      }
    },
    handle: {
      type: String,
      index: {
        unique: true,
        partialFilterExpression: { handle: { $ne: '' } }
      },
      maxlength: 40,
      // minlength: 1,
      validate: {
        validator: function(handle) {
          if (!handle) return true;

          return /^[a-zA-Z][a-zA-Z0-9-]*$/.test(handle);
        },
        message:
          'Handle must begin with a letter and consist of only alphanumeric characters and dashes.'
      }
    },
    avatar_id: {
      type: Schema.Types.ObjectId
    },
    lastActive: {
      type: Date,
      default: Date.now
    },
    birthday: {
      value: {
        type: Date,
        // required: [true, 'User must confirm their age'],
        validate: {
          validator: function(birthday) {
            if (birthday) return getAge(birthday) >= 13;
          },
          message: 'User must be 13 to register.'
        }
      },
      private: {
        type: Boolean,
        default: true
      }
    },

    books: {
      type: [
        {
          bookId: {
            type: Number,
            ref: 'Book',
            index: true,
            required: [true, 'A shelved book must have a bookId field.']
          },
          primaryShelf: {
            type: String,
            enum: ['to-read', 'reading', 'read'],
            required: [true, 'A shelved book must have a primaryShelf field.']
          },
          dateShelved: {
            type: Date,
            default: Date.now,
            required: [true, 'A shelved date is required.']
          }
        }
      ]
    },

    ratings: {
      type: [
        {
          rating: {
            type: Number,
            enum: [1, 2, 3, 4, 5]
          },
          bookId: {
            type: Number,
            ref: 'Book'
          }
        }
      ]
    },
    // reviews: {
    //   type: [
    //     {
    //       review: {
    //         type: String,
    //         maxlength: 8000
    //       },
    //       bookId: Number
    //     }
    //   ],
    //   default: []
    // },
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Review'
      }
    ],
    location: {
      value: {
        type: String,
        maxlength: 200
      },
      private: {
        type: Boolean,
        default: true
      }
    },
    website: {
      type: String,
      maxlength: 80,
      validate: {
        validator: function(val) {
          if (val) return validator.default.isURL(val);
        },
        message: 'Website not a valid URL'
      }
    },
    aboutMe: {
      type: String,
      maxlength: [2000, 'About me cannot exceed 2000 characters.']
    },
    favBooks: {
      type: String,
      maxlength: 400,
      default: ''
    },
    interests: {
      type: String,
      maxlength: 400
    },
    gender: {
      value: {
        type: String,
        enum: ['Male', 'Female', 'Other', 'Unspecified']
        // default: 'Unspecified'
      },
      private: {
        type: Boolean,
        default: true
      }
    },

    // photos: [String],
    social: {
      facebook: {
        type: String,
        maxlength: 80
      },
      twitter: {
        type: String,
        maxlength: 80
      },
      instagram: {
        type: String,
        maxlength: 80
      },
      youtube: {
        type: String,
        maxlength: 80
      },
      linkedin: {
        type: String,
        maxlength: 80
      }
    },
    dateCreated: {
      type: Date,
      default: Date.now
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    id: false
  }
);

ProfileSchema.pre('save', function(next) {
  this.wasNew = this.isNew;
  next();
});

ProfileSchema.pre('findOneAndUpdate', function(next) {
  const { website } = this._update;
  if (
    website &&
    !website.startsWith('http://') &&
    !website.startsWith('https://')
  ) {
    this._update.website = `https://${this._update.website}`;
  }

  next();
});

// increment and get profile id counter
ProfileSchema.pre('save', function(next) {
  if (!this.isNew) {
    return next();
  }
  autoIncrementModelId('profiles', this, next);
});

ProfileSchema.post('save', async function(doc, next) {
  if (this.wasNew) {
    const newUser = await mongoose
      .model('User')
      .findByIdAndUpdate(doc.user, { profile: doc._id }, { new: true })
      .populate('profile');
    mongoose.model('User').emit('profileWasCreated', newUser);
  }
  next();
});

// remove all avatar files chunks
ProfileSchema.post('remove', async function(doc, next) {
  const avatar = await Avatar.findOne({ 'metadata.profile_id': doc._id });
  if (avatar) {
    await mongoose.connection.db
      .collection('avatars.chunks')
      .deleteMany({ files_id: avatar._id });

    await avatar.remove();
  }

  next();
});

// remove all reviews, ratings, etc
ProfileSchema.post('remove', async function(doc, next) {
  const removalTasks = [];

  for (let i = 0; i < doc.ratings.length; i += 1) {
    const rating = doc.ratings[i];
    removalTasks.push(
      Book.findByIdAndUpdate(rating.bookId, {
        $pull: { ratings: { profileId: doc.id } }
      })
    );
  }

  await Promise.all(removalTasks);

  next();
});

ProfileSchema.virtual('age').get(function() {
  // return this.birthday
  //   ? getAge(this.birthday.value)
  //   : undefined;
  if (this.birthday && this.birthday.value) {
    const yearsOld = getAge(this.birthday.value);
    const { isPrivate } = this.birthday;
    const age = { value: yearsOld, private: isPrivate };

    return age;
  }
  return undefined;
});

const Profile = mongoose.model('Profile', ProfileSchema);

module.exports = Profile;

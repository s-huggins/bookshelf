/* eslint-disable object-shorthand, func-names */
const mongoose = require('mongoose');
const validator = require('validator');
const autoIncrementModelId = require('./Counter');
const Book = require('./Book');
const Avatar = require('./Avatar');
const catchAsync = require('../utils/asyncErrorWrapper');

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
          profile: {
            type: Schema.Types.ObjectId,
            ref: 'Profile'
          },
          profileId: {
            type: Number,
            unique: false
          },
          dateAdded: {
            type: Date,
            default: Date.now
          }
        }
      ]
    },

    friendRequests: {
      type: [
        {
          kind: {
            type: String,
            enum: ['Sent', 'Received']
          },
          profileId: Number, // of other user
          profile: {
            type: Schema.Types.ObjectId,
            ref: 'Profile'
          },
          date: {
            type: Date,
            default: Date.now
          },
          ignored: Boolean
        }
      ]
    },
    firstName: {
      type: String,
      required: [true, 'First name is required.'],
      trim: true,
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
      trim: true,
      maxlength: 20,
      minlength: 1,
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
      maxlength: 120,
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
        maxlength: 120,
        default: ''
      },
      twitter: {
        type: String,
        maxlength: 120,
        default: ''
      },
      instagram: {
        type: String,
        maxlength: 120,
        default: ''
      },
      youtube: {
        type: String,
        maxlength: 120,
        default: ''
      },
      linkedin: {
        type: String,
        maxlength: 120,
        default: ''
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

const formatURL = link => {
  if (!link.startsWith('http://') && !link.startsWith('https://')) {
    return `https://${link}`;
  }
  return link;
};

ProfileSchema.pre('findOneAndUpdate', function(next) {
  // const { website } = this._update;
  // if (
  //   website &&
  //   !website.startsWith('http://') &&
  //   !website.startsWith('https://')
  // ) {
  //   this._update.website = `https://${this._update.website}`;
  // }

  const { website } = this._update;
  if (website) {
    this._update.website = formatURL(website);
  }
  next();
});

ProfileSchema.pre('findOneAndUpdate', function(next) {
  const { social } = this._update;
  if (!social) {
    return next();
  }
  if (social.twitter) {
    let { twitter } = social;
    if (twitter.charAt(0) === '@') {
      twitter = twitter.substring(1);
    }
    // twitter = `https://twitter.com/${twitter}`;
    social.twitter = twitter;
  }
  if (social.instagram) {
    let { instagram } = social;
    if (instagram.charAt(0) === '@') {
      instagram = instagram.substring(1);
    }
    // instagram = `https://www.instagram.com/${instagram}`;
    social.instagram = instagram;
  }
  if (social.facebook) {
    social.facebook = formatURL(social.facebook);
  }
  if (social.youtube) {
    social.youtube = formatURL(social.youtube);
  }
  if (social.linkedin) {
    social.linkedin = formatURL(social.linkedin);
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

  // remove book ratings
  for (let i = 0; i < doc.ratings.length; i += 1) {
    const rating = doc.ratings[i];
    removalTasks.push(
      Book.findByIdAndUpdate(rating.bookId, {
        $pull: { ratings: { profileId: doc.id } }
      })
    );
  }

  // TODO: remove book reviews

  // clean the profiles of all former friends
  // const friendsTask = mongoose.model('Profile').updateMany({'friends.id': doc.id}, {$pull: {friends: {id: doc.id}}} )

  const friendsTask = mongoose.model('Profile').updateMany(
    {
      $or: [
        { 'friends.profileId': doc.id },
        { 'friendRequests.profileId': doc.id }
      ]
    },
    {
      $pull: {
        friends: { profileId: doc.id },
        friendRequests: { profileId: doc.id }
      }
    }
  );

  removalTasks.push(friendsTask);

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

ProfileSchema.virtual('currentRead').get(function() {
  if (!this.books) return undefined;
  const reading = this.books.filter(book => book.primaryShelf === 'reading');
  let latest = null;
  reading.forEach(book => {
    if (!latest) latest = book;
    else if (book.dateShelved > latest.dateShelved) latest = book;
  });

  return latest;
});

ProfileSchema.virtual('numFriends').get(function() {
  if (!this.friends) return undefined;
  return this.friends.length;
});
ProfileSchema.virtual('numBooks').get(function() {
  if (!this.books) return undefined;
  return this.books.length;
});

// wrap in catchAsync
ProfileSchema.statics.getOwnProfile = async function(filterObj) {
  let profile;
  try {
    // let profile = await this.findOne(filterObj)
    profile = await this.findOne(filterObj)
      .populate('books.bookId')
      .populate(
        'friendRequests.profile',
        'displayName avatar_id location friends books'
      )
      .populate({
        path: 'friends.profile',
        select: 'displayName avatar_id friends books lastActive',
        populate: {
          path: 'books.bookId'
        }
      });
  } catch (err) {
    return null;
  }

  if (!profile) return null;

  profile = profile.toJSON();
  // console.log('jsonprofile', profile);
  // remove the overfetched data that was only needed for virtual props
  profile.friends.forEach(fr => {
    delete fr.profile.books;
    delete fr.profile.friends;
  });
  profile.friendRequests.forEach(fReq => {
    delete fReq.profile.books;
    delete fReq.profile.friends;
  });
  return profile;
};

// TODO: private profile friends
ProfileSchema.statics.getOtherProfile = async function(filterObj, ownFriends) {
  let profile = await this.findOne(filterObj)
    .select('-friendRequests')
    .populate('books.bookId')
    .populate({
      path: 'friends.profile',
      select: 'displayName avatar_id friends books lastActive',
      // match for non private profiles
      populate: {
        path: 'books.bookId'
      }
    });

  if (!profile) return null;

  profile = profile.toJSON();

  // TODO: AND NOT A FRIEND
  if (!profile.isPublic) {
    return {
      isPublic: profile.isPublic,
      id: profile.id,
      displayName: profile.displayName,
      handle: profile.handle,
      avatar: profile.avatar
    };
  }

  // remove the overfetched data that was only needed for virtual props
  profile.friends.forEach(fr => {
    delete fr.profile.books;
    delete fr.profile.friends;
  });

  // remove userdata declared private
  // TODO: IF NOT A FRIEND
  Object.keys(profile).forEach(k => {
    if (profile[k].private) {
      delete profile[k];
    }
  });

  return profile;
};

const Profile = mongoose.model('Profile', ProfileSchema);

module.exports = Profile;

/* eslint-disable object-shorthand, func-names */
const mongoose = require('mongoose');

const { Schema } = mongoose;

// handle: {
//   type: String,
//   required: [true, 'Handle is required'],
//   min: 1,
//   max: 40
// },

// age: {
//   type: Number,
//   min: 13,
//   max: 130
// } TODO: use a virtual prop

// Expects birthday as a Date
function getAge(birthday) {
  const today = new Date();
  const yearsDiff = today.getFullYear() - birthday.getFullYear();
  return today.getDay() < birthday.getDay() ? yearsDiff - 1 : yearsDiff;
}

const profileSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      min: 1,
      max: 40
    },
    middleName: {
      type: String,
      max: 40
    },
    lastName: {
      type: String,
      max: 40
    },
    displayName: {
      type: String,
      max: 40,
      default() {
        return this.firstName;
      }
    },
    birthday: {
      type: Date,
      // required: [true, 'User must confirm their age'],
      validate: {
        validator: function(birthday) {
          return getAge(birthday) >= 13;
        },
        message: 'User must be 13 to register'
      }
    },
    country: {
      type: String,
      max: 80
    },
    website: {
      type: String
    },
    aboutMe: {
      type: String,
      max: [2000, 'About me cannot exceed 2000 characters.']
    },
    favGenres: [String],
    interests: [String],
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other']
    },
    avatar: String,
    photos: [String],
    social: {
      facebook: String,
      twitter: String,
      instagram: String,
      youtube: String,
      linkedin: String
    },
    date: {
      type: Date,
      default: Date.now()
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

profileSchema.virtual('age').get(function() {
  return this.birthday ? getAge(this.birthday) : undefined;
});

const Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile;

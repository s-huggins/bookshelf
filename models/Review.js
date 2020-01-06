/* eslint-disable object-shorthand, func-names */
const mongoose = require('mongoose');

const { Schema } = mongoose;

const ReviewSchema = new Schema({
  book: {
    type: Number,
    ref: 'Book'
  },
  reviewer: {
    type: Schema.Types.ObjectId,
    ref: 'Profile'
  },
  review: {
    type: String,
    maxlength: 20000
  },
  rating: {
    type: Number,
    enum: [1, 2, 3, 4, 5]
    // required: [true, 'A rating must have a value out of 5.']
  },
  dateCreated: {
    type: Date,
    default: Date.now()
  },
  dateChanged: {
    type: Date
  },
  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Profile'
    }
  ],
  comments: {
    type: [
      {
        comment: {
          type: String,
          maxlength: 2000
        },
        profile: {
          type: Schema.Types.ObjectId,
          ref: 'Profile'
        }
      }
    ],
    validate: {
      validator: function(arr) {
        return arr.length <= 1000;
      },
      message: '1000 comments maximum.'
    }
  }
});

const Review = mongoose.model('Review', ReviewSchema);

module.exports = Review;

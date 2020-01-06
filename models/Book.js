/* eslint-disable object-shorthand, func-names */
const mongoose = require('mongoose');

const { Schema } = mongoose;

const BookSchema = new Schema(
  {
    _id: {
      type: Number
    },
    title: {
      type: String,
      required: [true, 'A title is required.']
    },
    image_url: String,
    authors: {
      type: [
        {
          name: String,
          author_id: Number
        }
      ],

      validate: {
        validator: function(arr) {
          return arr.length > 0;
        },
        message: 'At least 1 author is required.'
      }
    },

    ratings: {
      type: [
        {
          profileId: {
            type: Number,
            index: true,
            required: [true, 'A rating must have an associated profile.']
          },
          rating: {
            type: Number,
            enum: [1, 2, 3, 4, 5],
            required: [true, 'A rating must have a value.']
          }
        }
      ]
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

BookSchema.virtual('average_rating').get(function() {
  if (this.ratings.length === 0) return 0;

  return (
    this.ratings.reduce((acc, next) => {
      return acc + next.rating;
    }, 0) / this.ratings.length
  );
});

const Book = mongoose.model('Book', BookSchema);

module.exports = Book;

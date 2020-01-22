import React from 'react';
import withUpdatingRating from '../Profile/withUpdatingRating';
import BookResult from './BookResult';

const BookResultList = ({ books }) => {
  return books.map(work => {
    const BookResultWithUpdatingRating = withUpdatingRating(BookResult);
    return (
      <BookResultWithUpdatingRating
        props={{
          ...work,
          ...work.best_book
        }}
        key={work.id}
      />
    );
  });
};

export default BookResultList;

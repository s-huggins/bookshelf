import React from 'react';
import withUpdatingRating from './withUpdatingRating';
import BookshelfBook from './BookshelfBook';

const BookshelfBookList = ({ books, ownBookshelf }) => {
  const bookList = books.map(book => {
    const BookshelfBookWithUpdatingRating = withUpdatingRating(BookshelfBook);
    return (
      <BookshelfBookWithUpdatingRating
        key={book.bookId._id}
        props={{
          ownBookshelf,
          dateShelved: book.dateShelved,
          ...book.bookId
        }}
      />
    );
  });

  return bookList;
};

export default BookshelfBookList;

import React from 'react';
import BookshelfBook from './BookshelfBook';

const BookshelfBookList = ({ books, ownBookshelf }) => {
  const bookList = books.map(book => {
    return (
      <BookshelfBook
        key={book.bookId._id}
        ownBookshelf={ownBookshelf}
        dateShelved={book.dateShelved}
        userRating={book.userRating}
        ownRating={book.ownRating}
        {...book.bookId}
        _id={book.bookId._id}
        title={book.bookId.title}
        averageRating={book.average_rating}
      />
    );
  });

  return bookList;
};

export default BookshelfBookList;

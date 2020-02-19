// import React from 'react';
// import withUpdatingRating from '../withUpdatingRating';
// import BookshelfBook from './BookshelfBook';

// const BookshelfBookList = ({ books, ownBookshelf }) => {
//   const bookList = books.map(book => {
//     const BookshelfBookWithUpdatingRating = withUpdatingRating(BookshelfBook);
//     return (
//       <BookshelfBookWithUpdatingRating
//         key={book.bookId._id}
//         props={{
//           ownBookshelf,
//           dateShelved: book.dateShelved,
//           userRating: book.userRating,
//           ownRating: book.ownRating,
//           ...book.bookId
//         }}
//       />
//     );
//   });

//   return bookList;
// };

// export default BookshelfBookList;

import React from 'react';
import withUpdatingRating from '../withUpdatingRating';
import BookshelfBook from './BookshelfBook';

const BookshelfBookList = ({ books, ownBookshelf, rateBook }) => {
  // const ownBooks = useSelector(state => state.auth.user.profile.books);

  const bookList = books.map(book => {
    // const {_id, title, }
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
        // ratingsCount={book.ratings_count}
        // rate={rating => rateBook(book.bookId._id, rating)}
        rateBook={rateBook}
      />
    );
  });

  return bookList;
};

export default BookshelfBookList;

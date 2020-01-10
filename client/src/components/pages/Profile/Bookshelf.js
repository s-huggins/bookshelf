import React from 'react';
import BookshelfBookList from './BookshelfBookList';

const Bookshelf = ({ books, shelf, ownBookshelf }) => {
  const shelfBooks = shelf
    ? books.filter(book => book.primaryShelf === shelf)
    : books;
  return (
    <div className="Bookshelves__list">
      <div className="pagination-head">
        <span className="pagination">
          « previous 1 2 3 4 5 6 7 8 9 … 90 91 next »
        </span>
      </div>
      <table>
        <thead>
          <tr className="Bookshelves__list-header">
            <th>cover</th>
            <th>title</th>
            <th>author</th>
            <th>avg rating</th>
            {!ownBookshelf && <th>rating</th>}
            <th>my rating</th>
            <th>date shelved</th>
          </tr>
        </thead>
        <tbody>
          <BookshelfBookList books={shelfBooks} ownBookshelf={ownBookshelf} />
        </tbody>
      </table>
      <div className="pagination-foot">
        <span className="pagination-settings">
          <span className="pagination-per-page">per page 20</span>
          <span className="pagination-sort">sort</span>
        </span>
        <span className="pagination">
          « previous 1 2 3 4 5 6 7 8 9 … 90 91 next »
        </span>
      </div>
    </div>
  );
};

export default Bookshelf;

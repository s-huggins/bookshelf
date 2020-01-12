import React from 'react';
import BookshelfBookList from './BookshelfBookList';
import Pagination from '../../../common/Pagination';
import { useState, useLayoutEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';

const Bookshelf = ({ books, ownBookshelf, children, shelf }) => {
  const [allBooks, setAllBooks] = useState(books);
  const [booksView, setBooksView] = useState({
    books,
    startIndex: 0,
    endIndex: books.length
  });

  const location = useLocation();
  const scrollCallback = useRef(e => {
    const viewportHeight = window.innerHeight;
    const pageHeight = document.body.scrollHeight;
    const scrolledHeight = window.pageYOffset;
    // hit page bottom when viewportHeight + scrolledHeight = pageHeight
    if (viewportHeight + scrolledHeight > pageHeight - 150) {
      // console.log('load more books');
      setBooksView(booksView => ({
        ...booksView,
        endIndex: booksView.endIndex + 5
      }));
    }
  });

  useLayoutEffect(() => {
    const parsed = queryString.parse(location.search);

    // set the default ordering here
    // only run a default order if no order query param
    // default currently set to order by dateShelved, later will be book position
    // only run default orders if books have changed
    const sorted =
      booksView.books === books
        ? booksView.books
        : books.sort(
            (b1, b2) => new Date(b1.dateShelved) - new Date(b2.dateShelved)
          );

    if (parsed['per-page'] === 'infinite') {
      console.log('infinite scroll effect');
      // scroll to top of page
      // determine when images have loaded
      // numScroll === any lower bound of enough books to scroll page
      const numScroll = Math.floor(window.innerHeight / 100) + 1; // each book has a min height of 100px

      setBooksView({
        books: sorted,
        startIndex: 0,
        endIndex: numScroll
      });
      window.addEventListener('scroll', scrollCallback.current);

      return () => {
        window.removeEventListener('scroll', scrollCallback.current);
      };
    } else {
      const perPage = parseInt(parsed['per-page']);
      const pageNum = Math.abs(parseInt(parsed.page)) || 1;

      if (!perPage || perPage <= 0) {
        setBooksView({
          books: sorted,
          startIndex: (pageNum - 1) * 20,
          endIndex: pageNum * 20
        });
      } else if (perPage > 100) {
        setBooksView({
          books: sorted,
          startIndex: 0,
          endIndex: books.length
        });
      } else {
        setBooksView({
          books: sorted,
          startIndex: (pageNum - 1) * perPage,
          endIndex: pageNum * perPage
        });
      }
    }
  }, [location, books]);

  // search and order criterion effect

  const parsed = queryString.parse(location.search);
  const infiniteScroll = parsed['per-page'] === 'infinite';
  let perPage = parseInt(parsed['per-page']) || 20;
  if (perPage <= 0) perPage = 20;
  const baseLink = `${location.pathname}${location.search}`.replace(
    /(\?page=(\d+))|(&page=(\d+))/,
    ''
  );
  const page = parseInt(parsed['page']) || 1;
  const total = booksView.books.length;
  return (
    <div className="Bookshelves__list">
      {!infiniteScroll && total > 0 && (
        <div className="pagination-head">
          <Pagination
            useQueryParam
            noLimit
            perPage={perPage}
            total={total}
            baseLink={baseLink}
            page={page}
          />
        </div>
      )}

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
          <BookshelfBookList
            books={booksView.books.slice(
              booksView.startIndex,
              booksView.endIndex
            )}
            ownBookshelf={ownBookshelf}
          />
        </tbody>
      </table>
      {total === 0 && <div className="no-items">No matching items!</div>}

      {!infiniteScroll && total > 0 && (
        <div className="pagination-foot">
          {children}
          <span className="pagination">
            <Pagination
              useQueryParam
              noLimit
              perPage={perPage}
              total={total}
              baseLink={baseLink}
              page={page}
            />
          </span>
        </div>
      )}
      {infiniteScroll && total > 0 && (
        <div className="pagination-foot pagination-foot--infinite">
          {children}
        </div>
      )}
    </div>
  );
};

export default Bookshelf;

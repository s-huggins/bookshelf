import React from 'react';
import BookshelfBookList from './BookshelfBookList';
import Pagination from '../../../common/Pagination';
import { useState, useLayoutEffect, useRef } from 'react';
import { useLocation, Link } from 'react-router-dom';
import queryString from 'query-string';
import BookshelfBookListHeader from './BookshelfBookListHeader';
import BookshelfFilter from './BookshelfFilter';

const Bookshelf = ({ books, ownBookshelf, children, shelf }) => {
  const [allBooks, setAllBooks] = useState(books);
  const [booksView, setBooksView] = useState({
    books, // a copy of books is passed down, not a ref
    startIndex: 0,
    endIndex: books.length,
    sort: '',
    order: ''
    // filter: ''
  });
  const [filter, setFilter] = useState('');

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

  const sortBooks = (books, col, order) => {
    let dir;
    switch (order) {
      case 1:
      case 'ascending':
        dir = 1;
        break;
      case -1:
      case 'descending':
        dir = -1;
        break;
      default:
        dir = 1;
        break;
    }

    switch (col) {
      case 'title':
        return books.sort(
          (b1, b2) =>
            dir *
            b1.bookId.title.localeCompare(b2.bookId.title, undefined, {
              numeric: true
            })
        );
      case 'author':
        return books.sort(
          (b1, b2) =>
            dir *
            b1.bookId.authors[0].name.localeCompare(
              b2.bookId.authors[0].name,
              undefined,
              { numeric: true }
            )
        );
      case 'avg-rating':
        return books.sort(
          (b1, b2) =>
            dir * (b1.bookId.average_rating - b2.bookId.average_rating)
        );
      case 'user-rating':
        return books.sort((b1, b2) => dir * (b1.userRating - b2.userRating));
      case 'my-rating':
        return books.sort((b1, b2) => dir * (b1.ownRating - b2.ownRating));
      case 'num-ratings':
        return books.sort(
          (b1, b2) => dir * (b1.bookId.ratings_count - b2.bookId.ratings_count)
        );
      case 'date':
      default:
        return books.sort(
          // (b1, b2) => dir*(new Date(b1.dateShelved) - new Date(b2.dateShelved))
          (b1, b2) =>
            dir * (new Date(b1.dateShelved) - new Date(b2.dateShelved))
        );
    }
  };

  const filterBooks = books => {
    if (filter)
      return books.filter(book => {
        // filter author or title
        const reg = new RegExp(filter, 'i');
        return (
          reg.test(book.bookId.title) || reg.test(book.bookId.authors[0].name)
        );
      });
    return books;
  };

  useLayoutEffect(() => {
    // console.log('RUNNING CHILD');
    const queryParamChanged = param => parsed[param] !== booksView[param];
    const parsed = queryString.parse(location.search);

    const booksChanged = books !== allBooks;

    let bookList = booksView.books;
    if (booksChanged) {
      setAllBooks(books);
      bookList = books;
    }

    // if sort/order params or the books changed, reorder
    // on initial mount, set the default ordering here
    // only run a default order if no order query param
    // default ordering is currently by dateShelved ascending, later will be book position
    // only run default orders if books have changed
    if (
      queryParamChanged('sort') ||
      queryParamChanged('order') ||
      booksChanged
    ) {
      bookList = sortBooks(bookList, parsed.sort, parsed.order);
    }

    if (parsed['per-page'] === 'infinite') {
      // scroll to top of page
      // determine when images have loaded
      // numScroll === any lower bound of enough books to scroll page
      const numScroll = Math.floor(window.innerHeight / 100) + 1; // each book has a min height of 100px

      setBooksView({
        books: bookList,
        startIndex: 0,
        endIndex: numScroll,
        sort: parsed.sort,
        order: parsed.order,
        filter: parsed.filter
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
          books: bookList,
          startIndex: (pageNum - 1) * 20,
          endIndex: pageNum * 20,
          sort: parsed.sort,
          order: parsed.order,
          filter: parsed.filter
        });
      } else if (perPage > 100) {
        setBooksView({
          books: bookList,
          startIndex: 0,
          endIndex: books.length,
          sort: parsed.sort,
          order: parsed.order,
          filter: parsed.filter
        });
      } else {
        setBooksView({
          books: bookList,
          startIndex: (pageNum - 1) * perPage,
          endIndex: pageNum * perPage,
          sort: parsed.sort,
          order: parsed.order,
          filter: parsed.filter
        });
      }
    }
  }, [location, books, filter]);

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
      <div className="pagination-head">
        <div className="pagination-filter">
          <BookshelfFilter filter={filter} setFilter={setFilter} />
        </div>
        {!infiniteScroll && total > 0 && (
          <Pagination
            useQueryParam
            noLimit
            perPage={perPage}
            total={total}
            baseLink={baseLink}
            page={page}
          />
        )}
      </div>

      <table>
        <thead>
          <BookshelfBookListHeader ownBookshelf={ownBookshelf} />
        </thead>
        <tbody>
          <BookshelfBookList
            // books={booksView.books.slice(
            //   booksView.startIndex,
            //   booksView.endIndex
            // )}
            books={filterBooks(booksView.books).slice(
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

import React from 'react';
import { NavLink } from 'react-router-dom';
import queryString from 'query-string';

const BookshelvesNav = ({ countShelf, buildBookshelfLink, books }) => {
  return (
    <nav className="Bookshelves__shelves-nav">
      <ul>
        <li className="list-header">Bookshelves</li>
        <li className="shelf-name">
          <NavLink
            to={buildBookshelfLink()}
            isActive={(match, location) => {
              return !queryString.parse(location.search).shelf;
            }}
            activeClassName="active-shelf"
          >
            All ({books.length.toLocaleString('en')})
          </NavLink>
        </li>
        <li className="shelf-name">
          <NavLink
            to={buildBookshelfLink('read')}
            isActive={(match, location) => {
              return queryString.parse(location.search).shelf === 'read';
            }}
            activeClassName="active-shelf"
          >
            Read ({countShelf(books, 'read').toLocaleString('en')})
          </NavLink>
        </li>
        <li className="shelf-name">
          <NavLink
            to={buildBookshelfLink('reading')}
            isActive={(match, location) => {
              return queryString.parse(location.search).shelf === 'reading';
            }}
            activeClassName="active-shelf"
          >
            Currently Reading (
            {countShelf(books, 'reading').toLocaleString('en')})
          </NavLink>
        </li>
        <li className="shelf-name">
          <NavLink
            to={buildBookshelfLink('to-read')}
            isActive={(match, location) => {
              return queryString.parse(location.search).shelf === 'to-read';
            }}
            activeClassName="active-shelf"
          >
            Want to Read ({countShelf(books, 'to-read').toLocaleString('en')})
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default BookshelvesNav;

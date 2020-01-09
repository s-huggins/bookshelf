import React from 'react';
import { Link } from 'react-router-dom';
import apostrophize from '../../../util/apostrophize';

const BookshelvesPanel = ({
  displayName,
  ownProfile,
  books,
  buildBookshelfLink,
  countShelf
}) => {
  return (
    <div className="panel panel--bookshelves">
      <div className="panel__header">
        <h2 className="panel__header-text">
          {ownProfile
            ? 'My bookshelves'
            : `${apostrophize(displayName)} bookshelves`}
        </h2>
      </div>
      <div className="panel__body">
        <ul className="shelves">
          <li>
            <Link to={buildBookshelfLink('read')}>
              read ({countShelf(books, 'read')})
            </Link>{' '}
          </li>
          <li>
            <Link to={buildBookshelfLink('reading')}>
              currently reading ({countShelf(books, 'reading')})
            </Link>
          </li>
          <li>
            <Link to={buildBookshelfLink('to-read')}>
              to read ({countShelf(books, 'to-read')})
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default BookshelvesPanel;

import React from 'react';
import { Link } from 'react-router-dom';
import CurrentRead from './CurrentRead';

const CurrentlyReadingPanel = ({
  books,
  ownProfile,
  displayName,
  buildBookshelfLink,
  bookCount
}) => {
  return (
    <div className="panel">
      <div className="panel__header">
        <h2 className="panel__header-text">
          {ownProfile
            ? 'Currently reading'
            : `${displayName} is currently reading`}
        </h2>
      </div>
      <div className="panel__body">
        {books
          .sort((b1, b2) => new Date(b2.dateShelved) - new Date(b1.dateShelved))
          .slice(0, 3)
          .map(_book => (
            <CurrentRead
              key={_book.bookId._id}
              dateShelved={_book.dateShelved}
              {..._book.bookId}
            />
          ))}
      </div>
      {bookCount > 3 && (
        <div className="panel__footer">
          <Link
            to={buildBookshelfLink('reading')}
            className="see-all-reading green-link"
          >
            {ownProfile
              ? `See all ${bookCount} books I am currently reading`
              : `See all ${bookCount} books ${displayName} is currently reading`}
          </Link>
        </div>
      )}
    </div>
  );
};

export default CurrentlyReadingPanel;

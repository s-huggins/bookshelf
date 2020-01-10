import React from 'react';
import { Link } from 'react-router-dom';
import CurrentRead from './CurrentRead';
import withRatingDisplayUpdate from './withUpdatingRating';

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
        {/* {books.map(_book => {
          const CurrentReadWithRatingDisplayUpdate = withRatingDisplayUpdate(
            CurrentRead
          );
          return (
            <CurrentReadWithRatingDisplayUpdate
              props={{ ..._book.bookId }}
              key={_book.bookId._id}
            />
          );
        })} */}
        {books.slice(0, 3).map(_book => (
          <CurrentRead key={_book.bookId._id} {..._book.bookId} />
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

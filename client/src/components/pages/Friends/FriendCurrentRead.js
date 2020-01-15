import React from 'react';
import { Link } from 'react-router-dom';
import InlineRating from '../../common/InlineRating';
import BookshelfDropdownButton from '../Profile/Bookshelves/BookshelfDropdownButton';
import cover from '../../../img/gulag.jpg';

import moment from 'moment';
import MiniRating from '../../common/MiniRating';
import pluralize from '../../../util/pluralize';

const CurrentRead = () => {
  // return <div className='FriendCurrentRead'>

  // </div>;
  return (
    <div className="FriendCurrentRead">
      <div className="book-panel book-panel--current-read">
        <div className="book-panel__cover">
          <Link to={`#!`}>
            <img src={cover} alt="bookcover" />
          </Link>
        </div>
        <div className="book-panel__details book-panel__details--current-read">
          <h3 className="book-panel__title">
            <Link to={`/book/`}>book title here</Link>
          </h3>
          <span>
            by{' '}
            <Link to={`/author/`} className="author-name">
              author name here
            </Link>
          </span>

          <span>
            <span className="minirating">
              <MiniRating average={4.4} />
            </span>
            <span className="text-tiny">
              {(4.23).toFixed(2)} avg rating —{' '}
              {`${2078} ${pluralize('rating', 2078)}`}
            </span>
          </span>
          <span className="book-panel__details-footer">
            <span>
              <Link to={`#!`} className="green-link bold-link">
                Stuart
              </Link>{' '}
              is currently reading it
            </span>
          </span>
        </div>
        <div className="book-panel__actions">
          <BookshelfDropdownButton
          // _id={_id}
          // title={title}
          // authors={authors}
          // image_url={image_url}
          />
          <span className="rate-text text-tiny">Rate this book</span>
          <div>
            <InlineRating
            // _id={_id}
            // title={title}
            // authors={authors}
            // image_url={image_url}
            // updateDisplay={updateRatingDisplay}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentRead;

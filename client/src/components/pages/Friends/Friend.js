import React from 'react';
import { Link } from 'react-router-dom';
import Avatar from '../Profile/Avatar';
import pluralize from '../../../util/pluralize';
import { printTimeAgo } from '../../../util/lastActive';

const Friend = ({
  isFriend,
  isYou,
  profileId,
  displayName,
  numFriends,
  numBooks,
  currentRead,
  avatar_id,
  lastActive
}) => {
  return (
    <div className="Friend">
      <div className="friend-info">
        <div className="friend-avatar">
          <Link to={`/user/${profileId}`}>
            <Avatar avatar_id={avatar_id} />
          </Link>
        </div>

        <div className="friend-details">
          <Link className="friend-name" to={`/user/${profileId}`}>
            {displayName}
          </Link>
          <span className="friend-nums">
            <Link
              to={`/user/${profileId}/bookshelves`}
            >{`${numBooks} ${pluralize('book', numBooks)}`}</Link>{' '}
            <span className="divider">|</span>{' '}
            <Link to={`/user/${profileId}/friends`}>{`${numFriends} ${pluralize(
              'friend',
              numFriends
            )}`}</Link>
          </span>
        </div>
      </div>
      <div className="friend-activity">
        {currentRead && (
          <>
            <div className="bookcover">
              <Link to={`/book/${currentRead.bookId._id}`}>
                <img src={currentRead.bookId.image_url} alt="bookcover" />
              </Link>
            </div>

            <div className="activity-details">
              <span className="currently-reading">Currently reading:</span>
              <Link
                to={`/book/${currentRead.bookId._id}`}
                className="book-title"
              >
                {currentRead.bookId.title}
              </Link>
              <span className="activity-time">
                — {printTimeAgo(new Date(lastActive))}
              </span>
            </div>
          </>
        )}
      </div>
      <div className="friend-actions">
        {isYou ? (
          <span className="small-text">This is you</span>
        ) : !isFriend ? (
          <button className="btn btn--light">Add friend</button>
        ) : null}
        <Link
          to={`/user/${profileId}/bookshelves`}
          className="green-link friend-action-link"
        >
          See bookshelves
        </Link>
      </div>
    </div>
  );
};

export default Friend;

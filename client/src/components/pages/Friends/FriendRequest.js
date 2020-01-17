import React from 'react';
import { Link } from 'react-router-dom';
import Avatar from '../Profile/Avatar';
import moment from 'moment';
import pluralize from '../../../util/pluralize';

const FriendRequest = ({
  date,
  profileId,
  displayName,
  location,
  numFriends,
  numBooks,
  avatar_id
}) => {
  const handleApprove = () => {};
  const handleIgnore = () => {};

  return (
    <div className="FriendRequest">
      <div className="FriendRequest__body">
        <div className="FriendRequest__avatar">
          <Link to={`/user/${profileId}`}>
            <Avatar avatar_id={avatar_id} />
          </Link>
        </div>
        <div className="FriendRequest__details">
          <ul>
            <li>
              <Link
                to={`/user/${profileId}`}
                className="green-link request-display-name"
              >
                {displayName}
              </Link>
            </li>
            <li>{`${numBooks.toLocaleString('en')} ${pluralize(
              'book',
              numBooks
            )}`}</li>
            <li>{`${numFriends.toLocaleString('en')} ${pluralize(
              'book',
              numFriends
            )}`}</li>
            <li>{location && location.value}</li>
          </ul>
        </div>
        <div className="FriendRequest__actions">
          <span className="action-confirm-text">
            Add{' '}
            <Link to={`/user/${profileId}`} className="green-link">
              {displayName}
            </Link>{' '}
            as a friend?
          </span>
          <span>
            <button className="btn btn--light" onClick={handleApprove}>
              Approve
            </button>
            <span className="faint-text">or</span>
            <button className="green-link ignore-link" onClick={handleIgnore}>
              ignore
            </button>
          </span>
        </div>
      </div>
      <div className="FriendRequest__footer">
        <span className="friend-request-time">
          {moment(date).format('Do MMM, YYYY hh:mm A')}
        </span>
      </div>
    </div>
  );
};

export default FriendRequest;

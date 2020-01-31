import React from 'react';
import avatar from '../../../img/avatar.png';
import { Link } from 'react-router-dom';
import Avatar from './Avatar';
import pluralize from '../../../util/pluralize';

const FriendPanel = ({
  profileId,
  avatar_id,
  displayName,
  numBooks,
  numFriends
}) => {
  return (
    <div className="FriendPanel">
      <div className="FriendPanel__avatar">
        <Link to={`/user/${profileId}`}>
          <Avatar avatar_id={avatar_id} />
        </Link>
      </div>
      <div className="FriendPanel__content">
        <Link to={`/user/${profileId}`} className="green-link friend-name">
          {displayName}
        </Link>
        <span className="details">
          <span>{`${numBooks} ${pluralize('book', numBooks)}`}</span>
          <span className="divider">|</span>
          <span>{`${numFriends} ${pluralize('friend', numFriends)}`}</span>
        </span>
      </div>
    </div>
  );
};

export default FriendPanel;

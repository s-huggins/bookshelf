import React from 'react';
import { Link } from 'react-router-dom';
import Avatar from '../Profile/Avatar';

const MessageAvatar = ({ profileId, avatar_id, displayName, archived }) => {
  return displayName ? (
    <span className="Message__profile Message__profile--recipient">
      <Link to={`/user/${profileId}`}>
        <Avatar avatar_id={avatar_id} />
      </Link>
      <Link to={`/user/${profileId}`} className="green-link">
        {displayName}
      </Link>
    </span>
  ) : (
    <span className="Message__profile Message__profile--recipient">
      <Avatar />
      {archived.displayName}
    </span>
  );
};

export default MessageAvatar;

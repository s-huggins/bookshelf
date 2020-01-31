import React from 'react';
import { Link } from 'react-router-dom';
import Avatar from '../Profile/Avatar';

const MessageAvatar = ({ profileId, displayName, profile }) => {
  return (
    <span className="Message__profile Message__profile--recipient">
      <Link to={`/user/${profileId}`}>
        <Avatar avatar_id={profile?.avatar_id} />
      </Link>
      <Link to={`/user/${profileId}`} className="green-link">
        {profile?.displayName || displayName}
      </Link>
    </span>
  );
};

export default MessageAvatar;

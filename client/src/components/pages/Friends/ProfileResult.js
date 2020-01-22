import React from 'react';
import Avatar from '../Profile/Avatar';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProfileResult = ({ location, id, displayName, avatar_id }) => {
  const handleAddFriend = e => {};

  const friendRequests = useSelector(
    state => state.auth.user.profile.friendRequests
  );
  const friends = useSelector(state => state.auth.user.profile.friends);

  return (
    <div className="ProfileResult">
      <Link to={`/user/${id}`}>
        <Avatar avatar_id={avatar_id} />
      </Link>
      <div className="ProfileResult__details">
        <span className="green-link display-name">
          <Link to={`/user/${id}`}>{displayName}</Link>
        </span>
        {location && location.value && <span>{location.value}</span>}
        <button className="btn btn--light" onClick={handleAddFriend}>
          Add as a Friend
        </button>
      </div>
    </div>
  );
};

export default ProfileResult;

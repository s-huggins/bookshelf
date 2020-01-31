import React from 'react';
import Avatar from '../Profile/Avatar';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import FriendButton from '../../common/FriendButton';

const ProfileResult = ({ location, id, displayName, avatar_id, handle }) => {
  const ownId = useSelector(state => state.auth.user.profile.id);

  return (
    <div className="ProfileResult">
      <Link to={`/user/${id}`}>
        <Avatar avatar_id={avatar_id} />
      </Link>
      <div className="ProfileResult__details">
        <span className="display-name">
          <Link to={`/user/${id}`} className="green-link">
            {displayName}
          </Link>{' '}
          {handle && (
            <Link to={`/${handle}`} className="green-link">
              {'<' + handle + '>'}
            </Link>
          )}
        </span>
        {location && location.value && <span>{location.value}</span>}
        {/* <button className="btn btn--light" onClick={handleAddFriend}>
          Add as a Friend
        </button> */}
        {id === ownId ? (
          <span className="text-muted">This is you</span>
        ) : (
          <FriendButton profileId={id} displayName={displayName} />
        )}
      </div>
    </div>
  );
};

export default ProfileResult;

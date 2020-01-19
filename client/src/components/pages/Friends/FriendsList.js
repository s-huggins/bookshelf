import React from 'react';
import Friend from './Friend';
import { useSelector } from 'react-redux';

const FriendsList = ({ friendsView }) => {
  const ownFriends = useSelector(state => state.auth.user.profile.friends);
  const ownFriendsSet = new Set(ownFriends.map(fr => fr.profileId));
  return (
    <div className="FriendsList">
      {friendsView.friends.map(fr => (
        <Friend
          key={fr.profileId}
          profileId={fr.profileId}
          {...fr.profile}
          isFriend={ownFriendsSet.has(fr.profileId)}
        />
      ))}
    </div>
  );
};

export default FriendsList;

import React from 'react';
import { useSelector } from 'react-redux';
import OwnFriends from './OwnFriends';
import OtherFriends from './OtherFriends';

const FriendsFork = ({ match }) => {
  // PrivateRoute ensures non-null userProfile
  const userProfile = useSelector(state => state.auth.user.profile);

  let friendsPage = null;

  if (match.params.id) {
    const profId = +match.params.id;
    // if (profId === userProfile.id) friendsPage = <OwnFriends />;
    // else friendsPage = <OtherFriends />;

    friendsPage = profId === userProfile.id ? <OwnFriends /> : <OtherFriends />;
  } else if (match.params.handle) {
    const handle = match.params.handle;
    // if (handle === userProfile.handle) friendsPage = <OwnFriends />;
    // else friendsPage = <OwnFriends />;

    friendsPage =
      handle === userProfile.handle ? <OwnFriends /> : <OtherFriends />;
  }

  return friendsPage;
};

export default FriendsFork;

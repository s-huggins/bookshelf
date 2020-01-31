import React from 'react';
import PrivateRoute from './PrivateRoute';
import Bookshelves from '../pages/Profile/Bookshelves/Bookshelves';
import Profile from '../pages/Profile/Profile';
import Edit from '../pages/Edit/Edit';
import OwnFriends from '../pages/Friends/OwnFriends';
import FriendRequests from '../pages/Friends/FriendRequests';
import FriendsReading from '../pages/Friends/FriendsReading';
import FriendsFork from '../pages/Friends/FriendsFork';
import FriendsOfFriends from '../pages/Friends/FriendsOfFriends';
import FindFriends from '../pages/Friends/FindFriends';

export default segment => {
  const propsArray = [
    { path: `${segment}/edit`, component: Edit },
    { path: `${segment}/bookshelves`, component: Bookshelves },
    { path: `${segment}/friends`, component: OwnFriends },
    { path: `${segment}/friends/requests`, component: FriendRequests },
    { path: `${segment}/friends/reading`, component: FriendsReading },
    { path: `${segment}/friends/find`, component: FindFriends },
    { path: `${segment}/friends/of-friends`, component: FriendsOfFriends },
    { path: `${segment}/:id/bookshelves`, component: Bookshelves },
    { path: `${segment}/:id/friends`, component: FriendsFork },
    { path: `${segment}/:id?`, component: Profile }
  ];

  return propsArray.map(props => (
    <PrivateRoute exact {...props} key={props.path} />
  ));
};

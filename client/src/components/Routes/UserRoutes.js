import React from 'react';
import PrivateRoute from './PrivateRoute';
import Bookshelves from '../pages/Profile/Bookshelves/Bookshelves';
import Profile from '../pages/Profile/Profile';
import Edit from '../pages/Edit/Edit';
import Friends from '../pages/Friends/Friends';
import FriendRequests from '../pages/Friends/FriendRequests';
import FriendsReading from '../pages/Friends/FriendsReading';

export default segment => {
  const propsArray = [
    { path: `${segment}/edit`, component: Edit },
    { path: `${segment}/bookshelves`, component: Bookshelves },
    { path: `${segment}/friends`, component: Friends },
    { path: `${segment}/friends/requests`, component: FriendRequests },
    { path: `${segment}/friends/reading`, component: FriendsReading },
    { path: `${segment}/:id/bookshelves`, component: Bookshelves },
    { path: `${segment}/:id/friends`, component: Friends },
    { path: `${segment}/:id?`, component: Profile }
  ];

  return propsArray.map(props => (
    <PrivateRoute exact {...props} key={props.path} />
  ));
};

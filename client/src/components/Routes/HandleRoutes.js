import React from 'react';
import PrivateRoute from './PrivateRoute';
import Bookshelves from '../pages/Profile/Bookshelves/Bookshelves';
import Profile from '../pages/Profile/Profile';
// import Friends from '../pages/Friends/Friends';
import FriendsFork from '../pages/Friends/FriendsFork';

export default segment => {
  const propsArray = [
    { path: `${segment}/bookshelves`, component: Bookshelves },
    // { path: `${segment}/friends`, component: Friends },
    { path: `${segment}/friends`, component: FriendsFork },
    { path: `${segment}`, component: Profile }
  ];

  return propsArray.map(props => (
    <PrivateRoute exact {...props} key={props.path} />
  ));
};

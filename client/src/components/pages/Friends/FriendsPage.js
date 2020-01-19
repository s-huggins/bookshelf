import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import FriendsList from './FriendsList';
import FindFriendsPanel from './FindFriendsPanel';
import FriendsListHeader from './FriendsListHeader';
import { useEffect } from 'react';
import queryString from 'query-string';
import { useState } from 'react';

const FriendsPage = ({ profile }) => {
  console.log(profile);
  const location = useLocation();
  const [filteredView, setFilteredView] = useState({
    friends: profile.friends,
    startIndex: 0,
    endIndex: profile.friends.length - 1
  });
  useEffect(() => {
    const parsed = queryString.parse(location.search);
    // filter friends list here to be passed down to FriendsList component
    // filter order page
  }, [location]);

  return (
    <div className="FriendsPage Friends__page">
      <div className="Friends__page-main">
        <form className="friends-search">
          <span className="friends-search-searchbar">
            <input
              type="text"
              className="form-control"
              placeholder="Search your friends list"
            />{' '}
            <button>
              <i className="fas fa-search"></i>
            </button>
          </span>
        </form>
        <FriendsListHeader friendsView={filteredView} />
        <FriendsList friendsView={filteredView} />
      </div>
      <div className="Friends__page-side sidebar">
        <div className="sidebar__panel link-list">
          <ul>
            <li>
              <Link to="/user/friends/requests" className="green-link">
                Friend requests{' '}
                <span className="notification-text">(1 new)</span>
              </Link>
            </li>
            <li>
              <Link to="/user/friends/reading" className="green-link">
                Books my friends are reading
              </Link>
            </li>
          </ul>
        </div>
        <FindFriendsPanel />
      </div>
    </div>
  );
};

export default FriendsPage;

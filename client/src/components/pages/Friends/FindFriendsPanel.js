import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useEffect } from 'react';
import SearchMembers from './SearchMembers';

const FindFriendsPanel = ({ setActiveNavLink }) => {
  const history = useHistory();
  const onClickIcon = () => {
    if (history.location.pathname.startsWith('/user/friends/requests')) {
      history.push('/user/friends', { activeNavLink: 'add-friends' });
    } else {
      setActiveNavLink('add-friends');
    }
  };

  return (
    <div className="FindFriendsPanel">
      <h2 className="sidebar__header">Find friends from</h2>
      <div className="sidebar__panel find-friends">
        <ul>
          <li>
            <i className="fas fa-envelope"></i>

            <button className="green-link button-link" onClick={onClickIcon}>
              Mail
            </button>
          </li>

          <li>
            <i className="fab fa-twitter"></i>
            <button className="green-link button-link" onClick={onClickIcon}>
              Twitter
            </button>
          </li>
          <li>
            <i className="fas fa-user-friends"></i>

            <Link to="/user/friends/of-friends" className="green-link">
              Friends of friends
            </Link>
          </li>
        </ul>
        <SearchMembers />
      </div>
    </div>
  );
};

export default FindFriendsPanel;

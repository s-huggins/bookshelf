import React from 'react';
import { Link } from 'react-router-dom';
import FriendsList from './FriendsList';
import FindFriendsPanel from './FindFriendsPanel';

const FriendsPage = ({ profile }) => {
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
        <div className="list-header">
          <div className="showing-detail">Showing 1-9 of 9</div>

          <div className="pagination-header">
            <span>
              <span className="filter-all">
                <Link to="#!">all</Link>
              </span>
              {'abcdefghijklmnopqrstuvwxyz'.split('').map(l => (
                <span key={l} className="filter-letter">
                  <Link to="#!" className="green-link">
                    {l}
                  </Link>
                </span>
              ))}
            </span>
            <span>
              <select name="sort" id="friends-sort">
                <option value="last-active">last active</option>
                <option value="display-name">display name</option>

                <option value="date-added">date added</option>
              </select>
            </span>
          </div>
        </div>
        <FriendsList />
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

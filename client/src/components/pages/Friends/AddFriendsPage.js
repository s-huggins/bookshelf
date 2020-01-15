import React from 'react';
import { Link } from 'react-router-dom';
import Friend from './Friend';
const AddFriendsPage = () => {
  return (
    <div className="AddFriendsPage Friends__page">
      <div className="Friends__page-main">
        <h2 className="add-friends-header">
          Find friends in your address book who are on bookshelf.
        </h2>
        <div className="friends-address-search">
          <input
            type="text"
            className="form-control"
            placeholder="Email or Twitter handle"
          />{' '}
          <button className="btn btn--light">Search</button>
        </div>
        <div className="friend-result">
          <span className="no-results-text">No profile found.</span>
          <Friend />
        </div>
      </div>
      <div className="Friends__page-side sidebar">
        <div className="sidebar__panel link-list">
          <ul>
            <li>
              <Link to="#!" className="green-link">
                View friends of friends
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AddFriendsPage;

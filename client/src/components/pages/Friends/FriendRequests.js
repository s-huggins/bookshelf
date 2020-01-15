import React from 'react';
import { Link } from 'react-router-dom';
import FindFriendsPanel from './FindFriendsPanel';
import FriendRequest from './FriendRequest';

const FriendRequests = () => {
  return (
    <div className="FriendRequests">
      <div className="container">
        <main className="Friends__page">
          <div className="Friends__page-main">
            <h1>
              <Link to="/user/friends" className="green-link">
                Friends
              </Link>{' '}
              > Requests
            </h1>
            <div className="FriendRequests__requests">
              <FriendRequest />
            </div>
          </div>

          <div className="Friends__page-side sidebar">
            <FindFriendsPanel />
          </div>
        </main>
      </div>
    </div>
  );
};

export default FriendRequests;

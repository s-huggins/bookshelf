import React from 'react';
import { Link } from 'react-router-dom';
import CurrentRead from './FriendCurrentRead';
import Pagination from '../../common/Pagination';

const Reading = () => {
  return (
    <div className="FriendsReading page-container">
      <div className="container">
        <main>
          <h1>
            <Link to="/user/friends" className="green-link">
              Friends
            </Link>{' '}
            > Reading
          </h1>
          <h2>Books My Friends Are Reading</h2>
          <div className="FriendsReading__list">
            <div className="FriendsReading__pagination">
              <Pagination />
            </div>
            <CurrentRead />
            <CurrentRead />
            <CurrentRead />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Reading;

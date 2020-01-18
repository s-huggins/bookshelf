import React from 'react';
import avatar from '../../../img/avatar.png';
import { Link } from 'react-router-dom';

const FriendPanel = () => {
  return (
    <div className="FriendPanel">
      <img src={avatar} alt="avatar" className="FriendPanel__avatar" />
      <div className="FriendPanel__content">
        <Link to="/user/1" className="green-link friend-name">
          Jordy
        </Link>
        <span className="details">
          <span>126 books</span>
          <span className="divider">|</span>
          <span>3 friends</span>
        </span>
      </div>
    </div>
  );
};

export default FriendPanel;

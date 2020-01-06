import React from 'react';
import avatar from '../../../img/avatar.png';

const FriendPanel = () => {
  return (
    <div className="FriendPanel">
      <img src={avatar} alt="avatar" className="FriendPanel__avatar" />
      <div className="FriendPanel__content">
        <a href="#!" className="green-link friend-name">
          Jordy
        </a>
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

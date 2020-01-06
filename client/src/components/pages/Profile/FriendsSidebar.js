import React from 'react';
import avatar from '../../../img/avatar.png';
import FriendPanel from './FriendPanel';

const FriendsSidebar = () => {
  return (
    <div className="sidebar">
      <h3 className="sidebar__header">Stuart's friends (3)</h3>
      <ul>
        <li>
          <FriendPanel />
        </li>
        <li>
          <FriendPanel />
        </li>
      </ul>

      <div className="sidebar__footer">
        <a href="#!" className="green-link">
          More friends...
        </a>
      </div>
    </div>
  );
};

export default FriendsSidebar;

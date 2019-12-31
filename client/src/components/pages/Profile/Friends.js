import React from 'react';
import avatar from '../../../img/avatar.png';

const Friends = () => {
  return (
    <div className="sidebar">
      <div className="sidebar__panel">
        <h3 className="sidebar__panel-header">Stuart's friends (3)</h3>
        <ul>
          <li>
            <div className="friend__panel">
              <img src={avatar} alt="avatar" className="friend__panel-img" />
              <div className="friend__panel-content">
                <a href="#!" className="green-link">
                  Jordy
                </a>
                <span>126 books</span>
                <span className="divider">|</span>
                <span>3 friends</span>
              </div>
            </div>
          </li>
          <li>
            <div className="friend__panel">
              <img src={avatar} alt="avatar" className="friend__panel-img" />
              <div className="friend__panel-content">
                <a href="#!" className="green-link">
                  Jamie
                </a>
                <span>237 books</span>
                <span className="divider">|</span>
                <span>13 friends</span>
              </div>
            </div>
          </li>
        </ul>

        <div className="sidebar__panel-footer">
          <a href="#!" className="green-link">
            More friends...
          </a>
        </div>
      </div>
    </div>
  );
};

export default Friends;

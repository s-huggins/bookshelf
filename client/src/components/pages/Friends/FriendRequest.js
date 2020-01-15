import React from 'react';
import pepe from '../../../img/pepe.png';
import { Link } from 'react-router-dom';

const FriendRequest = () => {
  return (
    <div className="FriendRequest">
      <div className="FriendRequest__body">
        <div className="FriendRequest__avatar">
          <Link to="#!">
            <img src={pepe} alt="avatar" />
          </Link>
        </div>
        <div className="FriendRequest__details">
          <ul>
            <li>
              <Link to="#!" className="green-link request-display-name">
                Jordy
              </Link>
            </li>
            <li>16 books</li>
            <li>0 friends</li>
            <li>The United States</li>
          </ul>
        </div>
        <div className="FriendRequest__actions">
          <span className="action-confirm-text">
            Add{' '}
            <Link to="#!" className="green-link">
              Jordy
            </Link>{' '}
            as a friend?
          </span>
          <span>
            <button className="btn btn--light">Approve</button>{' '}
            <span className="faint-text">or</span>
            <Link to="#!" className="green-link ignore-link">
              ignore
            </Link>
          </span>
        </div>
      </div>
      <div className="FriendRequest__footer">
        <span className="friend-request-time">25 minutes ago</span>
      </div>
    </div>
  );
};

export default FriendRequest;

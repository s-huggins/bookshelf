import React from 'react';
import pepe from '../../../img/pepe.png';
import moby from '../../../img/moby.jpg';
import { Link } from 'react-router-dom';

const Friend = () => {
  return (
    <div className="Friend">
      <div className="friend-info">
        <div className="friend-avatar">
          <Link to="#!">
            <img src={pepe} alt="avatar" />
          </Link>
        </div>

        <div className="friend-details">
          <Link className="friend-name" to="#!">
            Jordy
          </Link>
          <span className="friend-nums">
            <Link to="#!">924 books</Link> <span className="divider">|</span>{' '}
            <Link to="#!">104 friends</Link>
          </span>
        </div>
      </div>
      <div className="friend-activity">
        <div className="bookcover">
          <Link to="#!">
            <img src={moby} alt="bookcover" />
          </Link>
        </div>

        <div className="activity-details">
          <span className="currently-reading">Currently reading:</span>
          <Link to="#!" className="book-title">
            Moby Dick
          </Link>
          <span className="activity-time">— 10 hours, 28 min ago</span>
        </div>
      </div>
      <div className="friend-actions">
        <button className="btn btn--light">Add friend</button>
        <Link to="#!" className="green-link friend-action-link">
          See bookshelves
        </Link>
      </div>
    </div>
  );
};

export default Friend;

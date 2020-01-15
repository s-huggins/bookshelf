import React from 'react';
import { Link } from 'react-router-dom';

const FindFriendsPanel = () => {
  return (
    <div className="FindFriendsPanel">
      <h2 className="sidebar__header">Find friends from</h2>
      <div className="sidebar__panel find-friends">
        <ul>
          <li>
            {' '}
            <i className="fas fa-envelope"></i>{' '}
            <Link to="#!" className="green-link">
              Mail
            </Link>
          </li>

          <li>
            {' '}
            <i className="fab fa-twitter"></i>{' '}
            <Link to="#!" className="green-link">
              Twitter
            </Link>
          </li>
          <li>
            {' '}
            <i className="fas fa-user-friends"></i>{' '}
            <Link to="#!" className="green-link">
              Friends of friends
            </Link>
          </li>
        </ul>
        <form className="search-members">
          <input
            type="text"
            className="form-control"
            placeholder="Find by name or email"
          />
          <button className="btn btn--light">Search members</button>
        </form>
      </div>
    </div>
  );
};

export default FindFriendsPanel;

{
  /* <li>
              {' '}
              <i className="fab fa-facebook-square"></i>{' '}
              <Link to="#!" className="green-link">
                Facebook
              </Link>
            </li> */
}

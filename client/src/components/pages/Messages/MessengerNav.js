import React from 'react';
import { NavLink } from 'react-router-dom';

const MessengerNav = () => {
  return (
    <ul className="messenger-nav-list">
      <li className="messenger-nav-compose">
        <NavLink
          to="/message/new"
          className="green-link"
          activeClassName="nav-active"
        >
          compose
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/message/inbox"
          className="green-link"
          activeClassName="nav-active"
        >
          inbox
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/message/saved"
          className="green-link"
          activeClassName="nav-active"
        >
          saved
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/message/sent"
          className="green-link"
          activeClassName="nav-active"
        >
          sent
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/message/trash"
          className="green-link"
          activeClassName="nav-active"
        >
          trash
        </NavLink>
      </li>
    </ul>
  );
};

export default MessengerNav;

// import React from 'react';
// import { Link } from 'react-router-dom';

// const MessengerNav = () => {
//   return (
//     <ul className="messenger-nav-list">
//       <li className="messenger-nav-compose">
//         <Link to="/message/new" className="green-link">
//           compose
//         </Link>
//       </li>
//       <li>
//         <Link to="/message/inbox" className="green-link">
//           inbox
//         </Link>
//       </li>
//       <li>
//         <Link to="/message/saved" className="green-link">
//           saved
//         </Link>
//       </li>
//       <li>
//         <Link to="/message/outbox" className="green-link">
//           sent
//         </Link>
//       </li>
//       <li>
//         <Link to="/message/trash" className="green-link">
//           trash
//         </Link>
//       </li>
//     </ul>
//   );
// };

// export default MessengerNav;

import React from 'react';
import { Link, NavLink } from 'react-router-dom';

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

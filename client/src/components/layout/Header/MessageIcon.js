import React from 'react';
import { Link } from 'react-router-dom';

const MessageIcon = ({ numUnread }) => {
  return (
    <>
      <Link to="/message/inbox">
        <i className="fas fa-envelope" title="Messages"></i>
        {numUnread > 0 && (
          <span className="notification-badge">{numUnread}</span>
        )}
      </Link>
    </>
  );
};

export default MessageIcon;

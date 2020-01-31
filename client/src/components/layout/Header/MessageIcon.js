import React from 'react';
import { Link } from 'react-router-dom';

const MessageIcon = ({ inbox }) => {
  const unreadMessages = inbox.filter(msg => !msg.trash.trashed && !msg.read)
    .length;
  return (
    <>
      <Link to="/message/inbox">
        <i className="fas fa-envelope" title="Messages"></i>
        {unreadMessages > 0 && (
          <span className="notification-badge">{unreadMessages}</span>
        )}
      </Link>
    </>
  );
};

export default MessageIcon;

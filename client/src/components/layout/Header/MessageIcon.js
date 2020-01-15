import React from 'react';
import { Link } from 'react-router-dom';

const MessageIcon = () => {
  return (
    <>
      <Link to="#!">
        <i className="fas fa-envelope" title="Messages"></i>
        {/* <span className="notification-badge"></span>  TODO: ADD BACK IN*/}
      </Link>
    </>
  );
};

export default MessageIcon;

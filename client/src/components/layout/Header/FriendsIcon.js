import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';

const FriendsIcon = ({ friendRequests }) => {
  const outstandingRequests = friendRequests.filter(
    req => req.kind === 'Received'
  );

  const numFriendRequests = outstandingRequests.length;
  const iconLink =
    numFriendRequests > 0 ? '/user/friends/requests' : '/user/friends/';

  return (
    <Fragment>
      <Link to={iconLink}>
        <i className="fas fa-users" title="Friends"></i>
        {numFriendRequests > 0 && (
          <span className="notification-badge">{numFriendRequests}</span>
        )}
      </Link>
    </Fragment>
  );
};

export default FriendsIcon;

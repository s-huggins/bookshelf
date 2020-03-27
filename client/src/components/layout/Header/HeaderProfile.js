import React from 'react';
import HeaderSearch from './Search/HeaderSearch';
import ProfileIcon from './ProfileIcon';
import FriendsIcon from './FriendsIcon';
import { useSelector } from 'react-redux';
import MessageIcon from './MessageIcon';

const HeaderProfile = () => {
  // Parent Header component has ensured authentication, and consequently a loaded user profile

  const friendRequests = useSelector(
    state => state.auth.user.profile.friendRequests
  );
  const firstName = useSelector(state => state.auth.user.profile.firstName);
  const numUnread = useSelector(state => state.mail.mailbox.numUnread);

  return (
    <div className="HeaderProfile">
      <HeaderSearch />

      <div className="icons-container">
        {/* <a href="#!">
          <i className="fas fa-bell" title="Notifications"></i>
          <span className="notification-badge"></span> TODO: notifications component
        </a> */}

        <MessageIcon numUnread={numUnread} />
        <FriendsIcon friendRequests={friendRequests} />
        <ProfileIcon firstName={firstName} />
      </div>
    </div>
  );
};

export default HeaderProfile;

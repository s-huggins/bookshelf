import React, { useState, useEffect } from 'react';
import Loader from '../../common/Loader';
import useLoadProfile from '../Profile/Hooks/useLoadProfile';
import { Redirect, withRouter, useLocation } from 'react-router-dom';
import PrivateProfile from '../Profile/PrivateProfile';
import FriendsPage from './FriendsPage';
import AddFriendsPage from './AddFriendsPage';

const OwnFriends = () => {
  const [loadingProfile, profile] = useLoadProfile();
  const location = useLocation();
  const [activeNavLink, setActiveNavLink] = useState('friends');

  // if arriving from friend-requests page, location will contain state to choose display
  useEffect(() => {
    if (location?.state?.activeNavLink)
      setActiveNavLink(location?.state?.activeNavLink);
  }, []);

  const handleNavChange = e => {
    if (loadingProfile) return;
    const navLink = e.target.dataset.target;
    if (navLink) {
      setActiveNavLink(navLink);
    }
  };

  const selectFriendsPage = navLink => {
    switch (navLink) {
      case 'friends':
        return (
          <FriendsPage profile={profile} setActiveNavLink={setActiveNavLink} />
        );
      case 'add-friends':
        return <AddFriendsPage />;
    }
  };

  if (!loadingProfile && profile == null) return <Redirect to="/not-found" />;
  // TODO: and if not a friend
  if (!loadingProfile && !profile.isPublic) {
    return <PrivateProfile profile={profile} />;
  }
  return (
    <div className="Friends page-container">
      <div className="container">
        <main>
          <div className="Friends__header">
            <h1>Friends</h1>
            <nav className="page-nav">
              <ul className="page-nav__nav-links" onClick={handleNavChange}>
                <li
                  className={`page-nav__nav-link${
                    activeNavLink === 'friends' ? ' active' : ''
                  }`}
                  data-target="friends"
                >
                  Friends
                </li>
                <li
                  className={`page-nav__nav-link${
                    activeNavLink === 'add-friends' ? ' active' : ''
                  }`}
                  data-target="add-friends"
                >
                  Add Friends
                </li>
              </ul>
            </nav>
          </div>

          {loadingProfile ? <Loader /> : selectFriendsPage(activeNavLink)}
        </main>
      </div>
    </div>
  );
};

export default withRouter(OwnFriends);

import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { signOut } from '../../../redux/auth/authActions';

const ProfileIcon = ({ firstName }) => {
  const headerProfile = useRef(null);
  const headerProfileDropdown = useRef(null);

  useEffect(() => {
    const profileIcon = headerProfile.current;
    const dropdown = headerProfileDropdown.current;
    dropdown.style.display = 'none';

    // clicking the profile icon toggles menu display
    profileIcon.addEventListener('click', function() {
      if (dropdown.style.display === 'none') {
        dropdown.style.display = 'block';
      } else {
        dropdown.style.display = 'none';
      }
    });

    // clicking outside the menu should close it too
    document.addEventListener('click', function(e) {
      const menuClick =
        dropdown.contains(e.target) || profileIcon.contains(e.target);

      if (!menuClick) {
        dropdown.style.display = 'none';
      }
    });
  }, []);

  const logOut = e => {
    e.preventDefault();
    signOut();
    window.location.reload();
    // history.push('/');
  };

  return (
    <>
      <span className="header-profile" ref={headerProfile}>
        <i className="fas fa-user" title="Profile"></i>
      </span>

      <div className="header-profile-dropdown" ref={headerProfileDropdown}>
        <ul>
          <li className="dropdown-name">{firstName}</li>
          <Link to="/user">
            <li>Profile</li>
          </Link>

          <Link to="/user/friends">
            <li>Friends</li>
          </Link>

          <a href="#!">
            <li>Profile</li>
          </a>
        </ul>

        <hr />
        <ul>
          <Link to="/user/edit">
            <li>Account settings</li>
          </Link>
          <button className="signout-button" onClick={logOut}>
            <li>Sign out</li>
          </button>
        </ul>
      </div>
    </>
  );
};

export default ProfileIcon;

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import HeaderSearch from './Search/HeaderSearch';
import { signOut } from '../../../redux/auth/authActions';

const HeaderProfile = ({ location }) => {
  // const name = useSelector(state => state.auth.user.name);
  const name = useSelector(state => state.auth.user.profile.firstName);
  // const [profileDropdownVisible, setProfileDropdownVisible] = useState(false);
  // sets up a menu dropdown event when the profile icon is clicked
  useEffect(() => {
    // TODO: use refs
    const profileIcon = document.getElementById('header-profile');
    const dropdown = document.getElementById('header-profile-dropdown');
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
    <div className="HeaderProfile">
      <HeaderSearch />

      <div className="icons-container">
        <a href="#!">
          <i className="fas fa-bell" title="Notifications"></i>
        </a>

        <a href="#!">
          <i className="fas fa-envelope" title="Messages"></i>
        </a>

        <a href="#!">
          <i className="fas fa-users" title="Friends"></i>
        </a>

        {/* <Link id="header-profile" to='#!'><i className="fas fa-user" title="Profile"></i></Link> */}
        <span className="header-profile" id="header-profile">
          <i className="fas fa-user" title="Profile"></i>
        </span>

        <div className="header-profile-dropdown" id="header-profile-dropdown">
          <ul>
            <li className="dropdown-name">{name}</li>
            <Link to="/user">
              <li>Profile</li>
            </Link>

            <a href="#">
              <li>Friends</li>
            </a>

            <a href="#!">
              <li>Profile</li>
            </a>
          </ul>

          <hr />
          <ul>
            <Link to="/user/edit">
              <li>Account settings</li>
            </Link>

            <a href="#!" onClick={logOut}>
              <li>Sign out</li>
            </a>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default HeaderProfile;

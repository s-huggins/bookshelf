import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Redirect } from 'react-router-dom';
import Loader from '../../common/Loader';
import EditProfile from './EditProfile';
import EditAccount from './EditAccount';
import Alert from '../../common/Alert';
import { clearEditStatus } from '../../../redux/profile/profileActions';
import useLoadProfile from '../Profile/Hooks/useLoadProfile';

const Edit = () => {
  const { user } = useSelector(state => state.auth);
  const [loadingProfile, profile] = useLoadProfile();
  const editStatus = useSelector(state => state.profile.editStatus);

  const dispatch = useDispatch();

  const [activeNavLink, setActiveNavLink] = useState('profile');
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [alert, setAlert] = useState(null);

  /* Display success or failure alerts after a profile update */
  useEffect(() => {
    if (editStatus === 'success') {
      setAlert({
        type: 'info',
        message: 'The changes to your profile have been saved.'
      });
    } else if (editStatus === 'fail') {
      setAlert({
        type: 'warning',
        message:
          'Your updates were not saved. Please check your inputs and try again.'
      });
    }
    dispatch(clearEditStatus());
  }, [editStatus]);

  useEffect(() => {
    if (loadingEdit) {
      setLoadingEdit(false);
    }
  }, [profile, editStatus]);

  const handleNavChange = e => {
    if (loadingProfile || loadingEdit) return;
    const navLink = e.target.dataset.target;
    if (navLink) {
      setActiveNavLink(navLink);
    }
  };

  const selectEditPage = navLink => {
    switch (navLink) {
      case 'profile':
        return (
          <EditProfile profile={profile} setLoadingEdit={setLoadingEdit} />
        );
      case 'settings':
        return (
          <EditAccount
            profile={profile}
            user={user}
            setLoadingEdit={setLoadingEdit}
          />
        );
    }
  };

  if (!loadingProfile && !profile) return <Redirect to="/" />;

  return (
    <div className="EditProfile page-container">
      <div className="container">
        <main>
          {alert && (
            <Alert
              type={alert.type}
              message={alert.message}
              handleDismiss={() => setAlert(null)}
            />
          )}
          <h1>Account settings</h1>
          <nav className="page-nav">
            <ul className="page-nav__nav-links" onClick={handleNavChange}>
              <li
                className={`page-nav__nav-link${
                  activeNavLink === 'profile' ? ' active' : ''
                }`}
                data-target="profile"
              >
                Profile
              </li>
              <li
                className={`page-nav__nav-link${
                  activeNavLink === 'settings' ? ' active' : ''
                }`}
                data-target="settings"
              >
                Settings
              </li>
            </ul>
          </nav>

          {loadingProfile || loadingEdit ? (
            <Loader />
          ) : (
            selectEditPage(activeNavLink)
          )}
        </main>
      </div>
    </div>
  );
};

export default Edit;

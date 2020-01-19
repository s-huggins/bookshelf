import React from 'react';
import { Link, withRouter, Redirect } from 'react-router-dom';
import FriendsList from './FriendsList';
import useLoadProfile from '../Profile/Hooks/useLoadProfile';
import Loader from '../../common/Loader';
import PrivateProfile from '../Profile/PrivateProfile';

const OtherFriends = () => {
  const [loadingProfile, profile] = useLoadProfile();

  if (loadingProfile) {
    return <Loader />;
  }
  if (profile == null) return <Redirect to="/not-found" />;

  // TODO: and if not a friend
  if (!profile.isPublic) {
    return <PrivateProfile profile={profile} />;
  }

  return (
    <div className="OtherFriends Friends page-container">
      <div className="container">
        <main className="Friends__page">
          <div className="Friends__page-main">
            <div className="Friends__header Friends__header--other">
              <h1>
                Ryan's Friends{' '}
                <span className="small-text">Showing 1-30 of 105</span>
              </h1>
              <Link to="#!" className="green-link profile-link">
                Ryan's profile
              </Link>
            </div>
            <div className="OtherFriends__list">
              <div className="list-header">
                <span>
                  <span className="text-faded sort-label">sort by</span>
                  <select name="sort">
                    <option value="last-active">last active</option>
                    <option value="display-name">display name</option>

                    <option value="date-added">date added</option>
                  </select>
                </span>
                <span>pagination here</span>
              </div>
              <FriendsList />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default withRouter(OtherFriends);

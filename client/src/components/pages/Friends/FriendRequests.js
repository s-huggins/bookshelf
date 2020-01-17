import React from 'react';
import { Link } from 'react-router-dom';
import FindFriendsPanel from './FindFriendsPanel';
import FriendRequest from './FriendRequest';
import useLoadProfile from '../Profile/Hooks/useLoadProfile';
import Loader from '../../common/Loader';
import { useSelector } from 'react-redux';

const FriendRequests = () => {
  const profile = useSelector(state => state.profile.loadedProfile);
  const loadingProfile = useLoadProfile();

  return (
    <div className="FriendRequests page-container">
      <div className="container">
        <main className="Friends__page">
          <div className="Friends__page-main">
            <h1>
              <Link to="/user/friends" className="green-link">
                Friends
              </Link>{' '}
              > Requests
            </h1>

            {loadingProfile ? (
              <Loader />
            ) : (
              <div className="FriendRequests__requests">
                {profile.friendRequests.length > 0 ? (
                  profile.friendRequests
                    .filter(fReq => fReq.kind === 'Received')
                    .map(fReq => (
                      <FriendRequest
                        key={fReq.profileId}
                        date={fReq.date}
                        profileId={fReq.profileId}
                        {...fReq.profile}
                      />
                    ))
                ) : (
                  <p className="no-requests">You have no friend requests.</p>
                )}
              </div>
            )}
          </div>

          <div className="Friends__page-side sidebar">
            <FindFriendsPanel />
          </div>
        </main>
      </div>
    </div>
  );
};

export default FriendRequests;

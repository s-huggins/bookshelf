import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProfileDetailsFooter from './ProfileDetailsFooter';
import { useDispatch, useSelector } from 'react-redux';
import {
  sendFriendRequest,
  cancelFriendRequest,
  acceptFriendRequest
} from '../../../redux/auth/authActions';

const ProfileDetails = ({ profile }) => {
  const [seeMore, setSeeMore] = useState({
    isNeeded: profile && profile.aboutMe && profile.aboutMe.length > 400,
    show: true
  });
  const dispatch = useDispatch();

  const friendRequests = useSelector(
    state => state.auth.user.profile.friendRequests
  );
  const friends = useSelector(state => state.auth.user.profile.friends);
  const [friendRequestStatus, setFriendRequestStatus] = useState('');

  useEffect(() => {
    if (profile.ownProfile) return;

    const fReq = friendRequests.find(
      req => req.profileId === profile.profileId
    );
    if (fReq) setFriendRequestStatus(fReq.kind);
  }, []);

  const handleSeeMore = () => {
    setSeeMore({ ...seeMore, show: !seeMore.show });
  };

  const handleUnfriend = () => {};

  const handleFriendRequest = () => {
    if (friendRequestStatus === 'Sent') {
      // cancel request
      dispatch(cancelFriendRequest(profile.profileId));
      setFriendRequestStatus('');
    } else if (friendRequestStatus === 'Received') {
      // accept request
      dispatch(acceptFriendRequest(profile.profileId));
      setFriendRequestStatus('');
    } else {
      dispatch(sendFriendRequest(profile.profileId));
      setFriendRequestStatus('Sent');
    }
  };

  const renderFriendButton = () => {
    const isFriend = !!friends.find(fr => fr.profileId === profile.profileId);
    if (isFriend) {
      return (
        <button className="btn btn--light btn--action" onClick={handleUnfriend}>
          <i className="fas fa-check check"></i> Friends
        </button>
      );
    }

    let btnText;
    if (friendRequestStatus === 'Sent') {
      btnText = 'Cancel friend request';
    } else if (friendRequestStatus === 'Received') {
      btnText = 'Accept friend request';
    } else {
      btnText = 'Add friend';
    }

    return (
      <button
        className="btn btn--dark btn--action"
        onClick={handleFriendRequest}
      >
        {btnText}
      </button>
    );
  };

  if (!profile) return null;

  return (
    <div className="profile__main">
      <div className="profile__header">
        <h1 className="profile__header-text">
          {`${profile.displayName} ${profile.handle &&
            '(' + profile.handle + ')'} `}
          {profile.ownProfile && (
            <Link className="green-link edit-profile" to="/user/edit">
              (edit profile)
            </Link>
          )}
        </h1>
      </div>
      <div className="profile__body">
        {!profile.ownProfile && (
          <div className="profile__actions">
            {renderFriendButton()}
            <button className="btn btn--light btn--action">Message</button>
          </div>
        )}
        <ul className="profile__details profile__details--user-profile">
          {profile.name && (
            <li>
              <span className="text-bold">Name</span> {profile.name}
            </li>
          )}
          {profile.details && (
            <li>
              <span className="text-bold">Details</span> {profile.details}
            </li>
          )}
          {profile.birthday && (
            <li>
              <span className="text-bold">Birthday</span> {profile.birthday}
            </li>
          )}
          {profile.website && (
            <li>
              <span className="text-bold">Website</span>{' '}
              <a href={profile.website} className="green-link">
                {profile.website}
              </a>
            </li>
          )}
          <li>
            <span className="text-bold">Activity</span> {profile.activity}
          </li>
          {profile.interests && (
            <li>
              <span className="text-bold">Interests</span> {profile.interests}
            </li>
          )}
          {profile.favBooks && (
            <li>
              <span className="text-bold">Favorite Books</span>{' '}
              {profile.favBooks}
            </li>
          )}
          {profile.aboutMe && (
            <li>
              <span className="text-bold">About Me</span>{' '}
              <p>
                {seeMore.isNeeded && seeMore.show
                  ? profile.aboutMe.substring(0, 400) + '...'
                  : profile.aboutMe}{' '}
                {seeMore.isNeeded && (
                  <a className="green-link see-more" onClick={handleSeeMore}>
                    {seeMore.show ? '(See more)' : '(Show less)'}
                  </a>
                )}
              </p>
            </li>
          )}
        </ul>
      </div>
      <ProfileDetailsFooter social={profile.social} handle={profile.handle} />
    </div>
  );
};

export default ProfileDetails;

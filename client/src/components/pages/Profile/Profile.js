import React from 'react';
import { useSelector } from 'react-redux';
import Loader from '../../common/Loader';
import PrivateProfile from './PrivateProfile';
import Friends from './Friends';
import ProfileDetails from './ProfileDetails';
import ProfileSide from './ProfileSide';
import { getMonth, lastActive } from '../../../util/lastActive';
import { Redirect } from 'react-router-dom';
import useLoadProfile from './Hooks/useLoadProfile';

const Profile = ({ match }) => {
  const { user, token } = useSelector(state => state.auth);
  const profile = useSelector(state => state.profile.loadedProfile);

  /**
   * Begin profile fetch on mount with useLoadProfile.
   * If there is no route id param (/user/:id) or handle param (/:handle),
   * then fetch the user's own profile.
   * Otherwise fetch a profile according to profileId or handle, which can also
   * be used to fetch the user's own.
   * If fetching a profile not belonging to the user, the server will return
   * it if it is declared public or is friends with the user, else it will
   * return a limited snapshot when it is private and not a friend.
   */
  /* PROFILE FETCH HOOK */
  const profileId = match.params.id || match.params.handle || '';
  const loadingProfile = useLoadProfile(profileId);

  /**
   * The server does not return private fields of non-friends.
   */
  const buildProfileDetails = profile => {
    const profileDetails = {};

    profileDetails.ownProfile = profile.user === user._id;

    profileDetails.displayName = profile.displayName;

    const firstName = profile.firstName;
    const lastName = profile.lastName ? profile.lastName.value : '';
    profileDetails.name = [firstName, lastName].filter(v => !!v).join(' ');

    const age = profile.age ? profile.age.value : '';
    const gender = profile.gender ? profile.gender.value : '';
    const location = profile.location ? profile.location.value : '';
    profileDetails.details = [age, gender, location]
      .filter(v => !!v)
      .join(', ');

    const birthday = profile.birthday ? new Date(profile.birthday.value) : '';
    profileDetails.birthday = birthday
      ? `${getMonth(birthday.getMonth())} ${birthday.getDate()}`
      : '';

    profileDetails.handle = profile.handle || '';
    profileDetails.website = profile.website || '';
    profileDetails.interests = profile.interests || '';
    profileDetails.favBooks = profile.favBooks || '';
    profileDetails.aboutMe = profile.aboutMe || '';

    profileDetails.social = { ...profile.social } || {};
    const joinedDate = new Date(profile.dateCreated);
    let activity = `Joined in ${getMonth(
      joinedDate.getMonth()
    )} ${joinedDate.getFullYear()}, `;
    activity += lastActive(profile.lastActive);

    profileDetails.activity = activity;

    return profileDetails;
  };

  const buildProfileSide = profile => {
    const { _id: profileId, avatar_id, token, ratings, reviews } = profile;
    return {
      profileId,
      avatar_id,
      ratings,
      reviews,
      reviewsAverage:
        reviews.length > 0
          ? reviews.reduce((acc, next) => acc + next, 0) / reviews.length
          : 0.0
    };
  };

  if (loadingProfile) {
    return <Loader />;
  }

  // if (profileHasLoaded && profile == null) return <Redirect to="/not-found" />;
  if (profile == null) return <Redirect to="/not-found" />;

  // TODO: and if not a friend
  if (!profile.isPublic) {
    return <PrivateProfile profile={profile} />;
  }

  return (
    <div className="Profile">
      <main className="profile">
        <ProfileSide token={token} profile={buildProfileSide(profile)} />
        <ProfileDetails profile={buildProfileDetails(profile)} />
      </main>
      <Friends />
    </div>
  );
};

export default Profile;

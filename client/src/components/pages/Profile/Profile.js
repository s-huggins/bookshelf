import React from 'react';
import { useSelector } from 'react-redux';
import Loader from '../../common/Loader';
import PrivateProfile from './PrivateProfile';
import FriendsSidebar from './FriendsSidebar';
import ProfileDetails from './ProfileDetails';
import ProfileSide from './ProfileSide';
import { getMonth, lastActive } from '../../../util/lastActive';
import { Redirect, Link } from 'react-router-dom';
import useLoadProfile from './Hooks/useLoadProfile';
import apostrophize from '../../../util/apostrophize';
import CurrentRead from './CurrentRead';
import WantRead from './WantRead';

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

    const age =
      profile.age && profile.age.value ? 'Age ' + profile.age.value : '';
    const gender =
      profile.gender &&
      profile.gender.value &&
      profile.gender.value !== 'Unspecified'
        ? profile.gender.value
        : '';
    const location =
      profile.location && profile.location.value ? profile.location.value : '';
    profileDetails.details = [age, gender, location]
      .filter(v => !!v)
      .join(', ');

    const birthday =
      profile.birthday && profile.birthday.value
        ? new Date(profile.birthday.value)
        : '';
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

  const countShelf = (books, shelf) =>
    books.filter(book => book.primaryShelf === shelf).length;

  console.log(profile);

  return (
    <div className="Profile">
      <main>
        <div className="profile">
          <ProfileSide token={token} profile={buildProfileSide(profile)} />
          <ProfileDetails profile={buildProfileDetails(profile)} />
        </div>
        <div className="panel panel--bookshelves">
          <div className="panel__header">
            <h2 className="panel__header-text">
              {apostrophize(profile.displayName)} bookshelves
            </h2>
          </div>
          <div className="panel__body">
            <ul className="shelves">
              <li>
                <Link to="#!">read ({countShelf(profile.books, 'read')})</Link>{' '}
              </li>
              <li>
                <Link to="#!">
                  currently reading ({countShelf(profile.books, 'reading')})
                </Link>
              </li>
              <li>
                <Link to="#!">
                  to read ({countShelf(profile.books, 'to-read')})
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="panel">
          <div className="panel__header">
            <h2 className="panel__header-text">
              {profile.displayName} is currently reading
            </h2>
          </div>
          <div className="panel__body">
            <CurrentRead />
            <CurrentRead />
            <CurrentRead />
          </div>
          <div className="panel__footer">
            <Link to="#!" className="see-all-reading green-link">
              See all 12 books that Stuart is reading...
            </Link>
          </div>
        </div>

        <div className="panel">
          <div className="panel__header">
            <h2 className="panel__header-text">
              {apostrophize(profile.displayName)} recent updates
            </h2>
          </div>
          <div className="panel__body">
            <WantRead />
          </div>
          <div className="panel__footer">
            <Link to="#!" className="see-all-books green-link">
              More of {apostrophize(profile.displayName)} books...
            </Link>
          </div>
        </div>
      </main>
      <aside>
        <FriendsSidebar />
      </aside>
    </div>
  );
};

export default Profile;

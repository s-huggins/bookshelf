import React from 'react';
import { useSelector } from 'react-redux';
import Loader from '../../common/Loader';
import PrivateProfile from './PrivateProfile';
import FriendsSidebar from './FriendsSidebar';
import ProfileDetails from './ProfileDetails';
import ProfileSide from './ProfileSide';
import { getMonth, lastActive } from '../../../util/lastActive';
import { Redirect } from 'react-router-dom';
import useLoadProfile from './Hooks/useLoadProfile';
import BookshelvesPanel from './BookshelvesPanel';
import CurrentlyReadingPanel from './CurrentlyReadingPanel';
import RecentUpdatesPanel from './RecentUpdatesPanel';

const Profile = ({ location }) => {
  const { user } = useSelector(state => state.auth);
  const [loadingProfile, profile] = useLoadProfile();

  /**
   * The server does not return private fields of non-friends.
   */
  const buildProfileDetails = profile => {
    const profileDetails = { profileId: profile.id };

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
    const { _id: profileId, avatar_id, ratings, reviews } = profile;
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

  const buildBookshelfLink = shelf => {
    if (shelf) return `${location.pathname}/bookshelves?shelf=${shelf}`;
    else return `${location.pathname}/bookshelves`;
  };

  const countShelf = (books, shelf) =>
    books.filter(book => book.primaryShelf === shelf).length;

  if (loadingProfile) {
    return <Loader />;
  }
  // if (profileHasLoaded && profile == null) return <Redirect to="/not-found" />;
  if (profile == null) return <Redirect to="/not-found" />;

  // TODO: and if not a friend
  if (!profile.isPublic) {
    return <PrivateProfile profile={profile} />;
  }

  // const ownProfile = profile.user === user._id;

  return (
    <div className="Profile page-container">
      <main>
        <div className="profile">
          <ProfileSide
            location={location}
            profile={buildProfileSide(profile)}
            ownProfile={profile.user === user._id}
          />
          <ProfileDetails profile={buildProfileDetails(profile)} />
        </div>

        <BookshelvesPanel
          books={profile.books}
          displayName={profile.displayName}
          ownProfile={profile.user === user._id}
          buildBookshelfLink={buildBookshelfLink}
          countShelf={countShelf}
        />

        <CurrentlyReadingPanel
          books={profile.books.filter(book => book.primaryShelf === 'reading')}
          displayName={profile.displayName}
          ownProfile={profile.user === user._id}
          buildBookshelfLink={buildBookshelfLink}
          bookCount={countShelf(profile.books, 'reading')}
        />

        <RecentUpdatesPanel
          books={profile.books}
          displayName={profile.displayName}
          ownProfile={profile.user === user._id}
          buildBookshelfLink={buildBookshelfLink}
        />
      </main>
      <aside>
        <FriendsSidebar />
      </aside>
    </div>
  );
};

export default Profile;

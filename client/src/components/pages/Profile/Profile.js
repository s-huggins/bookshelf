import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import Loader from '../../common/Loader';
import PrivateProfile from './PrivateProfile';
import FriendsSidebar from './FriendsSidebar';
import ProfileDetails from './ProfileDetails';
import ProfileSide from './ProfileSide';
import { getMonth, lastActive } from '../../../util/lastActive';
import { Redirect } from 'react-router-dom';
import useLoadProfile from './Hooks/useLoadProfile';
// import BookshelvesPanel from './BookshelvesPanel';
// import CurrentlyReadingPanel from './CurrentlyReadingPanel';
// import RecentUpdatesPanel from './RecentUpdatesPanel';
import usePrivateProfile from './Hooks/usePrivateProfile';
import ProfilePanels from './ProfilePanels';

const Profile = ({ location }) => {
  const { id: ownProfileId } = useSelector(state => state.auth.user.profile);
  const [loadingProfile, profile] = useLoadProfile();
  const profileIsPrivate = usePrivateProfile(profile);
  /**
   * The server does not return private fields of non-friends.
   */

  const profileDetails = useMemo(() => {
    if (!profile) return {};

    const profDetails = { profileId: profile.id };

    profDetails.ownProfile = profile.id === ownProfileId;

    profDetails.displayName = profile.displayName;

    const firstName = profile.firstName;
    const lastName = profile.lastName ? profile.lastName.value : '';
    profDetails.name = [firstName, lastName].filter(v => !!v).join(' ');

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
    profDetails.details = [age, gender, location].filter(v => !!v).join(', ');

    const birthday =
      profile.birthday && profile.birthday.value
        ? new Date(profile.birthday.value)
        : '';
    profDetails.birthday = birthday
      ? `${getMonth(birthday.getMonth())} ${birthday.getDate()}`
      : '';

    profDetails.handle = profile.handle || '';
    profDetails.website = profile.website || '';
    profDetails.interests = profile.interests || '';
    profDetails.favBooks = profile.favBooks || '';
    profDetails.aboutMe = profile.aboutMe || '';

    profDetails.social = { ...profile.social } || {};
    const joinedDate = new Date(profile.dateCreated);
    let activity = `Joined in ${getMonth(
      joinedDate.getMonth()
    )} ${joinedDate.getFullYear()}, `;
    activity += lastActive(profile.lastActive);

    profDetails.activity = activity;

    return profDetails;
  }, [profile]);

  const buildProfileSide = profile => {
    const { _id: profileId, avatar_id, ratings, reviews } = profile;
    return {
      profileId,
      avatar_id,
      ratings,
      reviews
    };
  };

  const buildBookshelfLink = shelf => {
    if (shelf) return `${location.pathname}/bookshelves?shelf=${shelf}`;
    else return `${location.pathname}/bookshelves`;
  };

  if (loadingProfile) return <Loader />;
  if (profile == null) return <Redirect to="/not-found" />;

  return profileIsPrivate ? (
    <PrivateProfile profile={profile} />
  ) : (
    <div className="Profile page-container">
      <main>
        <div className="profile">
          <ProfileSide
            location={location}
            profile={buildProfileSide(profile)}
            ownProfile={profile.id === ownProfileId}
          />
          <ProfileDetails profile={profileDetails} />
        </div>

        <ProfilePanels
          profile={profile}
          ownProfile={profile.id === ownProfileId}
          buildBookshelfLink={buildBookshelfLink}
        />

        {/* <BookshelvesPanel
          books={profile.books}
          displayName={profile.displayName}
          ownProfile={profile.id === ownProfileId}
          buildBookshelfLink={buildBookshelfLink}
          countShelf={countShelf}
        />

        <CurrentlyReadingPanel
          books={profile.books.filter(book => book.primaryShelf === 'reading')}
          displayName={profile.displayName}
          ownProfile={profile.id === ownProfileId}
          buildBookshelfLink={buildBookshelfLink}
          bookCount={countShelf(profile.books, 'reading')}
        />

        <RecentUpdatesPanel
          books={profile.books}
          displayName={profile.displayName}
          ownProfile={profile.id === ownProfileId}
          buildBookshelfLink={buildBookshelfLink}
        /> */}
      </main>
      <aside>
        <FriendsSidebar profile={profile} />
      </aside>
    </div>
  );
};

export default Profile;

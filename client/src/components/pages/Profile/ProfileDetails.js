import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ProfileDetailsFooter from './ProfileDetailsFooter';

const ProfileDetails = ({ profile }) => {
  const [seeMore, setSeeMore] = useState({
    isNeeded: profile && profile.aboutMe && profile.aboutMe.length > 400,
    show: true
  });

  const handleSeeMore = () => {
    setSeeMore({ ...seeMore, show: !seeMore.show });
  };

  if (!profile) return null;

  return (
    <div className="profile__main">
      <div className="profile__header">
        <h1>
          {`${profile.displayName} ${profile.handle &&
            '(' + profile.handle + ')'} `}
          {profile.ownProfile && (
            <span>
              <Link className="green-link" to="/user/edit">
                (edit profile)
              </Link>
            </span>
          )}
        </h1>
      </div>
      <div className="profile__body">
        {!profile.ownProfile && (
          <div className="profile__actions">
            <button className="btn btn--dark">Add friend</button>
            <button className="btn btn--light">Message</button>
          </div>
        )}
        <ul>
          {profile.name && (
            <li>
              <span>Name</span> {profile.name}
            </li>
          )}
          {profile.details && (
            <li>
              <span>Details</span> {profile.details}
            </li>
          )}
          {profile.birthday && (
            <li>
              <span>Birthday</span> {profile.birthday}
            </li>
          )}
          {profile.website && (
            <li>
              <span>Website</span>{' '}
              <a href={profile.website} className="green-link">
                {profile.website}
              </a>
            </li>
          )}
          <li>
            <span>Activity</span> {profile.activity}
          </li>
          {profile.interests && (
            <li>
              <span>Interests</span> {profile.interests}
            </li>
          )}
          {profile.favBooks && (
            <li>
              <span>Favorite Books</span> {profile.favBooks}
            </li>
          )}
          {profile.aboutMe && (
            <li>
              <span>About Me</span>{' '}
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

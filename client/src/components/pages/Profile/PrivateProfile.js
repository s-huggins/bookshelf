import React from 'react';
import Avatar from './Avatar';
import FriendButton from '../../common/FriendButton';
import pluralize from '../../../util/pluralize';
import apostrophize from '../../../util/apostrophize';

const PrivateProfile = ({ profile }) => {
  return (
    <div className="PrivateProfile page-container">
      <div className="Profile">
        <main>
          <div className="profile">
            <div className="profile__side">
              <div className="profile__avatar">
                <Avatar avatar_id={profile.avatar_id} />
              </div>
              <ul>
                <li>{`${profile.ratingsCount.toLocaleString('en')} ${pluralize(
                  'rating',
                  profile.ratingsCount
                )} (${profile.ratingsAverage.toFixed(2)} avg)`}</li>

                <li>0 reviews</li>
              </ul>
            </div>

            <div className="profile__main">
              <div className="profile__header">
                <h1>
                  {profile.displayName +
                    (profile.handle ? `<${profile.handle}>` : '')}
                </h1>
              </div>
              <div className="profile__body">
                {/* <p>This profile is private.</p> */}
                <p className="private-data-text">
                  {apostrophize(profile.displayName)} data is set to private.
                </p>
                <p>You can view profiles for:</p>
                <ul>
                  <li>direct friends (if you are signed in)</li>
                  <li>users who have made their profile public</li>
                </ul>

                <div className="profile__actions">
                  <FriendButton
                    displayName={profile.displayName}
                    profileId={profile.id}
                  />
                  <button className="btn btn--light">Message</button>
                </div>
              </div>
              <div className="profile__footer">
                {profile.handle && (
                  <span className="handle">{`bookshelf/${profile.handle}`}</span>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PrivateProfile;

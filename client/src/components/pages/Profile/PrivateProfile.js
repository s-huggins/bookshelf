import React, { useEffect } from 'react';
import avatar from '../../../img/avatar.png';

const PrivateProfile = ({ profile }) => {
  // useEffect(() => {
  //   console.log(profile);
  // });
  // console.log(profile);

  return (
    <div className="PrivateProfile">
      <div className="Profile">
        <div className="container">
          <main>
            <div className="profile">
              <div className="profile__side">
                <div className="profile__avatar">
                  <a href="#!">
                    <img src={avatar} alt="avatar" />
                  </a>
                </div>
                <ul>
                  <li>0 ratings (0.0)</li>
                  <li>0 reviews</li>
                </ul>
              </div>

              <div className="profile__main">
                <div className="profile__header">
                  <h1>{profile.displayName}</h1>
                </div>
                <div className="profile__body">
                  <p>This profile is private.</p>
                  <div className="profile__actions">
                    <button className="btn btn--dark">Add friend</button>
                    <button className="btn btn--light">Message</button>
                  </div>
                </div>
                <div className="profile__footer">
                  {profile.handle && (
                    <span className="handle">{`bookshelf/user/${profile.handle}`}</span>
                  )}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default PrivateProfile;

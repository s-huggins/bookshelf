import React from 'react';
import Avatar from './Avatar';

const ProfileSide = ({ profile, token }) => {
  return (
    <div className="profile__side">
      <div className="profile__avatar">
        <a href="#!">
          <Avatar token={token} avatar_id={profile.avatar_id} />
        </a>
      </div>
      <ul>
        <li>
          <a href="#!" className="green-link">
            0 ratings (0.0)
          </a>
        </li>
        <li>
          <a href="#!" className="green-link">
            0 reviews
          </a>
        </li>
      </ul>
    </div>
  );
};

export default ProfileSide;

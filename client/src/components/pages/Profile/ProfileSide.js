import React from 'react';
import Avatar from './Avatar';
import pluralize from '../../../util/pluralize';
import { Link } from 'react-router-dom';

const ProfileSide = ({ profile, location, ownProfile }) => {
  const ratingsCount = profile.ratings.length;
  const ratingsSum = profile.ratings.reduce(
    (sum, ratingObj) => sum + ratingObj.rating,
    0
  );
  const ratingsAvg = ratingsCount > 0 ? ratingsSum / ratingsCount : 0;

  const ratingsLink = ownProfile
    ? `${location.pathname}/bookshelves?sort=my-rating&order=descending`
    : `${location.pathname}/bookshelves?sort=user-rating&order=descending`;

  return (
    <div className="profile__side">
      <div className="profile__avatar">
        <a href="#!">
          <Avatar avatar_id={profile.avatar_id} />
        </a>
      </div>
      <ul>
        <li>
          <Link to={ratingsLink} className="green-link">
            {`${ratingsCount.toLocaleString('en')} ${pluralize(
              'rating',
              ratingsCount
            )} (${ratingsAvg.toFixed(2)} avg)`}
          </Link>
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

import React from 'react';
import pluralize from '../../../util/pluralize';
import { useLocation, Link } from 'react-router-dom';

const AuthorStats = ({
  author_average_rating,
  author_ratings_count,
  works_count,
  authorId
}) => {
  const location = useLocation();
  return (
    <div className="author-stats">
      Average rating: {author_average_rating.toFixed(2)}{' '}
      <span className="middle-dot">·</span>{' '}
      {author_ratings_count.toLocaleString('en')}{' '}
      {pluralize('rating', author_ratings_count)}{' '}
      <span className="middle-dot">·</span> 5,151 reviews{' '}
      <span className="middle-dot">·</span>{' '}
      <Link to={`/author/${authorId}/books`}>
        {works_count.toLocaleString('en')} distinct{' '}
        {pluralize('work', works_count)}
      </Link>
    </div>
  );
};

export default AuthorStats;

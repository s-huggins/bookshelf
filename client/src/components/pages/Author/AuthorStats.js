import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import pluralize from '../../../util/pluralize';
import { resetBookRatedSignal } from '../../../redux/profile/profileActions';

const AuthorStats = ({
  author_average_rating,
  author_ratings_count,
  works_count,
  authorId
}) => {
  // TODO: update num times shelved too with this same signal pattern
  const dispatch = useDispatch();
  const token = useSelector(state => state.auth.token);
  const bookRatedSignal = useSelector(state => state.profile.bookRatedSignal);
  const [stats, setStats] = useState({
    averageRating: author_average_rating,
    ratingsCount: author_ratings_count
  });

  const fetchNewStats = async () => {
    const uri = `http://localhost:5000/api/v1/author/${authorId}/ratings`;

    const res = await fetch(uri, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`
      }
    });

    const json = await res.json();
    if (json.status === 'success') {
      setStats({
        averageRating: json.data.author_average_rating,
        ratingsCount: json.data.author_ratings_count
      });
    }
  };

  useEffect(() => {
    if (bookRatedSignal === 'on') {
      fetchNewStats();
      dispatch(resetBookRatedSignal());
    }
  }, [bookRatedSignal]);

  return (
    <div className="author-stats">
      Average rating: {stats.averageRating.toFixed(2)}{' '}
      <span className="middle-dot">·</span>{' '}
      {stats.ratingsCount.toLocaleString('en')}{' '}
      {pluralize('rating', stats.ratingsCount)}{' '}
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

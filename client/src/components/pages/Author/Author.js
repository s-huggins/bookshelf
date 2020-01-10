import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AuthorBook from './AuthorBook';
import {
  fetchAuthor,
  clearFetchStatus
} from '../../../redux/author/authorActions';
import Loader from '../../common/Loader';
import { Redirect, Link } from 'react-router-dom';
import AuthorDetails from './AuthorDetails';
import apostrophize from '../../../util/apostrophize';
import withUpdatingRating from '../Profile/withUpdatingRating';
import AuthorBooksList from './AuthorBooksList';
import pluralize from '../../../util/pluralize';
import AuthorStats from './AuthorStats';

const Author = ({ match, location }) => {
  const authorId = match.params.id;
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();
  const author = useSelector(state => state.author.author);
  const fetchStatus = useSelector(state => state.author.fetchStatus);

  /* Fetch author data on mount and with each route :id param change */
  useEffect(() => {
    setLoading(true);
    dispatch(fetchAuthor(authorId));
  }, [match.params.id]);

  useEffect(() => {
    if (fetchStatus !== '') {
      setLoading(false);
    }
  }, [fetchStatus]);

  useEffect(() => {
    if (!loading) {
      dispatch(clearFetchStatus());
    }
  }, [loading]);

  if (loading) return <Loader />;
  // if (fetchStatus === 'fail' || !author) return <Redirect to="/not-found" />;
  if (fetchStatus === 'fail') return <Redirect to="/not-found" />;
  if (fetchStatus === 'error')
    return (
      <Redirect
        to={{ pathname: '/something-went-wrong', state: { pushTo: '/' } }}
      />
    );
  return (
    <div className="Author">
      <div className="profile profile--author">
        <div className="profile__side">
          <img className="profile__img" src={author.image_url} alt="author" />
        </div>
        <div className="profile__main">
          <div className="profile__header">
            <h1 className="profile__header-text">{author.name}</h1>
          </div>
          <div className="profile__body">
            <AuthorDetails author={author} />
            <p
              className="profile__description"
              dangerouslySetInnerHTML={{ __html: author.about }}
            ></p>
          </div>

          <div className="Author-books">
            <h2 className="Author-books__header">
              {`${apostrophize(author.name)} books`}
            </h2>
            <AuthorStats
              author_average_rating={author.author_average_rating}
              author_ratings_count={author.author_ratings_count}
              works_count={+author.works_count}
              authorId={author.id}
            />
            <AuthorBooksList books={author.books} />
          </div>
          <span className="more-books green-link">
            <Link to={`/author/${authorId}/books`}>
              More books by {author.name}...
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Author;

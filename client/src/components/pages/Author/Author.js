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

const Author = ({ match }) => {
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
              {author.name.endsWith('s')
                ? `${author.name}'`
                : `${author.name}'s`}{' '}
              books
            </h2>
            {author.books.book.map(book => (
              <AuthorBook key={book.id} book={book} />
            ))}
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

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchAuthorBooks,
  clearFetchStatus
} from '../../../redux/author/authorActions';
import Loader from '../../common/Loader';
import { Redirect, Link } from 'react-router-dom';
import cormac from '../../../img/cormac.jpg';
import AuthorBook from './AuthorBook';

const AuthorBooks = ({ match }) => {
  const authorId = match.params.id;
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const dispatch = useDispatch();
  const authorBooks = useSelector(state => state.author.authorBooks);
  const fetchStatus = useSelector(state => state.author.fetchStatus);

  useEffect(() => {
    setLoading(true);
    let pageNum = parseInt(match.params.pageNum, 10);
    pageNum = Number.isNaN(pageNum) ? 1 : Math.abs(pageNum);
    dispatch(fetchAuthorBooks(authorId));
  }, [match.params.id]);

  useEffect(() => {
    if (fetchStatus !== '') {
      setLoading(false);
      dispatch(clearFetchStatus());
    }
  }, [fetchStatus]);

  console.log('fetchStatus before Loader', fetchStatus);
  if (loading) return <Loader />;
  console.log('fetchStatus after Loader', fetchStatus);
  if (fetchStatus === 'fail') return <Redirect to="not-found" />;
  if (fetchStatus === 'error')
    return (
      <Redirect
        to={{ pathname: '/something-went-wrong', state: { pushTo: '/' } }}
      />
    );

  return (
    <div className="AuthorBooks">
      <div className="header">
        <h1 className="header-text">Books by {authorBooks.name}</h1>
        <div className="header-author">
          <Link to={`/author/${authorBooks.id}`}>
            <img className="author-img" src={cormac} alt="author" />
          </Link>
          <div className="author-details">
            <Link to={`/author/${authorBooks.id}`}>Epicurus</Link>
            <span className="author-stats">
              Average rating 3.92 <span className="stats-separator">·</span>{' '}
              3,691 ratings <span className="stats-separator">·</span> 196
              reviews <span className="stats-separator">·</span> shelved 14,004
              times
            </span>
          </div>
        </div>
      </div>
      <div className="book-list-container">
        <div className="pagination-header">
          <span className="works-number">
            Showing {authorBooks.pagination.end} distinct{' '}
            {`work${+authorBooks.pagination.end !== 1 ? 's' : ''}`}.
          </span>
          <span className="pagination">
            <span className="prev">« previous</span> 1 2 3{' '}
            <span className="next">next »</span>
          </span>
        </div>
        <div className="book-list">
          {authorBooks.books.book.map(book => (
            <AuthorBook key={book.id} book={book} />
          ))}
        </div>
        <div className="pagination-footer">
          <span className="pagination">
            <span className="prev">« previous</span> 1 2 3{' '}
            <span className="next">next »</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default AuthorBooks;

import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchAuthorBooks,
  clearFetchStatus
} from '../../../redux/author/authorActions';
import Loader from '../../common/Loader';
import { Redirect, Link } from 'react-router-dom';
import pluralize from '../../../util/pluralize';
import Pagination from '../../common/Pagination';
import AuthorBooksList from './AuthorBooksList';
import AuthorStats from './AuthorStats';

const getPage = pageParam => {
  let pageNum = parseInt(pageParam, 10);
  if (Number.isNaN(pageNum) || pageNum <= 0) pageNum = 1;
  return pageNum;
};

const AuthorBooks = ({ match }) => {
  const authorId = match.params.id;
  const pageNum = getPage(match.params.pageNum);

  const [loading, setLoading] = useState(true);
  const [loadingNewBooks, setLoadingNewBooks] = useState(false);
  const authorImageSrc = useRef('');
  const runPaginationEffect = useRef(false);

  const dispatch = useDispatch();
  const authorBooks = useSelector(state => state.author.authorBooks);
  const fetchStatus = useSelector(state => state.author.fetchStatus);

  /* Runs on mount and whenever the author changes.*/
  useEffect(() => {
    setLoading(true);
    // always fetch author image in this effect
    dispatch(fetchAuthorBooks(authorId, pageNum, true));
  }, [match.params.id]);

  useEffect(() => {
    // skip on mount
    if (!runPaginationEffect.current) {
      runPaginationEffect.current = true;
      return;
    }
    setLoadingNewBooks(true);
    // already have author image, hence false in action
    dispatch(fetchAuthorBooks(authorId, pageNum, false));
  }, [match.params.pageNum]);

  useEffect(() => {
    if (fetchStatus !== '') {
      setLoading(false);
      setLoadingNewBooks(false);
      if (authorBooks && authorBooks.authorImage)
        authorImageSrc.current = authorBooks.authorImage;
    }
  }, [fetchStatus]);

  useEffect(() => {
    if (!loading && !loadingNewBooks) {
      dispatch(clearFetchStatus());
    }
  }, [loading, loadingNewBooks]);

  if (loading) return <Loader />;
  if (fetchStatus === 'fail') return <Redirect to="/not-found" />;
  if (fetchStatus === 'error')
    return (
      <Redirect
        to={{ pathname: '/something-went-wrong', state: { pushTo: '/' } }}
      />
    );

  const bookCount =
    authorBooks.pagination.end - authorBooks.pagination.start + 1;
  return (
    <div className="AuthorBooks page-container">
      <div className="header">
        <h1 className="header-text">
          Books by{' '}
          <Link to={`/author/${authorBooks.id}`} className="author-name">
            {authorBooks.name}
          </Link>
        </h1>
        <div className="header-author">
          <Link to={`/author/${authorBooks.id}`}>
            <img
              className="author-img"
              src={authorImageSrc.current}
              alt="author"
            />
          </Link>
          <div className="author-details">
            <Link to={`/author/${authorBooks.id}`} className="author-name">
              {authorBooks.name}
            </Link>
            <AuthorStats
              author_average_rating={authorBooks.author_average_rating}
              author_ratings_count={authorBooks.author_ratings_count}
              works_count={authorBooks.pagination.total}
              authorId={authorBooks.id}
            />
          </div>
        </div>
      </div>

      {loadingNewBooks ? (
        <Loader />
      ) : (
        <div className="book-list-container">
          <div className="pagination-header">
            <span className="works-number">
              Showing {bookCount} distinct {pluralize('work', bookCount)}.
            </span>

            <Pagination
              baseLink={`/author/${authorId}/books`}
              {...authorBooks.pagination}
              page={pageNum}
              perPage={30}
            />
          </div>
          <div className="book-list">
            <AuthorBooksList books={authorBooks.books} />
          </div>
          <div className="pagination-footer">
            <Pagination
              baseLink={`/author/${authorId}/books`}
              {...authorBooks.pagination}
              page={pageNum}
              perPage={30}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthorBooks;

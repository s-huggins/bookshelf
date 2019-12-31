import React, { useEffect, useState, useRef } from 'react';
import Rating from '../../common/Rating';
import MiniRating from '../../common/MiniRating';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBook, clearFetchStatus } from '../../../redux/book/bookActions';
import Loader from '../../common/Loader';
import { Redirect, Link } from 'react-router-dom';
import BookDetails from './BookDetails';
import AuthorDetail from './AuthorDetail';
import SimilarBooks from './SimilarBooks';

const Book = ({ match }) => {
  const bookId = match.params.id; // check it is an int

  const [loading, setLoading] = useState(true);
  const mounted = useRef(false);

  const dispatch = useDispatch();
  const book = useSelector(state => state.book.book);
  const fetchStatus = useSelector(state => state.book.fetchStatus);

  useEffect(() => {
    dispatch(fetchBook(bookId));
  }, []);

  useEffect(() => {
    if (fetchStatus !== '') {
      setLoading(false);
      dispatch(clearFetchStatus());
    }
  }, [fetchStatus]);

  useEffect(() => {
    if (mounted.current === false) {
      mounted.current = true;
      return;
    }
    setLoading(true);
    dispatch(fetchBook(bookId));
  }, [match.params.id]);

  const buildAuthorsArray = bookData => {
    if (!Array.isArray(bookData.authors.author)) {
      // single author
      return [bookData.authors.author];
    }

    return bookData.authors.author;
  };

  const printAuthors = authorsArray => {
    const numAuthors = authorsArray.length;

    const jsxArray = authorsArray.map((auth, i) => {
      return (
        <span key={auth.id}>
          <Link to={`/author/${auth.id}`}>{auth.name}</Link>
          {auth.role ? <span>{` (${auth.role})`}</span> : null}
          {i != numAuthors - 1 ? ', ' : ''}
        </span>
      );
    });

    return jsxArray;
  };

  if (loading) return <Loader />;

  if (fetchStatus === 'fail') return <Redirect to="not-found" />;
  if (fetchStatus === 'error')
    return (
      <Redirect
        to={{ pathname: '/something-went-wrong', state: { pushTo: '/' } }}
      />
    );

  return (
    <div className="Book">
      <div className="container">
        <div className="Book__profile">
          <div className="Book__profile-side">
            <img src={book.image_url} alt="bookcover" />
            <div>
              <div className="btn-group">
                <button className="btn btn--green">Want to Read</button>
                <button className="btn btn--green btn--dropdown">
                  <i className="fas fa-caret-down"></i>
                </button>
                <div className="btn-dropdown-pane">
                  <ul>
                    <a className="btn-dropdown-link" href="#!">
                      <li>Want to Read</li>
                    </a>

                    <a href="#!">
                      <li>Currently reading</li>
                    </a>
                    <a href="#!">
                      <li>Read</li>
                    </a>
                  </ul>
                </div>
              </div>
            </div>
            <div className="rating-container">
              <span>Rate this book</span>
              <Rating />
            </div>
          </div>
          <div className="Book__profile-main">
            <h1>{book.title}</h1>
            <span className="by-author">
              {/* by <a href="#!">Frank Herbert</a> */}
              by {printAuthors(buildAuthorsArray(book))}
            </span>
            <div className="minirating-container">
              <MiniRating average={4.22} />
              <span className="middle-dot">&#183;</span>
              <span className="green-link">0 ratings</span>
              <span className="middle-dot">&#183;</span>
              <span className="green-link">0 reviews</span>
            </div>
            <p
              className="Book__profile-desciption"
              dangerouslySetInnerHTML={{ __html: book.description }}
            ></p>
            <div className="Book__profile-details">
              <BookDetails data={book} />
            </div>
            <h2>My Activity</h2>
            <ul>
              <li>Shelves</li>
              <li>Status</li>
            </ul>
            <hr />
            <h2>Friend Reviews (1)</h2>
            <ul>
              <li>Jordy added it</li>
            </ul>
          </div>
          <div className="sidebar">
            {book.similar_books &&
            ((Array.isArray(book.similar_books.book) &&
              book.similar_books.book.length) ||
              book.similar_books.book) ? (
              <div className="also-enjoyed">
                <h3 className="also-enjoyed-header">Readers also enjoyed</h3>
                <SimilarBooks books={book.similar_books.book} />
                <a href="#!" className="green-link see-similar">
                  See similar books...
                </a>
              </div>
            ) : null}
            <div className="sidebar-authors">
              {buildAuthorsArray(book).map(auth => (
                <div className="sidebar__panel panel-author" key={auth.id}>
                  <AuthorDetail author={auth} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Book;

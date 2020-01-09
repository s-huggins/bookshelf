import React, { useEffect, useState } from 'react';
import Rating from '../../common/Rating';
import MiniRating from '../../common/MiniRating';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBook, clearFetchStatus } from '../../../redux/book/bookActions';
import Loader from '../../common/Loader';
import { Redirect, Link } from 'react-router-dom';
import BookDetails from './BookDetails';
import AuthorDetail from './AuthorDetail';
import SimilarBooks from './SimilarBooks';
import DropdownButton from '../../common/DropdownButton';
import pluralize from '../../../util/pluralize';
import BookRating from './BookRating';

const Book = ({ match }) => {
  const bookId = match.params.id; // check it is an int

  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();
  const book = useSelector(state => state.book.book);
  const fetchStatus = useSelector(state => state.book.fetchStatus);

  useEffect(() => {
    setLoading(true);
    dispatch(fetchBook(bookId));
  }, [match.params.id]);

  useEffect(() => {
    if (fetchStatus !== '') {
      setLoading(false);
      dispatch(clearFetchStatus());
    }
  }, [fetchStatus]);

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
      <div className="profile profile--book">
        <div className="profile__side profile__side--book">
          <img className="profile__img" src={book.image_url} alt="bookcover" />
          <DropdownButton book={book} />
          <div className="rating-container">
            <span>Rate this book</span>
            <BookRating book={book} />
          </div>
        </div>
        <div className="profile__main profile__main--book">
          <div className="profile__header">
            <h1 className="profile__header-text">{book.title}</h1>
            <span className="by-author">
              by {printAuthors(buildAuthorsArray(book))}
            </span>
          </div>
          <div className="profile__body">
            <div className="minirating-container">
              <MiniRating average={book.average_rating} />
              <span className="middle-dot">&#183;</span>
              <span className="green-link">
                {book.ratings_count} {pluralize('rating', book.ratings_count)}
              </span>
              <span className="middle-dot">&#183;</span>
              <span className="green-link">0 reviews</span>
            </div>
            <p
              className="profile__desciption"
              dangerouslySetInnerHTML={{ __html: book.description }}
            ></p>
            <div className="details-container">
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
        </div>
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
            <div
              className="sidebar__panel sidebar__panel--author"
              key={auth.id}
            >
              <AuthorDetail author={auth} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Book;

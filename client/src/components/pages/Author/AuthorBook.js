import React from 'react';
import MiniRating from '../../common/MiniRating';
import { Link } from 'react-router-dom';
import SearchResultRating from '../Search/SearchResultRating';
import pluralize from '../../../util/pluralize';
import AuthorBookDropdownButton from './AuthorBookDropdownButton';

const AuthorBook = ({ book }) => {
  const printDetails = book => {
    const avgRatingStr = `${book.average_rating.toFixed(2)} avg rating`;
    const ratingsCountStr = `${book.ratings_count} ${pluralize(
      'rating',
      book.ratings_count
    )}`;

    const pubYearStr = book.publication_year
      ? `published ${book.publication_year}`
      : '';
    const numPagesStr = book.num_pages
      ? `${book.num_pages} ${pluralize('page', book.num_pages)}`
      : '';

    return [avgRatingStr, ratingsCountStr, pubYearStr, numPagesStr]
      .filter(s => s)
      .join(' — ');
  };

  return (
    <div className="AuthorBook">
      <div className="AuthorBook__preview">
        <div className="AuthorBook__cover">
          <Link to={`/book/${book.id}`}>
            <img src={book.image_url} alt="bookcover" />
          </Link>
        </div>
        <div className="AuthorBook__details">
          <h3 className="AuthorBook__details-header">
            <Link to={`/book/${book.id}`}>{book.title}</Link>
          </h3>

          <div className="AuthorBook__details-specifics">
            <span className="AuthorBook__details-rating">
              <MiniRating average={book.average_rating} />
            </span>
            <span className="text-tiny">{printDetails(book)}</span>
          </div>
        </div>
      </div>
      <div className="AuthorBook__actions">
        <AuthorBookDropdownButton
          id={book.id}
          title={book.title}
          author={book.author}
          image_url={book.image_url}
        />
        <div className="AuthorBook__rate">
          <span className="AuthorBook__rate-text text-tiny">
            Rate this book
          </span>
          <div>
            <SearchResultRating book={book} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthorBook;

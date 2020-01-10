import React, { useState } from 'react';
import MiniRating from '../../common/MiniRating';
import { Link } from 'react-router-dom';
import SearchResultRating from '../Search/SearchResultRating';
import pluralize from '../../../util/pluralize';
import AuthorBookDropdownButton from './AuthorBookDropdownButton';

const AuthorBook = ({ book }) => {
  const [averageRating, setAverageRating] = useState(book.average_rating);
  const [ratingsCount, setRatingsCount] = useState(book.ratings_count);

  const updateRatingDisplay = (oldRating, newRating) => {
    const sumRatings = averageRating * ratingsCount;

    // if book was not previously rated by user
    if (!oldRating) {
      const newSumRatings = sumRatings + newRating;
      const newRatingsCount = ratingsCount + 1;
      const newAverageRating = newSumRatings / newRatingsCount;

      setAverageRating(newAverageRating);
      setRatingsCount(newRatingsCount);
    } else if (newRating) {
      // user updated rating without unrating
      const newSumRatings = sumRatings - oldRating + newRating;
      const newAverageRating = newSumRatings / ratingsCount;

      setAverageRating(newAverageRating);
    } else {
      // user removed a rating
      const newSumRatings = sumRatings - oldRating;
      const newRatingsCount = ratingsCount - 1;
      const newAverageRating =
        newRatingsCount !== 0 ? newSumRatings / newRatingsCount : 0;

      setAverageRating(newAverageRating);
      setRatingsCount(newRatingsCount);
    }
  };

  const printDetails = book => {
    const avgRatingStr = `${averageRating.toFixed(2)} avg rating`;
    const ratingsCountStr = `${ratingsCount} ${pluralize(
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
              <MiniRating average={averageRating} />
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
            <SearchResultRating
              book={book}
              updateDisplay={updateRatingDisplay}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthorBook;

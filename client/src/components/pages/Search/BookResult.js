import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import MiniRating from '../../common/MiniRating';
import SearchResultDropdownButton from './SearchResultDropdownButton';
import SearchResultRating from './SearchResultRating';
import pluralize from '../../../util/pluralize';

const BookResult = ({
  work: {
    books_count,
    original_publication_year,
    best_book = { title: 'Untitled', id: -1 }
  }
}) => {
  const {
    author = { name: 'Unknown', id: -1 },
    average_rating,
    ratings_count
  } = best_book;

  const [averageRating, setAverageRating] = useState(average_rating);
  const [ratingsCount, setRatingsCount] = useState(ratings_count);

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

  return (
    <div className="BookResult">
      <Link to={`/book/${best_book.id}`} className="BookResult__cover">
        <img src={best_book.small_image_url} alt="bookcover" />
      </Link>
      <div className="BookResult__details">
        <h2 className="BookResult__details-header">
          <Link to={`/book/${best_book.id}`}>{best_book.title}</Link>
        </h2>
        <span className="BookResult__details-by">
          by{' '}
          <span className="BookResult__details-author">
            <Link to={`/author/${author.id}`}>{author.name}</Link>
          </span>
        </span>
        <div className="BookResult__details-specifics">
          <MiniRating average={averageRating} />
          <span className="text-tiny">
            {averageRating.toFixed(2)} avg rating —{' '}
            {`${ratingsCount} ${pluralize('rating', ratingsCount)}`} — published{' '}
            {original_publication_year}
          </span>
        </div>
        <SearchResultDropdownButton best_book={best_book} />
        <div className="BookResult__rate">
          <span className="BookResult__rate-text text-tiny">
            Rate this book
          </span>
          <div>
            <SearchResultRating
              best_book={best_book}
              updateDisplay={updateRatingDisplay}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookResult;

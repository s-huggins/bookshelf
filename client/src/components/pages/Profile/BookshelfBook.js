import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import nophoto from '../../../img/nophoto.png';
import RatingFixed from '../../common/RatingFixed';
import { Link } from 'react-router-dom';
import InlineRating from '../../common/InlineRating';

const BookshelfBook = ({
  ownBookshelf,
  dateShelved,
  _id,
  title,
  authors,
  image_url,
  average_rating,
  ratings_count
}) => {
  const myRatings = useSelector(state => state.auth.user.profile.ratings);
  const myRating = myRatings.find(r => r.bookId === _id);

  const [averageRating, setAverageRating] = useState(average_rating);
  const [ratingsCount, setRatingsCount] = useState(ratings_count);

  // to be passed down to BookshelfRating
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
    <tr className="Bookshelves__list-book">
      <td>
        <Link to={`/book/${_id}`}>
          <img src={image_url || nophoto} alt="bookcover" />
        </Link>
      </td>
      <td className="title">
        <Link to={`/book/${_id}`}>{title}</Link>
      </td>
      <td className="author">
        <Link to={`/author/${authors[0].authorId}`} className="green-link">
          {authors[0].name}
        </Link>
      </td>
      <td className="avg-rating">{averageRating.toFixed(2)}</td>
      {!ownBookshelf && (
        <td className="other-rating">
          <RatingFixed rating={4} />
        </td>
      )}
      <td className="my-rating">
        <InlineRating
          _id={_id}
          title={title}
          authors={authors}
          image_url={image_url}
          updateDisplay={updateRatingDisplay}
        />
      </td>
      <td className="date-shelved">Dec 31, 2019</td>
    </tr>
  );
};

export default BookshelfBook;

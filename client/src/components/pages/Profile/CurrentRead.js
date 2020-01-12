import React from 'react';
import cover from '../../../img/gulag.jpg';
import { Link, useLocation } from 'react-router-dom';
import moment from 'moment';
import BookshelfDropdownButton from './Bookshelves/BookshelfDropdownButton';
import InlineRating from '../../common/InlineRating';

const CurrentRead = ({
  _id,
  title,
  authors,
  image_url,
  average_rating,
  ratings_count,
  dateShelved,
  updateRatingDisplay
}) => {
  const location = useLocation();

  // const [averageRating, setAverageRating] = useState(average_rating);
  // const [ratingsCount, setRatingsCount] = useState(ratings_count);

  // const updateRatingDisplay = (oldRating, newRating) => {
  //   const sumRatings = averageRating * ratingsCount;

  //   // if book was not previously rated by user
  //   if (!oldRating) {
  //     const newSumRatings = sumRatings + newRating;
  //     const newRatingsCount = ratingsCount + 1;
  //     const newAverageRating = newSumRatings / newRatingsCount;

  //     setAverageRating(newAverageRating);
  //     setRatingsCount(newRatingsCount);
  //   } else if (newRating) {
  //     // user updated rating without unrating
  //     const newSumRatings = sumRatings - oldRating + newRating;
  //     const newAverageRating = newSumRatings / ratingsCount;

  //     setAverageRating(newAverageRating);
  //   } else {
  //     // user removed a rating
  //     const newSumRatings = sumRatings - oldRating;
  //     const newRatingsCount = ratingsCount - 1;
  //     const newAverageRating =
  //       newRatingsCount !== 0 ? newSumRatings / newRatingsCount : 0;

  //     setAverageRating(newAverageRating);
  //     setRatingsCount(newRatingsCount);
  //   }
  // };

  return (
    <div className="book-panel book-panel--current-read">
      <div className="book-panel__cover">
        <Link to={`/book/${_id}`}>
          <img src={image_url || cover} alt="bookcover" />
        </Link>
      </div>
      <div className="book-panel__details book-panel__details--current-read">
        <span>
          <Link to={location.pathname} className="green-link bold-link">
            Stuart
          </Link>{' '}
          is currently reading
        </span>
        <h3 className="book-panel__title">
          <Link to={`/book/${_id}`}>{title}</Link>
        </h3>
        <span>
          by{' '}
          <Link to={`/author/${authors[0].authorId}`} className="author-name">
            {authors[0].name}
          </Link>
        </span>
        <span className="book-panel__details-footer">
          <span className="book-panel__date">
            {moment(dateShelved).format('Do MMM, YYYY hh:mm A')}
          </span>
          <span className="middle-dot">&#183;</span>
          <span>
            <Link to="#!">1 comment</Link>
          </span>
        </span>
      </div>
      <div className="book-panel__actions">
        <BookshelfDropdownButton
          _id={_id}
          title={title}
          authors={authors}
          image_url={image_url}
        />
        <span className="rate-text text-tiny">Rate this book</span>
        <div>
          <InlineRating
            _id={_id}
            title={title}
            authors={authors}
            image_url={image_url}
            // updateDisplay={updateRatingDisplay}
          />
        </div>
      </div>
    </div>
  );
};

export default CurrentRead;

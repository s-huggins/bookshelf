import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import nophoto from '../../../../img/nophoto.png';
import RatingFixed from '../../../common/RatingFixed';
import { Link } from 'react-router-dom';
import InlineRating from '../../../common/InlineRating';
import moment from 'moment';

const BookshelfBook = ({
  ownBookshelf,
  dateShelved,
  _id,
  title,
  authors,
  image_url,
  averageRating,
  ratingsCount,
  updateRatingDisplay
}) => {
  const myRatings = useSelector(state => state.auth.user.profile.ratings);
  const myRating = myRatings.find(r => r.bookId === _id);

  return (
    <tr className="Bookshelves__list-book">
      <td className="cover">
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
      <td className="date-shelved">
        {moment(dateShelved).format('Do MMM, YYYY')}
      </td>
    </tr>
  );
};

export default BookshelfBook;

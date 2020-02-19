import React, { useState, useEffect } from 'react';
import Rating from './Rating';
import { useDispatch, useSelector } from 'react-redux';
import { rateBook } from '../../redux/profile/profileActions';

const InlineRating = ({
  _id,
  title,
  authors,
  image_url,
  updateDisplay,
  rate
}) => {
  const [rating, setRating] = useState(0);
  const dispatch = useDispatch();
  const userRatings = useSelector(state => state.auth.user.profile.ratings);

  // retrieve the user's own rating on mount
  useEffect(() => {
    const userRating = userRatings.find(ratingEl => ratingEl.bookId === +_id);
    if (userRating) setRating(userRating.rating);
  }, []);

  const handleRating = starNumClicked => {
    const oldRating = rating;
    let newRating;
    // clicking the star again disables the rating
    if (starNumClicked === rating) {
      setRating(0);
      newRating = 0;
    } else {
      setRating(starNumClicked);
      newRating = starNumClicked;
    }

    updateDisplay && updateDisplay(oldRating, newRating);
    rate && rate(newRating);
    const authorsData = authors.map(author => ({
      ...author,
      authorId: +author.id
    }));

    const bookData = {
      bookId: _id,
      title,
      authors: authorsData,
      image_url
    };
    dispatch(rateBook(bookData, newRating)); // persists profile & book updates to db
  };

  return <Rating rating={rating} handleRating={handleRating} />;
};

export default InlineRating;

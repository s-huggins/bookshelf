import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { rateBook } from '../../../redux/profile/profileActions';
import { updateRating } from '../../../redux/book/bookActions';
import Rating from '../../common/Rating';

const BookRating = ({ book }) => {
  const [rating, setRating] = useState(0);
  const dispatch = useDispatch();
  const ratings = useSelector(state => state.auth.user.profile.ratings);

  // on mount, we must fetch the user's own rating
  useEffect(() => {
    if (!book) return;
    const userRating = ratings.find(ratingEl => ratingEl.bookId === +book.id);
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

    if (!book) return; // TODO: remove this eventually

    // could use a ref here to cache bookdata

    const {
      average_rating,
      ratings_count,
      title,
      image_url,
      authors,
      id
    } = book;

    let authorsArr = Array.isArray(authors.author)
      ? authors.author
      : [authors.author];

    authorsArr = authorsArr.map(author => ({
      ...author,
      authorId: +author.id
    }));

    const bookData = {
      bookId: +id,
      title,
      authors: authorsArr,
      image_url
    };
    // TODO: reuuse inline rating component to manage view state instead of redux?
    dispatch(updateRating(oldRating, newRating, average_rating, ratings_count)); // updates book in store for fast view update
    dispatch(rateBook(bookData, newRating)); // persists profile & book updates to db
  };

  return <Rating rating={rating} handleRating={handleRating} />;
};

export default BookRating;

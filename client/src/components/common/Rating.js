import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { rateBook } from '../../redux/profile/profileActions';
import { updateRating } from '../../redux/book/bookActions';
import { useEffect } from 'react';

const Rating = ({ book }) => {
  const [rating, setRating] = useState(0);
  const dispatch = useDispatch();
  const ratings = useSelector(state => state.auth.user.profile.ratings);

  const handleRating = e => {
    const starNumClicked = +e.nativeEvent.target.dataset.star;
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

    const bookData = {
      bookId: +book.id,
      title: book.title,
      authors: Array.isArray(book.authors.author)
        ? book.authors.author
        : [book.authors.author],
      image_url: book.image_url
    };
    dispatch(updateRating(oldRating, newRating)); // updates book in store for fast view update
    dispatch(rateBook(bookData, newRating)); // persists profile & book updates to db
  };

  // on mount, we must fetch the user's own rating
  useEffect(() => {
    if (!book) return;
    const userRating = ratings.find(ratingEl => ratingEl.bookId === +book.id);
    if (userRating) setRating(userRating.rating);
  }, []);

  // in the MiniRating component, we must fetch avg

  const getClass = starNum => {
    return rating >= starNum ? 'star-on' : '';
  };

  const getTitle = starNum => {
    switch (starNum) {
      case 1:
        return 'did not like it';
      case 2:
        return 'it was okay';
      case 3:
        return 'liked it';
      case 4:
        return 'really liked it';
      case 5:
        return 'it was amazing';
    }
  };

  return (
    <div className="Rating" onClick={handleRating}>
      <span data-star="5" className={getClass(5)} title={getTitle(5)}></span>
      <span data-star="4" className={getClass(4)} title={getTitle(4)}></span>
      <span data-star="3" className={getClass(3)} title={getTitle(3)}></span>
      <span data-star="2" className={getClass(2)} title={getTitle(2)}></span>
      <span data-star="1" className={getClass(1)} title={getTitle(1)}></span>
    </div>
  );
};

export default Rating;

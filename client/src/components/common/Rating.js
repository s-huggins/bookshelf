import React, { useState } from 'react';
// import starOn from '../../img/star-on.png';
// import starOff from '../../img/star-off.png';

const Rating = () => {
  const [rating, setRating] = useState(0);

  const handleRating = e => {
    const starNumClicked = +e.nativeEvent.target.dataset.star;
    if (rating === starNumClicked) setRating(0);
    else setRating(starNumClicked);
  };

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

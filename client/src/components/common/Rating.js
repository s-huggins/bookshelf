import React from 'react';

const Rating = ({ rating, handleRating }) => {
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

  const starClicked = e => {
    const starNumClicked = +e.nativeEvent.target.dataset.star;
    handleRating(starNumClicked);
  };

  return (
    <div className="Rating" onClick={starClicked}>
      <span data-star="5" className={getClass(5)} title={getTitle(5)}></span>
      <span data-star="4" className={getClass(4)} title={getTitle(4)}></span>
      <span data-star="3" className={getClass(3)} title={getTitle(3)}></span>
      <span data-star="2" className={getClass(2)} title={getTitle(2)}></span>
      <span data-star="1" className={getClass(1)} title={getTitle(1)}></span>
    </div>
  );
};

export default Rating;

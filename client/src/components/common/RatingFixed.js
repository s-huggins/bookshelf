import React from 'react';

const RatingFixed = ({ rating }) => {
  const stars = [];

  for (let i = 1; i <= 5; i++) {
    stars.push(<span className={i <= rating ? 'star-on' : ''} key={i}></span>);
  }

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
    <div className="Rating-fixed" title={getTitle(rating)}>
      {stars}
    </div>
  );
};

export default RatingFixed;

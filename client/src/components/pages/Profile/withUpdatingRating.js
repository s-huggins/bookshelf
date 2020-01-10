import React, { useState } from 'react';

// export default (Component, props, key) => {
export default Component => {
  return ({ props }) => {
    const [averageRating, setAverageRating] = useState(props.average_rating);
    const [ratingsCount, setRatingsCount] = useState(props.ratings_count);

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
      <Component
        {...props}
        averageRating={averageRating}
        ratingsCount={ratingsCount}
        updateRatingDisplay={updateRatingDisplay}
      />
    );
  };
};

import React from 'react';

const MiniRating = ({ average }) => {
  const fillNum = Math.floor(average);
  const fraction = average - fillNum;

  const getClass = starNum => {
    if (fillNum === 0) return '';

    if (starNum <= fillNum) return 'on';

    if (starNum === fillNum + 1 && fraction) {
      if (fraction <= 0.5) return 'half';

      return 'high';
    }

    return '';
  };

  return (
    <div className="MiniRating">
      <span className={getClass(1)}></span>
      <span className={getClass(2)}></span>
      <span className={getClass(3)}></span>
      <span className={getClass(4)}></span>
      <span className={getClass(5)}></span>
    </div>
  );
};

export default MiniRating;

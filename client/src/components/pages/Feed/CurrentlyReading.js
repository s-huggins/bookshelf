import React from 'react';
import moby from '../../../img/moby.jpg';

const CurrentlyReading = () => {
  return (
    <div className="current-read-aside">
      <div className="current-read-aside__img">
        <a href="#!">
          <img src={moby} alt="bookcover" />
        </a>
      </div>
      <div className="current-read-aside__detail">
        <h4>
          <a href="#!" className="current-read-aside__detail-title">
            Moby-Dick
          </a>
        </h4>
        by{' '}
        <span className="current-read-aside__detail-author">
          <a href="#!">Herman Melville</a>
        </span>
      </div>
    </div>
  );
};

export default CurrentlyReading;

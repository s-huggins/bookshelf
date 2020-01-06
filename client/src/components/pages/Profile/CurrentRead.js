import React from 'react';
import cover from '../../../img/gulag.jpg';
import DropdownButton from '../../common/DropdownButton';
import Rating from '../../common/Rating';
import { Link } from 'react-router-dom';

const CurrentRead = () => {
  return (
    <div className="book-panel book-panel--current-read">
      <div className="book-panel__cover">
        <Link to="#!">
          <img src={cover} alt="bookcover" />
        </Link>
      </div>
      <div className="book-panel__details book-panel__details--current-read">
        <span>
          <Link to="#!" className="green-link bold-link">
            Stuart
          </Link>{' '}
          is currently reading
        </span>
        <h3 className="book-panel__title">
          Frederick the Great: King of Prussia
        </h3>
        <span>
          by{' '}
          <span className="book-panel__author-name">Timothy C.W. Blanning</span>
        </span>
        <span className="book-panel__details-footer">
          <span className="book-panel__date">Jan 01, 2020 02:37PM</span>
          <span className="middle-dot">&#183;</span>
          <span>
            <Link to="#!">1 comment</Link>
          </span>
        </span>
      </div>
      <div className="book-panel__actions">
        <DropdownButton />
        <span className="rate-text text-tiny">Rate this book</span>
        <div>
          <Rating />
        </div>
      </div>
    </div>
  );
};

export default CurrentRead;

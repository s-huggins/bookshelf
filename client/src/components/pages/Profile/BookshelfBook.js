import React from 'react';
import cover from '../../../img/gulag.jpg';
import Rating from '../../common/Rating';
import RatingFixed from '../../common/RatingFixed';
import { Link } from 'react-router-dom';

const BookshelfBook = () => {
  return (
    <tr className="Bookshelves__list-book">
      <td>
        <Link to="!#">
          <img src={cover} alt="bookcover" />
        </Link>
      </td>
      <td className="title">
        <Link to="!#" className="green-link">
          A Book of Five Rings: The Classic Guide to Strategy
        </Link>
      </td>
      <td className="author">
        <Link to="#!" className="green-link">
          Miyamoto Musashi
        </Link>
      </td>
      <td className="avg-rating">4.07</td>
      <td className="friend-rating">
        <RatingFixed rating={4} />
      </td>
      <td className="my-rating">
        <Rating />
      </td>
      <td className="date-shelved">Dec 31, 2019</td>
    </tr>
  );
};

export default BookshelfBook;

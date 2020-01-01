import React from 'react';
import { Link } from 'react-router-dom';
import Rating from '../../common/Rating';
import MiniRating from '../../common/MiniRating';
import DropdownButton from '../../common/DropdownButton';

const BookResult = ({
  work: {
    books_count,
    original_publication_year,
    best_book = { title: 'Untitled', id: -1 }
  }
}) => {
  const { author = { name: 'Unknown', id: -1 } } = best_book;

  return (
    <div className="BookResult">
      <Link to={`/book/${best_book.id}`} className="BookResult__cover">
        <img src={best_book.small_image_url} alt="bookcover" />
      </Link>
      <div className="BookResult__details">
        <h2 className="BookResult__details-header">
          <Link to={`/book/${best_book.id}`}>{best_book.title}</Link>
        </h2>
        <span className="BookResult__details-by">
          by{' '}
          <span className="BookResult__details-author">
            <Link to={`/author/${author.id}`}>{author.name}</Link>
          </span>
        </span>
        <div className="BookResult__details-specifics">
          <MiniRating average={4.22} />
          <span className="text-tiny">
            4.22 avg rating — 654,257 ratings — published{' '}
            {original_publication_year}
          </span>
        </div>
        <DropdownButton />
        <div className="BookResult__rate">
          <span className="BookResult__rate-text text-tiny">
            Rate this book
          </span>
          <div>
            <Rating />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookResult;

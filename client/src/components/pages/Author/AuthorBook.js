import React from 'react';
import MiniRating from '../../common/MiniRating';
import { Link } from 'react-router-dom';
import DropdownButton from '../../common/DropdownButton';
import Rating from '../../common/Rating';

const AuthorBook = ({ book }) => {
  const printDetails = book => {
    const dummy = '4.22 avg rating — 654,257 ratings'; //TODO: replace with db data

    const pubYear = book.publication_year
      ? `published ${book.publication_year}`
      : '';
    const numPages = book.num_pages
      ? `${book.num_pages} page${book.num_pages !== 1 ? 's' : ''}`
      : '';

    return [dummy, pubYear, numPages].filter(s => s.length).join(' — ');
  };

  return (
    <div className="AuthorBook">
      <div className="AuthorBook__preview">
        <div className="AuthorBook__cover">
          <Link to={`/book/`}>
            <img src={book.image_url} alt="bookcover" />
          </Link>
        </div>
        <div className="AuthorBook__details">
          <h3 className="AuthorBook__details-header">
            <Link to={`/book/${book.id}`}>{book.title}</Link>
          </h3>

          <div className="AuthorBook__details-specifics">
            <span className="AuthorBook__details-rating">
              <MiniRating average={4.22} />
            </span>
            <span className="text-tiny">{printDetails(book)}</span>
          </div>
        </div>
      </div>
      <div className="AuthorBook__actions">
        <DropdownButton />
        <div className="AuthorBook__rate">
          <span className="AuthorBook__rate-text text-tiny">
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

export default AuthorBook;

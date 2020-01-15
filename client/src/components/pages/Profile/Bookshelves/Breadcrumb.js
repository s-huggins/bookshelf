import React from 'react';
import { useLocation, Link } from 'react-router-dom';

const Breadcrumb = ({ buildBookshelfLink, activeShelf, displayName }) => {
  const location = useLocation();

  const printShelf = () => {
    switch (activeShelf.shelf) {
      case 'read':
        return 'Read';
      case 'reading':
        return 'Reading';
      case 'to-read':
        return 'To Read';
      case '':
        return 'All';
      default:
        return null;
    }
  };

  return (
    <div className="Bookshelves__header">
      <h1 className="Bookshelves__header-text">
        <Link
          className="green-link"
          to={location.pathname
            .split('/')
            .slice(0, -1)
            .join('/')}
        >
          {displayName}
        </Link>
        <span className="breadcrumb"> &gt; </span>
        <Link className="green-link" to={buildBookshelfLink()}>
          Books
        </Link>
        {printShelf() && (
          <>
            <span className="breadcrumb"> &gt; </span>
            <Link className="green-link" to={buildBookshelfLink(activeShelf)}>
              {printShelf()}
            </Link>
          </>
        )}
      </h1>
    </div>
  );
};

export default Breadcrumb;

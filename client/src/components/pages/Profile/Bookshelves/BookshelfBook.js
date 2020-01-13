import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import nophoto from '../../../../img/nophoto.png';
import RatingFixed from '../../../common/RatingFixed';
import { Link } from 'react-router-dom';
import InlineRating from '../../../common/InlineRating';
import moment from 'moment';
import { useEffect } from 'react';
import { useRef } from 'react';
import BookshelfBookEditPane from './BookshelfBookEditPane';

const BookshelfBook = ({
  ownBookshelf,
  dateShelved,
  _id,
  title,
  authors,
  image_url,
  averageRating,
  // ratingsCount,
  updateRatingDisplay,
  userRating
}) => {
  const ownBooks = useSelector(state => state.auth.user.profile.books);
  const [bookShelved, setBookShelved] = useState(
    ownBooks.find(book => book.bookId === _id)
  );

  const [editPaneActive, setEditPaneActive] = useState(false);
  const editPane = useRef(null);
  const editPaneClickCallback = useRef(function(e) {
    const editPaneClick =
      editPane.current && editPane.current.contains(e.target);

    if (!editPaneClick) {
      setEditPaneActive(false);
    }
  });

  useEffect(() => {
    if (editPaneActive) {
      document.addEventListener('click', editPaneClickCallback.current);
    }

    return () =>
      document.removeEventListener('click', editPaneClickCallback.current);
  }, [editPaneActive]);

  const handleEditPane = e => {
    setEditPaneActive(!editPaneActive);
  };

  return (
    <tr className="Bookshelves__list-book">
      <td className="cover">
        <Link to={`/book/${_id}`}>
          <img src={image_url || nophoto} alt="bookcover" />
        </Link>
      </td>
      <td className="title green-link">
        <Link to={`/book/${_id}`}>{title}</Link>
      </td>
      <td className="author">
        <Link to={`/author/${authors[0].authorId}`} className="green-link">
          {authors[0].name}
        </Link>
      </td>
      <td className="avg-rating">{averageRating.toFixed(2)}</td>
      {!ownBookshelf && (
        <td className="other-rating">
          <RatingFixed rating={userRating} />
        </td>
      )}
      <td className="my-rating">
        <InlineRating
          _id={_id}
          title={title}
          authors={authors}
          image_url={image_url}
          updateDisplay={updateRatingDisplay}
        />
        <span className="shelf-action" onClick={handleEditPane}>
          {bookShelved ? 'edit shelves' : 'add to shelves'}
        </span>

        <BookshelfBookEditPane
          _id={_id}
          title={title}
          authors={authors}
          image_url={image_url}
          ref={editPane}
          editPaneActive={editPaneActive}
          setEditPaneActive={setEditPaneActive}
          setBookShelved={setBookShelved}
        />
      </td>

      <td className="date-shelved">
        {moment(dateShelved).format('Do MMM, YYYY')}
      </td>
    </tr>
  );
};

export default BookshelfBook;

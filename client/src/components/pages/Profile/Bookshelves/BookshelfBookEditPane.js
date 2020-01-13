import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { shelveBook } from '../../../../redux/profile/profileActions';

const BookshelfBookEditPane = React.forwardRef(
  (
    {
      _id,
      title,
      authors,
      image_url,
      editPaneActive,
      setEditPaneActive,
      setBookShelved
    },
    ref
  ) => {
    const ownBooks = useSelector(state => state.auth.user.profile.books);
    const dispatch = useDispatch();

    const bookShelved = ownBooks.find(book => book.bookId === _id);
    const primaryShelf = bookShelved ? bookShelved.primaryShelf : '';
    const [shelf, setShelf] = useState(primaryShelf);

    const handleShelfChange = e => {
      const newShelf = e.target.value || '';
      setShelf(newShelf);

      if (newShelf) setBookShelved(true);
      else setBookShelved(false);

      const bookData = {
        bookId: _id,
        title,
        authors,
        image_url
      };

      dispatch(shelveBook(bookData, newShelf));
      // update view ??
    };

    return (
      <div
        className={`edit-pane${editPaneActive ? ' edit-pane--active' : ''}`}
        ref={ref}
      >
        <div className="edit-pane-header">
          <h6 className="header-text">choose shelves...</h6>{' '}
          <span
            className="close-button"
            onClick={() => setEditPaneActive(false)}
          >
            close
          </span>
        </div>
        <label htmlFor={`${_id}-read`}>
          <input
            type="radio"
            id={`${_id}-read`}
            name={`${_id}-shelf`}
            value="read"
            onChange={handleShelfChange}
            checked={shelf === 'read'}
          />{' '}
          <span className="label-text">read</span>
        </label>
        <label htmlFor={`${_id}-reading`}>
          <input
            type="radio"
            id={`${_id}-reading`}
            name={`${_id}-shelf`}
            value="reading"
            onChange={handleShelfChange}
            checked={shelf === 'reading'}
          />{' '}
          <span className="label-text">currently reading</span>
        </label>
        <label htmlFor={`${_id}-to-read`}>
          <input
            type="radio"
            id={`${_id}-to-read`}
            name={`${_id}-shelf`}
            value="to-read"
            onChange={handleShelfChange}
            checked={shelf === 'to-read'}
          />
          <span className="label-text">to read</span>
        </label>

        {shelf && (
          <label className="unshelf" value="" onClick={handleShelfChange}>
            <i className="fas fa-times"></i>{' '}
            <span className="label-text">unshelf this book</span>
          </label>
        )}
      </div>
    );
  }
);

export default BookshelfBookEditPane;

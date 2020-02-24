import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { shelveBook } from '../../redux/profile/profileActions';

const DropdownButton = ({ book, onShelfChange }) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [shelf, setShelf] = useState('');

  const dispatch = useDispatch();
  const books = useSelector(state => state.auth.user.profile.books);

  /* Determine initial button appearance at mount with books data from user profile */
  useEffect(() => {
    if (!book) return;
    const shelvedBook = books.find(bookEl => bookEl.bookId === +book.id);
    if (shelvedBook) setShelf(shelvedBook.primaryShelf);
  }, []);

  /* Build button appearance */

  let buttonText;
  let button;

  switch (shelf) {
    case 'to-read':
      buttonText = 'Want to Read';
      break;
    case 'reading':
      buttonText = 'Reading';
      break;
    case 'read':
      buttonText = 'Read';
      break;
    default:
      buttonText = 'Want to Read';
      break;
  }

  if (shelf !== '') {
    button = (
      <button className="btn btn--grey btn--bold">
        <span className="btn-icon">
          <i className="fas fa-check check"></i>

          <i
            className="fas fa-times cross"
            onClick={() => handleShelfChange('')}
          ></i>
        </span>{' '}
        {buttonText}
      </button>
    );
  } else {
    button = (
      <button
        className="btn btn--green"
        onClick={() => handleShelfChange('to-read')}
      >
        {buttonText}
      </button>
    );
  }

  const showDropdown = () => {
    setTimeout(() => {
      setDropdownVisible(true);
    }, 150);
  };

  const closeDropdown = () => {
    setTimeout(() => {
      setDropdownVisible(false);
    }, 200);
  };

  const handleShelfChange = shelf => {
    setShelf(shelf);

    let authors = Array.isArray(book.authors.author)
      ? book.authors.author
      : [book.authors.author];

    authors = authors.map(author => ({
      ...author,
      authorId: +author.id
    }));

    const bookData = {
      bookId: +book.id,
      title: book.title,
      authors,
      image_url: book.image_url
    };
    dispatch(shelveBook(bookData, shelf));
    onShelfChange && onShelfChange(+book.id, shelf);
    // update profile api, update book api for num times shelved?
  };
  return (
    <div className="DropdownButton">
      {button}
      <button
        className="btn btn--green btn--dropdown"
        onMouseLeave={closeDropdown}
        onMouseEnter={showDropdown}
      >
        <i className="fas fa-caret-down"></i>
      </button>
      <div
        className={`dropdown-pane${
          dropdownVisible ? ' dropdown-pane--visible' : ''
        }`}
        onMouseLeave={closeDropdown}
      >
        <ul>
          {shelf !== 'to-read' && (
            <li>
              <button
                className="dropdown-link"
                onClick={() => handleShelfChange('to-read')}
              >
                <span>Want to Read</span>
              </button>
            </li>
          )}
          {shelf !== 'reading' && (
            <li>
              <button
                className="dropdown-link"
                onClick={() => handleShelfChange('reading')}
              >
                <span>Currently Reading</span>
              </button>
            </li>
          )}
          {shelf !== 'read' && (
            <li>
              <button
                className="dropdown-link"
                onClick={() => handleShelfChange('read')}
              >
                <span>Read</span>
              </button>
            </li>
          )}
          {shelf !== '' && (
            <li className="clear-from-shelf">
              <button
                className="dropdown-link"
                onClick={() => handleShelfChange('')}
              >
                <span>Clear from Shelf</span>
              </button>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default DropdownButton;

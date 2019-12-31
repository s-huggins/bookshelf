import React, { useState, useRef } from 'react';
import { withRouter } from 'react-router-dom';
import SearchSpinner from './SearchSpinner';
import debounce from 'debounce-async';
import store from '../../../../redux/store';
import ResultsPreview from './ResultsPreview';

/**
 * An onKeyUp handler to fetch a few books to be displayed.
 * This is intended as an inline search and is debounced below.
 */
const fetchBooks = (searchString, setSearching, cancelSearch) => {
  if (searchString.trim() === '') return Promise.resolve(null);
  setSearching(true);
  return new Promise((resolve, reject) => {
    const uri = `http://localhost:5000/api/v1/search?q=${searchString}`;
    const token = store.getState().auth.token;

    fetch(uri, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(json => {
        if (cancelSearch.current === true) {
          cancelSearch.current = false;
          setSearching(false);
          resolve(null);
          return;
        }
        setSearching(false);

        if (json.status !== 'success') {
          resolve(null);
          return;
        }

        resolve(json.data);
      })
      .catch(err => {
        console.log('ERROR', err);
      });
  });
};

/* DEBOUNCED HANDLER */
const runFetchBooks = debounce(fetchBooks, 250, {});

const HeaderSearch = ({ history }) => {
  const [searching, setSearching] = useState(false);
  const [books, setBooks] = useState(null);
  const [inFocus, setInFocus] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [previewInFocus, setPreviewInFocus] = useState(null);
  const cancelSearch = useRef(false);
  const searchField = useRef(null);

  const handleTyping = e => {
    if (e.keyCode === 13) {
      cancelSearch.current = true;
      setSearching(false);
      // setBooks(null);
      // setInFocus(false);
      searchField.current.blur();
      return;
    }
    if (e.keyCode === 40 || e.keyCode === 38) {
      return;
    }

    setSearchQuery(e.target.value);
    runFetchBooks(e.target.value, setSearching, cancelSearch)
      .then(data => {
        if (data !== null) {
          const books =
            data.works && data.works.slice(0, 5).map(work => work.best_book);

          setBooks(books);
        }
      })
      .catch(e => {});
  };

  const handleArrowPress = e => {
    if (e.keyCode === 40) {
      if (!books) return;
      if (!previewInFocus || previewInFocus === books.length)
        setPreviewInFocus(1);
      else setPreviewInFocus(previewInFocus + 1);
    } else if (e.keyCode === 38) {
      if (!books) return;
      if (!previewInFocus || previewInFocus === 1)
        setPreviewInFocus(books.length);
      else setPreviewInFocus(previewInFocus - 1);
    }
  };

  const handleBlur = e => {
    const relatedTarget = e.nativeEvent.relatedTarget;
    if (relatedTarget && relatedTarget.classList.contains('searchPreviewLink'))
      return searchField.current.focus();

    setInFocus(false);
    setPreviewInFocus(null);
  };

  const blurInput = () => searchField.current.blur();

  const handleSearch = e => {
    e.preventDefault();
    // searchField.current.blur();
    // setSearching(false);
    // cancelSearch.current = true;
    if (searchQuery.trim() === '') return;

    if (previewInFocus) {
      const id = books[previewInFocus - 1].id;
      history.push(`/book/${id}`);
      setSearchQuery('');
      return;
    }

    history.push(`/search?q=${searchQuery}`);
  };

  return (
    <div className="HeaderSearch">
      <form className="searchbar" onSubmit={handleSearch}>
        <input
          type="text"
          className="form-control"
          placeholder="Search books"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          onKeyUp={handleTyping}
          onKeyDown={handleArrowPress}
          onBlur={handleBlur}
          onFocus={() => setInFocus(true)}
          ref={searchField}
        />
        <button
          style={{ cursor: searching ? 'default' : 'pointer' }}
          type="submit"
        >
          {searching ? <SearchSpinner /> : <i className="fas fa-search"></i>}
        </button>
      </form>
      {inFocus && books && (
        <ResultsPreview
          works={books}
          searchString={searchQuery}
          previewInFocus={previewInFocus}
          setPreviewInFocus={setPreviewInFocus}
          blurInput={blurInput}
          setSearchQuery={setSearchQuery}
        />
      )}
    </div>
  );
};

export default withRouter(HeaderSearch);

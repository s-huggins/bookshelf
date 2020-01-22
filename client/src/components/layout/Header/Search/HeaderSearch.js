import React, { useState, useRef, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import SearchSpinner from './SearchSpinner';
import debounce from 'debounce-async';
import store from '../../../../redux/store';
import ResultsPreview from './ResultsPreview';

/**
 * An onKeyUp handler to fetch a few books to be displayed.
 * This is intended for an inline search and is debounced below.
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
const runFetchBooks = debounce(fetchBooks, 200, {});

const HeaderSearch = ({ history }) => {
  const [searching, setSearching] = useState(false);
  const [books, setBooks] = useState(null);
  const [inFocus, setInFocus] = useState(false);
  const [searchQuery, setSearchQuery] = useState({
    active: '',
    cached: ''
  });
  const [previewInFocus, setPreviewInFocus] = useState(null);
  const cancelSearch = useRef(false);
  const searchField = useRef(null);
  // const resultsRef = useRef(null);

  const handleTyping = e => {
    // enter key
    if (e.keyCode === 13) {
      cancelSearch.current = true;
      setSearching(false);
      searchField.current.blur();
      return;
    }
    // up/down arrows
    if (e.keyCode === 40 || e.keyCode === 38) {
      return;
    }

    const userInput = e.target.value;
    setPreviewInFocus(null);
    if (userInput.trim().length) {
      setSearchQuery({ active: userInput, cached: userInput });
      runFetchBooks(userInput, setSearching, cancelSearch)
        .then(data => {
          if (data !== null) {
            const books =
              data.works && data.works.slice(0, 5).map(work => work.best_book);

            setBooks(books);
          }
        })
        .catch(e => {
          /* debounce-async swallows this */
        });
    } else {
      setBooks(null);
    }
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

  // effect to close previews if clicked away
  useEffect(() => {
    if (inFocus) {
      const closeResults = e => {
        const clickedInput = searchField.current?.contains(e.target);
        if (!clickedInput) setInFocus(false);
      };

      document.addEventListener('click', closeResults);

      return () => document.removeEventListener('click', closeResults);
    }
  }, [inFocus]);

  const handleSearch = e => {
    e.preventDefault();

    if (previewInFocus) {
      const id = books[previewInFocus - 1].id;
      history.push(`/book/${id}`);
      setSearchQuery({ ...searchQuery, active: '' });
      return;
    }

    if (searchQuery.active.trim() === '') return;

    history.push(`/search?q=${searchQuery.active}`);
    setSearchQuery({ ...searchQuery, active: '' });
  };

  return (
    <div className="HeaderSearch">
      <form className="searchbar" onSubmit={handleSearch}>
        <input
          type="text"
          className="form-control"
          placeholder="Search books"
          value={searchQuery.active}
          onChange={e =>
            setSearchQuery({ active: e.target.value, cached: e.target.value })
          }
          onKeyUp={handleTyping}
          onKeyDown={handleArrowPress}
          onFocus={() => setInFocus(true)}
          onClick={() => setPreviewInFocus(null)}
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
          searchQuery={searchQuery}
          previewInFocus={previewInFocus}
          setPreviewInFocus={setPreviewInFocus}
          setSearchQuery={setSearchQuery}
        />
      )}
    </div>
  );
};

export default withRouter(HeaderSearch);

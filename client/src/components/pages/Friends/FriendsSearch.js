import React from 'react';
import { useState } from 'react';
import debounce from 'debounce-async';
import queryString from 'query-string';
import { useLocation, useHistory } from 'react-router-dom';

const searchFriends = searchInput => {
  if (searchInput.trim() === '') return Promise.resolve(null);
  return new Promise((resolve, reject) => {
    resolve(searchInput);
  });
};

/* DEBOUNCED HANDLER */
const handleSearch = debounce(searchFriends, 400, {});

const FriendsSearch = ({ setSearchString }) => {
  const [input, setInput] = useState('');
  const location = useLocation();
  const history = useHistory();

  const handleInputChange = e => {
    const input = e.target.value;
    setInput(input);
    handleSearch(input)
      .then(val => {
        setSearchString(val);

        const baseURL = location.pathname;
        const parsed = queryString.parse(location.search);
        parsed.page = 1;

        const pushTo = Object.entries(parsed).reduce(
          (link, [param, val], i) => {
            return i === 0
              ? `${link}?${param}=${val}`
              : `${link}&${param}=${val}`;
          },
          baseURL
        );

        history.push(pushTo);
      })
      .catch(err => {
        /* do nothing */
      });
  };

  const handleSubmit = e => {
    e.preventDefault();
    setSearchString(input);
  };

  return (
    <form className="friends-search" onSubmit={handleSubmit}>
      <span className="friends-search-searchbar">
        <input
          type="text"
          className="form-control"
          placeholder="Search your friends list"
          value={input}
          onChange={handleInputChange}
        />{' '}
        <button>
          <i className="fas fa-search"></i>
        </button>
      </span>
    </form>
  );
};

export default FriendsSearch;

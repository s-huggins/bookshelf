import React, { useState } from 'react';
import debounce from 'debounce-async';

const filterBooks = filterInput => {
  if (filterInput.trim() === '') return Promise.resolve(null);
  return new Promise((resolve, reject) => {
    resolve(filterInput);
  });
};

/* DEBOUNCED HANDLER */
const handleFilter = debounce(filterBooks, 400, {});

const BookshelfFilter = ({ setFilter }) => {
  const [filterString, setFilterString] = useState('');

  const handleInputChange = e => {
    const input = e.target.value;
    setFilterString(input);
    handleFilter(input)
      .then(val => {
        setFilter(val);
      })
      .catch(err => {
        /* do nothing */
      });
  };

  const handleSubmit = e => {
    e.preventDefault();
    // setFilter(e.target.value);
    setFilter(filterString);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        className="form-control"
        placeholder="Filter books"
        value={filterString}
        onChange={handleInputChange}
      />
      <button>
        <i className="fas fa-search"></i>
      </button>
    </form>
  );
};

export default BookshelfFilter;

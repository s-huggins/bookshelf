import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import queryString from 'query-string';
import {
  searchBooks,
  clearSearchStatus
} from '../../../redux/search/searchActions';
import SearchResults from './SearchResults';

const Search = ({ location, history }) => {
  const getParams = () => {
    // refactor into custom hook
    const parsed = queryString.parse(location.search);

    let filter = parsed['search[field]'] || 'all';
    if (!['all', 'title', 'author'].includes(filter.toLowerCase()))
      filter = 'all';

    let pageNum = parseInt(parsed.page);
    if (Number.isNaN(pageNum) || pageNum <= 0) pageNum = 1;
    if (pageNum > 100) pageNum = 100;

    return [parsed.q, filter, pageNum];
  };

  const [formState, setFormState] = useState({
    searchString: '',
    filter: 'all'
  });
  const [searching, setSearching] = useState(false);
  const [page, setPage] = useState(1);

  const { searchStatus, bookResults } = useSelector(state => state.search);
  const dispatch = useDispatch();

  /* INITIAL MOUNT AND QUERY STRING CHANGE */
  useEffect(() => {
    const [query, filter, pageNum] = getParams();

    setFormState({
      ...formState,
      searchString: query,
      filter
    });

    setPage(pageNum);

    if (query) {
      setSearching(true);
      dispatch(searchBooks(query, filter, pageNum));
    }
  }, [location.search]);

  useEffect(() => {
    if (searchStatus !== '') {
      setSearching(false);
    }
  }, [bookResults]);

  useEffect(() => {
    if (!searching) {
      dispatch(clearSearchStatus());
    }
  }, [searching]);

  // a new search always returns page 1
  const handleSearch = e => {
    e.preventDefault();
    history.push(
      `/search?q=${formState.searchString
        .trim()
        .replace(/\s+/g, '+')}&search[field]=${formState.filter}&page=${1}`
    );

    // make API call for results
    setSearching(true);
    dispatch(searchBooks(formState.searchString, formState.filter, 1));
  };

  const handleQueryChange = e => {
    setFormState({
      ...formState,
      searchString: e.target.value
    });
  };
  const handleFilterChange = e => {
    setFormState({
      ...formState,
      filter: e.target.value
    });
  };

  return (
    <div className="Search page-container">
      <div className="container">
        <h1>Search</h1>
        <form className="Search__form" onSubmit={handleSearch}>
          <div className="Searchbar">
            <input
              type="text"
              className="form-control"
              placeholder="Search by Book Title, Author, or ISBN"
              value={formState.searchString}
              onChange={handleQueryChange}
            />
            <button type="submit" className="btn btn--light">
              Search
            </button>
          </div>
          <div className="Search-filters">
            <input
              type="radio"
              name="filter"
              value="all"
              checked={formState.filter === 'all'}
              id="filter-all"
              onChange={handleFilterChange}
            />{' '}
            <label htmlFor="filter-all">all</label>
            <input
              type="radio"
              name="filter"
              value="title"
              checked={formState.filter === 'title'}
              id="filter-title"
              onChange={handleFilterChange}
            />{' '}
            <label htmlFor="filter-title">title</label>
            <input
              type="radio"
              name="filter"
              value="author"
              checked={formState.filter === 'author'}
              id="filter-author"
              onChange={handleFilterChange}
            />{' '}
            <label htmlFor="filter-author">author</label>
          </div>
        </form>
        <SearchResults
          searching={searching}
          page={page}
          searchString={formState.searchString}
          filter={formState.filter}
        />
      </div>
    </div>
  );
};

export default Search;

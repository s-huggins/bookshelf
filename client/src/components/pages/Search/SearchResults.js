import React from 'react';
import { useSelector } from 'react-redux';
import BookResult from './BookResult';
import Loader from '../../common/Loader';

const SearchResults = ({ searching, page }) => {
  const bookResults = useSelector(state => state.search.bookResults);
  console.log(bookResults && bookResults.works);
  const buildQueryInfo = bookResults => {
    if (bookResults) {
      const { totalResults, queryTimeSeconds } = bookResults;
      return `Page ${page} of ${totalResults} result${
        +totalResults === 1 ? '' : 's'
      } (${queryTimeSeconds} seconds)`;
    }
    return '';
  };

  if (searching) return <Loader />;

  return (
    <div className="SearchResults">
      <span className="SearchResults__query-info">
        {buildQueryInfo(bookResults)}
      </span>
      <div className="SearchResults__list">
        {bookResults &&
          bookResults.works &&
          bookResults.works.map(work => (
            <BookResult key={work.id} work={work} />
          ))}
      </div>
    </div>
  );
};

export default SearchResults;

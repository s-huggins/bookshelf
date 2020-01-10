import React from 'react';
import { useSelector } from 'react-redux';
import Loader from '../../common/Loader';
import Pagination from '../../common/Pagination';
import pluralize from '../../../util/pluralize';
import BookResultList from './BookResultList';

const SearchResults = ({ searching, page, searchString, filter }) => {
  const bookResults = useSelector(state => state.search.bookResults);

  const buildQueryInfo = bookResults => {
    const { totalResults, queryTimeSeconds } = bookResults;
    return `Page ${page} of ${totalResults} ${pluralize(
      'result',
      totalResults
    )} (${queryTimeSeconds} seconds)`;
  };

  if (searching) return <Loader />;
  if (!bookResults || !searchString) return null;

  return (
    <div className="SearchResults">
      <span className="SearchResults__query-info">
        {buildQueryInfo(bookResults)}
      </span>
      <div className="SearchResults__list">
        <BookResultList books={bookResults.works} />
      </div>
      <div className="SearchResults__footer">
        <Pagination
          useQueryParam
          baseLink={`/search?q=${searchString
            .trim()
            .replace(/\s+/g, '+')}&search[field]=${filter}`}
          total={bookResults.totalResults}
          page={page}
          perPage={10}
        />
      </div>
    </div>
  );
};

export default SearchResults;

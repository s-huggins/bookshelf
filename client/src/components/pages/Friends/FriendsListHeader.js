import React from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import Pagination from '../../common/Pagination';
import queryString from 'query-string';
import { useEffect } from 'react';
import { useState } from 'react';

const FriendsListHeader = ({
  friendsView: { listView, startIndex, endIndex }
}) => {
  const location = useLocation();
  const history = useHistory();
  const [filterLetter, setFilterLetter] = useState('all');
  const [sort, setSort] = useState('last-active');

  const printShowing = () => {
    const filteredTotal = listView.length;
    if (!filteredTotal) return 'Showing 0 of 0';

    return `Showing ${startIndex + 1}-${Math.min(
      endIndex,
      filteredTotal
    )} of ${filteredTotal}`;
  };
  const getPaginationSettings = () => {
    const parsed = queryString.parse(location.search);
    // const baseLink = `${location.pathname}${location.search}`.replace(
    //   /(\?page=(\d+))|(&page=(\d+))/,
    //   ''
    // );

    let page = parseInt(parsed['page']) || 1;
    if (page <= 0) page = 1;

    const total = listView.length;

    return {
      perPage: 30,
      // baseLink,
      page,
      total,
      useQueryParam: true,
      noLimit: true
    };
  };

  useEffect(() => {
    const parsed = queryString.parse(location.search);
    setFilterLetter(parsed.letter || 'all');
  }, [location]);

  const handleFilterChange = e => {
    const filterClicked = e.nativeEvent.target.dataset.filter;
    const baseURL = location.pathname;
    const parsed = queryString.parse(location.search);
    parsed.page = 1;
    if (filterClicked === 'all') delete parsed.letter;
    else parsed.letter = filterClicked;

    const filterLink = Object.entries(parsed).reduce(
      (link, [param, val], i) => {
        return i === 0 ? `${link}?${param}=${val}` : `${link}&${param}=${val}`;
      },
      baseURL
    );

    setFilterLetter(filterClicked);
    history.push(filterLink);
  };

  const handleSortChange = e => {
    const criterion = e.target.value;
    const baseURL = location.pathname;
    const parsed = queryString.parse(location.search);
    parsed.sort = criterion;

    const sortLink = Object.entries(parsed).reduce((link, [param, val], i) => {
      return i === 0 ? `${link}?${param}=${val}` : `${link}&${param}=${val}`;
    }, baseURL);

    setSort(criterion);
    history.push(sortLink);
  };

  return (
    <div className="list-header">
      <div className="pagination-header">
        <span className="showing-detail">{printShowing()}</span>
        <Pagination {...getPaginationSettings()} />
      </div>

      <div className="filter-header">
        <span>
          <span className="filter-all">
            <button
              className={`filter-button${
                filterLetter === 'all' ? ' active-link' : ' green-link'
              }`}
              data-filter={'all'}
              onClick={handleFilterChange}
            >
              all
            </button>
          </span>

          {'abcdefghijklmnopqrstuvwxyz'.split('').map(l => (
            <button
              key={l}
              className={`filter-button${
                filterLetter === l ? ' active-link' : ' green-link'
              }`}
              data-filter={l}
              onClick={handleFilterChange}
            >
              {l}
            </button>
          ))}
        </span>
        <span>
          <span className="sort-label text-faded">sort by</span>
          <select onChange={handleSortChange} value={sort}>
            <option value="last-active">last active</option>
            <option value="display-name">display name</option>
            <option value="date-added">date added</option>
          </select>
        </span>
      </div>
    </div>
  );
};

export default FriendsListHeader;

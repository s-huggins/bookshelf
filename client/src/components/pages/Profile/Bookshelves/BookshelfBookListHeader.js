import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import queryString from 'query-string';
import { useSelector } from 'react-redux';
import apostrophize from '../../../../util/apostrophize';

const BookshelfBookListHeader = ({ ownBookshelf }) => {
  const location = useLocation(); // rerenders on location change
  const displayName = useSelector(
    state => state.profile.loadedProfile.displayName
  );

  const switchOrder = (order, fallback = 'ascending') => {
    if (order === 'ascending') return 'descending';
    if (order === 'descending') return 'ascending';
    return fallback;
  };

  const buildSortingLink = col => {
    const parsed = queryString.parse(location.search);
    const order = parsed.order;
    // const newOrder = order === 'descending' ? 'ascending' : 'descending';
    let newOrder;
    switch (col) {
      case 'title':
        if (parsed.sort === 'title') {
          newOrder = switchOrder(order);
        } else newOrder = 'ascending';
        break;

      case 'author':
        if (parsed.sort === 'author') {
          newOrder = switchOrder(order);
        } else newOrder = 'ascending';
        break;

      case 'avg-rating':
        if (parsed.sort === 'avg-rating') {
          newOrder = switchOrder(order, 'descending');
        } else newOrder = 'descending';
        break;

      case 'my-rating':
        if (parsed.sort === 'my-rating') {
          newOrder = switchOrder(order, 'descending');
        } else newOrder = 'descending';
        break;

      case 'user-rating':
        if (parsed.sort === 'user-rating') {
          newOrder = switchOrder(order, 'descending');
        } else newOrder = 'descending';
        break;

      case 'date':
        if (parsed.sort === 'date') {
          newOrder = switchOrder(order, 'descending');
        } else newOrder = 'descending';
        break;
    }

    delete parsed.sort;
    delete parsed.order;
    const params = Object.entries(parsed).map(([qParam, qVal]) => [
      qParam.toLowerCase(),
      qVal
    ]);

    const baseURL = `${location.pathname}?sort=${col}&order=${newOrder}`;
    const newURL = params.reduce((url, [qParam, qVal]) => {
      return `${url}&${qParam}=${qVal}`;
    }, baseURL);

    return newURL;
  };

  return (
    <tr className="Bookshelves__list-header">
      <th>cover</th>
      <th>
        <Link to={buildSortingLink('title')}>title</Link>
      </th>
      <th>
        <Link to={buildSortingLink('author')}>author</Link>
      </th>
      <th>
        <Link to={buildSortingLink('avg-rating')}>avg rating</Link>
      </th>
      {!ownBookshelf && (
        <th>
          <Link to={buildSortingLink('user-rating')}>{`${apostrophize(
            displayName
          )} rating`}</Link>
        </th>
      )}
      <th>
        <Link to={buildSortingLink('my-rating')}>my rating</Link>
      </th>
      <th>
        <Link to={buildSortingLink('date')}>date shelved</Link>
      </th>
    </tr>
  );
};

export default BookshelfBookListHeader;

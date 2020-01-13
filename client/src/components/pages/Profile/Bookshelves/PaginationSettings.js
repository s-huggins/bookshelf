import React, { useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { useEffect } from 'react';
import queryString from 'query-string';

const columnSet = new Set([
  'title',
  'author',
  'avg-rating',
  'user-rating',
  'my-rating',
  'num-ratings',
  'date'
]);
const orderSet = new Set(['ascending', 'descending']);
const defaultColumn = 'date';
const defaultOrder = 'ascending';

const PaginationSettings = ({ shelf, ownBookshelf }) => {
  const location = useLocation();
  const history = useHistory();
  const [perPage, setPerPage] = useState(20);
  const [sort, setSort] = useState({
    column: defaultColumn,
    order: defaultOrder
  });

  //componentDidMount
  useEffect(() => {
    const parsed = queryString.parse(location.search);
    if (parsed['per-page'] === 'infinite') {
      setPerPage('infinite');
    } else {
      const perPageInitial = parseInt(parsed['per-page']);

      if (!perPageInitial) {
        setPerPage(20);
      } else if (perPageInitial <= 0) {
        setPerPage(20);
      } else if (perPageInitial > 100) {
        setPerPage('infinite');
      } else {
        setPerPage(perPageInitial);
      }
    }
    const column = columnSet.has(parsed.sort) ? parsed.sort : defaultColumn;
    const order = orderSet.has(parsed.order) ? parsed.order : defaultOrder;
    setSort({ column, order });
  }, []);

  useEffect(() => {
    // update state to mirror url query params
    const parsed = queryString.parse(location.search);
    const column = columnSet.has(parsed.sort) ? parsed.sort : defaultColumn;
    const order = orderSet.has(parsed.order) ? parsed.order : defaultOrder;
    setSort({ column, order });
  }, [location]);

  const perPageChanged = e => {
    const newPerPage = e.target.value;
    if (newPerPage === 'infinite') {
      setPerPage('infinite');
      // bounce user to top of page
      window.scrollTo(0, 0);
    } else setPerPage(+newPerPage);

    const parsed = queryString.parse(location.search);
    const params = Object.entries(parsed).map(([qParam, qVal]) => [
      qParam.toLowerCase(),
      qVal
    ]);
    const baseURL = `${location.pathname}?shelf=${parsed.shelf ||
      'all'}&per-page=${newPerPage}`;
    const newURL = params.reduce((url, [qParam, qVal]) => {
      if (qParam === 'shelf') return url;
      if (qParam === 'per-page') return url;

      return `${url}&${qParam}=${qVal}`;
    }, baseURL);

    history.push(newURL);
  };

  const sortChanged = e => {
    const sortCol = e.target.value;
    setSort({ ...sort, column: sortCol });
    const baseURL = location.pathname;
    const parsed = { ...queryString.parse(location.search), sort: sortCol };
    const params = Object.entries(parsed).map(([qParam, qVal]) => [
      qParam.toLowerCase(),
      qVal
    ]);
    const newURL = params.reduce((url, [qParam, qVal], i) => {
      if (i === 0) {
        if (qParam === 'sort') return `${url}?sort=${sortCol}`;
        return `${url}?${qParam}=${qVal}`;
      }
      if (qParam === 'sort') return `${url}&sort=${sortCol}`;

      return `${url}&${qParam}=${qVal}`;
    }, baseURL);
    history.push(newURL);
  };

  const orderChanged = e => {
    const order = e.target.value;
    setSort({ ...sort, order });
    const baseURL = location.pathname;
    const parsed = { ...queryString.parse(location.search), order };
    const params = Object.entries(parsed).map(([qParam, qVal]) => [
      qParam.toLowerCase(),
      qVal
    ]);
    const newURL = params.reduce((url, [qParam, qVal], i) => {
      if (i === 0) {
        if (qParam === 'order') return `${url}?order=${order}`;
        return `${url}?${qParam}=${qVal}`;
      }
      if (qParam === 'order') return `${url}&order=${order}`;

      return `${url}&${qParam}=${qVal}`;
    }, baseURL);
    history.push(newURL);
  };

  return (
    <span className="PaginationSettings">
      <span className="PaginationSettings__per-page">
        <label htmlFor="per-page" className="PaginationSettings__label">
          per page
        </label>
        <select
          name="per-page"
          id="per-page"
          value={perPage}
          onChange={perPageChanged}
        >
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="30">30</option>
          <option value="40">40</option>
          <option value="50">50</option>
          <option value="75">75</option>
          <option value="100">100</option>
          <option value="infinite">infinite scroll</option>
        </select>
      </span>
      <span className="PaginationSettings__sort">
        <label htmlFor="sort" className="PaginationSettings__label">
          sort
        </label>
        <select
          name="sort"
          id="sort"
          onChange={sortChanged}
          value={sort.column}
        >
          <option value="title">Title</option>
          <option value="author">Author</option>
          <option value="avg-rating">Average rating</option>
          {!ownBookshelf && <option value="user-rating">User rating</option>}
          <option value="my-rating">My rating</option>
          <option value="num-ratings">Num ratings</option>
          <option value="date">Date shelved</option>
        </select>
        <input
          type="radio"
          name="order"
          value="ascending"
          checked={sort.order === 'ascending'}
          id="asc"
          onChange={orderChanged}
        />
        <label htmlFor="asc" className="PaginationSettings__dir-label">
          asc.
        </label>
        <input
          type="radio"
          name="order"
          value="descending"
          checked={sort.order === 'descending'}
          id="desc"
          onChange={orderChanged}
        />
        <label htmlFor="desc" className="PaginationSettings__dir-label">
          desc.
        </label>
      </span>
    </span>
  );
};

export default PaginationSettings;

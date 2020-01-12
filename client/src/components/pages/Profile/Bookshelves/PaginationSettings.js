import React, { useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { useEffect } from 'react';
import queryString from 'query-string';

const PaginationSettings = ({ shelf }) => {
  const location = useLocation();
  const history = useHistory();
  const [perPage, setPerPage] = useState(20);

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
  }, []);

  const perPageChanged = e => {
    const newPerPage = e.target.value;
    if (newPerPage === 'infinite') setPerPage('infinite');
    else setPerPage(+newPerPage);

    const parsed = queryString.parse(location.search);
    const entries = Object.entries(parsed).map(([qParam, qVal]) => [
      qParam.toLowerCase(),
      qVal
    ]);
    const baseURL = `${location.pathname}?shelf=${parsed.shelf ||
      'all'}&per-page=${newPerPage}`;
    const newURL = entries.reduce((url, [qParam, qVal]) => {
      if (qParam === 'shelf') return url;
      if (qParam === 'per-page') return url;

      return `${url}&${qParam}=${qVal}`;
    }, baseURL);

    history.push(newURL);
  };

  const sortChanged = e => {};

  const orderChanged = e => {};

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
        <select name="sort" id="sort" onChange={sortChanged}>
          <option value="title">Title</option>
          <option value="author">Author</option>
          <option value="avg-rating">Average rating</option>
          <option value="date">Date shelved</option>
        </select>
        <input
          type="radio"
          name="order"
          value="ascending"
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

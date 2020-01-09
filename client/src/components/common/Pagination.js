import React from 'react';
import { Link } from 'react-router-dom';

/* Goodreads API returns a maximum of 100 distinct 30-result pages, regardless
of whether search results exceed 3000. */

const Pagination = ({
  perPage,
  baseLink,
  total,
  page,
  useQueryParam,
  noLimit
}) => {
  // const totalPages = Math.min(100, Math.ceil(total / perPage) || 1);
  const totalPages = noLimit
    ? Math.ceil(total / perPage) || 1
    : Math.min(100, Math.ceil(total / perPage) || 1);

  let pageNumbers = [];

  const pageLink = pageNum => {
    let link = baseLink;

    if (useQueryParam) {
      if (baseLink.includes('?')) {
        link += `&page=${pageNum}`;
      } else {
        link += `?page=${pageNum}`;
      }
      return link;
    }

    return `${baseLink}/page/${pageNum}`;
  };

  // previous pages
  if (page <= 5) {
    for (let i = 1; i < page; i++) {
      pageNumbers.push(
        <span className="pagination__page-number" key={i}>
          <Link to={pageLink(i)}>{i}</Link>
        </span>
      );
    }
  } else {
    pageNumbers = [
      <span className="pagination__page-number" key={1}>
        <Link to={pageLink(1)}>1</Link>
      </span>,
      <span className="pagination__ellipsis" key="ellipsis-1">
        ...
      </span>,
      <span className="pagination__page-number" key={page - 3}>
        <Link to={pageLink(page - 3)}>{page - 3}</Link>
      </span>,
      <span className="pagination__page-number" key={page - 2}>
        <Link to={pageLink(page - 2)}>{page - 2}</Link>
      </span>,
      <span className="pagination__page-number" key={page - 1}>
        <Link to={pageLink(page - 1)}>{page - 1}</Link>
      </span>
    ];
  }

  // current page
  pageNumbers.push(
    <span className="pagination__page-number" key={page}>
      {page}
    </span>
  );

  // next pages
  if (page > totalPages - 5) {
    for (let i = page + 1; i <= totalPages; i++) {
      pageNumbers.push(
        <span className="pagination__page-number" key={i}>
          <Link to={pageLink(i)}>{i}</Link>
        </span>
      );
    }
  } else {
    pageNumbers = [
      ...pageNumbers,
      <span className="pagination__page-number" key={page + 1}>
        <Link to={pageLink(page + 1)}>{page + 1}</Link>
      </span>,
      <span className="pagination__page-number" key={page + 2}>
        <Link to={pageLink(page + 2)}>{page + 2}</Link>
      </span>,
      <span className="pagination__page-number" key={page + 3}>
        <Link to={pageLink(page + 3)}>{page + 3}</Link>
      </span>,
      <span className="pagination__ellipsis" key="ellipsis-2">
        ...
      </span>,
      <span className="pagination__page-number" key={totalPages}>
        <Link to={pageLink(totalPages)}>{totalPages}</Link>
      </span>
    ];
  }

  return (
    <span className="pagination">
      {page > 1 ? (
        <span className="pagination__prev">
          <Link to={pageLink(page - 1)}>« previous</Link>
        </span>
      ) : (
        <span className="pagination__prev">« previous</span>
      )}

      {pageNumbers}

      {page < totalPages ? (
        <span className="pagination__next">
          <Link to={pageLink(page + 1)}>next »</Link>
        </span>
      ) : (
        <span className="pagination__next">next »</span>
      )}
    </span>
  );
};

export default Pagination;

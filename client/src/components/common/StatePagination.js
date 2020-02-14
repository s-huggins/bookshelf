import React from 'react';

const StatePagination = ({ perPage, total, page, setPage, noLimit }) => {
  const totalPages = noLimit
    ? Math.ceil(total / perPage) || 1
    : Math.min(100, Math.ceil(total / perPage) || 1);

  let pageNumbers = [];

  const pageButton = (pageNum, text) => {
    return (
      <button
        className="button-reset green-link"
        onClick={() => setPage(pageNum)}
      >
        {text || pageNum}
      </button>
    );
  };

  // previous pages
  if (page <= 5) {
    for (let i = 1; i < page; i++) {
      pageNumbers.push(
        <span className="pagination__page-number" key={i}>
          {/* <Link to={pageLink(i)}>{i}</Link> */}
          {/* <button className="button-reset green-link" onClick={() => setPage(i)}>{i}</button> */}
          {pageButton(i)}
        </span>
      );
    }
  } else {
    pageNumbers = [
      <span className="pagination__page-number" key={1}>
        {/* <Link to={pageLink(1)}>1</Link> */}
        {pageButton(1)}
      </span>,
      <span className="pagination__ellipsis" key="ellipsis-1">
        ...
      </span>,
      <span className="pagination__page-number" key={page - 3}>
        {/* <Link to={pageLink(page - 3)}>{page - 3}</Link> */}
        {pageButton(page - 3)}
      </span>,
      <span className="pagination__page-number" key={page - 2}>
        {/* <Link to={pageLink(page - 2)}>{page - 2}</Link> */}
        {pageButton(page - 2)}
      </span>,
      <span className="pagination__page-number" key={page - 1}>
        {/* <Link to={pageLink(page - 1)}>{page - 1}</Link> */}
        {pageButton(page - 1)}
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
          {/* <Link to={pageLink(i)}>{i}</Link> */}
          {pageButton(i)}
        </span>
      );
    }
  } else {
    pageNumbers = [
      ...pageNumbers,
      <span className="pagination__page-number" key={page + 1}>
        {/* <Link to={pageLink(page + 1)}>{page + 1}</Link> */}
        {pageButton(page + 1)}
      </span>,
      <span className="pagination__page-number" key={page + 2}>
        {/* <Link to={pageLink(page + 2)}>{page + 2}</Link> */}
        {pageButton(page + 2)}
      </span>,
      <span className="pagination__page-number" key={page + 3}>
        {/* <Link to={pageLink(page + 3)}>{page + 3}</Link> */}
        {pageButton(page + 3)}
      </span>,
      <span className="pagination__ellipsis" key="ellipsis-2">
        ...
      </span>,
      <span className="pagination__page-number" key={totalPages}>
        {/* <Link to={pageLink(totalPages)}>{totalPages}</Link> */}
        {pageButton(totalPages)}
      </span>
    ];
  }

  return (
    <span className="pagination">
      {page > 1 ? (
        <span className="pagination__prev">
          {/* <Link to={pageLink(page - 1)}>« previous</Link> */}
          {pageButton(page - 1, '« previous')}
        </span>
      ) : (
        <span className="pagination__prev">« previous</span>
      )}

      {pageNumbers}

      {page < totalPages ? (
        <span className="pagination__next">
          {/* <Link to={pageLink(page + 1)}>next »</Link> */}
          {pageButton(page + 1, 'next »')}
        </span>
      ) : (
        <span className="pagination__next">next »</span>
      )}
    </span>
  );
};

export default StatePagination;

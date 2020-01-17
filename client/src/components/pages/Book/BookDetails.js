import React from 'react';
import formatDate from '../../../util/formatDate';
import getLangNames from '../../../util/langCodes';

const BookDetails = ({ data }) => {
  /* BUILD UP JSX FOR FIRST <UL> */
  const buildPhysicalData = book => {
    let physical = null;
    let publication = null;

    physical = [
      book.format ? `${book.format}`.trim() : '',
      book.edition_information ? `${book.edition_information}`.trim() : '',
      book.num_pages
        ? `${book.num_pages}`.trim() +
          ` page${+book.num_pages !== 1 ? 's' : ''}`
        : ''
    ]
      .filter(s => s.length)
      .join(', ');

    physical = physical ? <li key="physical">{physical}</li> : null;

    const publisher = book.publisher || '';

    const pubDate = formatDate(
      book.publication_year,
      book.publication_month,
      book.publication_day
    );

    const pubDateOriginal =
      book.work &&
      formatDate(
        book.work.original_publication_year,
        book.work.original_publication_month,
        book.work.original_publication_day
      );

    if (pubDate) {
      publication = `Published ${pubDate}`;

      if (publisher) publication = publication + ` by ${publisher}`;

      publication = <span>{publication}</span>;

      if (pubDateOriginal)
        publication = (
          <li key="publication">
            {publication}{' '}
            <span className="text-tiny first-published">{`(first published ${pubDateOriginal})`}</span>
          </li>
        );
      else publication = <li key="publication">{publication}</li>;
    } else if (pubDateOriginal) {
      publication = <li key="publication">{`Published ${pubDateOriginal}`}</li>;
    }

    if (physical || publication)
      return (
        <ul className="profile__details profile__details--book details-physical">
          {[physical, publication].filter(p => p).map(p => p)}
        </ul>
      );
    else return null;
  };

  /* BUILD UP JSX FOR SECOND <UL> */
  const buildMetadata = book => {
    let originalTitle = null;
    let editionLang = null;
    let isbn = null;
    let isbn13 = null;
    let kindleAsin = null;

    originalTitle = book.work && book.work.original_title;
    originalTitle = originalTitle && (
      <li key="title">
        <span className="text-bold">Original Title</span>
        {originalTitle}
      </li>
    );

    editionLang = getLangNames(book.language_code);
    editionLang = editionLang.international || editionLang.native || null;
    editionLang = editionLang && (
      <li key="lang">
        <span className="text-bold">Edition Language</span>
        {editionLang}
      </li>
    );

    isbn = book.isbn && (
      <li key="isbn">
        <span className="text-bold">ISBN</span>
        {book.isbn}
      </li>
    );
    isbn13 = book.isbn13 && (
      <li key="isbn13">
        <span className="text-bold">ISBN13</span>
        {book.isbn13}
      </li>
    );
    kindleAsin = book.kindle_asin && (
      <li key="kindle">
        <span className="text-bold">Kindle ASIN</span>
        {book.kindle_asin}
      </li>
    );

    let metadata = [
      originalTitle,
      editionLang,
      isbn,
      isbn13,
      kindleAsin
    ].filter(d => d);

    if (metadata.length)
      return (
        <ul className="profile__details profile__details--book details-metadata">
          {metadata.map(d => d)}
        </ul>
      );
    else return null;
  };

  /* BUILDS JSX FOR BOOK DETAILS USING HELPERS ABOVE */
  const buildDetails = book => {
    const details = {};
    details.physical = buildPhysicalData(book);
    details.metadata = buildMetadata(book);

    return details;
  };

  /* RENDER */
  const details = buildDetails(data);
  return (
    <>
      {details.physical}
      {details.metadata}
    </>
  );
};

export default BookDetails;

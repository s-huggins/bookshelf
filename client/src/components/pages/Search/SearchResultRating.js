import React from 'react';
import InlineRating from '../../common/InlineRating';

/** Compatibility layer to wrap around the BookshelfRating component. Reshapes
 * data into a form expected by BookshelfRating.
 */
const SearchResultRating = ({ book, updateDisplay }) => {
  const bookData = {
    _id: +book.id,
    title: book.title,
    authors: [book.author],
    image_url: book.image_url
  };

  return <InlineRating updateDisplay={updateDisplay} {...bookData} />;
};

export default SearchResultRating;

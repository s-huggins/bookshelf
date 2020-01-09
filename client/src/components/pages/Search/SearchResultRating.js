import React from 'react';
import InlineRating from '../../common/InlineRating';

/** Compatibility layer to wrap around the BookshelfRating component. Reshapes
 * data into a form expected by BookshelfRating.
 */
const SearchResultRating = ({ best_book, updateDisplay }) => {
  const book = {
    _id: +best_book.id,
    title: best_book.title,
    authors: [best_book.author],
    image_url: best_book.image_url
  };

  return <InlineRating updateDisplay={updateDisplay} {...book} />;
};

export default SearchResultRating;

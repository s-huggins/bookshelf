import React from 'react';
import DropdownButton from '../../common/DropdownButton';

const SearchResultDropdownButton = ({ best_book }) => {
  // const book = {
  //   id: best_book.id,
  //   title: best_book.title,
  //   image_url: best_book.image_url,
  //   authors: { author: best_book.author }
  // };

  const book = {
    ...best_book,
    authors: { author: best_book.author }
  };

  return <DropdownButton book={book} />;
};

export default SearchResultDropdownButton;

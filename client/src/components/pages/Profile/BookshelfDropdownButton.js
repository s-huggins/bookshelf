import React from 'react';
import DropdownButton from '../../common/DropdownButton';

/* As with BookshelfRating, this component is a compatibility layer that wraps DropdownButton
components, which expect their book data prop to be in the form returned by the Goodreads API.
The purpose of this wrapper is to structure book data arriving from the db into a form that the
DropdownButton component expects.
*/
const BookshelfDropdownButton = ({ _id, title, authors, image_url }) => {
  const book = {
    id: _id,
    title,
    authors: { author: authors },
    image_url
  };

  return (
    <>
      <DropdownButton book={book} />
    </>
  );
};

export default BookshelfDropdownButton;

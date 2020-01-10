import React from 'react';
import DropdownButton from '../../common/DropdownButton';

const AuthorBookDropdownButton = ({ id, title, author, image_url }) => {
  const book = {
    id: +id,
    title,
    authors: { author: [author] },
    image_url
  };

  return <DropdownButton book={book} />;
};

export default AuthorBookDropdownButton;

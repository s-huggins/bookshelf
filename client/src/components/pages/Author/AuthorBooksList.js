import React from 'react';
import AuthorBook from './AuthorBook';

const AuthorBooksList = ({ books }) => {
  return (
    <>
      {books.map(book => (
        <AuthorBook key={book.id} book={book} />
      ))}
    </>
  );
};

export default AuthorBooksList;

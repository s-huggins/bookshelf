import React from 'react';
import withUpdatingRating from '../Profile/withUpdatingRating';
import AuthorBook from './AuthorBook';

const AuthorBooksList = ({ books }) => {
  // console.log(books);
  return (
    <>
      {books.map(book => {
        const AuthorBookWithUpdatingRating = withUpdatingRating(AuthorBook);
        return <AuthorBookWithUpdatingRating key={book.id} props={{ book }} />;
      })}
    </>
  );
};

export default AuthorBooksList;

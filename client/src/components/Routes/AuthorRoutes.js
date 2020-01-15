import React from 'react';
import PrivateRoute from './PrivateRoute';
import Author from '../pages/Author/Author';
import AuthorBooks from '../pages/Author/AuthorBooks';

export default segment => {
  const propsArray = [
    { path: `${segment}/:id`, component: Author },
    { path: `${segment}/:id/books`, component: AuthorBooks },
    { path: `${segment}/:id/books/page/:pageNum?`, component: AuthorBooks }
  ];

  return propsArray.map(props => (
    <PrivateRoute exact {...props} key={props.path} />
  ));
};

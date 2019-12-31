import React from 'react';
import { Link } from 'react-router-dom';

const AuthorDetail = ({ author }) => {
  return (
    <div className="AuthorDetail">
      <Link to={`/author/${author.id}`}>
        <img src={author.image_url} alt={author.name} />
      </Link>
      <h3 className="author-name">
        <Link to={`/author/${author.id}`}>{author.name}</Link>
      </h3>
    </div>
  );
};

export default AuthorDetail;

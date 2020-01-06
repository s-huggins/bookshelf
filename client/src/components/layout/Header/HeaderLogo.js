import React from 'react';
import { Link } from 'react-router-dom';

function HeaderLogo() {
  return (
    <span className="Header__brand">
      <Link to="/">
        <div className="logo">
          <i className="fas fa-book-open logo-icon"></i>
          <span className="logo-text">
            <span className="logo-text__left">book</span>
            <span className="logo-text__right">shelf</span>
          </span>
        </div>
      </Link>
    </span>
  );
}

export default HeaderLogo;

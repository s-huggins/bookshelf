import React from 'react';

function HeaderLogo() {
  return (
    <span className="Header__brand">
      <a href="/">
        <div className="logo">
          <i className="fas fa-book-open logo-icon"></i>
          <span className="logo-text">
            <span className="logo-text__left">book</span>
            <span className="logo-text__right">shelf</span>
          </span>
        </div>
      </a>
    </span>
  );
}

export default HeaderLogo;

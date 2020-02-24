import React from 'react';

const GlobalErrorBoundaryLogo = ({ handleNavigateAway }) => {
  return (
    <span
      className="Header__brand"
      onClick={handleNavigateAway}
      style={{ cursor: 'pointer' }}
    >
      <div className="logo">
        <i className="fas fa-book-open logo-icon"></i>
        <span className="logo-text">
          <span className="logo-text__left">book</span>
          <span className="logo-text__right">shelf</span>
        </span>
      </div>
    </span>
  );
};

export default GlobalErrorBoundaryLogo;

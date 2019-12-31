import React from 'react';

const Alert = ({ type = 'info', message, handleDismiss }) => {
  const classes = ['alert', `alert--${type}`].join(' ');

  // const dismissAlert = () => { handleDismiss() }

  return (
    <div className={classes}>
      <span className="alert__message">{message}</span>
      <span className="alert__dismiss" onClick={handleDismiss}>
        <i className="fas fa-times"></i>
      </span>
    </div>
  );
};

export default Alert;

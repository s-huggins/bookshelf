import React from 'react';

const DropdownButton = () => {
  return (
    <div className="DropdownButton">
      <button className="btn btn--green">Want to Read</button>
      <button className="btn btn--green btn--dropdown">
        <i className="fas fa-caret-down"></i>
      </button>
      <div className="dropdown-pane">
        <ul>
          <a className="dropdown-link" href="#!">
            <li>Want to Read</li>
          </a>

          <a href="#!">
            <li>Currently reading</li>
          </a>
          <a href="#!">
            <li>Read</li>
          </a>
        </ul>
      </div>
    </div>
  );
};

export default DropdownButton;

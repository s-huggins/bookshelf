import React from 'react';
import { Link } from 'react-router-dom';

const Compose = () => {
  return (
    <div className="Compose">
      <h1>
        <Link to="/message" className="green-link">
          Messages
        </Link>{' '}
        > Compose New Message
      </h1>
      <div className="Compose__form">
        <form>
          <div className="Compose__form-input">
            <span className="Compose__label">from:</span>{' '}
            <Link to="/user" className="green-link">
              Stuart
            </Link>
          </div>
          <div className="Compose__form-input">
            <label htmlFor="message-to" className="Compose__label">
              to:
            </label>{' '}
            <input
              type="text"
              id="message-to"
              name="to"
              className="form-control input-to"
            />
          </div>
          <div className="Compose__form-input">
            <label htmlFor="message-subject" className="Compose__label">
              subject:
            </label>{' '}
            <input
              type="text"
              id="message-subject"
              name="subject"
              className="form-control input-subject"
            />
          </div>
          <div className="Compose__form-input">
            <label
              htmlFor="message-body"
              className="Compose__label Compose__label--block"
            >
              message:
            </label>
            <textarea
              className="form-control input-body"
              name="body"
              id="message-body"
            />
          </div>
          <button className="btn btn--light">Send</button>
        </form>
      </div>
    </div>
  );
};

export default Compose;

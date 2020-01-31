import React from 'react';
import { Link } from 'react-router-dom';
import Avatar from '../Profile/Avatar';

const SpoolMessage = () => {
  return (
    <div className="SpoolMessage">
      <Avatar />
      <div className="message-body">
        <p className="message-lead">
          <Link to="#!" className="green-link">
            you
          </Link>{' '}
          said to{' '}
          <Link to="#!" className="green-link">
            Jordy
          </Link>
          :
        </p>
        <p className="message-text">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias iure
          quibusdam tempora eligendi aspernatur atque ipsa voluptatem
          praesentium libero quisquam?
        </p>
      </div>
      <div className="message-side">
        <div className="message-date">
          <span className="message-date-cal">Dec 05, 2019</span>
          <span className="message-date-time"> 05:51PM</span>
        </div>
        <div className="message-actions">
          {/* VIEW / SAVE / DELETE */}
          <button className="button-reset green-link message-action">
            view
          </button>
          <span className="divider">|</span>
          <button className="button-reset green-link message-action">
            delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default SpoolMessage;

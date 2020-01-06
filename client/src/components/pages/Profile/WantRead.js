import React from 'react';
import cover from '../../../img/gulag.jpg';
import DropdownButton from '../../common/DropdownButton';
import Rating from '../../common/Rating';
import avatar from '../../../img/avatar.png';
import { Link } from 'react-router-dom';

const WantRead = () => {
  return (
    <div className="book-panel book-panel--want-read">
      <div className="book-panel__header">
        <span>
          <Link to="#!" className="green-link bold-link">
            Stuart
          </Link>{' '}
          wants to read
        </span>
      </div>
      <div className="book-panel__content book-panel__content--want-read">
        <div className="book-panel__cover">
          <Link to="#!">
            <img src={cover} alt="bookcover" />
          </Link>
        </div>
        <div className="book-panel__details">
          <h3 className="book-panel__title">
            Frederick the Great: King of Prussia
          </h3>
          <span>
            by{' '}
            <span className="book-panel__author-name">
              Timothy C.W. Blanning
            </span>
          </span>
        </div>
        <div className="book-panel__actions">
          <DropdownButton />
          <span className="rate-text text-tiny">Rate this book</span>
          <div>
            <Rating />
          </div>
        </div>
      </div>
      <div className="book-panel__footer">
        <span className="book-panel__date">Jan 01, 2020 02:37PM</span>
        <span className="middle-dot">&#183;</span>
        <span>
          <Link to="#!">like</Link>
        </span>
        <span className="middle-dot">&#183;</span>
        <span>
          <Link to="#!">2 comments</Link>
        </span>

        <div className="Comments Comments--book-panel">
          <div className="Comment Comment--book-panel">
            <div className="Comment__avatar Comment--book-panel__avatar">
              <img src={avatar} alt="avatar" />
            </div>
            <div className="Comment__body">
              <p>
                <span className="Comment__handle">
                  <a href="#!" className="green-link">
                    Jordy
                  </a>
                </span>{' '}
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aut ex
                impedit tempora culpa eveniet voluptatem temporibus maiores
                natus animi! Explicabo?
              </p>

              <div className="Comment__footer">
                <span className="Comment__date">Dec 17, 2019 02:37PM</span>
                <span className="middle-dot">&#183;</span>
                <span>
                  <a href="#!" className="green-link">
                    delete
                  </a>
                </span>
              </div>
            </div>
          </div>
          <div className="Comments__input Comments--book-panel__input">
            <div className="Comments__input-avatar Comments--book-panel__input-avatar">
              <img src={avatar} alt="avatar" />
            </div>
            <div className="form-container">
              <form>
                <textarea
                  name="comment"
                  rows="1"
                  className="form-control"
                  placeholder="Write a comment..."
                ></textarea>
                <button className="btn btn--light">Comment</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WantRead;

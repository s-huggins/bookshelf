import React from 'react';
import gulag from '../../../img/gulag.jpg';
import avatar from '../../../img/avatar.png';

const FeedUpdate = () => {
  return (
    <div className="FeedUpdate">
      <div className="Feed__panel">
        <div className="Feed__panel-header">
          <span className="user-name">Stuart</span> wants to read
        </div>
        <div className="Feed__panel-body">
          <div className="Feed__panel-img">
            <img src={gulag} alt="bookcover" />
          </div>
          <div className="Feed__panel-content">
            <h3 className="Feed__panel-content-header--title">
              The Gulag Archipelago, 1918-1956: An Experiment in Literary
              Investigation
            </h3>
            by <span>Aleksandr Solzhenitsyn</span>
            <div>
              <div className="btn-group">
                <button className="btn btn--green">Want to Read</button>
                <button className="btn btn--green btn--dropdown">
                  <i className="fas fa-caret-down"></i>
                </button>
                <div className="btn-dropdown-pane">
                  <ul>
                    <a href="#!">
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
            </div>
            <p>
              Drawing on his own incarceration and exile, as well as on evidence
              from more than 200 fellow prisoners and Soviet archives, Aleksandr
              I. Solzhenitsyn reveals the entire apparatus of Soviet repression
              -- the state within the state that ruled all-powerfully.
            </p>
          </div>
        </div>
        <div className="Feed__panel-footer">
          <a href="#!" className="green-link">
            Like
          </a>
          <span className="middle-dot">&#183;</span>
          <a href="#!" className="green-link">
            Comment
          </a>
        </div>
      </div>
      <div className="Feed__likes">
        <p>
          <span>Stuart</span> liked this
        </p>
      </div>
      <div className="Comments">
        <div className="Comment">
          <div className="Comment__avatar">
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
              impedit tempora culpa eveniet voluptatem temporibus maiores natus
              animi! Explicabo?
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
        <div className="Comments__input">
          <div className="Comments__input-avatar">
            <img src={avatar} alt="avatar" />
          </div>
          <textarea
            name="comment"
            rows="1"
            className="form-control"
            placeholder="Write a comment..."
          ></textarea>
        </div>
      </div>
    </div>
  );
};

export default FeedUpdate;

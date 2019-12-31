import React from 'react';

const ProfileDetailsFooter = ({ social, handle }) => {
  return (
    <div className="profile__footer">
      <ul className="social-links">
        {social.facebook && (
          <li>
            <a href="#!">
              <i className="fab fa-facebook-square"></i>
            </a>
          </li>
        )}
        {social.youtube && (
          <li>
            <a href="#!">
              <i className="fab fa-youtube"></i>
            </a>
          </li>
        )}
        {social.twitter && (
          <li>
            <a href="#!">
              <i className="fab fa-twitter"> </i>
            </a>
          </li>
        )}
        {social.instagram && (
          <li>
            <a href="#!">
              <i className="fab fa-instagram"> </i>
            </a>
          </li>
        )}
        {social.tumblr && (
          <li>
            <a href="#!">
              <i className="fab fa-tumblr-square"> </i>
            </a>
          </li>
        )}
      </ul>
      {handle && <span className="handle">{`bookshelf/user/${handle}`}</span>}
    </div>
  );
};

export default ProfileDetailsFooter;

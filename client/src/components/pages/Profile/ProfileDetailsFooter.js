import React from 'react';
import { Link } from 'react-router-dom';

const ProfileDetailsFooter = ({ social, handle }) => {
  return (
    <div className="profile__footer">
      <ul className="social-links">
        {social.facebook && (
          <li>
            <a href={social.facebook} target="_blank" rel="noopener noreferrer">
              <i className="fab fa-facebook-square"></i>
            </a>
          </li>
        )}
        {social.youtube && (
          <li>
            <a href={social.youtube} target="_blank" rel="noopener noreferrer">
              <i className="fab fa-youtube"></i>
            </a>
          </li>
        )}
        {social.twitter && (
          <li>
            <a
              href={`https://www.twitter.com/${social.twitter}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fab fa-twitter"></i>
            </a>
          </li>
        )}
        {social.instagram && (
          <li>
            <a
              href={`https://www.instagram.com/${social.instagram}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fab fa-instagram"> </i>
            </a>
          </li>
        )}
        {social.linkedin && (
          <li>
            <a
              href={social.instagram}
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fab fa-linkedin-in"></i>
            </a>
          </li>
        )}
      </ul>
      {handle && <span className="handle">{`bookshelf/${handle}`}</span>}
    </div>
  );
};

export default ProfileDetailsFooter;

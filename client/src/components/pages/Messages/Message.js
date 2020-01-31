import React, { useEffect } from 'react';
import Avatar from '../Profile/Avatar';
import { Link, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { openNewMessage } from '../../../redux/profile/profileActions';
import MessageRecipients from './MessageRecipients';

const Message = ({ message, trash, read, saved, ownProfile }) => {
  // const ownProfile = useSelector(state => state.profile.loadedProfile);
  const history = useHistory();
  const dispatch = useDispatch();

  const handleReply = () => {
    history.push('/message/new', {
      to: {
        displayName: message.from.profile.displayName,
        profileId: message.from.profileId
      },
      subject: `re: ${message.subject}`
    });
  };

  useEffect(() => {
    // opening an unread message marks it as read
    if (!read) {
      dispatch(openNewMessage([message._id], true));
    }
  }, []);

  return (
    <div className="Message">
      <h2>
        Message from{' '}
        {message.from?.profile?.displayName || message.from.displayName}
      </h2>
      <div className="Message__action-bar">
        <Link to="#!" className="green-link">
          next
        </Link>{' '}
        <span className="middle-dot">·</span>{' '}
        <Link to="#!" className="green-link">
          previous
        </Link>
      </div>
      <table>
        <tbody>
          <tr>
            <th scope="row">from:</th>
            {message.from.profile ? (
              <td className="Message__profile">
                <Link to={`/user/${message.from.profileId}`}>
                  <Avatar />
                </Link>
                <Link
                  to={`/user/${message.from.profileId}`}
                  className="green-link"
                >
                  {message.from.profile.displayName}
                </Link>
              </td>
            ) : (
              <td className="Message__profile">
                <Avatar />
                {message.from.displayName}
              </td>
            )}
          </tr>
          <tr>
            <th scope="row">to: </th>
            <td className="Message__recipients">
              <MessageRecipients
                recipients={message.to}
                ownProfile={ownProfile}
              />
            </td>
          </tr>
          <tr>
            <th scope="row">subject:</th>
            <td>
              <p>{message.subject}</p>
            </td>
          </tr>
          <tr>
            <th scope="row">message:</th>
            <td>
              <p>{message.body}</p>
            </td>
          </tr>
        </tbody>
      </table>
      <button className="btn btn--light" onClick={handleReply}>
        Reply
      </button>
    </div>
  );
};

export default Message;

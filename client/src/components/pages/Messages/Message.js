import React, { useEffect } from 'react';
import Avatar from '../Profile/Avatar';
import { Link, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import MessageRecipients from './MessageRecipients';
import { markRead } from '../../../redux/mail/mailActions';

const Message = ({ message }) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const handleReply = () => {
    history.push('/message/new', {
      to: {
        displayName:
          message.from.displayName || message.from.archived.displayName,
        profileId: message.from.profileId
      },
      subject: `re: ${message.subject}`
    });
  };

  const handleNext = () => {
    let messageCode = message.nextMessage._id;

    if (message.folder === 'inbox') messageCode += '0';
    else messageCode += '1';

    messageCode += message.nextMessage.seq;

    history.push(`/message/show/${messageCode}`);
  };

  const renderNext = () => {
    if (!message.nextMessage) return <span>next</span>;

    let messageCode = message.nextMessage._id;

    if (message.folder === 'inbox') messageCode += '0';
    else messageCode += '1';

    messageCode += message.nextMessage.seq;

    return (
      <button
        className="button-reset green-link"
        onClick={() => history.push(`/message/show/${messageCode}`)}
      >
        next
      </button>
    );
  };
  const renderPrevious = () => {
    if (!message.previousMessage) return <span>previous</span>;

    let messageCode = message.previousMessage._id;

    if (message.folder === 'inbox') messageCode += '0';
    else messageCode += '1';

    messageCode += message.previousMessage.seq;

    return (
      <button
        className="button-reset green-link"
        onClick={() => history.push(`/message/show/${messageCode}`)}
      >
        previous
      </button>
    );
  };

  const handlePrevious = () => {
    let messageCode = message.previousMessage._id;

    if (message.folder === 'inbox') messageCode += '0';
    else messageCode += '1';

    messageCode += message.previousMessage.seq;

    history.push(`/message/show/${messageCode}`);
  };

  useEffect(() => {
    // opening an unread message marks it as read
    if (!message.read) {
      dispatch(markRead([message]));
    }
  }, [message]);
  console.log(message);
  return (
    <div className="Message">
      <h2>
        Message from{' '}
        {message.from.displayName || message.from.archived.displayName}
      </h2>
      <div className="Message__action-bar">
        {/* <button className="button-reset green-link" onClick={handleNext}>
          next
        </button> */}
        {renderNext()}
        <span className="middle-dot">·</span>{' '}
        {/* <button className="button-reset green-link" onClick={handlePrevious}>
          previous
        </button> */}
        {renderPrevious()}
      </div>
      <table>
        <tbody>
          <tr>
            <th scope="row">from:</th>
            {message.from.displayName ? (
              <td className="Message__profile">
                <Link to={`/user/${message.from.profileId}`}>
                  <Avatar avatar_id={message.from.avatar_id} />
                </Link>
                <Link
                  to={`/user/${message.from.profileId}`}
                  className="green-link"
                >
                  {message.from.displayName}
                </Link>
              </td>
            ) : (
              <td className="Message__profile">
                <Avatar />
                {message.from.archived.displayName}
              </td>
            )}
          </tr>
          <tr>
            <th scope="row">to: </th>
            <td className="Message__recipients">
              <MessageRecipients recipients={message.to} />
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

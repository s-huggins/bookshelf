import React, { useEffect } from 'react';
import Avatar from '../Profile/Avatar';
import { Link, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import MessageRecipients from './MessageRecipients';
import { markRead } from '../../../redux/mail/mailActions';

const Message = ({ message, dismissAlert }) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const ownProfileId = useSelector(state => state.auth.user.profile.id);

  const handleReply = () => {
    const from = {
      profileId: message.from.profileId,
      displayName: message.from.displayName || message.from.archived.displayName
    };
    const to = message.to.map(recip => ({
      profileId: recip.profileId,
      displayName: recip.displayName || recip.archived.displayName
    }));

    const recipients = [...to, from].filter(
      recip => recip.profileId !== ownProfileId
    );

    history.push('/message/new', {
      to: recipients,
      subject: `re: ${message.subject}`
    });
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
        onClick={() => {
          dismissAlert();
          history.push(`/message/show/${messageCode}`);
        }}
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
        onClick={() => {
          dismissAlert();
          history.push(`/message/show/${messageCode}`);
        }}
      >
        previous
      </button>
    );
  };
  useEffect(() => {
    // opening an unread message marks it as read
    // false and not undefined
    if (message.read === false) {
      dispatch(markRead([message]));
    }
  }, [message]);

  return (
    <div className="Message">
      <h2>
        Message from{' '}
        {message.from.displayName || message.from.archived.displayName}
      </h2>
      <div className="Message__action-bar">
        {renderNext()}
        <span className="middle-dot">·</span> {renderPrevious()}
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
              <div className="cell-content-container">
                <p className="Message__text-body">{message.body}</p>
              </div>
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

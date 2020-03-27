import React from 'react';
import Avatar from '../Profile/Avatar';
import { useHistory } from 'react-router-dom';
import moment from 'moment';

const MessagePreview = ({
  subject,
  from,
  dateSent,
  messageId,
  read,
  checked,
  checkMessage,
  uncheckMessage,
  seq,
  messageDirection,
  folder
}) => {
  const history = useHistory();
  const handleCheckMessage = () => {
    if (checked) uncheckMessage();
    else checkMessage();
  };

  const buildLink = () => {
    const sent = folder === 'sent';

    return `/message/show/${messageId}${sent ? 1 : 0}${seq}`;
  };

  return (
    <tr className="MessagePreview">
      <td className="cell-from" onClick={() => history.push(buildLink())}>
        <Avatar avatar_id={from.avatar_id} />
        <span className="green-link">
          {from.displayName || from.archived.displayName}
        </span>
      </td>
      <td className="cell-subject" onClick={() => history.push(buildLink())}>
        <span>
          <span className="green-link subject-text">{subject}</span>{' '}
          {messageDirection !== 'out' && !read && (
            <span className="new-message">(new)</span>
          )}{' '}
        </span>
      </td>
      <td className="cell-date">
        <span className="date-cal">
          {moment(new Date(dateSent)).format('MMM DD, YYYY')}
        </span>
        <span className="date-time">
          {moment(new Date(dateSent)).format('h:mmA')}
        </span>
      </td>
      <td className="cell-check">
        <input
          type="checkbox"
          checked={checked}
          onChange={handleCheckMessage}
        />
      </td>
    </tr>
  );
};

export default MessagePreview;

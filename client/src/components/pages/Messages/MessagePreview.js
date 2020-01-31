import React, { useState } from 'react';
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
  folder
}) => {
  const history = useHistory();
  const handleCheckMessage = () => {
    checkMessage(messageId, !checked);
  };

  return (
    <tr className="MessagePreview">
      <td
        className="cell-from"
        onClick={() => history.push(`/message/show/${messageId}`)}
      >
        <Avatar avatar_id={from?.profile?.avatar_id} />
        <span className="green-link">
          {from?.profile?.displayName || from.displayName}
        </span>
      </td>
      <td
        className="cell-subject"
        onClick={() => history.push(`/message/show/${messageId}`)}
      >
        <span>
          <span className="green-link">{subject}</span>{' '}
          {!read && <span className="new-message">(new)</span>}{' '}
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

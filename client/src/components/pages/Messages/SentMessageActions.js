import React, { useEffect, useRef } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  clearMailActionStatus,
  saveMail,
  unsaveMail,
  markRead,
  markUnread,
  trashMail,
  untrashMail,
  deleteSent
} from '../../../redux/mail/mailActions';
import { useState } from 'react';

const SentMessageActions = ({ message, setAlert }) => {
  const dispatch = useDispatch();
  const actionStatus = useSelector(state => state.mail.actionStatus);
  const action = useRef({ type: '', flag: null });
  const history = useHistory();
  const [deleted, setDeleted] = useState(message.deleted);

  useEffect(() => {
    setDeleted(message.deleted);
  }, [message]);

  useEffect(() => {
    if (actionStatus === 'success') {
      setAlert({ type: 'info', message: 'Message deleted.' });
      setDeleted(true);

      dispatch(clearMailActionStatus());
      action.current = { type: '', flag: null };
    }

    if (actionStatus === 'fail') {
      setAlert({
        type: 'warning',
        message: 'Something went wrong. Please try again.'
      });

      dispatch(clearMailActionStatus());
      action.current = { type: '', flag: null };
    }
  }, [actionStatus]);

  const handleDelete = () => {
    dispatch(deleteSent([message]));
    // action.current = { type: 'delete' };
  };

  return (
    <div className="MessageActions">
      <div>
        <Link to="/message/inbox" className="green-link inbox-link">
          my inbox
        </Link>
      </div>

      <div>
        <span className="action-list-header">message actions</span>
        <ul>
          {deleted ? (
            <li>deleted</li>
          ) : (
            <li>
              <button
                className="button-reset green-link"
                onClick={handleDelete}
              >
                delete
              </button>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default SentMessageActions;

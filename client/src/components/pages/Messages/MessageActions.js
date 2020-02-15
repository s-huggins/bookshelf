import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  clearMailActionStatus,
  saveMail,
  unsaveMail,
  markRead,
  markUnread,
  trashMail,
  untrashMail
} from '../../../redux/mail/mailActions';
import { useState } from 'react';

const MessageActions = ({ message, setAlert }) => {
  const dispatch = useDispatch();
  const actionStatus = useSelector(state => state.mail.actionStatus);
  const action = useRef({ type: '', flag: null });
  const [messageState, setMessageState] = useState({
    read: true, // opening the message marks it as read
    saved: message.saved,
    trashed: message.trash.trashed
  });

  useEffect(() => {
    setMessageState({
      read: true,
      saved: message.saved,
      trashed: message.trash.trashed
    });
  }, [message]);

  useEffect(() => {
    if (actionStatus === 'success') {
      switch (action.current.type) {
        case 'save':
          if (action.current.flag) {
            setAlert({
              type: 'info',
              message: 'Message moved to the saved folder.'
            });
            setMessageState(prevSt => ({ ...prevSt, saved: true }));
          } else {
            setAlert({
              type: 'info',
              message: 'Message moved to the inbox folder.'
            });
            setMessageState(prevSt => ({ ...prevSt, saved: false }));
          }
          break;

        case 'read':
          if (action.current.flag) {
            setAlert({ type: 'info', message: 'Message marked as read.' });
            setMessageState(prevSt => ({ ...prevSt, read: true }));
          } else {
            setAlert({ type: 'info', message: 'Message marked as unread.' });
            setMessageState(prevSt => ({ ...prevSt, read: false }));
          }
          break;

        case 'trash':
          if (action.current.flag) {
            setAlert({
              type: 'info',
              message: 'Message sent to the trash.'
            });
            setMessageState(prevSt => ({ ...prevSt, trashed: true }));
          } else {
            setAlert({
              type: 'info',
              message: 'Message recovered from the trash.'
            });
            setMessageState(prevSt => ({ ...prevSt, trashed: false }));
          }
          break;
      }
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

  const handleMarkSaved = () => {
    // if saved, unsave. if unsaved, save.
    if (!messageState.saved) dispatch(saveMail([message]));
    else dispatch(unsaveMail([message]));
    action.current = { type: 'save', flag: !messageState.saved };
  };
  const handleMarkRead = () => {
    // if marked read, mark unread, and vice versa.
    if (!messageState.read) dispatch(markRead([message]));
    else dispatch(markUnread([message]));
    action.current = { type: 'read', flag: !messageState.read };
  };
  const handleTrash = () => {
    // send to or remove from trash
    if (!messageState.trashed) dispatch(trashMail([message]));
    else dispatch(untrashMail([message]));
    action.current = { type: 'trash', flag: !messageState.trashed };
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
          <li>
            <button
              className="button-reset green-link"
              onClick={handleMarkSaved}
            >
              {messageState.saved ? 'unsave' : 'save'}
            </button>
          </li>
          <li>
            <button className="button-reset green-link" onClick={handleTrash}>
              {messageState.trashed ? 'recover from trash' : 'send to trash'}
            </button>
          </li>
          <li>
            <button
              className="button-reset green-link"
              onClick={handleMarkRead}
            >
              {messageState.read ? 'mark as unread' : 'mark as read'}
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default MessageActions;

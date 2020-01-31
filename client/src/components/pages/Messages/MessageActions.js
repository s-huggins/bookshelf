import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  markSaved,
  clearEditStatus,
  markRead,
  trashMessages
} from '../../../redux/profile/profileActions';

const MessageActions = ({ messageId, saved, read, trash, setAlert }) => {
  const dispatch = useDispatch();
  const editStatus = useSelector(state => state.profile.editStatus);
  const action = useRef({ type: '', flag: null });

  useEffect(() => {
    if (editStatus === 'success') {
      switch (action.current.type) {
        case 'save':
          if (action.current.flag) {
            setAlert({
              type: 'info',
              message: 'Message moved to the saved folder.'
            });
          } else {
            setAlert({
              type: 'info',
              message: 'Message moved to the inbox folder.'
            });
          }
          break;

        case 'read':
          if (action.current.flag) {
            setAlert({ type: 'info', message: 'Message marked as read.' });
          } else {
            setAlert({ type: 'info', message: 'Message marked as unread.' });
          }
          break;

        case 'trash':
          if (action.current.flag) {
            setAlert({
              type: 'info',
              message: 'Message sent to the trash.'
            });
          } else {
            setAlert({
              type: 'info',
              message: 'Message recovered from the trash.'
            });
          }
          break;
      }
      action.current = null;
      dispatch(clearEditStatus());
    }

    if (editStatus === 'fail') {
      setAlert({
        type: 'warning',
        message: 'Something went wrong. Please try again.'
      });

      dispatch(clearEditStatus());
      action.current = null;
    }
  }, [editStatus]);

  const handleMarkSaved = () => {
    // if saved, unsave. if unsaved, save.
    dispatch(markSaved([messageId], !saved));
    action.current = { type: 'save', flag: !saved };
  };
  const handleMarkRead = () => {
    // if marked read, mark unread, and vice versa.
    dispatch(markRead([messageId], !read));
    action.current = { type: 'read', flag: !read };
  };
  const handleTrash = () => {
    // send to or remove from trash
    dispatch(trashMessages([messageId], !trash.trashed));
    action.current = { type: 'trash', flag: !trash.trashed };
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
              {saved ? 'unsave' : 'save'}
            </button>
          </li>
          <li>
            <button className="button-reset green-link" onClick={handleTrash}>
              {trash.trashed ? 'recover from trash' : 'send to trash'}
            </button>
          </li>
          <li>
            <button
              className="button-reset green-link"
              onClick={handleMarkRead}
            >
              {read ? 'mark as unread' : 'mark as read'}
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default MessageActions;

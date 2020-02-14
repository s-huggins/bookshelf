import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useLoadMail, { MailFolder } from './hooks/useLoadMail';
import Folder from './Folder';
import useMailboxAlert, { writeAlertText } from './hooks/useMailboxAlert';
import {
  untrashMail,
  saveMail,
  markRead,
  deleteTrash
} from '../../../redux/mail/mailActions';
import Loader from '../../common/Loader';

const TrashFolder = () => {
  const dispatch = useDispatch();
  const [action, setAction] = useState('');
  const [alertCache, alert, dismissAlert] = useMailboxAlert();

  const [loadingMail, mail] = useLoadMail(MailFolder.TRASH);
  const numTrashed = useSelector(state => state.mail.mailbox.numTrashed);

  const [checkedMessages, setCheckedMessages] = useState({});
  // uncheck messages after each action
  useEffect(() => {
    setCheckedMessages({});
  }, [loadingMail]);

  const checkBatch = (check, ...messageIds) => {
    setCheckedMessages(oldState => {
      const newState = { ...oldState };
      messageIds.forEach(_id => {
        newState[_id] = check;
      });
      return newState;
    });
  };

  const checkMessages = (...messageIds) => checkBatch(true, ...messageIds);
  const uncheckMessages = (...messageIds) => checkBatch(false, ...messageIds);

  const handleAction = e => {
    const numChecked = Object.values(checkedMessages).filter(v => v).length;
    if (numChecked === 0) return;
    const messages = mail.filter(msg => checkedMessages[msg._id]);

    switch (e.target.value) {
      case 'inbox':
        dispatch(untrashMail(messages));
        alertCache.current = writeAlertText(
          writeAlertText.RECOVER_FROM_TRASH,
          numChecked
        );
        break;
      case 'save':
        dispatch(saveMail(messages));
        alertCache.current = writeAlertText(
          writeAlertText.MOVE_TO_SAVED,
          numChecked
        );
        break;
      case 'read':
        dispatch(markRead(messages));
        alertCache.current = writeAlertText(
          writeAlertText.MARK_READ,
          numChecked
        );
        break;
      case 'delete':
        dispatch(deleteTrash(messages));
        alertCache.current = writeAlertText(writeAlertText.DELETE, numChecked);
        break;
    }

    setAction('');
  };

  return loadingMail ? (
    <Loader />
  ) : (
    <>
      <Folder
        messages={mail}
        loading={loadingMail}
        title="Trash"
        totalMessages={numTrashed}
        path="/message/trash"
        checkMessages={checkMessages}
        uncheckMessages={uncheckMessages}
        checkedMessages={checkedMessages}
        alert={alert}
        dismissAlert={dismissAlert}
      >
        <select
          name="actions"
          className="actions-dropdown"
          onChange={handleAction}
          value={action}
        >
          <option value="">actions...</option>
          <option value="inbox">move to inbox</option>
          <option value="save">move to saved</option>
          <option value="read">mark as read</option>
          <option value="delete">delete</option>
        </select>
      </Folder>
      <p className="trash-note">
        Note: all messages in the trash will be deleted after 30 days
      </p>
    </>
  );
};

export default TrashFolder;

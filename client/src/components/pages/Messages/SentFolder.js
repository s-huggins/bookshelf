import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import useMailboxAlert, { writeAlertText } from './hooks/useMailboxAlert';
import useLoadMail, { MailFolder } from './hooks/useLoadMail';
import { deleteSent } from '../../../redux/mail/mailActions';
import Folder from './Folder';
import Loader from '../../common/Loader';
import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SentFolder = () => {
  const dispatch = useDispatch();
  const [action, setAction] = useState('');
  const [alertCache, alert, dismissAlert] = useMailboxAlert();
  const location = useLocation();

  const [loadingMail, mail] = useLoadMail(MailFolder.SENT);
  const numSent = useSelector(state => state.mail.mailbox.numSent);

  const [checkedMessages, setCheckedMessages] = useState({});
  // uncheck messages after each action
  useEffect(() => {
    setCheckedMessages({});
  }, [loadingMail]);

  // useLayoutEffect(() => {
  //   console.log(location.state);
  // }, []);

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
      case 'delete':
        dispatch(deleteSent(messages));
        alertCache.current = writeAlertText(writeAlertText.deleteSent);
    }
    setAction('');
  };

  return loadingMail ? (
    <Loader />
  ) : (
    <Folder
      messages={mail}
      loading={loadingMail}
      totalMessages={numSent}
      title="Sent messages"
      path="/message/outbox"
      checkMessages={checkMessages}
      uncheckMessages={uncheckMessages}
      checkedMessages={checkedMessages}
      alert={alert}
      dismissAlert={dismissAlert}
      mailDirection="out"
    >
      <select
        name="actions"
        className="actions-dropdown"
        onChange={handleAction}
        value={action}
      >
        <option value="">actions...</option>
        <option value="delete">delete</option>
      </select>
    </Folder>
  );
};

export default SentFolder;

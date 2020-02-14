import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import useLoadMail, { MailFolder } from './hooks/useLoadMail';
import useMailboxAlert, { writeAlertText } from './hooks/useMailboxAlert';
import Folder from './Folder';
import Loader from '../../common/Loader';
import {
  fetchInboxPage,
  saveMail,
  trashMail,
  markRead
} from '../../../redux/mail/mailActions';

const InboxFolder = () => {
  const dispatch = useDispatch();
  const params = useParams();
  // const getPage = () => {
  //   let pageNum = parseInt(params.pageNum, 10);
  //   if (Number.isNaN(pageNum) || pageNum <= 0) pageNum = 1;
  //   return pageNum;
  // };

  // const [loadingMail, inbox] = useLoadInbox(getPage());
  const [loadingMail, mail] = useLoadMail(MailFolder.INBOX);
  const numInbox = useSelector(state => state.mail.mailbox.numInbox);
  const [action, setAction] = useState('');
  const [alertCache, alert, dismissAlert] = useMailboxAlert();

  const [checkedMessages, setCheckedMessages] = useState({});

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

  // const refreshFolder = () => {
  //   dispatch(fetchInboxPage(getPage()));
  // };
  const handleAction = e => {
    const numChecked = Object.values(checkedMessages).filter(v => v).length;
    if (numChecked === 0) return;
    const messages = mail.filter(msg => checkedMessages[msg._id]);

    switch (e.target.value) {
      case 'save':
        dispatch(saveMail(messages));
        alertCache.current = writeAlertText(
          writeAlertText.MOVE_TO_SAVED,
          numChecked
        );
        break;
      case 'trash':
        dispatch(trashMail(messages));
        alertCache.current = writeAlertText(
          writeAlertText.SEND_TO_TRASH,
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
    }
    setAction('');
  };

  return loadingMail ? (
    <Loader />
  ) : (
    <Folder
      messages={mail}
      loading={loadingMail}
      title="My inbox"
      totalMessages={numInbox}
      // refresh
      // refreshFolder={refreshFolder}
      // refreshLabel="Refresh inbox"
      path="/message/inbox"
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
        <option value="save">move to saved</option>
        <option value="trash">move to trash</option>
        <option value="read">mark as read</option>
      </select>
    </Folder>
  );
};

export default InboxFolder;

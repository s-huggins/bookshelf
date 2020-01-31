import React, { useState } from 'react';
import Folder from './Folder';
import { Switch, Redirect, Route } from 'react-router-dom';
import useMailboxAlert, { writeAlertText } from './hooks/useMailboxAlert';

const SavedFolder = ({
  folder,
  checkMessage,
  checkedMessages,
  moveToInbox,
  markRead,
  sendToTrash
}) => {
  const [action, setAction] = useState('');
  const [alertCache, alert, dismissAlert] = useMailboxAlert();

  const handleAction = e => {
    const numChecked = Object.keys(checkedMessages).length;

    switch (e.target.value) {
      case 'inbox':
        moveToInbox();
        alertCache.current = writeAlertText(
          writeAlertText.MOVE_TO_INBOX,
          numChecked
        );
        break;
      case 'trash':
        sendToTrash();
        alertCache.current = writeAlertText(
          writeAlertText.SEND_TO_TRASH,
          numChecked
        );
        break;
      case 'read':
        markRead();
        alertCache.current = writeAlertText(
          writeAlertText.MARK_READ,
          numChecked
        );
        break;
    }
    setAction('');
  };

  return (
    <Switch>
      <Route exact path="/message/saved/page/:pageNum">
        <Folder
          messages={folder.sort(
            (m1, m2) =>
              new Date(m2.message.dateSent) - new Date(m1.message.dateSent)
          )}
          title="Saved messages"
          type="saved"
          path="/message/saved"
          checkMessage={checkMessage}
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
            <option value="trash">move to trash</option>
            <option value="read">mark as read</option>
          </select>
        </Folder>
      </Route>
      <Redirect to="/message/saved/page/1" />
    </Switch>
  );
};

export default SavedFolder;

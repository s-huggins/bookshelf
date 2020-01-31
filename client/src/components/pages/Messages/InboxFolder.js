import React, { useState } from 'react';
import Folder from './Folder';
import { Switch, Redirect, Route } from 'react-router-dom';
import useMailboxAlert, { writeAlertText } from './hooks/useMailboxAlert';

const InboxFolder = ({
  folder,
  checkMessage,
  checkedMessages,
  markSaved,
  markRead,
  sendToTrash
}) => {
  const [action, setAction] = useState('');
  const [alertCache, alert, dismissAlert] = useMailboxAlert();

  const handleAction = e => {
    const numChecked = Object.keys(checkedMessages).length;

    switch (e.target.value) {
      case 'save':
        markSaved();
        alertCache.current = writeAlertText(
          writeAlertText.MOVE_TO_SAVED,
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
      <Route exact path="/message/inbox/page/:pageNum">
        <Folder
          messages={folder.sort(
            (m1, m2) =>
              new Date(m2.message.dateSent) - new Date(m1.message.dateSent)
          )}
          title="My inbox"
          type="inbox"
          refresh
          refreshLabel="Refresh inbox"
          path="/message/inbox"
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
            <option value="save">move to saved</option>
            <option value="trash">move to trash</option>
            <option value="read">mark as read</option>
          </select>
        </Folder>
      </Route>
      <Redirect to="/message/inbox/page/1" />
    </Switch>
  );
};

export default InboxFolder;

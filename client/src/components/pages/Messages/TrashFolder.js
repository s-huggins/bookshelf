import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Folder from './Folder';
import { useState } from 'react';
import useMailboxAlert, { writeAlertText } from './hooks/useMailboxAlert';

const TrashFolder = ({
  folder,
  checkMessage,
  checkedMessages,
  recoverFromTrash,
  markSaved,
  markRead,
  deleteTrash
}) => {
  const [action, setAction] = useState('');
  const [alertCache, alert, dismissAlert] = useMailboxAlert();

  const handleAction = e => {
    const numChecked = Object.keys(checkedMessages).length;

    switch (e.target.value) {
      case 'inbox':
        recoverFromTrash();
        alertCache.current = writeAlertText(
          writeAlertText.RECOVER_FROM_TRASH,
          numChecked
        );
        break;
      case 'save':
        markSaved();
        alertCache.current = writeAlertText(
          writeAlertText.MOVE_TO_SAVED,
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
      case 'delete':
        deleteTrash();
        alertCache.current = writeAlertText(writeAlertText.DELETE, numChecked);
        break;
    }

    setAction('');
  };

  return (
    <Switch>
      <Route exact path="/message/trash/page/:pageNum">
        <Folder
          messages={folder.sort(
            (m1, m2) =>
              new Date(m2.message.dateSent) - new Date(m1.message.dateSent)
          )}
          title="Trash"
          type="trash"
          path="/message/trash"
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
            <option value="save">move to saved</option>
            <option value="read">mark as read</option>
            <option value="delete">delete</option>
          </select>
        </Folder>
        <p className="trash-note">
          Note: all messages in the trash will be deleted after 30 days
        </p>
      </Route>
      <Redirect to="/message/trash/page/1" />
    </Switch>
  );
};

export default TrashFolder;

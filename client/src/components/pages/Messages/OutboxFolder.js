import React, { useState } from 'react';
import Folder from './Folder';
import { Switch, Redirect, Route } from 'react-router-dom';
import useMailboxAlert, { writeAlertText } from './hooks/useMailboxAlert';

const OutboxFolder = ({
  folder,
  checkMessage,
  checkedMessages,
  deleteSent
}) => {
  const [action, setAction] = useState('');
  const [alertCache, alert, dismissAlert] = useMailboxAlert();

  const handleAction = e => {
    const numChecked = Object.keys(checkedMessages).length;

    switch (e.target.value) {
      case 'delete':
        deleteSent();
        alertCache.current = writeAlertText(writeAlertText.deleteSent);
    }
    setAction('');
  };

  return (
    <Switch>
      <Route exact path="/message/outbox/page/:pageNum">
        <Folder
          messages={folder.sort(
            (m1, m2) =>
              new Date(m2.message.dateSent) - new Date(m1.message.dateSent)
          )}
          title="Sent messages"
          type="sent"
          path="/message/outbox"
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
            <option value="delete">delete</option>
          </select>
        </Folder>
      </Route>
      <Redirect to="/message/outbox/page/1" />
    </Switch>
  );
};

export default OutboxFolder;

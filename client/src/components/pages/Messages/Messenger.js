import React, { useState } from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import Compose from './Compose';
import MessageSpool from './MessageSpool';
import Loader from '../../common/Loader';
import useLoadProfile from '../Profile/Hooks/useLoadProfile';
import InboxFolder from './InboxFolder';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  markSaved,
  markRead,
  trashMessages,
  deleteMessages
} from '../../../redux/profile/profileActions';
import TrashFolder from './TrashFolder';
import OutboxFolder from './OutboxFolder';
import SavedFolder from './SavedFolder';

const Messenger = () => {
  const dispatch = useDispatch();
  const [loading, profile] = useLoadProfile(useLoadProfile.WITH_MAIL);
  const [checkedMessages, setCheckedMessages] = useState({
    inbox: {},
    saved: {},
    sent: {},
    trash: {}
  });

  // effect to clear checks after each user action
  useEffect(() => {
    setCheckedMessages({
      inbox: {},
      saved: {},
      sent: {},
      trash: {}
    });
  }, [profile]);

  const checkMessage = (folder, messageId, checked) =>
    setCheckedMessages(prevSt => ({
      ...prevSt,
      [folder]: { ...prevSt[folder], [messageId]: checked }
    }));

  const getCheckedIds = folder => {
    return Object.entries(checkedMessages[folder])
      .filter(([id, checked]) => checked)
      .map(([id, checked]) => id);
  };

  const markMessages = (currentFolder, mark, markFlag) => {
    const toMark = getCheckedIds(currentFolder);
    if (!toMark.length) return;

    switch (mark) {
      case 'saved':
        dispatch(markSaved(toMark, markFlag));
        break;
      case 'read':
        dispatch(markRead(toMark, markFlag));
        break;
    }
  };

  const sendToTrash = currentFolder => {
    const targets = getCheckedIds(currentFolder);
    if (!targets.length) return;
    dispatch(trashMessages(targets, true));
  };
  const recoverFromTrash = () => {
    const targets = getCheckedIds('trash');
    if (!targets.length) return;
    dispatch(trashMessages(targets, false));
  };

  const removeMessages = currentFolder => {
    const targets = getCheckedIds(currentFolder);
    if (!targets.length) return;
    dispatch(deleteMessages(targets));
  };

  if (loading) return <Loader />;
  if (!profile) return <Redirect to="/something-went-wrong" />;

  return (
    <div className="Mailbox page-container">
      <div className="content-container">
        <Switch>
          <Route exact path="/message">
            <Redirect to="/message/inbox" />
          </Route>

          <Route exact path="/message/new">
            <Compose />
          </Route>

          <Route path="/message/inbox">
            <InboxFolder
              folder={profile.inbox.filter(
                msg => !msg.trash.trashed && !msg.saved
              )}
              checkMessage={(messageId, checked) =>
                checkMessage('inbox', messageId, checked)
              }
              checkedMessages={checkedMessages.inbox}
              markSaved={() => markMessages('inbox', 'saved', true)}
              markRead={() => markMessages('inbox', 'read', true)}
              sendToTrash={() => sendToTrash('inbox')}
            />
          </Route>

          <Route path="/message/outbox">
            <OutboxFolder
              folder={profile.outbox}
              checkMessage={(messageId, checked) =>
                checkMessage('sent', messageId, checked)
              }
              checkedMessages={checkedMessages.sent}
              deleteSent={() => removeMessages('sent')}
            />
          </Route>

          <Route path="/message/saved">
            <SavedFolder
              folder={profile.inbox.filter(msg => msg.saved)}
              checkMessage={(messageId, checked) =>
                checkMessage('saved', messageId, checked)
              }
              checkedMessages={checkedMessages.saved}
              moveToInbox={() => markMessages('saved', 'saved', false)}
              markRead={() => markMessages('saved', 'read', true)}
              sendToTrash={() => sendToTrash('saved')}
            />
          </Route>

          <Route path="/message/trash">
            <TrashFolder
              folder={profile.inbox.filter(msg => msg.trash.trashed)}
              checkMessage={(messageId, checked) =>
                checkMessage('trash', messageId, checked)
              }
              checkedMessages={checkedMessages.trash}
              recoverFromTrash={recoverFromTrash}
              markSaved={() => markMessages('trash', 'saved', true)}
              markRead={() => markMessages('trash', 'read', true)}
              deleteTrash={() => removeMessages('trash')}
            />
          </Route>

          <Route exact path="/message/show/:messageId">
            <MessageSpool inbox={profile.inbox} outbox={profile.outbox} />
          </Route>
          <Route>
            <Redirect to="/message/inbox" />
          </Route>
        </Switch>
      </div>
    </div>
  );
};

export default Messenger;

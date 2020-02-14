import React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import Compose from './Compose';
import InboxFolder from './InboxFolder';
import SavedFolder from './SavedFolder';
import SentFolder from './SentFolder';
import TrashFolder from './TrashFolder';
import MessageSpool from './MessageSpool';

const Messenger = () => {
  return (
    <div className="Mailbox page-container">
      <div className="content-container">
        <Switch>
          <Route exact path="/message/new">
            <Compose />
          </Route>

          <Route
            exact
            path={['/message/inbox', '/message/inbox/page/:pageNum']}
          >
            <InboxFolder />
          </Route>

          <Route
            exact
            path={['/message/saved', '/message/saved/page/:pageNum']}
          >
            <SavedFolder />
          </Route>

          <Route path="/message/sent">
            <SentFolder />
          </Route>

          <Route path="/message/trash">
            <TrashFolder />
          </Route>

          <Route exact path="/message/show/:messageCode">
            <MessageSpool />
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

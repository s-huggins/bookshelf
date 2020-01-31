import React, { useState, useEffect } from 'react';
import Message from './Message';
import MessageActions from './MessageActions';
import Spool from './Spool';
import { useParams, Redirect } from 'react-router-dom';
import Alert from '../../common/Alert';
import { useSelector } from 'react-redux';

const MessageSpool = ({ inbox, outbox }) => {
  // const params = useParams();
  // const messageId = params.messageId;
  const { messageId } = useParams();
  const [alert, setAlert] = useState(null);
  const ownProfile = useSelector(state => state.profile.loadedProfile);
  // create a Set containing all other profiles privy to message
  // use this set to fetch all related messages

  /**
   * run back through inbox/outbox looking for messages with to arrays of the same size?
   */

  // console.log('inbox', inbox);
  // console.log('outbox', outbox);

  const message = inbox.find(msg => msg.message._id === messageId);
  // useEffect(() => {
  //   const participants = new Set([message.from.profileId, ...message.to.map(recip => recip.profileId)]);

  // }, [messageId]);

  if (!message) return <Redirect to="/message/inbox" />;

  return (
    <div className="MessageSpool page-container">
      <main>
        <div className="MessageSpool__spool-container alert-container">
          {alert && (
            <Alert
              type={alert.type}
              message={alert.message}
              handleDismiss={() => setAlert(null)}
            />
          )}
        </div>
        <div className="MessageSpool__top">
          <div className="MessageSpool__spool-container">
            <Message
              message={message.message}
              trash={message.trash}
              read={message.read}
              saved={message.saved}
              ownProfile={ownProfile}
            />
          </div>
          <MessageActions
            messageId={messageId}
            saved={message.saved}
            read={message.read}
            trash={message.trash}
            setAlert={setAlert}
          />
        </div>
        <div className="MessageSpool__spool MessageSpool__spool-container">
          <Spool />
        </div>
      </main>
    </div>
  );
};

export default MessageSpool;

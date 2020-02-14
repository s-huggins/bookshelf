import { useState, useEffect, useLayoutEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import store from '../../../../redux/store';

const useLoadMessage = () => {
  const [loadingMessage, setLoadingMessage] = useState(true);
  const [message, setMessage] = useState(null);

  /**
   * :messageCode param structure is as follows:
   * first 24 characters are the MongoDB ObjectID string
   * then an integer 0 or 1, where 0 indicates a received message, 1 a sent message
   * the remaining integer chars are the seq value used to locate the inbox/outbox bucket containing the message
   *
   */
  const { messageCode } = useParams();
  const history = useHistory();
  const inbox = useSelector(state => state.mail.inbox);
  const sent = useSelector(state => state.mail.sent);

  const loadMessage = async (folder, seq, id) => {
    const token = store.getState().auth.token;
    const endpoint = `http://localhost:5000/api/v1/message/folder/${folder}/${seq}/${id}`;
    const res = await fetch(endpoint, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`
      }
    });
    const json = await res.json();

    if (json.status !== 'success') {
      // redirect to inbox if message does not exist
      history.push('/message/inbox');
    } else {
      json.data.message.folder = folder;
      setMessage(json.data.message);
    }
  };

  // check for message in redux store. if there, we can skip the fetch
  useLayoutEffect(() => {
    const messageId = messageCode.slice(0, 24);
    const received = !!messageCode[24];
    const seq = messageCode.slice(25);

    // if (received) {
    //   let msg = inbox.find(msg => msg._id === messageId);
    //   if (msg) {
    //     // setLoadingMessage(false);
    //     setMessage(msg);
    //   } else {
    //     loadMessage('inbox', seq, messageId);
    //   }
    // } else {
    //   let msg = sent.find(msg => msg._id === messageId);
    //   if (msg) {
    //     // setLoadingMessage(false);
    //     setMessage(msg);
    //   } else {
    //     loadMessage('sent', seq, messageId);
    //   }
    // }
    if (received) {
      loadMessage('inbox', seq, messageId);
    } else {
      loadMessage('sent', seq, messageId);
    }
  }, [messageCode]);

  useEffect(() => {
    if (message) setLoadingMessage(false);
  }, [message]);

  return [loadingMessage, message];
};

export default useLoadMessage;

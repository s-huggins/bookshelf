import store from '../../redux/store';
import {
  FETCH_INBOX,
  FETCH_MAIL_FAILURE,
  MAIL_ACTION_FAILURE,
  MAIL_ACTION_SUCCESS,
  CLEAR_MAIL_ACTION_STATUS,
  FETCH_SAVED,
  FETCH_TRASH,
  FETCH_SENT,
  FETCH_SPOOL,
  CLEAR_SPOOL
} from './mailTypes';

const fetchMail = async (endpoint, dispatch, fetchType) => {
  const token = store.getState().auth.token;

  const res = await fetch(endpoint, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    }
  });

  const json = await res.json();

  if (json.status === 'success') {
    if (fetchType === FETCH_SENT) {
      json.data.messages.forEach(msg => (msg.folder = 'sent'));
    } else if (fetchType !== FETCH_SPOOL) {
      json.data.messages.forEach(msg => (msg.folder = 'inbox'));
    }

    dispatch({
      type: fetchType,
      payload: json.data.messages
    });
  } else {
    dispatch({
      type: FETCH_MAIL_FAILURE
    });
  }
};

const fetchInbox = (skip = 0, limit = 20) => async dispatch => {
  const endpoint = `http://localhost:5000/api/v1/message/folder/inbox?skip=${skip}&limit=${limit}`;
  await fetchMail(endpoint, dispatch, FETCH_INBOX);
};

const fetchSaved = (skip = 0, limit = 20) => async dispatch => {
  const endpoint = `http://localhost:5000/api/v1/message/folder/saved?skip=${skip}&limit=${limit}`;
  await fetchMail(endpoint, dispatch, FETCH_SAVED);
};
const fetchTrash = (skip = 0, limit = 20) => async dispatch => {
  const endpoint = `http://localhost:5000/api/v1/message/folder/trash?skip=${skip}&limit=${limit}`;
  await fetchMail(endpoint, dispatch, FETCH_TRASH);
};
const fetchSent = (skip = 0, limit = 20) => async dispatch => {
  const endpoint = `http://localhost:5000/api/v1/message/folder/sent?skip=${skip}&limit=${limit}`;
  await fetchMail(endpoint, dispatch, FETCH_SENT);
};
const fetchSpool = (groupId, skip = 0, limit = 20) => async dispatch => {
  const endpoint = `http://localhost:5000/api/v1/message/spool/${groupId}?skip=${skip}&limit=${limit}`;
  await fetchMail(endpoint, dispatch, FETCH_SPOOL);
};

export const fetchInboxPage = pageNum => fetchInbox((pageNum - 1) * 20, 20);
export const fetchSavedPage = pageNum => fetchSaved((pageNum - 1) * 20, 20);
export const fetchTrashPage = pageNum => fetchTrash((pageNum - 1) * 20, 20);
export const fetchSentPage = pageNum => fetchSent((pageNum - 1) * 20, 20);
export const fetchSpoolPage = (groupId, pageNum) =>
  fetchSpool(groupId, (pageNum - 1) * 20, 20);
export const clearSpool = () => ({ type: CLEAR_SPOOL });

const updateMail = async (endpoint, messages, dispatch) => {
  const token = store.getState().auth.token;
  const res = await fetch(endpoint, {
    method: 'PATCH',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ messages })
  });

  const json = await res.json();

  if (json.status === 'success') {
    dispatch({
      type: MAIL_ACTION_SUCCESS,
      payload: json.data.mailbox
    });
  } else {
    dispatch({
      type: MAIL_ACTION_FAILURE
    });
  }
};

const handleTrash = (messages, undo = false) => async dispatch => {
  let endpoint = `http://localhost:5000/api/v1/message/trash`;
  if (undo) endpoint = `${endpoint}?undo=true`;

  await updateMail(endpoint, messages, dispatch);
};

export const trashMail = messages => handleTrash(messages);
export const untrashMail = messages => handleTrash(messages, true);

const handleRead = (messages, unread = false) => async dispatch => {
  let endpoint = `http://localhost:5000/api/v1/message/mark/read`;
  if (unread) endpoint = `${endpoint}?undo=true`;

  await updateMail(endpoint, messages, dispatch);
};

export const markRead = messages => handleRead(messages);
export const markUnread = messages => handleRead(messages, true);

const handleSave = (messages, unsave = false) => async dispatch => {
  let endpoint = `http://localhost:5000/api/v1/message/mark/saved`;
  if (unsave) endpoint = `${endpoint}?undo=true`;

  await updateMail(endpoint, messages, dispatch);
};

export const saveMail = messages => handleSave(messages);
export const unsaveMail = messages => handleSave(messages, true);

export const deleteSent = messages => async dispatch => {
  const endpoint = 'http://localhost:5000/api/v1/message/delete/sent';
  await updateMail(endpoint, messages, dispatch);
};
export const deleteTrash = messages => async dispatch => {
  const endpoint = 'http://localhost:5000/api/v1/message/delete/trash';
  await updateMail(endpoint, messages, dispatch);
};

export const clearMailActionStatus = () => ({ type: CLEAR_MAIL_ACTION_STATUS });

export const sendMessage = async (msgRecipients, msgSubject, msgBody) => {
  const token = store.getState().auth.token;
  const body = {
    to: msgRecipients,
    subject: msgSubject,
    body: msgBody
  };
  const res = await fetch('http://localhost:5000/api/v1/message', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(body)
  });

  const json = await res.json();

  if (json.status !== 'success') return null;

  const { sent, mailbox } = json.data;
  const seq = mailbox.buckets.outbox.length - 1;
  const messageId = sent._id;
  const messageCode = `${messageId}${1}${seq}`;

  return messageCode;
};

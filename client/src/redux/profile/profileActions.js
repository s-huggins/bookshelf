import {
  PREPARE_LOAD_PROFILE,
  CLEAR_PROFILE,
  LOAD_PROFILE_SUCCESS,
  LOAD_PROFILE_FAILURE,
  EDIT_PROFILE_SUCCESS,
  EDIT_PROFILE_FAILURE,
  CLEAR_EDIT_STATUS,
  EDIT_AVATAR_SUCCESS,
  EDIT_AVATAR_FAILURE,
  CLEAR_EDIT_AVATAR_STATUS,
  // SHELVE_BOOK,
  // UPDATE_PROFILE_RATINGS,
  SIGNAL_BOOK_WAS_RATED,
  RESET_BOOK_WAS_RATED_SIGNAL,
  MARK_MESSAGE,
  MARK_MESSAGE_FAILURE,
  TRASH_MESSAGE,
  TRASH_MESSAGE_FAILURE,
  OPEN_NEW_MESSAGE,
  DELETE_MESSAGE,
  UPDATE_MAILBOX
} from './profileTypes';

import {
  PROFILE_WAS_UPDATED,
  RATE_BOOK,
  UPDATE_INBOX_HEADER
} from '../auth/authTypes';

import store from '../../redux/store';

export const prepareGetProfile = () => ({
  type: PREPARE_LOAD_PROFILE
});
// export const clearProfile = () => ({
//   type: CLEAR_PROFILE
// });
export const clearEditStatus = () => ({
  type: CLEAR_EDIT_STATUS
});
export const clearEditAvatarStatus = () => ({
  type: CLEAR_EDIT_AVATAR_STATUS
});

// profileId optional
export const getProfile = profileId => async dispatch => {
  dispatch(prepareGetProfile());
  let uri = 'http://localhost:5000/api/v1/profile';
  if (profileId) {
    uri = `${uri}/${profileId}`;
  }

  const token = store.getState().auth.token;
  const res = await fetch(uri, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    }
  });

  const json = await res.json();

  if (json.status === 'success') {
    dispatch({
      type: LOAD_PROFILE_SUCCESS,
      payload: json
    });
  } else {
    dispatch({
      type: LOAD_PROFILE_FAILURE
    });
  }
};

export const editProfile = updatedProfile => async dispatch => {
  // make call to api
  // dispatch success or failure, depending upon backend validation

  const uri = 'http://localhost:5000/api/v1/profile';
  const token = store.getState().auth.token;

  const res = await fetch(uri, {
    method: 'PATCH',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(updatedProfile)
  });
  const json = await res.json();
  if (json.status === 'success') {
    dispatch({
      type: PROFILE_WAS_UPDATED,
      payload: json.data.user
    });

    dispatch({
      type: EDIT_PROFILE_SUCCESS,
      payload: json.data.profile
    });
  } else {
    dispatch({
      type: EDIT_PROFILE_FAILURE,
      payload: json
    });
  }
};

export const editAvatar = formData => async dispatch => {
  const token = store.getState().auth.token;
  const res = await fetch('http://localhost:5000/api/v1/profile/avatar', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: formData
  });

  const json = await res.json();

  if (json.status === 'success') {
    dispatch({
      type: PROFILE_WAS_UPDATED,
      payload: json.data.user
    });
    dispatch({
      type: EDIT_AVATAR_SUCCESS,
      payload: json.data.profile
    });
  } else {
    dispatch({
      type: EDIT_AVATAR_FAILURE,
      payload: json
    });
  }
};

export const deleteAvatar = () => async dispatch => {
  const token = store.getState().auth.token;
  const res = await fetch('http://localhost:5000/api/v1/profile/avatar', {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    }
  });

  const json = await res.json();

  if (json.status === 'success') {
    dispatch({
      type: PROFILE_WAS_UPDATED,
      payload: json.data.user
    });
    dispatch({
      type: EDIT_AVATAR_SUCCESS,
      payload: json.data.profile
    });
  } else {
    dispatch({
      type: EDIT_AVATAR_FAILURE,
      payload: json
    });
  }
};

export const shelveBook = (bookData, shelf) => async dispatch => {
  const body = { shelf, ...bookData };

  const token = store.getState().auth.token;
  // const res =
  await fetch('http://localhost:5000/api/v1/profile/bookshelves', {
    method: 'PATCH',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(body)
  });

  // const json = await res.json();
};

export const rateBook = (bookData, rating) => async dispatch => {
  const body = { rating, ...bookData };

  const token = store.getState().auth.token;
  const res = await fetch('http://localhost:5000/api/v1/profile/rating', {
    method: 'PATCH',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(body)
  });

  const json = await res.json();

  if (json.status === 'success') {
    dispatch({ type: SIGNAL_BOOK_WAS_RATED });
    dispatch({ type: RATE_BOOK, payload: json.data.profile });
  }
};

export const resetBookRatedSignal = () => ({
  type: RESET_BOOK_WAS_RATED_SIGNAL
});

export const getMailbox = () => async dispatch => {
  dispatch(prepareGetProfile());
  const token = store.getState().auth.token;
  const endpoint = 'http://localhost:5000/api/v1/message';

  const res = await fetch(endpoint, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    }
  });

  const json = await res.json();

  if (json.status === 'success') {
    dispatch({
      type: LOAD_PROFILE_SUCCESS,
      payload: json
    });
  } else {
    dispatch({
      type: LOAD_PROFILE_FAILURE
    });
  }
};

const markMessages = (messageIds, mark, markFlag) => async dispatch => {
  const token = store.getState().auth.token;
  const endpoint = `http://localhost:5000/api/v1/message/mark?${mark}=${markFlag}`;

  const res = await fetch(endpoint, {
    method: 'PATCH',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ messageIds })
  });

  const json = await res.json();

  if (json.status === 'success') {
    dispatch({
      type: UPDATE_MAILBOX,
      payload: {
        inbox: json.data.inbox,
        outbox: json.data.outbox
      }
    });
    dispatch({
      type: UPDATE_INBOX_HEADER,
      payload: {
        inbox: json.data.inbox
      }
    });
  } else {
    dispatch({
      type: MARK_MESSAGE_FAILURE
    });
  }
};

export const markRead = (messageIds, isRead) => async dispatch => {
  dispatch(markMessages(messageIds, 'read', isRead));
};
export const markSaved = (messageIds, isSaved) => async dispatch => {
  dispatch(markMessages(messageIds, 'saved', isSaved));
};

export const openNewMessage = messageId => async dispatch => {
  const token = store.getState().auth.token;
  const endpoint = `http://localhost:5000/api/v1/message/mark?read=true`;

  const res = await fetch(endpoint, {
    method: 'PATCH',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ messageIds: [messageId] })
  });

  const json = await res.json();

  if (json.status === 'success') {
    dispatch({
      type: OPEN_NEW_MESSAGE,
      payload: {
        inbox: json.data.inbox,
        outbox: json.data.outbox
      }
    });
    dispatch({
      type: UPDATE_INBOX_HEADER,
      payload: {
        inbox: json.data.inbox
      }
    });
  }
};

export const trashMessages = (messageIds, trashFlag) => async dispatch => {
  const token = store.getState().auth.token;
  const endpoint = `http://localhost:5000/api/v1/message/trash?trash=${trashFlag}`;

  const res = await fetch(endpoint, {
    method: 'PATCH',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ messageIds })
  });

  const json = await res.json();

  if (json.status === 'success') {
    dispatch({
      type: UPDATE_MAILBOX,
      payload: {
        inbox: json.data.inbox,
        outbox: json.data.outbox
      }
    });
    dispatch({
      type: UPDATE_INBOX_HEADER,
      payload: {
        inbox: json.data.inbox
      }
    });
  } else {
    dispatch({
      type: TRASH_MESSAGE_FAILURE
    });
  }
};

export const deleteMessages = (messageIds) => async dispatch => {
  const token = store.getState().auth.token;
  const endpoint = `http://localhost:5000/api/v1/message`;

  const res = await fetch(endpoint, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ messageIds })
  });

  const json = await res.json();

  if (json.status === 'success') {
    dispatch({
      type: UPDATE_MAILBOX,
      payload: {
        inbox: json.data.inbox,
        outbox: json.data.outbox
      }
    });
    dispatch({
      type: UPDATE_INBOX_HEADER,
      payload: {
        inbox: json.data.inbox
      }
    });
  } else {
    dispatch({
      type: TRASH_MESSAGE_FAILURE
    });
  }
}

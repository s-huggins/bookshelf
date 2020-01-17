import {
  SIGN_UP,
  SIGN_UP_FAIL,
  SIGN_UP_ERROR,
  SIGN_IN,
  SIGN_IN_FAIL,
  SIGN_IN_ERROR,
  SET_CURRENT_USER,
  SIGN_OUT,
  LOADING_USER,
  EDIT_USER_SUCCESS,
  EDIT_USER_FAILURE,
  CLEAR_EDIT_STATUS,
  DELETE_ACCOUNT,
  SENT_FRIEND_REQUEST,
  CANCELED_FRIEND_REQUEST,
  ACCEPTED_FRIEND_REQUEST,
  IGNORED_FRIEND_REQUEST,
  CLEAR_FAILED_SIGNUP,
  CLEAR_FAILED_SIGNIN,
  CLEAR_LANDING_AUTH_FAIL
} from './authTypes';

import store from '../store';

export const clearFailedSignup = () => ({ type: CLEAR_FAILED_SIGNUP });
export const clearFailedSignin = () => ({ type: CLEAR_FAILED_SIGNIN });
export const clearLandingAuthFail = () => ({ type: CLEAR_LANDING_AUTH_FAIL });

export const register = (userData, fromLanding = false) => async dispatch => {
  try {
    const res = await fetch('http://localhost:5000/api/v1/users/signup', {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify(userData)
    });
    const json = await res.json();
    if (json.status === 'success') {
      // save token in local storage
      localStorage.setItem('jwt', json.token);

      dispatch({
        type: SIGN_UP,
        payload: {
          token: json.token,
          user: json.data.user
        }
      });
    } else if (json.status === 'fail') {
      dispatch({
        type: SIGN_UP_FAIL,
        payload: {
          errors: json.errors,
          fromLanding
        }
      });
    } else if (json.status === 'error') {
      dispatch({
        type: SIGN_UP_ERROR,
        payload: { errors: json.errors, fromLanding }
      });
    }
  } catch (err) {
    dispatch({
      type: SIGN_UP_ERROR,
      payload: { error: 'Something went wrong.', fromLanding }
    });
  }
};

export const logIn = userData => async dispatch => {
  try {
    const res = await fetch('http://localhost:5000/api/v1/users/login', {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify(userData)
    });
    const json = await res.json();

    if (json.status === 'success') {
      localStorage.setItem('jwt', json.token);

      dispatch({
        type: SIGN_IN,
        payload: {
          token: json.token,
          user: json.data.user
        }
      });
    } else if (json.status === 'fail') {
      dispatch({
        type: SIGN_IN_FAIL,
        payload: json.errors
      });
    } else if (json.status === 'error') {
      dispatch({
        type: SIGN_IN_ERROR,
        payload: json.errors
      });
    }
  } catch (err) {
    dispatch({
      type: SIGN_IN_ERROR,
      payload: { error: 'Something went wrong.' }
    });
  }
};

export const setCurrentUser = () => async dispatch => {
  if (localStorage.jwt) {
    const jwtHeader = `Bearer ${localStorage.jwt}`;
    const res = await fetch('http://localhost:5000/api/v1/users', {
      headers: {
        Accept: 'application/json',
        Authorization: jwtHeader
      },
      method: 'GET'
    });
    const json = await res.json();

    if (json.status === 'success') {
      dispatch({
        type: SET_CURRENT_USER,
        payload: json.data
      });
    } else {
      localStorage.removeItem('jwt');
      dispatch({ type: SIGN_OUT });
    }
  } else {
    dispatch(setLoading(false));
  }
};

const resolveAccountEdit = (json, dispatch) => {
  if (json.status === 'success') {
    localStorage.setItem('jwt', json.token);
    dispatch({
      type: EDIT_USER_SUCCESS,
      payload: {
        user: json.data.user,
        token: json.token
      }
    });
  } else if (json.status === 'fail') {
    dispatch({
      type: EDIT_USER_FAILURE,
      payload: {
        status: 'fail',
        message: json.message || 'Something went wrong. Please try again.'
      }
    });
  } else {
    dispatch({
      type: EDIT_USER_FAILURE,
      payload: {
        status: 'error',
        message: 'Something went wrong. Please try again.'
      }
    });
  }
};

export const editEmail = (email, password) => async dispatch => {
  const token = store.getState().auth.token;
  const res = await fetch('http://localhost:5000/api/v1/users/updateEmail', {
    method: 'PATCH',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ email, password })
  });

  const json = await res.json();

  resolveAccountEdit(json, dispatch);
};

export const editPassword = (
  currentPassword,
  newPassword
) => async dispatch => {
  const token = store.getState().auth.token;
  const res = await fetch('http://localhost:5000/api/v1/users/updatePassword', {
    method: 'PATCH',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ currentPassword, newPassword })
  });

  const json = await res.json();

  resolveAccountEdit(json, dispatch);
};

export const deleteAccount = password => async dispatch => {
  const token = store.getState().auth.token;
  const res = await fetch('http://localhost:5000/api/v1/users', {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ password })
  });

  const json = await res.json();

  if (json.status === 'success') {
    dispatch({
      type: DELETE_ACCOUNT
    });
  } else if (json.status === 'fail') {
    dispatch({
      type: EDIT_USER_FAILURE,
      payload: {
        status: 'fail',
        message: json.message || 'Something went wrong. Please try again.'
      }
    });
  } else {
    dispatch({
      type: EDIT_USER_FAILURE,
      payload: {
        status: 'error',
        message: 'Something went wrong. Please try again.'
      }
    });
  }
};

export const signOut = () => {
  localStorage.removeItem('jwt');
  return {
    type: SIGN_OUT
  };
};

const setLoading = isLoading => ({
  type: LOADING_USER,
  payload: isLoading
});

export const clearEditStatus = () => ({
  type: CLEAR_EDIT_STATUS
});

export const sendFriendRequest = profileId => async dispatch => {
  const uri = `http://localhost:5000/api/v1/profile/friendRequests/outgoing/${profileId}`;
  const token = store.getState().auth.token;

  const res = await fetch(uri, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  });

  const json = await res.json();

  if (json.status === 'success')
    dispatch({
      type: SENT_FRIEND_REQUEST,
      payload: {
        friendRequests: json.data.friendRequests
      }
    });
};

export const cancelFriendRequest = profileId => async dispatch => {
  const uri = `http://localhost:5000/api/v1/profile/friendRequests/outgoing/${profileId}`;
  const token = store.getState().auth.token;

  const res = await fetch(uri, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  });

  const json = await res.json();

  if (json.status === 'success')
    dispatch({
      type: CANCELED_FRIEND_REQUEST,
      payload: {
        friendRequests: json.data.friendRequests
      }
    });
};

export const acceptFriendRequest = profileId => async dispatch => {
  const uri = `http://localhost:5000/api/v1/profile/friendRequests/incoming/${profileId}`;
  const token = store.getState().auth.token;

  const res = await fetch(uri, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  });

  const json = await res.json();

  if (json.status === 'success')
    dispatch({
      type: ACCEPTED_FRIEND_REQUEST,
      payload: {
        friendRequests: json.data.friendRequests,
        friends: json.data.friends
      }
    });
};

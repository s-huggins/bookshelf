import store from '../../redux/store';
import {
  FETCH_AUTHOR_SUCCESS,
  FETCH_AUTHOR_FAILURE,
  CLEAR_FETCH_STATUS
} from './authorTypes';

export const fetchAuthor = authorId => async dispatch => {
  let uri = `http://localhost:5000/api/v1/author/${authorId}`;
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
      type: FETCH_AUTHOR_SUCCESS,
      payload: json.data
    });
  } else {
    dispatch({
      type: FETCH_AUTHOR_FAILURE,
      payload: json.status
    });
  }
};

export const clearFetchStatus = () => ({ type: CLEAR_FETCH_STATUS });

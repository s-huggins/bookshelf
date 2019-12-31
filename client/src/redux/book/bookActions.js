import store from '../../redux/store';
import {
  FETCH_BOOK_SUCCESS,
  FETCH_BOOK_FAILURE,
  CLEAR_FETCH_STATUS
} from './bookTypes';

export const fetchBook = bookId => async dispatch => {
  let uri = `http://localhost:5000/api/v1/book/${bookId}`;
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
      type: FETCH_BOOK_SUCCESS,
      payload: json.data
    });
  } else {
    dispatch({
      type: FETCH_BOOK_FAILURE,
      payload: json.status
    });
  }
};

export const clearFetchStatus = () => ({ type: CLEAR_FETCH_STATUS });

import store from '../../redux/store';
import {
  SEARCH_BOOKS_SUCCESS,
  SEARCH_BOOKS_FAILURE,
  CLEAR_SEARCH_STATUS
} from './searchTypes';

export const searchBooks = (query, filter, page) => async dispatch => {
  let uri = 'http://localhost:5000/api/v1/search';

  // TODO: check params, return early if invalid?

  const token = store.getState().auth.token;

  const url = new URL(uri);
  url.search = new URLSearchParams({ q: query, 'search[field]': filter, page });

  const res = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    }
  });

  const json = await res.json();
  console.log(json);

  if (json.status === 'success') {
    dispatch({
      type: SEARCH_BOOKS_SUCCESS,
      payload: json.data
    });
  } else {
    dispatch({
      type: SEARCH_BOOKS_FAILURE
    });
  }
};

export const clearSearchStatus = () => ({ type: CLEAR_SEARCH_STATUS });

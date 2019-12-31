import {
  FETCH_BOOK_SUCCESS,
  FETCH_BOOK_FAILURE,
  CLEAR_FETCH_STATUS
} from './bookTypes';

const initialState = {
  book: null,
  fetchStatus: ''
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_BOOK_SUCCESS:
      return {
        ...state,
        book: action.payload,
        fetchStatus: 'success'
      };

    case FETCH_BOOK_FAILURE:
      return {
        ...state,
        book: null,
        fetchStatus: action.payload
      };

    case CLEAR_FETCH_STATUS:
      return {
        ...state,
        fetchStatus: ''
      };

    default:
      return state;
  }
};

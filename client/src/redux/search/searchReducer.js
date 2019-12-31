import {
  SEARCH_BOOKS_SUCCESS,
  SEARCH_BOOKS_FAILURE,
  CLEAR_SEARCH_STATUS
} from './searchTypes';

const initialState = {
  bookResults: null,
  searchStatus: ''
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SEARCH_BOOKS_SUCCESS:
      return {
        ...state,
        bookResults: action.payload,
        searchStatus: 'success'
      };

    case SEARCH_BOOKS_FAILURE:
      return {
        ...state,
        bookResults: null,
        searchStatus: 'fail'
      };

    case CLEAR_SEARCH_STATUS:
      return {
        ...state,
        searchStatus: ''
      };

    default:
      return state;
  }
};

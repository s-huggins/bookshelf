import {
  FETCH_AUTHOR_SUCCESS,
  FETCH_AUTHOR_FAILURE,
  FETCH_AUTHOR_BOOKS_SUCCESS,
  FETCH_AUTHOR_BOOKS_FAILURE,
  CLEAR_FETCH_STATUS
} from './authorTypes';

const initialState = {
  author: null,
  authorBooks: null,
  fetchStatus: ''
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_AUTHOR_SUCCESS:
      return {
        ...state,
        author: action.payload,
        fetchStatus: 'success'
      };

    case FETCH_AUTHOR_FAILURE:
      return {
        ...state,
        author: null,
        fetchStatus: action.payload
      };

    case FETCH_AUTHOR_BOOKS_SUCCESS:
      return {
        ...state,
        authorBooks: action.payload,
        fetchStatus: 'success'
      };

    case FETCH_AUTHOR_BOOKS_FAILURE:
      return {
        ...state,
        authorBooks: null,
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

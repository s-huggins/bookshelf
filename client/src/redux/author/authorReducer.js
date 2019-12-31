import {
  FETCH_AUTHOR_SUCCESS,
  FETCH_AUTHOR_FAILURE,
  CLEAR_FETCH_STATUS
} from './authorTypes';

const initialState = {
  author: null,
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

    case CLEAR_FETCH_STATUS:
      return {
        ...state,
        fetchStatus: ''
      };

    default:
      return state;
  }
};

import isEmpty from '../../util/isEmpty';

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
  PROFILE_WAS_UPDATED,
  SENT_FRIEND_REQUEST,
  CANCELED_FRIEND_REQUEST,
  ACCEPTED_FRIEND_REQUEST,
  IGNORED_FRIEND_REQUEST,
  CLEAR_FAILED_SIGNUP,
  CLEAR_FAILED_SIGNIN,
  CLEAR_LANDING_AUTH_FAIL
} from './authTypes';

const initialState = {
  isAuthenticated: false,
  user: null,
  token: '',
  signUp: {
    failed: false,
    errors: {}
  },
  signIn: {
    failed: false,
    errors: {}
  },
  landingAuthFail: false,
  loadingUser: true,
  editStatus: '',
  errorMessage: ''
};

export default (state = initialState, action) => {
  switch (action.type) {
    case LOADING_USER:
      return {
        ...state,
        loadingUser: action.payload
      };
    case SIGN_UP:
      return {
        ...state,
        isAuthenticated: true,
        token: action.payload.token,
        user: action.payload.user,
        signUp: {
          failed: false,
          errors: {}
        },
        signIn: {
          failed: false,
          errors: {}
        },
        landingAuthFail: false,
        loadingUser: false
        // loadingUser: true
      };

    case SIGN_UP_FAIL:
      return {
        ...state,
        signUp: {
          failed: true,
          errors: action.payload.errors
        },
        landingAuthFail: action.payload.fromLanding || false,
        signIn: {
          failed: false,
          errors: {}
        },
        loadingUser: false
      };

    case SIGN_UP_ERROR:
      return {
        ...state,
        signUp: {
          failed: true,
          errors: action.payload.errors
        },
        landingAuthFail: action.payload.fromLanding || false,
        signIn: {
          failed: false,
          errors: {}
        },
        loadingUser: false
      };

    case SIGN_IN:
      return {
        ...state,
        isAuthenticated: true,
        token: action.payload.token,
        user: action.payload.user,
        signUp: {
          failed: false,
          errors: {}
        },
        signIn: {
          failed: false,
          errors: {}
        },
        landingAuthFail: false,
        loadingUser: false
      };

    case SIGN_IN_FAIL:
      return {
        ...state,
        signIn: {
          failed: true,
          errors: action.payload
        },
        signUp: {
          failed: false,
          errors: {}
        },
        landingAuthFail: false,
        loadingUser: false
      };

    case SIGN_IN_ERROR:
      return {
        ...state,
        signIn: {
          failed: true,
          errors: action.payload
        },
        signUp: {
          failed: false,
          errors: {}
        },
        landingAuthFail: false,
        loadingUser: false
      };

    case SET_CURRENT_USER:
      return {
        ...state,
        isAuthenticated: !isEmpty(action.payload.user),
        user: action.payload.user,
        token: action.payload.token,
        loadingUser: false
      };

    case SIGN_OUT:
      return {
        ...state,
        isAuthenticated: false,
        token: '',
        user: null,
        loadingUser: false
      };

    case EDIT_USER_SUCCESS:
      return {
        ...state,
        token: action.payload.token,
        user: action.payload.user,
        loadingUser: false,
        editStatus: 'success',
        errorMessage: ''
      };
    case EDIT_USER_FAILURE:
      return {
        ...state,
        loadingUser: false,
        editStatus: action.payload.status,
        errorMessage: action.payload.message
      };

    case PROFILE_WAS_UPDATED:
      return {
        ...state,
        user: action.payload
      };

    case CLEAR_EDIT_STATUS:
      return {
        ...state,
        editStatus: '',
        errorMessage: ''
      };

    case LOADING_USER:
      return {
        ...state,
        loadingUser: action.payload
      };

    case DELETE_ACCOUNT:
      return {
        ...initialState
      };

    case SENT_FRIEND_REQUEST:
      return {
        ...state,
        user: {
          ...state.user,
          friendRequests: action.payload.friendRequests
        }
      };

    case CANCELED_FRIEND_REQUEST:
      return {
        ...state,
        user: {
          ...state.user,
          friendRequests: action.payload.friendRequests
        }
      };

    case ACCEPTED_FRIEND_REQUEST:
      return {
        ...state,
        user: {
          ...state.user,
          friendRequests: action.payload.friendRequests,
          friends: action.payload.friends
        }
      };

    case CLEAR_FAILED_SIGNUP:
      return {
        ...state,
        signUp: {
          failed: false,
          errors: {}
        }
      };
    case CLEAR_FAILED_SIGNIN:
      return {
        ...state,
        signIn: {
          failed: false,
          errors: {}
        }
      };
    case CLEAR_LANDING_AUTH_FAIL:
      return {
        ...state,
        landingAuthFail: false
      };

    default:
      return state;
  }
};

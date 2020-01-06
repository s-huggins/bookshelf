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
  PROFILE_WAS_UPDATED
} from './authTypes';

const initialState = {
  isAuthenticated: false,
  user: null,
  token: '',
  failedSignUp: false,
  signUpErrors: {},
  failedSignIn: false,
  signInErrors: {},
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
        failedSignUp: false,
        failedSignIn: false,
        signUpErrors: {},
        signInErrors: {},
        loadingUser: false
        // loadingUser: true
      };

    case SIGN_UP_FAIL:
      return {
        ...state,
        failedSignUp: true,
        signUpErrors: action.payload,
        failedSignIn: false,
        signInErrors: {},
        loadingUser: false
      };

    case SIGN_UP_ERROR:
      return {
        ...state,
        failedSignUp: true,
        signUpErrors: action.payload,
        failedSignIn: false,
        signInErrors: {},
        loadingUser: false
      };

    case SIGN_IN:
      return {
        ...state,
        isAuthenticated: true,
        token: action.payload.token,
        user: action.payload.user,
        failedSignUp: false,
        failedSignIn: false,
        signUpErrors: {},
        signInErrors: {},
        loadingUser: false
      };

    case SIGN_IN_FAIL:
      return {
        ...state,
        failedSignIn: true,
        signInErrors: action.payload,
        failedSignUp: false,
        signUpErrors: {},
        loadingUser: false
      };

    case SIGN_IN_ERROR:
      return {
        ...state,
        failedSignIn: true,
        signInErrors: action.payload,
        failedSignUp: false,
        signUpErrors: {},
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

    default:
      return state;
  }
};

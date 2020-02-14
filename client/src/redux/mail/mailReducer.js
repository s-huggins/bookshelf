import {
  FETCH_INBOX,
  UPDATE_MAILBOX,
  CLEAR_MAIL_ACTION_STATUS,
  MAIL_ACTION_FAILURE,
  MAIL_ACTION_SUCCESS,
  FETCH_SAVED,
  FETCH_TRASH,
  FETCH_SENT,
  FETCH_SPOOL,
  CLEAR_SPOOL
} from './mailTypes';

const initialState = {
  inbox: [],
  sent: [],
  saved: [],
  trash: [],
  spool: null,
  mailbox: {},
  actionStatus: ''
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_INBOX:
      return {
        ...state,
        inbox: action.payload
      };

    case FETCH_SAVED:
      return {
        ...state,
        saved: action.payload
      };

    case FETCH_TRASH:
      return {
        ...state,
        trash: action.payload
      };

    case FETCH_SENT:
      return {
        ...state,
        sent: action.payload
      };

    case FETCH_SPOOL:
      return {
        ...state,
        spool: action.payload
      };

    case UPDATE_MAILBOX:
      return {
        ...state,
        mailbox: action.payload
      };

    case MAIL_ACTION_SUCCESS:
      return {
        ...state,
        mailbox: action.payload,
        actionStatus: 'success'
      };

    case MAIL_ACTION_FAILURE:
      return {
        ...state,
        actionStatus: 'fail'
      };

    case CLEAR_MAIL_ACTION_STATUS:
      return {
        ...state,
        actionStatus: ''
      };

    case CLEAR_SPOOL:
      return {
        ...state,
        spool: null
      };

    default:
      return state;
  }
};

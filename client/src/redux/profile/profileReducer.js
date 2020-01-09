import {
  PREPARE_LOAD_PROFILE,
  CLEAR_PROFILE,
  LOAD_PROFILE_SUCCESS,
  LOAD_PROFILE_FAILURE,
  EDIT_PROFILE_SUCCESS,
  EDIT_PROFILE_FAILURE,
  CLEAR_EDIT_STATUS,
  EDIT_AVATAR_SUCCESS,
  EDIT_AVATAR_FAILURE,
  CLEAR_EDIT_AVATAR_STATUS,
  UPDATE_PROFILE_RATINGS
} from './profileTypes';

/* editStatus one of '', 'success', 'fail' */
const initialState = {
  loadedProfile: null,
  profileHasLoaded: false,
  editStatus: '',
  editAvatarStatus: ''
};

export default (state = initialState, action) => {
  switch (action.type) {
    case PREPARE_LOAD_PROFILE:
    case CLEAR_PROFILE:
      return {
        ...state,
        loadedProfile: null,
        profileHasLoaded: false
      };
    case LOAD_PROFILE_SUCCESS:
      return {
        ...state,
        profileHasLoaded: true,
        loadedProfile: action.payload.data.profile
      };

    case LOAD_PROFILE_FAILURE:
      return {
        ...state,
        profileHasLoaded: true,
        loadedProfile: null
      };

    case EDIT_PROFILE_SUCCESS:
      return {
        ...state,
        loadedProfile: action.payload,
        profileHasLoaded: true,
        editStatus: 'success'
      };
    case EDIT_PROFILE_FAILURE:
      return {
        ...state,
        // loadedProfile: null,
        profileHasLoaded: true,
        editStatus: 'fail'
      };

    case CLEAR_EDIT_STATUS:
      return {
        ...state,
        editStatus: ''
      };

    case EDIT_AVATAR_SUCCESS:
      return {
        ...state,
        loadedProfile: action.payload,
        profileHasLoaded: true,
        editAvatarStatus: 'success'
      };

    case EDIT_AVATAR_FAILURE:
      return {
        ...state,
        // loadedProfile: null,
        profileHasLoaded: true,
        editAvatarStatus: 'fail'
      };

    case CLEAR_EDIT_AVATAR_STATUS:
      return {
        ...state,
        editAvatarStatus: ''
      };

    default:
      return state;
  }
};

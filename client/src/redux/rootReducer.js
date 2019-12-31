import { combineReducers } from 'redux';
import authReducer from './auth/authReducer';
import profileReducer from './profile/profileReducer';
import searchReducer from './search/searchReducer';
import bookReducer from './book/bookReducer';

export default combineReducers({
  auth: authReducer,
  profile: profileReducer,
  search: searchReducer,
  book: bookReducer
});

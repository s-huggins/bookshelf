import {
  PREPARE_LOAD_PROFILE,
  CLEAR_PROFILE,
  LOAD_PROFILE_SUCCESS,
  LOAD_PROFILE_FAILURE,
  EDIT_PROFILE_SUCCESS,
  EDIT_PROFILE_FAILURE,
  CLEAR_EDIT_STATUS
} from './profileTypes';
import store from '../../redux/store';

export const prepareGetProfile = () => ({
  type: PREPARE_LOAD_PROFILE
});
export const clearProfile = () => ({
  type: CLEAR_PROFILE
});

// const fetchProfile = async profileId => {
//   let uri = 'http://localhost:5000/api/v1/profile';
//   if (profileId) {
//     uri = `${uri}/${profileId}`;
//   }
//   const token = store.getState().auth.token;

//   const res = await fetch(uri, {
//     method: 'GET',
//     headers: {
//       Accept: 'application/json',
//       Authorization: `Bearer ${token}`
//     }
//   });
//   const json = await res.json();

//   return json;
// };

// const fetchAvatar = async profile_id => {
//   const uri = `http://localhost:5000/api/v1/profile/avatar/${profile_id}`;
//   const token = store.getState().auth.token;
//   const res = await fetch(uri, {
//     method: 'GET',
//     headers: {
//       Authorization: `Bearer ${token}`
//     }
//   });

//   if (res.status === 'fail' || res.status === 'error') {
//     return '';
//   }

//   const blob = await res.blob();
//   const blobUrl = URL.createObjectURL(blob);

//   return blobUrl;
// };

// profileId optional
export const getProfile = profileId => async dispatch => {
  let uri = 'http://localhost:5000/api/v1/profile';
  if (profileId) {
    uri = `${uri}/${profileId}`;
  }

  const token = store.getState().auth.token;
  const res = await fetch(uri, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    }
  });

  const json = await res.json();

  if (json.status === 'success') {
    dispatch({
      type: LOAD_PROFILE_SUCCESS,
      payload: json
    });
  } else {
    dispatch({
      type: LOAD_PROFILE_FAILURE
    });
  }
};

// profileId the default _id mongoDB field
// USING THIS??????????????????????????????????
export const getAvatar = profileId => async dispatch => {
  const uri = `http://localhost:5000/api/v1/profile/avatar/${profileId}`;
  const token = store.getState().auth.token;
  const res = await fetch(uri, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (res.status === 'fail' || res.status === 'error') {
    // dispatch({ type: AVATAR_NOT_FOUND, payload: { profileId } });
  }

  const blob = await res.blob();
  const blobUrl = URL.createObjectURL(blob);

  // dispatch({ type: AVATAR_FOUND, payload: { blobUrl, profileId } });
};

export const editAvatar = formData => async dispatch => {
  const token = store.getState().auth.token;
  const res = await fetch('http://localhost:5000/api/v1/profile/avatar', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: formData
  });

  const json = await res.json();

  if (json.status === 'success') {
    dispatch({
      type: EDIT_PROFILE_SUCCESS,
      payload: json.data.profile
    });
  } else {
    dispatch({
      type: EDIT_PROFILE_FAILURE,
      payload: json
    });
  }
};

export const deleteAvatar = () => async dispatch => {
  const token = store.getState().auth.token;
  const res = await fetch('http://localhost:5000/api/v1/profile/avatar', {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    }
  });

  const json = await res.json();

  if (json.status === 'success') {
    dispatch({
      type: EDIT_PROFILE_SUCCESS,
      payload: json.data.profile
    });
  } else {
    dispatch({
      type: EDIT_PROFILE_FAILURE,
      payload: json
    });
  }
};

export const editProfile = updatedProfile => async dispatch => {
  // make call to api
  // dispatch success or failure, depending upon backend validation
  const uri = 'http://localhost:5000/api/v1/profile';
  const token = store.getState().auth.token;

  const res = await fetch(uri, {
    method: 'PATCH',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(updatedProfile)
  });
  const json = await res.json();
  if (json.status === 'success') {
    dispatch({
      type: EDIT_PROFILE_SUCCESS,
      payload: json.data.profile
    });
  } else {
    dispatch({
      type: EDIT_PROFILE_FAILURE,
      payload: json
    });
  }
};

export const clearEditStatus = () => ({
  type: CLEAR_EDIT_STATUS
});

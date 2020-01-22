import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import LocationDropdown from './LocationDropdown';
import DoBDropdown from './DoBDropdown';
import EditTextInput from './EditTextInput';
import validator from 'validator';
import blacklist from './handleBlacklist';
import store from '../../../redux/store';
import {
  editProfile,
  editAvatar,
  deleteAvatar,
  clearEditAvatarStatus
} from '../../../redux/profile/profileActions';
import debounce from 'debounce-async';
import Avatar from '../Profile/Avatar';
import Loader from '../../common/Loader';
import pluralize from '../../../util/pluralize';

/* USERNAME/HANDLE VALIDATOR TO BE DEBOUNCED */
const handleValidator = handle => {
  if (handle.length > 40) {
    return Promise.resolve('Handle cannot exceed 40 characters.');
  }
  if (handle !== '' && !/^[a-zA-Z][a-zA-Z0-9-]*$/.test(handle)) {
    return Promise.resolve(
      'Handle must begin with a letter and can consist of only alphanumeric characters and dashes.'
    );
  }
  if (blacklist.has(handle.toLowerCase())) {
    return Promise.resolve('Sorry, that handle is not allowed.');
  }
  if (
    handle &&
    store.getState().profile.loadedProfile.handle &&
    !(
      handle.toLowerCase() ===
      store.getState().profile.loadedProfile.handle.toLowerCase()
    )
  ) {
    return new Promise((resolve, reject) => {
      const uri = `http://localhost:5000/api/v1/profile/handleCheck/${handle}`;
      const token = store.getState().auth.token;
      fetch(uri, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`
        }
      })
        .then(res => res.json())
        .then(json => {
          if (json.data.handleTaken) resolve('That handle is taken.');
          else resolve('');
        })
        .catch(err => reject(err));
    });
  }
  return Promise.resolve('');
};

/* DEBOUNCED HANDLER */
const runHandleValidator = debounce(handleValidator, 600, {});

const EditProfile = ({ profile, setLoadingEdit }) => {
  // track form state to display validation errors in the UI
  const [formState, setFormState] = useState({
    firstName: {
      value: '',
      valid: true
    },
    lastName: {
      value: '',
      valid: true
    },
    displayName: {
      value: '',
      valid: true
    },
    lastNamePrivacy: '',
    handle: {
      value: '',
      valid: true
    },
    gender: '',
    genderPrivacy: '',
    location: '',
    locationPrivacy: '',
    birthday: '',
    birthdayPrivacy: '',
    website: {
      value: '',
      valid: true
    },
    interests: {
      value: '',
      valid: true
    },
    favBooks: {
      value: '',
      valid: true
    },
    aboutMe: {
      value: '',
      valid: true
    },
    facebook: {
      value: '',
      valid: true
    },
    twitter: {
      value: '',
      valid: true
    },
    instagram: {
      value: '',
      valid: true
    },
    youtube: {
      value: '',
      valid: true
    },
    linkedin: {
      value: '',
      valid: true
    }
  });

  const [formValidity, setFormValidity] = useState(true);
  const [avatarAction, setAvatarAction] = useState('');
  const [avatarMessage, setAvatarMessage] = useState('');

  const dispatch = useDispatch();
  const editAvatarStatus = useSelector(state => state.profile.editAvatarStatus);

  const calculateFormValidity = () => {
    return Object.values(formState)
      .filter(val => typeof val === 'object') // text inputs are nested objects in the state
      .every(val => val.valid);
  };

  // holds the file input element for avatar submission events
  const avatarInput = useRef(null);

  /** Prepopulate form fields with profile data fetched from the db.
   *  First checks if an old profile exists in the store, and if so, removes
   *  and replaces it with the user's own.
   */
  useEffect(() => {
    profile &&
      setFormState({
        firstName: {
          value: profile.firstName || '',
          valid: true
        },

        lastName: {
          value: profile.lastName ? profile.lastName.value || '' : '',
          valid: true
        },
        displayName: {
          value: profile.displayName || profile.firstName,
          valid: true
        },
        lastNamePrivacy: profile.lastName
          ? profile.lastName.private
            ? 'friends'
            : 'everyone'
          : 'friends',
        handle: {
          value: profile.handle || '',
          valid: true
        },
        gender: profile.gender
          ? profile.gender.value || 'Unspecified'
          : 'Unspecified',
        genderPrivacy: profile.gender
          ? profile.gender.private
            ? 'friends'
            : 'everyone'
          : 'friends',
        location: profile.location ? profile.location.value || '' : '',
        locationPrivacy: profile.location
          ? profile.location.private
            ? 'friends'
            : 'everyone'
          : 'friends',
        // birthday: profile.birthday
        //   ? profile.birthday.value
        //     ? profile.birthday.value
        //     : '2000-01-01'
        //   : '2000-01-01',
        birthday:
          profile.birthday && profile.birthday.value
            ? profile.birthday.value
            : '',
        birthdayPrivacy: profile.birthday
          ? profile.birthday.private
            ? 'friends'
            : 'everyone'
          : 'friends',
        website: {
          value: profile.website || '',
          valid: true
        },
        interests: {
          value: profile.interests || '',
          valid: true
        },
        favBooks: {
          value: profile.favBooks || '',
          valid: true
        },
        aboutMe: {
          value: profile.aboutMe || '',
          valid: true
        },
        facebook: {
          value: profile.social.facebook || '',
          valid: true
        },
        twitter: {
          value: profile.social.twitter || '',
          valid: true
        },
        instagram: {
          value: profile.social.instagram || '',
          valid: true
        },
        youtube: {
          value: profile.social.youtube || '',
          valid: true
        },
        linkedin: {
          value: profile.social.linkedin || '',
          valid: true
        }
      });
  }, []);

  /**
   * Initial and subsequent validity checks on the overall form. TODO: necessary???
   */
  useEffect(() => {
    if (profile) {
      setFormValidity(calculateFormValidity());
    }
  }, [formState, profile]);

  useEffect(() => {
    if (editAvatarStatus !== '') {
      if (editAvatarStatus !== 'success') {
        if (avatarAction === 'upload') setAvatarMessage('Upload failed.');
        else if (avatarAction === 'remove') setAvatarMessage('Delete failed.');
        else setAvatarMessage('Failed.');
      } else {
        setAvatarMessage('');
      }

      // setAvatarUploading(false);
      setAvatarAction('');
      dispatch(clearEditAvatarStatus());
    }
  }, [editAvatarStatus]);

  /* HANDLERS */

  // only for inputs and textareas
  const handleTextInputChanged = (inputName, inputVal, isValid) => {
    setFormState(oldFormState => ({
      ...formState,
      [inputName]: {
        value: inputVal,
        valid: isValid === undefined ? oldFormState[inputName].isValid : isValid
      }
    }));
  };

  // async validity update for 'handle' field
  const handleValidityChanged = (inputName, isValid) => {
    setFormState(oldFormState => ({
      ...formState,
      [inputName]: {
        ...oldFormState[inputName],
        valid: isValid
      }
    }));
  };

  /* HANDLERS FOR RADIO BUTTONS & DROPDOWNS */
  const handleLocationChange = location =>
    setFormState({ ...formState, location });

  const handleBirthdayChange = birthday =>
    setFormState({ ...formState, birthday });

  const handleGenderChange = e =>
    setFormState({ ...formState, gender: e.target.value });

  const handleRadioChange = e =>
    setFormState({ ...formState, [e.target.name]: e.target.value });

  /* SUBMIT HANDLER */
  const onSubmit = e => {
    e.preventDefault();

    // helper method
    const isPrivate = privacySetting =>
      privacySetting === 'friends' ? true : false;

    const update = {};
    update.firstName = formState.firstName.value;
    update.lastName = {
      value: formState.lastName.value,
      private: isPrivate(formState.lastNamePrivacy)
    };
    update.displayName = formState.displayName.value;
    update.handle = formState.handle.value;
    update.gender = {
      value: formState.gender,
      private: isPrivate(formState.genderPrivacy)
    };
    update.location = {
      value: formState.location,
      private: isPrivate(formState.locationPrivacy)
    };
    update.birthday = {
      value: formState.birthday,
      private: isPrivate(formState.birthdayPrivacy)
    };
    update.website = formState.website.value;
    update.interests = formState.interests.value;
    update.favBooks = formState.favBooks.value;
    update.aboutMe = formState.aboutMe.value;

    const social = {
      facebook: formState.facebook.value,
      twitter: formState.twitter.value,
      instagram: formState.instagram.value,
      youtube: formState.youtube.value,
      linkedin: formState.linkedin.value
    };
    update.social = social;

    setLoadingEdit(true);
    dispatch(editProfile(update));
  };

  const onSubmitAvatar = e => {
    e.preventDefault();
    if (avatarInput.current.files.length === 0) return;

    setAvatarAction('upload');
    const formData = new FormData();
    formData.append('img', avatarInput.current.files[0]);
    dispatch(editAvatar(formData));
  };

  const removeAvatar = async e => {
    if (!profile.avatar_id) return;
    setAvatarAction('remove');
    dispatch(deleteAvatar());
  };

  /* VALIDATORS */

  const maxLengthValidator = (maxlen, label) => val =>
    val.length > maxlen
      ? `${label} cannot exceed ${maxlen} ${pluralize('character', maxlen)}.`
      : '';

  const validators = {
    firstName: {
      validate: val => {
        if (val.length === 0) return 'First name is required.';

        return maxLengthValidator(40, 'First name')(val);
      },
      onBlur: false
    },
    lastName: {
      validate: val => maxLengthValidator(40, 'Last name')(val),
      onBlur: true
    },
    displayName: {
      validate: val => {
        if (val.length === 0) return 'Display name is required.';
        return maxLengthValidator(20, 'Display name')(val);
      },
      onBlur: false
    },
    handle: {
      validate: runHandleValidator,
      onBlur: false,
      async: true
    },
    website: {
      validate: val => {
        const lengthError = maxLengthValidator(120, 'Website')(val);
        if (lengthError) return lengthError;

        if (val && !validator.isURL(val)) return 'Not a valid URL.';

        return '';
      },
      onBlur: true
    },

    interests: {
      validate: val => maxLengthValidator(400, 'Your interests')(val),

      onBlur: true
    },
    favBooks: {
      validate: val => maxLengthValidator(400, 'Your favourite books')(val),

      onBlur: true
    },
    aboutMe: {
      validate: val => maxLengthValidator(2000, 'Your about me section')(val),

      onBlur: true
    },
    social: {
      validate: val => maxLengthValidator(120, 'Social fields')(val),

      onBlur: true
    }
  };

  return (
    <div className="form-control--edit">
      <form
        className="form-control--edit__fields"
        autoComplete="off"
        onSubmit={onSubmit}
      >
        {/* FIRST NAME */}
        <EditTextInput
          labelText="First Name"
          fieldName="firstName"
          value={formState.firstName.value}
          validator={validators.firstName}
          inputChanged={handleTextInputChanged}
          validityChanged={handleValidityChanged}
          required
        />
        {/* LAST NAME */}
        <EditTextInput
          labelText="Last Name"
          fieldName="lastName"
          value={formState.lastName.value}
          validator={validators.lastName}
          inputChanged={handleTextInputChanged}
          validityChanged={handleValidityChanged}
        />
        {/* LAST NAME PRIVACY */}
        <div className="form-control--edit__radio">
          <span className="lead">Share my last name with:</span>
          <label className="radio-label" htmlFor="lastName-everyone">
            <input
              type="radio"
              name="lastNamePrivacy"
              value="everyone"
              id="lastName-everyone"
              checked={formState.lastNamePrivacy === 'everyone'}
              onChange={handleRadioChange}
            />
            <span className="label-text">Everyone</span>
          </label>
          <label className="radio-label" htmlFor="lastName-friends">
            <input
              type="radio"
              name="lastNamePrivacy"
              value="friends"
              id="lastName-friends"
              checked={formState.lastNamePrivacy === 'friends'}
              onChange={handleRadioChange}
            />
            <span className="label-text">Friends only</span>
          </label>
        </div>
        {/* DISPLAY NAME */}
        <EditTextInput
          labelText="Display Name"
          fieldName="displayName"
          value={formState.displayName.value}
          validator={validators.displayName}
          inputChanged={handleTextInputChanged}
          validityChanged={handleValidityChanged}
          required
        />
        {/* HANDLE */}
        <EditTextInput
          labelText="Handle"
          fieldName="handle"
          value={formState.handle.value}
          validator={validators.handle}
          inputChanged={handleTextInputChanged}
          exampleText={`(customize your URL — bookshelf.com/${formState.handle
            .value || 'my-custom-handle'})`}
          validityChanged={handleValidityChanged}
        />
        {/* GENDER */}
        <div className="form-control--edit__field">
          <label
            htmlFor="gender"
            className="form-control--edit__label-dropdown"
          >
            Gender
          </label>
          <select
            name="gender"
            id="gender"
            value={formState.gender}
            onChange={handleGenderChange}
          >
            <option value="Unspecified">Unspecified</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          <span className="note-text">
            <span>Note:</span> Selecting 'Unspecified' or 'Other' will display
            they/them/their pronouns.
          </span>
        </div>

        {/* GENDER PRIVACY */}
        <div className="form-control--edit__radio">
          <span className="lead">Share my gender with:</span>
          <label className="radio-label" htmlFor="gender-everyone">
            <input
              type="radio"
              name="genderPrivacy"
              value="everyone"
              id="gender-everyone"
              checked={formState.genderPrivacy === 'everyone'}
              onChange={handleRadioChange}
            />
            <span className="label-text">Everyone</span>
          </label>
          <label className="radio-label" htmlFor="gender-friends">
            <input
              type="radio"
              name="genderPrivacy"
              value="friends"
              id="gender-friends"
              checked={formState.genderPrivacy === 'friends'}
              onChange={handleRadioChange}
            />
            <span className="label-text">Friends only</span>
          </label>

          <span className="note-text">
            <span>Note:</span> Selecting 'Friends only' will display
            they/them/their pronouns to non-friends.
          </span>
        </div>

        {/* Location */}
        <LocationDropdown
          value={formState.location}
          handleDropdownChange={handleLocationChange}
        />

        {/* Location Privacy */}

        <div className="form-control--edit__radio">
          <span className="lead">Share my location with:</span>
          <label className="radio-label" htmlFor="location-everyone">
            <input
              type="radio"
              name="locationPrivacy"
              value="everyone"
              id="location-everyone"
              checked={formState.locationPrivacy === 'everyone'}
              onChange={handleRadioChange}
            />
            <span className="label-text">Everyone</span>
          </label>
          <label className="radio-label" htmlFor="location-friends">
            <input
              type="radio"
              name="locationPrivacy"
              value="friends"
              id="location-friends"
              checked={formState.locationPrivacy === 'friends'}
              onChange={handleRadioChange}
            />
            <span className="label-text">Friends only</span>
          </label>
        </div>

        {/* Birthday */}
        <DoBDropdown
          birthday={formState.birthday}
          handleChange={handleBirthdayChange}
        />

        {/* Birthday Privacy */}

        <div className="form-control--edit__radio">
          <span className="lead">Share my age and birthday with:</span>
          <label className="radio-label" htmlFor="birthday-everyone">
            <input
              type="radio"
              name="birthdayPrivacy"
              value="everyone"
              id="birthday-everyone"
              checked={formState.birthdayPrivacy === 'everyone'}
              onChange={handleRadioChange}
            />
            <span className="label-text">Everyone</span>
          </label>
          <label className="radio-label" htmlFor="birthday-friends">
            <input
              type="radio"
              name="birthdayPrivacy"
              value="friends"
              id="birthday-friends"
              checked={formState.birthdayPrivacy === 'friends'}
              onChange={handleRadioChange}
            />
            <span className="label-text">Friends only</span>
          </label>
        </div>

        {/* Website */}
        <EditTextInput
          labelText="Website"
          fieldName="website"
          value={formState.website.value}
          validator={validators.website}
          inputChanged={handleTextInputChanged}
          validityChanged={handleValidityChanged}
          exampleText="(e.g. http://www.my-website.com)"
        />
        {/* Interests */}
        <EditTextInput
          labelText="My interests"
          fieldName="interests"
          value={formState.interests.value}
          validator={validators.interests}
          inputChanged={handleTextInputChanged}
          validityChanged={handleValidityChanged}
          exampleText="(use comma separated phrases)"
        />
        {/* Favourite books */}
        <EditTextInput
          labelText="Tell us your favourite books, or genres?"
          fieldName="favBooks"
          value={formState.favBooks.value}
          validator={validators.favBooks}
          inputChanged={handleTextInputChanged}
          validityChanged={handleValidityChanged}
          // exampleText="(use comma separated phrases)"
        />
        {/* About me */}
        <EditTextInput
          labelText="About me"
          fieldName="aboutMe"
          value={formState.aboutMe.value}
          validator={validators.aboutMe}
          inputChanged={handleTextInputChanged}
          validityChanged={handleValidityChanged}
          textarea
        />
        <h3 className="social-fields-header">Social Links</h3>
        {/* Facebook */}
        <EditTextInput
          labelText="Facebook"
          fieldName="facebook"
          value={formState.facebook.value}
          validator={validators.social}
          inputChanged={handleTextInputChanged}
          validityChanged={handleValidityChanged}
          exampleText="(full link to your profile)"
        />
        {/* Twitter */}
        <EditTextInput
          labelText="Twitter"
          fieldName="twitter"
          value={formState.twitter.value}
          validator={validators.social}
          inputChanged={handleTextInputChanged}
          validityChanged={handleValidityChanged}
          exampleText="(your handle, without the @)"
        />
        {/* Instagram */}
        <EditTextInput
          labelText="Instagram"
          fieldName="instagram"
          value={formState.instagram.value}
          validator={validators.social}
          inputChanged={handleTextInputChanged}
          validityChanged={handleValidityChanged}
          exampleText="(your handle, without the @)"
        />
        {/* Youtube */}
        <EditTextInput
          labelText="Youtube"
          fieldName="youtube"
          value={formState.youtube.value}
          validator={validators.social}
          inputChanged={handleTextInputChanged}
          validityChanged={handleValidityChanged}
          exampleText="(full link to your profile)"
        />
        {/* LinkedIn */}
        <EditTextInput
          labelText="LinkedIn"
          fieldName="linkedin"
          value={formState.linkedin.value}
          validator={validators.social}
          inputChanged={handleTextInputChanged}
          validityChanged={handleValidityChanged}
          exampleText="(full link to your profile)"
        />
        <button
          className="btn btn--light"
          type="submit"
          disabled={!formValidity}
        >
          Update Profile
        </button>
      </form>

      <form
        className="form-control--edit__file"
        onSubmit={onSubmitAvatar}
        encType="multipart/form-data"
      >
        <Avatar avatar_id={profile.avatar_id} />
        <input type="file" name="avatar" id="avatar" ref={avatarInput} />
        <span className="example">JPEG/PNG under 3MB only</span>

        <span className="avatar-loader">
          {avatarAction !== '' && <Loader />}
        </span>

        {avatarMessage && (
          <span className="avatar-message">{avatarMessage}</span>
        )}
        <div className="avatar-btn-container">
          <button className="btn btn--light" type="submit">
            Upload avatar
          </button>

          <button
            className="btn btn--light"
            type="button"
            onClick={removeAvatar}
          >
            Remove avatar
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;

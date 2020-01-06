import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import EditTextInput from './EditTextInput';
import { useEffect } from 'react';
import Loader from '../../common/Loader';
import { editPassword, clearEditStatus } from '../../../redux/auth/authActions';
import Alert from '../../common/Alert';

const ChangePassword = () => {
  const [formState, setFormState] = useState({
    currentPassword: {
      value: '',
      valid: false
    },
    newPassword: {
      value: '',
      valid: false
    },
    newPasswordConfirm: {
      value: '',
      valid: false
    }
  });

  const [formValidity, setFormValidity] = useState(false);
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [alert, setAlert] = useState(null);
  const [matchError, setMatchError] = useState('');
  // const [newPasswordFocused, setNewPasswordFocused] = useState('false');

  const passwordsMatch = () => {
    return formState.newPassword.value === formState.newPasswordConfirm.value;
  };

  const calculateFormValidity = () => {
    return Object.values(formState)
      .filter(val => typeof val === 'object') // text inputs are nested objects in the state
      .every(val => val.valid);
  };

  useEffect(() => {
    // const passwordError =
    //   formState.newPassword.value &&
    //   formState.newPasswordConfirm.value &&
    //   !passwordsMatch();
    // if (passwordError && !newPasswordFocused)
    //   setMatchError("Your passwords don't match.");
    // else setMatchError('');

    // setFormValidity(!passwordError && calculateFormValidity());

    setFormValidity(calculateFormValidity());
  }, [formState]);

  const editStatus = useSelector(state => state.auth.editStatus);
  const errorMessage = useSelector(state => state.auth.errorMessage);
  const token = useSelector(state => state.auth.token);
  const dispatch = useDispatch();

  useEffect(() => {
    setLoadingEdit(false);
    if (editStatus === 'success') {
      setAlert({
        type: 'info',
        message: 'The changes to your profile have been saved.'
      });
    } else if (editStatus === 'fail') {
      setAlert({
        type: 'warning',
        message: errorMessage
      });
    } else if (editStatus === 'error') {
      setAlert({
        type: 'warning',
        message: errorMessage
      });
    }
    dispatch(clearEditStatus());
  }, [editStatus, errorMessage]);

  const handleTextInputChanged = (inputName, inputVal, isValid) => {
    setFormState(oldFormState => ({
      ...formState,
      [inputName]: {
        value: inputVal,
        valid: isValid === undefined ? oldFormState[inputName].isValid : isValid
      }
    }));
  };

  const handleValidityChanged = (inputName, isValid) => {
    setFormState(oldFormState => ({
      ...formState,
      [inputName]: {
        ...oldFormState[inputName],
        valid: isValid
      }
    }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (calculateFormValidity() === false) return;
    if (!passwordsMatch()) {
      setMatchError("Your passwords don't match.");
      return;
    }

    setLoadingEdit(true);
    dispatch(
      editPassword(formState.currentPassword.value, formState.newPassword.value)
    );
    setFormState({
      currentPassword: {
        value: '',
        valid: false
      },
      newPassword: {
        value: '',
        valid: false
      },
      newPasswordConfirm: {
        value: '',
        valid: false
      }
    });
  };

  const validators = {
    currentPassword: {
      validate: val => {
        if (val.length === 0) return 'Your current password is required.';
        return '';
      },
      onBlur: true
    },
    newPassword: {
      validate: val => {
        if (val.length === 0) return 'Your new password is required.';
        if (val.length < 8) return 'Passwords must be at least 8 characters.';
        return '';
      },
      onBlur: true
    },
    newPasswordConfirm: {
      validate: val => {
        if (val.length === 0) return 'You must confirm your new password.';
        // if (val.length < 8)
        //   return 'Your password must be at least 8 characters.';

        return '';
      },
      onBlur: true
    }
  };

  if (loadingEdit) return <Loader />;

  return (
    <div className="ChangePassword">
      <div className="container">
        {alert && (
          <Alert
            type={alert.type}
            message={alert.message}
            handleDismiss={() => setAlert(null)}
          />
        )}

        <div className="edit-header">
          <h1>Change Password</h1>{' '}
          <Link to="/user/edit" className="btn btn--light back-link">
            Back to Settings
          </Link>
        </div>
        <div className="form-control--edit">
          <form
            className="form-control--edit__fields"
            autoComplete="off"
            onSubmit={handleSubmit}
          >
            <EditTextInput
              labelText="Current password"
              fieldName="currentPassword"
              type="password"
              value={formState.currentPassword.value}
              validator={validators.currentPassword}
              inputChanged={handleTextInputChanged}
              validityChanged={handleValidityChanged}
              required
            />
            <EditTextInput
              labelText="New password"
              fieldName="newPassword"
              type="password"
              value={formState.newPassword.value}
              validator={validators.newPassword}
              inputChanged={handleTextInputChanged}
              validityChanged={handleValidityChanged}
              // onFocus={() => setNewPasswordFocused(true)}
              // onBlur={() => setNewPasswordFocused(false)}
              required
            />
            <EditTextInput
              labelText="Confirm new password"
              fieldName="newPasswordConfirm"
              type="password"
              value={formState.newPasswordConfirm.value}
              validator={validators.newPasswordConfirm}
              inputChanged={handleTextInputChanged}
              validityChanged={handleValidityChanged}
              // onFocus={() => setNewPasswordFocused(true)}
              // onBlur={() => setNewPasswordFocused(false)}
              required
            />

            {matchError && (
              <p className="passwords-match-error">
                Your passwords don't match.
              </p>
            )}

            <button
              className="btn btn--light"
              type="submit"
              disabled={!formValidity}
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;

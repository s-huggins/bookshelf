import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import EditTextInput from './EditTextInput';
import validator from 'validator';
import { useEffect } from 'react';
import Loader from '../../common/Loader';
import { editEmail, clearEditStatus } from '../../../redux/auth/authActions';
import Alert from '../../common/Alert';

const ChangeEmail = () => {
  const [formState, setFormState] = useState({
    email: {
      value: '',
      valid: true
    },
    password: {
      value: '',
      valid: false
    }
  });

  const [formValidity, setFormValidity] = useState(false);
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [alert, setAlert] = useState(null);

  const calculateFormValidity = () => {
    return Object.values(formState)
      .filter(val => typeof val === 'object') // text inputs are nested objects in the state
      .every(val => val.valid);
  };

  useEffect(() => {
    setFormValidity(calculateFormValidity());
  }, [formState]);

  const email = useSelector(state => state.auth.user.email);
  const editStatus = useSelector(state => state.auth.editStatus);
  const errorMessage = useSelector(state => state.auth.errorMessage);
  const token = useSelector(state => state.auth.token);
  const dispatch = useDispatch();

  useEffect(() => {
    setFormState({
      ...formState,
      email: {
        value: email,
        valid: true
      }
    });
  }, []);

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
  }, [email, editStatus, errorMessage]);

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

    setLoadingEdit(true);
    dispatch(editEmail(formState.email.value, formState.password.value));
    setFormState({ ...formState, password: { value: '', valid: false } });
  };

  const validators = {
    email: {
      validate: async val => {
        if (val.length === 0) return 'Your email is required.';
        if (val.length > 80)
          return 'Sorry, your email cannot exceed 80 characters.';
        if (!validator.isEmail(val)) return 'Not a valid email.';

        const res = await fetch('/api/v1/users/emailCheck', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email: val })
        });

        const json = await res.json();
        if (json.status === 'success' && json.data.emailAlreadyRegistered)
          return 'Email is already registered.';

        return '';
      },
      onBlur: true,
      async: true
    },
    password: {
      validate: val => {
        if (val.length === 0) return 'Your password is required.';
      },
      onBlur: true
    }
  };

  if (loadingEdit) return <Loader />;

  return (
    <div className="ChangeEmail page-container">
      <div className="container">
        {alert && (
          <Alert
            type={alert.type}
            message={alert.message}
            handleDismiss={() => setAlert(null)}
          />
        )}

        <div className="edit-header">
          <h1>Change Email</h1>{' '}
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
              labelText="Email Address"
              fieldName="email"
              value={formState.email.value}
              validator={validators.email}
              inputChanged={handleTextInputChanged}
              validityChanged={handleValidityChanged}
              required
            />
            <EditTextInput
              labelText="Current password"
              fieldName="password"
              type="password"
              value={formState.password.value}
              validator={validators.password}
              inputChanged={handleTextInputChanged}
              validityChanged={handleValidityChanged}
              required
            />
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

export default ChangeEmail;

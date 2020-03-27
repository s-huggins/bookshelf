import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import Loader from '../../common/Loader';
import {
  clearEditStatus,
  deleteAccount
} from '../../../redux/auth/authActions';
import Alert from '../../common/Alert';
import { Link } from 'react-router-dom';

const DeleteAccount = () => {
  const [formState, setFormState] = useState({
    password: {
      value: '',
      valid: false
    },
    confirmDelete: false
  });

  const [formValidity, setFormValidity] = useState(false);
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [alert, setAlert] = useState(null);

  const calculateFormValidity = () =>
    formState.password.valid && formState.confirmDelete;

  const editStatus = useSelector(state => state.auth.editStatus);
  const errorMessage = useSelector(state => state.auth.errorMessage);
  const dispatch = useDispatch();

  useEffect(() => {
    setFormValidity(calculateFormValidity());
  }, [formState]);

  useEffect(() => {
    setLoadingEdit(false);
    if (editStatus === 'success') {
      setAlert({
        type: 'info',
        message: 'Your account has been deleted.'
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

  const handleSubmit = e => {
    e.preventDefault();
    if (calculateFormValidity() === false) return;

    setLoadingEdit(true);
    setFormState({
      password: {
        value: '',
        valid: false
      },
      confirmDelete: false
    });
    dispatch(deleteAccount(formState.password.value));
  };

  const passwordInputChanged = e => {
    const value = e.target.value;

    setFormState({
      ...formState,
      password: {
        value,
        valid: value !== ''
      }
    });
  };

  const handleConfirmDelete = e => {
    setFormState({
      ...formState,
      confirmDelete: true
    });
  };

  return (
    <div className="DeleteAccount page-container">
      <div className="container">
        {alert && (
          <Alert
            type={alert.type}
            message={alert.message}
            handleDismiss={() => setAlert(null)}
          />
        )}
        <div className="edit-header">
          <h1>Delete Account</h1>{' '}
          <Link to="/user/edit" className="btn btn--light back-link">
            Back to Settings
          </Link>
        </div>
        {loadingEdit ? (
          <Loader />
        ) : (
          <div className="form-control--edit">
            <form
              className="form-control--edit__fields"
              autoComplete="off"
              onSubmit={handleSubmit}
            >
              <div className="form-control--edit__field">
                <label className="form-control--edit__label" htmlFor="password">
                  Password
                </label>
                <input
                  className="form-control"
                  type="password"
                  name="password"
                  id="password"
                  onChange={passwordInputChanged}
                />
              </div>

              <div className="delete-radio-container">
                <p className="warning-text">
                  Are you sure you want to permanently delete your account?
                </p>

                <div className="form-control--edit__radio">
                  <label className="radio-label" htmlFor="confirm">
                    <input
                      type="radio"
                      name="confirmDelete"
                      id="confirm"
                      checked={formState.confirmDelete}
                      onChange={handleConfirmDelete}
                    />
                    <span className="label-text">Yes</span>
                  </label>
                </div>
              </div>

              <button
                className="btn btn--light"
                type="submit"
                disabled={!formValidity}
              >
                Submit
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeleteAccount;

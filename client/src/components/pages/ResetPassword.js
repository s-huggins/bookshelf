import React, { useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import Loader from '../common/Loader';

const ResetPassword = ({ match }) => {
  const [requestSent, setRequestSent] = useState(false);
  const [resetErrors, setResetErrors] = useState([]);
  const [validationError, setValidationError] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const onSubmit = async e => {
    e.preventDefault();

    // if (password.length < 8) {
    //   setValidationError('Your password must be at least 8 characters.');
    //   return;
    // }

    // if (password !== passwordConfirm) {
    //   setValidationError("Your passwords don't match.");
    //   return;
    // }

    setValidationError('');

    // validation

    setLoading(true);

    const res = await fetch(
      `http://localhost:5000/api/v1/users/resetPassword/${match.params.resetToken}`,
      {
        method: 'PATCH',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password, passwordConfirm })
      }
    );

    setLoading(false);
    const json = await res.json();
    console.log(json);

    if (res.status !== 200) {
      setResetErrors(
        json.message
          .split('. ')
          .map(err => (err.endsWith('.') ? err : `${err}.`))
      );
    } else {
      setRequestSent(true);
      setValidationError('');
      // setResetErrors([]);
    }
  };

  return (
    <div className="ResetPassword page-container">
      <main>
        <div className="form-container">
          <h1>New Password</h1>
          <hr />
          {loading ? (
            <div className="loader-container">
              <Loader />
            </div>
          ) : (
            <div>
              {resetErrors.length > 0 ? (
                <div className="reset-error-container">
                  <ul>
                    {resetErrors.map((err, i) => (
                      <li className="reset-error-text" key={i}>
                        {err}
                      </li>
                    ))}
                  </ul>

                  <Link to="/forgot-password" className="btn btn--back">
                    Back
                  </Link>
                </div>
              ) : requestSent ? (
                <div className="reset-success-container">
                  <p>Password updated.</p>
                  <Link to="/login" className="btn btn--back">
                    Login
                  </Link>
                </div>
              ) : (
                <div>
                  {validationError && (
                    <div className="error-box">{validationError}</div>
                  )}

                  <form onSubmit={onSubmit} autoComplete="off">
                    <label htmlFor="password">Password</label>

                    <input
                      className={`form-control form-control--register form-control--reset-password`}
                      type="password"
                      name="password"
                      id="password"
                      placeholder="New password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                    />

                    <label htmlFor="password-confirm">Confirm password</label>

                    <input
                      className={`form-control form-control--register form-control--reset-password`}
                      type="password"
                      name="passwordConfirm"
                      id="password-confirm"
                      placeholder="Retype password"
                      value={passwordConfirm}
                      onChange={e => setPasswordConfirm(e.target.value)}
                    />

                    <div className="btn-container">
                      <button className="btn btn--register">Reset</button>
                      <Link className="green-link cancel" to="/login">
                        Cancel
                      </Link>
                    </div>
                  </form>
                  <div className="signin-footer">
                    <span>
                      Not a member?{' '}
                      <span>
                        <Link to="/register">Sign up</Link>
                      </span>
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default withRouter(ResetPassword);

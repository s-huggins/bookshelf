import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Loader from '../common/Loader';

const ForgotPassword = () => {
  const inputEl = useRef(null);
  const [requestSent, setRequestSent] = useState(false);
  const [errorStatus, setErrorStatus] = useState(null);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async e => {
    e.preventDefault();
    const email = inputEl.current.value;
    if (!email.trim()) return;

    setLoading(true);

    const res = await fetch('/api/v1/users/forgotPassword', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email })
    });

    setLoading(false);

    if (res.status === 404) {
      setErrorStatus(404);
    } else if (res.status !== 200) {
      setErrorStatus(500);
    } else {
      const json = await res.json();
      setRequestSent(true);
      setErrorStatus(null);
      setEmail(email);
    }
  };

  const handleBack = () => {
    setRequestSent(false);
    setEmail('');
  };

  return (
    <div className="ForgotPassword page-container">
      <main>
        <div className="form-container">
          <h1>Reset Password</h1>
          <hr />
          {loading ? (
            <div className="loader-container">
              <Loader />
            </div>
          ) : (
            <div>
              {errorStatus && (
                <div className="reset-error">
                  {errorStatus === 404
                    ? 'That email is not registered.'
                    : 'Something went wrong. Please try again!'}
                </div>
              )}
              {!requestSent ? (
                <div>
                  <form onSubmit={onSubmit} autoComplete="off">
                    <label htmlFor="email">Email</label>

                    <input
                      className={`form-control form-control--register`}
                      type="text"
                      name="email"
                      id="email"
                      ref={inputEl}
                      placeholder="Email address"
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
              ) : (
                <div className="success-container">
                  <p>
                    A password reset token has been sent to your email address
                    at <span className="email-address">{email}.</span> It will
                    expire in 10 minutes!
                  </p>

                  <button className="btn btn--back" onClick={handleBack}>
                    Go back
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ForgotPassword;
